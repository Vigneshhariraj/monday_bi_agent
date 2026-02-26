import os
import re
import statistics
from dotenv import load_dotenv
from google import genai
from monday_client import fetch_board_items

load_dotenv()


# =====================================================
# DATA EXTRACTION
# =====================================================

def extract_items(board_response):
    boards = board_response.get("data", {}).get("boards", [])
    if not boards:
        return []

    items = boards[0]["items_page"]["items"]

    structured = []
    for item in items:
        row = {"name": item["name"]}
        for col in item["column_values"]:
            row[col["id"]] = col["text"]
        structured.append(row)

    return structured


# =====================================================
# COLUMN DETECTION
# =====================================================

def detect_column(deals, possible_values):
    if not deals:
        return None

    for key in deals[0].keys():
        for deal in deals:
            value = str(deal.get(key, "") or "")
            if value in possible_values:
                return key
    return None


def detect_numeric_column(deals):
    if not deals:
        return None

    for key in deals[0].keys():
        for deal in deals:
            value = str(deal.get(key, "") or "")
            if value.replace(".", "").isdigit():
                return key
    return None


def detect_company_column(data):
    if not data:
        return None

    for key in data[0].keys():
        sample = [str(d.get(key, "") or "") for d in data[:20]]
        if any("company" in v.lower() for v in sample):
            return key
    return None


# =====================================================
# MAIN PROCESSING
# =====================================================

def process_query(user_query, config, history=None):
    monday_api_key = config.get("mondayApiKey") or os.getenv("MONDAY_API_KEY")
    gemini_api_key = config.get("geminiApiKey") or os.getenv("GEMINI_API_KEY")
    deals_board_id = config.get("dealsBoardId") or os.getenv("DEALS_BOARD_ID")
    work_orders_board_id = config.get("workOrdersBoardId") or os.getenv("WORK_ORDERS_BOARD_ID")

    client = genai.Client(api_key=gemini_api_key)

    deals_raw = fetch_board_items(deals_board_id, monday_api_key)
    work_orders_raw = fetch_board_items(work_orders_board_id, monday_api_key)
    
    deals = extract_items(deals_raw)
    work_orders = extract_items(work_orders_raw)

    query_lower = user_query.lower()

    status_column = detect_column(deals, ["Open", "Won", "Dead"])
    revenue_column = detect_numeric_column(deals)
    company_column = detect_company_column(deals)
    wo_company_column = detect_company_column(work_orders)

    trace = {
        "monday_api_called": True,
        "deals_fetched": len(deals),
        "work_orders_fetched": len(work_orders),
        "status_column_detected": status_column,
        "revenue_column_detected": revenue_column,
        "company_column_detected": company_column,
        "workorder_company_column_detected": wo_company_column
    }

    # =====================================================
    # 1️⃣ CROSS-BOARD CONVERSION
    # =====================================================

    if "work order" in query_lower or "conversion" in query_lower:

        if company_column and wo_company_column and status_column:

            def normalize(name):
                return re.sub(r'[^a-z0-9]', '', name.lower())

            won_deals = [
                deal for deal in deals
                if str(deal.get(status_column, "")).lower() == "won"
            ]

            won_companies = {
                normalize(str(d.get(company_column, "")))
                for d in won_deals
            }

            wo_companies = {
                normalize(str(w.get(wo_company_column, "")))
                for w in work_orders
            }

            converted = won_companies & wo_companies

            conversion_rate = (
                (len(converted) / len(won_companies)) * 100
                if won_companies else 0
            )

            return {
                "answer": (
                    f"{len(converted)} won deals have associated work orders. "
                    f"Conversion rate: {conversion_rate:.1f}%."
                ),
                "trace": trace
            }

    # =====================================================
    # 2️⃣ WIN RATE + FUNNEL METRICS
    # =====================================================

    if "win rate" in query_lower or "funnel" in query_lower:

        won = 0
        dead = 0
        open_deals = 0
        revenues = []

        for deal in deals:
            status = str(deal.get(status_column, "")).lower()
            raw_value = str(deal.get(revenue_column, "") or "")

            try:
                value = float(raw_value)
                revenues.append(value)
            except:
                value = 0

            if status == "won":
                won += 1
            elif status == "dead":
                dead += 1
            elif status == "open":
                open_deals += 1

        win_rate = (won / (won + dead)) * 100 if (won + dead) > 0 else 0
        avg_deal = statistics.mean(revenues) if revenues else 0
        median_deal = statistics.median(revenues) if revenues else 0

        # Revenue Forecast
        open_pipeline_value = sum(
            float(d.get(revenue_column, 0) or 0)
            for d in deals
            if str(d.get(status_column, "")).lower() == "open"
        )

        forecast_revenue = (win_rate / 100) * open_pipeline_value

        return {
            "answer": (
                f"Win Rate: {win_rate:.1f}%. "
                f"Won: {won}, Dead: {dead}, Open: {open_deals}. "
                f"Average Deal Size: {avg_deal:,.0f}. "
                f"Median Deal Size: {median_deal:,.0f}. "
                f"Expected Realizable Revenue from open pipeline: {forecast_revenue:,.0f}."
            ),
            "trace": trace
        }

    # =====================================================
    # 3️⃣ DATA QUALITY REPORT
    # =====================================================

    if "data quality" in query_lower or "inconsistency" in query_lower:

        missing_revenue = sum(
            1 for d in deals
            if not str(d.get(revenue_column, "")).strip()
        )

        missing_status = sum(
            1 for d in deals
            if not str(d.get(status_column, "")).strip()
        )

        inconsistent_company_ids = 0

        if company_column and wo_company_column:
            deal_companies = set(str(d.get(company_column, "")).lower() for d in deals)
            wo_companies = set(str(w.get(wo_company_column, "")).lower() for w in work_orders)
            inconsistent_company_ids = len(deal_companies - wo_companies)

        return {
            "answer": (
                f"Data Quality Report: "
                f"{missing_revenue} deals missing revenue values. "
                f"{missing_status} deals missing status. "
                f"{inconsistent_company_ids} deal companies not found in work orders."
            ),
            "trace": trace
        }

    # =====================================================
    # 4️⃣ GENERIC REVENUE
    # =====================================================

    if "revenue" in query_lower and revenue_column:

        total = sum(
            float(d.get(revenue_column, 0) or 0)
            for d in deals
        )

        return {
            "answer": f"Total pipeline revenue is {total:,.0f}.",
            "trace": trace
        }

    # =====================================================
    # 5️⃣ GEMINI FALLBACK (Now with History)
    # =====================================================

    history_context = ""
    if history:
        history_context = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])

    prompt = f"""
You are a Business Intelligence AI Agent for Monday.com.
You have access to live board data (Deals and Work Orders).

BOARD DATA SUMMARY:
- Total Deals: {len(deals)}
- Total Work Orders: {len(work_orders)}
- Core Metrics Found: Status, Revenue, Company Links.

CONVERSATION HISTORY:
{history_context}

NEW USER QUESTION:
{user_query}

Provide a structured business insight based on the data and history.
If you need to perform calculations not covered by the hardcoded logic, do them now based on the data summary provided.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "answer": response.text,
        "trace": trace
    }
