import re
import sys
sys.path.append('scripts')
sys.stdout.reconfigure(encoding='utf-8')

MD_PATH = r"c:\Users\DELL\Downloads\B_Pharm_Syllabus_2026_NEP2020.md"
with open(MD_PATH, "r", encoding="utf-8") as f:
    text = f.read()
pages = re.split(r'## PDF Page \d+', text)

def clean_ocr(t):
    t = re.sub(r'```text', '', t)
    t = re.sub(r'```', '', t)
    t = re.sub(r'\r', '', t)
    t = re.sub(r'\s*B\.Pharm Syllabus\s*', '\n', t)
    t = re.sub(r'\s*Regulation\s*', '\n', t)
    t = re.sub(r'\n\s*\d+\s*\n', '\n', t)
    return t

# Search for any page that has Roman numerals VI, VII, VIII, IX, X, XI, XII in a table or unit
print("Searching entire syllabus (358 pages) for Roman numerals VI, VII, VIII, IX, X...")

for p_num in range(1, len(pages)):
    p_text = clean_ocr(pages[p_num])
    # check for Roman numerals VI, VII, VIII, IX in Detailed Syllabus table
    if "Detailed Syllabus" in p_text or "Unit No." in p_text or "No. of Lectures" in p_text:
        # Check if Roman numerals VI or higher appear with hours or in table
        high_romans = re.findall(r"\b(VI|VII|VIII|IX|X|XI|XII)\b(?=.*(?:hours|hrs|\d+\s*hours))", p_text, re.IGNORECASE)
        high_romans_start = re.findall(r"^\s*(VI|VII|VIII|IX|X|XI|XII)\b", p_text, re.MULTILINE)
        if high_romans or high_romans_start:
            # find course code on this page or previous page
            code_m = re.findall(r"\b(BP\d{3}[TP](?:\s+[A-Z0-9]+)?)\b", p_text)
            if not code_m:
                code_m = re.findall(r"\b(BP\d{3}[TP](?:\s+[A-Z0-9]+)?)\b", clean_ocr(pages[p_num-1]))
            print(f"Page {p_num} (Code: {code_m}): found high romans: {set(high_romans + high_romans_start)}")
