import re
import sys
sys.path.append('scripts')
sys.stdout.reconfigure(encoding='utf-8')

from theory_config import THEORY_COURSES

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

print("Scanning all 49 courses for actual table unit rows...")

courses_units_info = []

for c in THEORY_COURSES:
    code = c["code"]
    c_text = clean_ocr("\n".join(pages[c["start"]:c["end"]+1]))
    syl = re.search(r"(?:Detailed Syllabus|Unit\s*(?:No\.?)?\s*Topics)[\s\S]*?(?:Recommended References|Recommended Books|Reference Books|$)", c_text, re.IGNORECASE)
    raw = syl.group(0) if syl else ""
    
    # Find all Roman numeral units or Unit rows in the table
    # Look for patterns like:
    # "Unit No." or lines starting with Roman numerals I, II, III, IV, V, VI, VII, VIII, IX, X
    # or "Unit I", "Unit 1", etc.
    
    # Let's find all occurrences of Unit numbers in this course syllabus table
    # In tables, Roman numerals are: I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII
    romans_found = []
    lines = raw.split("\n")
    for l in lines:
        # Match lines that have Roman numeral with hours, e.g. "II ... 2 hours" or "VI Gastrointestinal ... 2 hours"
        m = re.findall(r"\b(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\b(?=.*(?:hours|hrs|\d+\s*hours))", l, re.IGNORECASE)
        # also match lines where Roman numeral is at the start like "VI Gastrointestinal" or "I 12 hours"
        m2 = re.match(r"^\s*(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\b", l)
        # also "Unit I", "Unit 1"
        m3 = re.findall(r"\bUnit\s+([IVX0-9]+)\b", l, re.IGNORECASE)
        
        for r in m:
            romans_found.append(r.upper())
        if m2:
            romans_found.append(m2.group(1).upper())
        for r in m3:
            romans_found.append(r.upper())

    # Filter distinct in order of appearance
    distinct_romans = []
    for r in romans_found:
        if not distinct_romans or distinct_romans[-1] != r:
            distinct_romans.append(r)
            
    print(f"{code} (Credits: {c['credits']}): {c['name']}")
    print(f"   Raw text lines: {len(lines)}")
    # let's look for how many rows exist in the Detailed Syllabus table
    # In Detailed Syllabus table, each row typically has a duration: "X hours"
    hours_matches = re.findall(r"\b(\d+)\s*(?:hours|hrs)\b", raw, re.IGNORECASE)
    print(f"   Hours entries found: {hours_matches} (count={len(hours_matches)})")
    
    courses_units_info.append({
        "code": code,
        "name": c["name"],
        "credits": c["credits"],
        "hours_count": len(hours_matches),
        "hours": hours_matches,
        "start": c["start"],
        "end": c["end"]
    })
