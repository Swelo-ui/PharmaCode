import json
import re
import sys
sys.path.append('scripts')

MD_PATH = r"c:\Users\DELL\Downloads\B_Pharm_Syllabus_2026_NEP2020.md"
with open(MD_PATH, "r", encoding="utf-8") as f:
    md_text = f.read()

from theory_config import THEORY_COURSES
with open('scripts/verified_49_markers.json', 'r', encoding='utf-8') as f:
    MARKERS = json.load(f)

pages = re.split(r'## PDF Page \d+', md_text)

print(f"Checking {len(THEORY_COURSES)} theory courses...")
anomalies = []
for c in THEORY_COURSES:
    code = c["code"]
    m = MARKERS.get(code, [])
    course_text = ""
    for p in range(c["start"], c["end"] + 1):
        if p < len(pages):
            course_text += "\n" + pages[p]
    
    ds_idx = course_text.find("Detailed Syllabus")
    if ds_idx != -1:
        sub_text = course_text[ds_idx:]
        ref_idx = sub_text.find("Recommended References")
        if ref_idx != -1:
            sub_text = sub_text[:ref_idx]
        
        hours_found = re.findall(r"(\d+)\s*(?:hours|hrs)", sub_text, re.IGNORECASE)
        romans_found = re.findall(r"^\s*([IVXLCDM]+)\b", sub_text, re.MULTILINE)
        
        if len(hours_found) != 5 or len(m) != 5:
            anomalies.append({
                "code": code,
                "name": c["name"],
                "sem": c["sem"],
                "hours": hours_found,
                "romans": romans_found,
                "markers_count": len(m)
            })

print(f"Found {len(anomalies)} anomalies:")
for a in anomalies:
    print(a)
