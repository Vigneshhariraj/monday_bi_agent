from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'Monday BI Agent - Decision Log', border=False, ln=True, align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def convert_md_to_pdf(md_file, pdf_file):
    if not os.path.exists(md_file):
        print(f"Error: {md_file} not found.")
        return

    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    pdf = PDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=11)
    
    lines = content.split('\n')
    for line in lines:
        if not line.strip():
            pdf.ln(5)
            continue
            
        # Remove bold markers and other MD symbols fpdf doesn't like
        clean_line = line.replace('**', '').replace('*', '').replace('---', '__________________________________________________')
        
        # Check for non-latin characters and replace if necessary (fpdf default fonts only support latin-1)
        # Using helvetica which is safer.
        
        if line.startswith('# '):
            pdf.set_font("helvetica", 'B', 16)
            pdf.multi_cell(0, 10, txt=clean_line[2:])
            pdf.ln(2)
        elif line.startswith('## '):
            pdf.set_font("helvetica", 'B', 14)
            pdf.multi_cell(0, 10, txt=clean_line[3:])
            pdf.ln(1)
        elif line.startswith('### '):
            pdf.set_font("helvetica", 'B', 12)
            pdf.multi_cell(0, 8, txt=clean_line[4:])
        else:
            pdf.set_font("helvetica", size=11)
            pdf.multi_cell(0, 7, txt=clean_line)
            
    pdf.output(pdf_file)
    print(f"Successfully converted {md_file} to {pdf_file}")

if __name__ == "__main__":
    convert_md_to_pdf("Decision_Log.md", "Decision_Log.pdf")
