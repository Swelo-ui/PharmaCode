import json
import re

with open('pharmacode_app/assets/data/syllabus.json', 'r', encoding='utf-8') as f:
    semesters = json.load(f)

total_subjects = 0
total_units = 0
total_topics = 0

issues = []

table_artifacts = [
    "detailed syllabus", "no. of lectures", "no. of hours", "course objectives",
    "b.pharm syllabus", "hours per week", "maximum marks", "unit no."
]

dangling_end_words = [
    " and", " or", " of", " with", " for", " in", " to", " the",
    " including", " such as", " viz", " e.g", " i.e"
]

for sem in semesters:
    sem_num = sem["num"]
    subjects = sem.get("subjects", [])
    total_subjects += len(subjects)
    
    for sub in subjects:
        code = sub["code"]
        name = sub["name"]
        stype = sub.get("type", "")
        units = sub.get("units", [])
        total_units += len(units)
        
        # 1. Check if units list is empty
        if not units and stype not in ["I", "RP"]:
            issues.append({
                "sem": sem_num, "code": code, "subject": name,
                "issue": "Empty units list"
            })
        
        for u_idx, unit in enumerate(units):
            u_num = unit.get("num", "")
            u_title = unit.get("title", "")
            u_hours = unit.get("hours", "")
            topics = unit.get("topics", [])
            total_topics += len(topics)
            
            # Check empty title
            if not u_title or u_title.strip() == "":
                issues.append({
                    "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                    "issue": "Unit title is empty"
                })
            
            # Check 0 topics
            if not topics:
                issues.append({
                    "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                    "issue": f"Unit {u_num} has 0 topics"
                })
            
            for t_idx, topic in enumerate(topics):
                # 2. Check for \ufffd or corrupt characters
                if "\ufffd" in topic or "\u0000" in topic:
                    issues.append({
                        "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                        "topic_idx": t_idx, "issue": "Corrupt OCR replacement character \\ufffd found",
                        "text": topic
                    })
                
                # 3. Check for raw table artifacts
                for art in table_artifacts:
                    if art in topic.lower():
                        if "overview of management of the diseases associated" not in topic.lower():
                            issues.append({
                                "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                                "topic_idx": t_idx, "issue": f"Table artifact '{art}' found in topic",
                                "text": topic
                            })
                
                # 4. Check for dangling words at the end
                topic_clean = topic.rstrip(".").rstrip()
                for dend in dangling_end_words:
                    if topic_clean.lower().endswith(dend):
                        # exclude legitimate occurrences like 'Vitamin A' or 'Hepatitis B' or 'Type A'
                        if dend in [" a", " an"] and re.search(r"\b(?:vitamin|type|group|hepatitis|class|category)\s+[aA]\b", topic_clean, re.I):
                            continue
                        issues.append({
                            "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                            "topic_idx": t_idx, "issue": f"Dangling ending '{dend}'",
                            "text": topic
                        })
                
                # 5. Check for unclosed brackets (ignoring outline numbering like a), b), ii), 1) )
                t_no_outline = re.sub(r"(?:^|[\s;])(?:[a-z0-9]|[ivxlcdm]{1,4})\)\s*", " ", topic, flags=re.I)
                open_p = t_no_outline.count("(")
                close_p = t_no_outline.count(")")
                if open_p != close_p and abs(open_p - close_p) >= 1:
                    issues.append({
                        "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                        "topic_idx": t_idx, "issue": f"Unbalanced parentheses ({open_p} open, {close_p} close)",
                        "text": topic
                    })
                
                # 6. Check for extremely short topics (< 8 chars)
                if len(topic.strip()) < 8:
                    issues.append({
                        "sem": sem_num, "code": code, "subject": name, "unit": u_num,
                        "topic_idx": t_idx, "issue": "Extremely short topic (< 8 chars)",
                        "text": topic
                    })

print(f"\n--- AUDIT COMPLETE ---")
print(f"Total Semesters: {len(semesters)}")
print(f"Total Subjects: {total_subjects}")
print(f"Total Units: {total_units}")
print(f"Total Topics: {total_topics}")
print(f"Total Actual Issues Found: {len(issues)}")

if issues:
    print("\nListing found issues:")
    for i, iss in enumerate(issues[:50], 1):
        print(f"[{i}] Sem {iss['sem']} | {iss['code']} | Unit {iss.get('unit', '-')} | {iss['issue']}")
        if "text" in iss:
            print(f"     Text: {iss['text'][:120]}")
    if len(issues) > 50:
        print(f"... and {len(issues) - 50} more issues.")
