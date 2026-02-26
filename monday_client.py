import requests

def fetch_board_items(board_id, api_key):
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json",
        "API-Version": "2023-10"
    }
    
    query = """
    query ($board_id: ID!) {
      boards(ids: [$board_id]) {
        items_page(limit: 500) {
          items {
            id
            name
            column_values {
              id
              text
            }
          }
        }
      }
    }
    """

    variables = {"board_id": board_id}

    response = requests.post(
        "https://api.monday.com/v2",
        json={
            "query": query,
            "variables": variables
        },
        headers=headers,
        timeout=30
    )

    return response.json()