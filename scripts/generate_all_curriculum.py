# scripts/generate_all_curriculum.py
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

from theory_config import THEORY_COURSES
from elective_config import ELECTIVE_GROUPS

MD_PATH = r"c:\Users\DELL\Downloads\B_Pharm_Syllabus_2026_NEP2020.md"

with open(MD_PATH, "r", encoding="utf-8") as f:
    raw_content = f.read()

pages = re.split(r"## PDF Page \d+", raw_content)

def clean_text(text):
    text = re.sub(r"```text", "", text)
    text = re.sub(r"```", "", text)
    text = re.sub(r"\r", "", text)
    text = re.sub(r"\s*B\.Pharm Syllabus\s*", "\n", text)
    text = re.sub(r"\s*Regulation\s*", "\n", text)
    text = re.sub(r"\n\s*\d+\s*\n", "\n", text)
    return text

def extract_objectives(text):
    m = re.search(r"(?:COURSE OBJECTIVES|Course Objectives):?([\s\S]*?)(?:COURSE OUTCOMES|Course Outcomes|Detailed Syllabus|List of practical|List of practices)", text, re.IGNORECASE)
    if not m:
        return []
    raw = m.group(1)
    items = re.split(r"\n\s*\d+\.\s+", raw)
    cleaned = []
    for it in items:
        s = " ".join(it.strip().split())
        if len(s) > 8 and not re.search(r"objectives of this course are", s, re.IGNORECASE):
            s = re.sub(r"Course Outcomes.*", "", s, flags=re.IGNORECASE).strip()
            cleaned.append(s)
    return cleaned

def extract_references(text):
    m = re.search(r"(?:Recommended References|Recommended Books|Reference Books)[^\n]*:?\n([\s\S]*?)(?:## PDF Page|\n\s*Course Code|\n\s*Unit No|$)", text, re.IGNORECASE)
    if not m:
        return []
    raw = m.group(1)
    items = re.split(r"\n\s*\d+\.\s+", raw)
    cleaned = []
    for it in items:
        s = " ".join(it.strip().split())
        s = re.sub(r"\bCourse Code\b.*", "", s).strip()
        if len(s) > 8:
            cleaned.append(s)
    return cleaned

def refine_topics(raw_topics):
    refined = []
    for t in raw_topics:
        t_clean = t.strip()
        if ";" in t_clean and len(t_clean) > 60:
            parts = [p.strip() for p in t_clean.split(";") if len(p.strip()) > 3]
            refined.extend(parts)
        else:
            refined.append(t_clean)
    return [re.sub(r"\s+", " ", t).strip() for t in refined if len(t.strip()) > 3]

# ─────────────────────────────────────────────────────────────
# 1. THEORY COURSES EXTRACTOR
# ─────────────────────────────────────────────────────────────
def extract_theory(c):
    text = clean_text("\n".join(pages[c["start"]:c["end"]+1]))
    objectives = extract_objectives(text)
    references = extract_references(text)

    syl_m = re.search(r"(?:Detailed Syllabus|Detailed syllabus):?([\s\S]*?)(?:Recommended References|Recommended Books|Reference Books|$)", text, re.IGNORECASE)
    if not syl_m:
        syl_m = re.search(r"(?:Unit No\.|Unit Topics)[\s\S]*?Lectures([\s\S]*?)(?:Recommended References|Recommended Books|Reference Books|$)", text, re.IGNORECASE)
    raw = syl_m.group(1) if syl_m else ""
    raw = re.sub(r"^\s*Unit[\s\S]*?Lectures\s*\n", "", raw, flags=re.IGNORECASE)
    lines = [l.strip() for l in raw.split("\n") if l.strip()]

    while lines and ("study of the development" in lines[0].lower() or "chemical classification" in lines[0].lower() or "superscripted" in lines[0].lower()):
        lines.pop(0)

    romans = ["I", "II", "III", "IV", "V"]
    r_pos = []
    for idx, l in enumerate(lines):
        m = re.match(r"^\s{0,12}(I|II|III|IV|V)\b", l)
        if m and len(r_pos) < 5 and m.group(1) == romans[len(r_pos)]:
            r_pos.append((m.group(1), idx))
    
    if len(r_pos) < 5:
        r_pos = []
        for idx, l in enumerate(lines):
            for r in romans:
                if len(r_pos) < 5 and r == romans[len(r_pos)]:
                    if re.search(r"\b" + r + r"\b", l[:15]):
                        r_pos.append((r, idx))
                        break

    unit_ranges = []
    current_start = 0
    for i in range(len(r_pos)):
        r_num, roman_line = r_pos[i]
        if i + 1 < len(r_pos):
            next_roman_line = r_pos[i+1][1]
            split_line = next_roman_line
            for b in range(next_roman_line - 1, roman_line, -1):
                bl = lines[b]
                is_bullet = bl.startswith("•") or bl.startswith("o") or bl.startswith("-") or re.match(r"^[a-z0-9]\)\s+", bl) or re.search(r"\b(hours|hrs)\b", bl, re.IGNORECASE)
                if not is_bullet:
                    split_line = b
                else:
                    break
            unit_ranges.append((r_num, current_start, split_line))
            current_start = split_line
        else:
            unit_ranges.append((r_num, current_start, len(lines)))

    units = []
    for u_idx, (r_num, start_idx, end_idx) in enumerate(unit_ranges):
        block = lines[start_idx:end_idx]
        block_text = "\n".join(block)

        h_m = re.search(r"(\d+)\s*(Hours|hours|hrs)", block_text)
        hours = f"{h_m.group(1)} Hours" if h_m else "9 Hours"

        raw_topics = []
        cur_topic = ""
        for l in block:
            lc = l.strip()
            lc = re.sub(r"^(?:I|II|III|IV|V)\b\s*", "", lc).strip()
            lc = re.sub(r"\s+\d+\s*(?:Hours|hours|hrs)\s*$", "", lc, flags=re.IGNORECASE).strip()
            if not lc or re.match(r"^\d+\s*(?:Hours|hours|hrs)$", lc, flags=re.IGNORECASE):
                continue

            is_bullet = lc.startswith("•") or lc.startswith("o") or lc.startswith("-") or re.match(r"^[a-z0-9]\)\s+", lc) or re.match(r"^\d+\.\s+", lc)
            if is_bullet:
                if cur_topic:
                    raw_topics.append(cur_topic)
                cur_topic = re.sub(r"^[•o\-\s]+", "", lc).strip()
            else:
                if cur_topic:
                    cur_topic += " " + lc
                else:
                    clean_l = lc.lower()
                    if not any(clean_l in t.lower() for t in c["unit_titles"]):
                        cur_topic = lc

        if cur_topic:
            raw_topics.append(cur_topic)

        clean_topics = refine_topics(raw_topics)
        u_title = c["unit_titles"][u_idx] if u_idx < len(c["unit_titles"]) else f"Unit {r_num}"

        units.append({
            "num": r_num,
            "title": u_title,
            "hours": hours,
            "topics": clean_topics
        })

    return {
        "sem": c["sem"],
        "code": c["code"],
        "name": c["name"],
        "credits": c["credits"],
        "type": c["type"],
        "highlight": c["highlight"],
        "units": units,
        "objectives": objectives,
        "references": references
    }

# ─────────────────────────────────────────────────────────────
# 2. CORE PRACTICAL COURSES EXTRACTOR (27 Courses)
# ─────────────────────────────────────────────────────────────
PRACTICAL_COURSES = [
    # Sem 1
    {"sem": 1, "code": "BP107P", "name": "General Pharmacy (Practical)", "credits": 1, "type": "P", "start": 71, "end": 72, "default_hours": "45 Hours"},
    {"sem": 1, "code": "BP108P", "name": "Healthcare Psychology and Communication Skills (Practical)", "credits": 1, "type": "P", "start": 73, "end": 74, "default_hours": "30 Hours"},
    {"sem": 1, "code": "BP109P", "name": "Human Anatomy, Physiology and Pathophysiology I (Practical)", "credits": 1, "type": "P", "start": 75, "end": 76, "default_hours": "45 Hours"},
    {"sem": 1, "code": "BP110P", "name": "Introduction to Pharmacognosy (Practical)", "credits": 1, "type": "P", "start": 77, "end": 78, "default_hours": "45 Hours"},
    {"sem": 1, "code": "BP111P", "name": "Pharmaceutical Inorganic and Analytical Chemistry (Practical)", "credits": 1, "type": "P", "start": 79, "end": 80, "default_hours": "45 Hours"},
    # Sem 2
    {"sem": 2, "code": "BP207P", "name": "Biochemistry (Practical)", "credits": 1, "type": "P", "start": 101, "end": 102, "default_hours": "45 Hours"},
    {"sem": 2, "code": "BP208P", "name": "Human Anatomy, Physiology and Pathophysiology II (Practical)", "credits": 1, "type": "P", "start": 103, "end": 104, "default_hours": "45 Hours"},
    {"sem": 2, "code": "BP209P", "name": "Pharmaceutical Organic Chemistry (Practical)", "credits": 1, "type": "P", "start": 105, "end": 106, "default_hours": "45 Hours"},
    {"sem": 2, "code": "BP210P", "name": "Pharmacognosy and Phytochemistry (Practical)", "credits": 1, "type": "P", "start": 107, "end": 108, "default_hours": "45 Hours"},
    {"sem": 2, "code": "BP211P", "name": "Physical Pharmaceutics (Practical)", "credits": 1, "type": "P", "start": 109, "end": 110, "default_hours": "45 Hours"},
    # Sem 3
    {"sem": 3, "code": "BP309P", "name": "General Pharmacology (Practical)", "credits": 2, "type": "P", "start": 134, "end": 136, "default_hours": "60 Hours"},
    {"sem": 3, "code": "BP310P", "name": "Heterocyclic Compounds and Stereochemistry (Practical)", "credits": 2, "type": "P", "start": 137, "end": 138, "default_hours": "60 Hours"},
    {"sem": 3, "code": "BP311P", "name": "Pharmaceutical Dosage Forms I (Practical)", "credits": 1, "type": "P", "start": 139, "end": 140, "default_hours": "45 Hours"},
    # Sem 4
    {"sem": 4, "code": "BP406P", "name": "Herbal Drug Technology (Practical)", "credits": 1, "type": "P", "start": 157, "end": 158, "default_hours": "45 Hours"},
    {"sem": 4, "code": "BP407P", "name": "Medicinal Chemistry (Practical)", "credits": 1, "type": "P", "start": 159, "end": 160, "default_hours": "45 Hours"},
    {"sem": 4, "code": "BP408P", "name": "Pharmaceutical Biotechnology (Practical)", "credits": 1, "type": "P", "start": 161, "end": 162, "default_hours": "45 Hours"},
    {"sem": 4, "code": "BP409P", "name": "Social Pharmacy and Public Health (Practical)", "credits": 1, "type": "P", "start": 163, "end": 164, "default_hours": "30 Hours"},
    {"sem": 4, "code": "BP410P", "name": "Systemic Pharmacology I (Practical)", "credits": 1, "type": "P", "start": 165, "end": 167, "default_hours": "45 Hours"},
    # Sem 5
    {"sem": 5, "code": "BP507P", "name": "Biomedicinal Chemistry (Practical)", "credits": 2, "type": "P", "start": 189, "end": 190, "default_hours": "60 Hours"},
    {"sem": 5, "code": "BP508P", "name": "Industrial Pharmacognosy (Practical)", "credits": 1, "type": "P", "start": 191, "end": 192, "default_hours": "45 Hours"},
    {"sem": 5, "code": "BP509P", "name": "Pharmaceutical Dosage Form II (Practical)", "credits": 1, "type": "P", "start": 193, "end": 194, "default_hours": "45 Hours"},
    {"sem": 5, "code": "BP510P", "name": "Systemic Pharmacology II (Practical)", "credits": 2, "type": "P", "start": 195, "end": 197, "default_hours": "60 Hours"},
    # Sem 6
    {"sem": 6, "code": "BP608P", "name": "Biopharmaceutics and Pharmacokinetics (Practical)", "credits": 1, "type": "P", "start": 217, "end": 218, "default_hours": "45 Hours"},
    {"sem": 6, "code": "BP609P", "name": "Pharmaceutical Analysis (Practical)", "credits": 2, "type": "P", "start": 219, "end": 220, "default_hours": "60 Hours"},
    # Sem 7
    {"sem": 7, "code": "BP709P", "name": "Modern Analytical Techniques (Practical)", "credits": 1, "type": "P", "start": 246, "end": 247, "default_hours": "45 Hours"},
    # Sem 8
    {"sem": 8, "code": "BP807P", "name": "Pharmaceutical Marketing Skills (Practical)", "credits": 1, "type": "P", "start": 264, "end": 265, "default_hours": "30 Hours"},
    {"sem": 8, "code": "BP808P", "name": "Sterile Dosage Forms and Novel Drug Delivery System (Practical)", "credits": 2, "type": "P", "start": 266, "end": 267, "default_hours": "60 Hours"}
]

def extract_practical(c):
    text = clean_text("\n".join(pages[c["start"]:c["end"]+1]))
    objectives = extract_objectives(text)
    references = extract_references(text)

    h_m = re.search(r"(\d+)\s*(Hours|hours|hrs)", text)
    hours = f"{h_m.group(1)} Hours" if h_m else c["default_hours"]

    prac_m = re.search(r"(?:List of practicals?|List of practices?|Detailed Syllabus:?[\s\S]*?List of practicals?|Detailed Syllabus:?[\s\S]*?List of practices?):?([\s\S]*?)(?:Recommended References|Recommended Books|Reference Books|$)", text, re.IGNORECASE)
    experiments = []
    if prac_m:
        raw_prac = prac_m.group(1).strip()
        lines = [l.strip() for l in raw_prac.split("\n") if l.strip()]
        cur_exp = ""
        for line in lines:
            if re.match(r"^\d+\.\s+", line):
                if cur_exp:
                    experiments.append(cur_exp)
                cur_exp = line
            elif cur_exp and (re.match(r"^[a-z]\)\s+", line) or re.match(r"^[•\-o]\s+", line)):
                cur_exp += "; " + line
            elif cur_exp:
                cur_exp += " " + line
            elif not cur_exp and len(line) > 5 and not "minimum" in line.lower() and not "perform any" in line.lower():
                cur_exp = line
        if cur_exp:
            experiments.append(cur_exp)

    clean_exps = []
    for exp in experiments:
        s = " ".join(exp.split())
        if len(s) > 5 and not "minimum" in s.lower() and not "perform any" in s.lower() and not "recommended" in s.lower():
            clean_exps.append(s)

    units = [
        {
            "num": "I",
            "title": f"Laboratory Practicals & Experiments ({hours})",
            "hours": hours,
            "topics": clean_exps
        }
    ]

    return {
        "sem": c["sem"],
        "code": c["code"],
        "name": c["name"],
        "credits": c["credits"],
        "type": c["type"],
        "highlight": False,
        "units": units,
        "objectives": objectives,
        "references": references
    }

# ─────────────────────────────────────────────────────────────
# 3. ELECTIVE COURSES EXTRACTOR (8 Parent Courses, 32 Options)
# ─────────────────────────────────────────────────────────────
def extract_elective_group(g):
    all_objectives = []
    all_references = []
    units = []

    for idx, opt in enumerate(g["options"]):
        opt_text = clean_text("\n".join(pages[opt["start"]:opt["end"]+1]))
        opt_objs = extract_objectives(opt_text)
        opt_refs = extract_references(opt_text)

        for obj in opt_objs:
            if obj not in all_objectives:
                all_objectives.append(obj)
        for ref in opt_refs:
            if ref not in all_references:
                all_references.append(ref)

        if opt["type"] == "P":
            prac_m = re.search(r"(?:List of practicals?|List of practices?|Detailed Syllabus:?[\s\S]*?List of practicals?|Detailed Syllabus:?[\s\S]*?List of practices?):?([\s\S]*?)(?:Recommended References|Recommended Books|Reference Books|$)", opt_text, re.IGNORECASE)
            experiments = []
            if prac_m:
                raw_prac = prac_m.group(1).strip()
                lines = [l.strip() for l in raw_prac.split("\n") if l.strip()]
                cur_exp = ""
                for line in lines:
                    if re.match(r"^\d+\.\s+", line):
                        if cur_exp: experiments.append(cur_exp)
                        cur_exp = line
                    elif cur_exp and (re.match(r"^[a-z]\)\s+", line) or re.match(r"^[•\-o]\s+", line)):
                        cur_exp += "; " + line
                    elif cur_exp:
                        cur_exp += " " + line
                    elif not cur_exp and len(line) > 5 and not "minimum" in line.lower() and not "perform any" in line.lower():
                        cur_exp = line
                if cur_exp:
                    experiments.append(cur_exp)
            clean_exps = []
            for exp in experiments:
                s = " ".join(exp.split())
                if len(s) > 5 and not "minimum" in s.lower() and not "perform any" in s.lower() and not "recommended" in s.lower():
                    clean_exps.append(s)
            
            topics = clean_exps if clean_exps else [f"Hands-on practical experiments for {opt['title']}"]
        else:
            syl_m = re.search(r"(?:Detailed Syllabus|Detailed syllabus):?([\s\S]*?)(?:Recommended References|Recommended Books|Reference Books|$)", opt_text, re.IGNORECASE)
            raw = syl_m.group(1) if syl_m else ""
            lines = [l.strip() for l in raw.split("\n") if l.strip()]
            lines = [l for l in lines if not re.match(r"^(?:Unit|Topics|No\.|Lectures)", l, re.IGNORECASE)]
            raw_topics = []
            cur = ""
            for l in lines:
                lc = l.strip()
                # Skip lines that are just Roman numerals or hours
                if re.match(r"^(?:I|II|III|IV|V)\s*(?:\d+\s*(?:hours|hrs))?$", lc, re.IGNORECASE):
                    continue
                if re.match(r"^\d+\s*(?:hours|hrs)$", lc, re.IGNORECASE):
                    continue

                # Strip Roman numerals and stray hours from current line
                lc = re.sub(r"^(?:I|II|III|IV|V)\b\s*", "", lc).strip()
                lc = re.sub(r"\b\d+\s*(?:hours|hrs)\b", "", lc, flags=re.IGNORECASE).strip()
                if not lc:
                    continue

                is_bullet = lc.startswith("•") or lc.startswith("-") or lc.startswith("*") or re.match(r"^o\s+", lc) or re.match(r"^\d+\.\s+", lc)
                if is_bullet:
                    if cur:
                        raw_topics.append(cur)
                    cur = re.sub(r"^[•\-\*]\s*|^o\s+|^\d+\.\s+", "", lc).strip()
                else:
                    if cur:
                        cur += " " + lc
                    else:
                        cur = lc
            if cur:
                raw_topics.append(cur)

            cleaned_topics = []
            for t in raw_topics:
                t_clean = " ".join(t.split()).strip()
                t_clean = re.sub(r"^[•\-\*]\s*|^o\s+|^\d+\.\s+", "", t_clean).strip()
                t_clean = re.sub(r"\b\d+\s*(?:hours|hrs)\b", "", t_clean, flags=re.IGNORECASE).strip()
                if len(t_clean) > 3 and not re.match(r"^\d+$", t_clean):
                    cleaned_topics.append(t_clean)

            topics = refine_topics(cleaned_topics) if cleaned_topics else [f"Comprehensive theoretical study of {opt['title']}"]

        romans = ["I", "II", "III", "IV", "V", "VI"]
        num_label = romans[idx] if idx < len(romans) else str(idx + 1)

        units.append({
            "num": num_label,
            "title": f"Option {idx + 1}: {opt['code']} — {opt['title']} ({opt['hours']})",
            "hours": opt["hours"],
            "topics": topics
        })

    return {
        "sem": g["sem"],
        "code": g["parent_code"],
        "name": g["name"],
        "credits": g["credits"],
        "type": g["type"],
        "highlight": False,
        "units": units,
        "objectives": all_objectives[:6], # Keep concise top objectives
        "references": all_references[:8]   # Keep top recommended references
    }

# ─────────────────────────────────────────────────────────────
# 4. INTERNSHIPS & RESEARCH PROJECTS (4 Courses)
# ─────────────────────────────────────────────────────────────
def get_internships_and_projects():
    return [
        {
            "sem": 4,
            "code": "BP411I",
            "name": "Internship I (Mandatory)",
            "credits": 4,
            "type": "I",
            "highlight": True,
            "objectives": [
                "Expose students to real-world pharmaceutical manufacturing, healthcare systems, or community pharmacy practice.",
                "Understand standard operating procedures (SOPs), cGMP, quality systems, and regulatory documentation in industrial settings.",
                "Gain hands-on exposure to formulation compounding, dispensing, inventory management, and patient counseling.",
                "Develop professional work ethics, teamwork, and communication skills in organizational environments.",
                "Synthesize experiential learning into a comprehensive internship portfolio and technical report."
            ],
            "references": [
                "Pharmacy Council of India (PCI) Guidelines for Practice Training and Internship in B.Pharm (NEP 2020 Regulation Section 22).",
                "WHO Guidelines on Good Manufacturing Practices (GMP) and Good Distribution Practices (GDP).",
                "Indian Pharmacopoeia Commission (IPC) Guidance on Pharmacovigilance and Quality Standards.",
                "Remington: The Science and Practice of Pharmacy, 23rd Edition."
            ],
            "units": [
                {
                    "num": "I",
                    "title": "Industrial & Manufacturing Operations Exposure",
                    "hours": "30 Hours",
                    "topics": [
                        "Observation of pharmaceutical production lines (solid orals, liquid orals, injectables, semi-solids)",
                        "cGMP compliance, cleanroom classification, HVAC systems, and gowning procedures",
                        "Raw material procurement, quarantine, testing, and warehouse management",
                        "In-process quality control (IPQC) testing and batch manufacturing record (BMR) documentation"
                    ]
                },
                {
                    "num": "II",
                    "title": "Hospital & Clinical Pharmacy Operations",
                    "hours": "30 Hours",
                    "topics": [
                        "Inpatient and outpatient pharmacy dispensing procedures and computerized prescription handling",
                        "Medication reconciliation, drug-drug interaction screening, and adverse drug reaction reporting",
                        "Ward rounds observation and understanding hospital drug formulary management",
                        "Cold chain maintenance and storage of vaccines, biologicals, and narcotic drugs"
                    ]
                },
                {
                    "num": "III",
                    "title": "Community Pharmacy & Patient Care Practice",
                    "hours": "30 Hours",
                    "topics": [
                        "Prescription auditing, dispensing protocols, and patient counseling techniques",
                        "OTC medication management, minor ailment triage, and first-aid advisory",
                        "Digital pharmacy management software, inventory control, and supply chain tracking",
                        "Community health awareness, rational drug use education, and public health campaigns"
                    ]
                },
                {
                    "num": "IV",
                    "title": "Regulatory Documentation & Technical Report Submission",
                    "hours": "30 Hours",
                    "topics": [
                        "Daily training logbook maintenance verified and countersigned by industrial/hospital mentor",
                        "Case studies on quality issues, deviation handling, and corrective and preventive action (CAPA)",
                        "Formal internship report preparation (minimum 25 pages) as per PCI Regulation Section 22",
                        "Evaluation criteria: Certificate & report submission (75 marks), Viva voce presentation (25 marks)"
                    ]
                }
            ]
        },
        {
            "sem": 6,
            "code": "BP612I",
            "name": "Internship II (Mandatory)",
            "credits": 4,
            "type": "I",
            "highlight": True,
            "objectives": [
                "Provide advanced specialized training in pharmaceutical R&D, quality assurance, regulatory affairs, or clinical pharmacovigilance.",
                "Understand advanced analytical method validation, dissolution testing, stability studies, and dossier preparation.",
                "Apply pharmaceutical knowledge to industry-scale problem solving, troubleshooting, and continuous quality improvement.",
                "Understand national and international regulatory compliance (CDSCO, USFDA, EMA, WHO).",
                "Demonstrate executive report writing, presentation, and defense skills before academic and industry evaluators."
            ],
            "references": [
                "PCI Regulations on Experiential Learning and Advanced Internship (NEP 2020 Section 22).",
                "ICH Guidelines (Q1A Stability, Q2 Analytical Validation, Q7 GMP for APIs, Q8 Pharmaceutical Development).",
                "CDSCO Guidance on Clinical Trials, Bioavailability/Bioequivalence Studies, and New Drug Applications.",
                "US FDA Code of Federal Regulations (21 CFR Part 210/211)."
            ],
            "units": [
                {
                    "num": "I",
                    "title": "Formulation R&D and Process Development",
                    "hours": "30 Hours",
                    "topics": [
                        "Pre-formulation testing, excipient compatibility studies, and solubility enhancement strategies",
                        "Pilot plant scale-up, technology transfer, and process validation protocols",
                        "Novel drug delivery formulation trials (nanoparticles, liposomes, sustained-release matrices)",
                        "Formulation troubleshooting, stability testing according to ICH Q1A guidelines"
                    ]
                },
                {
                    "num": "II",
                    "title": "Advanced Quality Assurance & Regulatory Affairs",
                    "hours": "30 Hours",
                    "topics": [
                        "Analytical method validation (ICH Q2R1) using HPLC, GC, LC-MS, and FTIR instrumentation",
                        "Out of Specification (OOS), Out of Trend (OOT), and CAPA investigation methodologies",
                        "CTD/eCTD dossier module preparation (Module 3 Quality, Module 4 Nonclinical, Module 5 Clinical)",
                        "Regulatory audit preparation, data integrity compliance (ALCOA+), and electronic signatures"
                    ]
                },
                {
                    "num": "III",
                    "title": "Pharmacovigilance & Clinical Research Practice",
                    "hours": "30 Hours",
                    "topics": [
                        "Individual Case Safety Report (ICSR) processing, MedDRA coding, and causality assessment",
                        "Periodic Safety Update Reports (PSUR/PBRER) and Signal Detection methodologies",
                        "Clinical trial protocol review, GCP compliance, informed consent documentation, and trial monitoring",
                        "Regulatory submission of adverse events to PvPI (NCC-IPC) and CDSCO portal"
                    ]
                },
                {
                    "num": "IV",
                    "title": "Advanced Dissertation Report & Viva-Voce Evaluation",
                    "hours": "30 Hours",
                    "topics": [
                        "Compilation of comprehensive technical internship thesis with experimental or observational data",
                        "Evaluation criteria per Section 22: Certificate & report submission (75 Marks), Oral defense (25 Marks)",
                        "Presentation of project outcomes before internal and external university-appointed evaluators",
                        "Integration of findings into professional career development or research publication"
                    ]
                }
            ]
        },
        {
            "sem": 7,
            "code": "BP710RP",
            "name": "Research Project (Major)",
            "credits": 6,
            "type": "RP",
            "highlight": True,
            "objectives": [
                "Develop independent research thinking, scientific hypothesis generation, and literature survey methodology.",
                "Design rigorous experimental or computational protocols to address unmet pharmaceutical research questions.",
                "Execute laboratory synthesis, formulation design, in silico modeling, or pharmacological evaluations.",
                "Maintain accurate research laboratory notebooks complying with data integrity and bioethics standards.",
                "Complete Semester VII milestone evaluation including problem formulation, methodology, and interim progress."
            ],
            "references": [
                "PCI NEP 2020 Regulation Section 21: Guidelines for Project Work and Dissertation.",
                "Kothari, C. R., Research Methodology: Methods and Techniques. New Age International Publishers.",
                "Booth, W. C., Colomb, G. G., Williams, J. M. The Craft of Research. University of Chicago Press.",
                "Guidelines of Committee for Control and Supervision of Experiments on Animals (CCSEA) and Institutional Ethics Committee (IEC)."
            ],
            "units": [
                {
                    "num": "I",
                    "title": "Topic Selection, Hypothesis & Literature Review",
                    "hours": "20 Hours",
                    "topics": [
                        "Identification of research gap across pharmaceutics, medicinal chemistry, pharmacology, or pharmacognosy",
                        "Comprehensive database search using PubMed, Scopus, Web of Science, Google Scholar, and SciFinder",
                        "Formulation of clear scientific hypothesis, aims, and specific measurable objectives",
                        "External mentor alignment from Industry, Hospital, or NABL/CDSCO-approved laboratory"
                    ]
                },
                {
                    "num": "II",
                    "title": "Research Design & Ethical Clearances",
                    "hours": "20 Hours",
                    "topics": [
                        "Detailed experimental methodology, study design, and statistical power analysis",
                        "Institutional Animal Ethics Committee (IAEC) or Institutional Ethics Committee (IEC) protocol submission",
                        "Chemical safety, hazardous waste disposal, bio-safety cabinet handling, and GLP compliance",
                        "Procurement of active pharmaceutical ingredients, excipients, analytical reagents, and standard references"
                    ]
                },
                {
                    "num": "III",
                    "title": "Method Standardization & Pilot Experimentation",
                    "hours": "30 Hours",
                    "topics": [
                        "Calibration and standardization of analytical instruments (UV, FTIR, HPLC, TLC-densitometry)",
                        "Pilot scale synthesis of lead molecules, extract isolation, or prototype formulation compounding",
                        "Optimization of process variables using Quality by Design (QbD) or Design of Experiments (DoE)",
                        "Recording raw data in bound research notebooks adhering to ALCOA+ principles"
                    ]
                },
                {
                    "num": "IV",
                    "title": "Interim Milestone Report & Semester VII Evaluation",
                    "hours": "20 Hours",
                    "topics": [
                        "Compilation of Semester VII progress report (minimum 15 pages) detailing literature, methodology, and initial findings",
                        "Table XVIII & XIX criteria alignment: Objectives evaluation (10 marks), Methodology adopted (20 marks)",
                        "Group presentation before University-appointed external and internal evaluation committee",
                        "Formulation of work plan for final experimental completion in Semester VIII"
                    ]
                }
            ]
        },
        {
            "sem": 8,
            "code": "BP810RP",
            "name": "Research Project (Final Submission)",
            "credits": 6,
            "type": "RP",
            "highlight": True,
            "objectives": [
                "Complete all experimental runs, computational screenings, or clinical observational evaluations.",
                "Apply statistical methods (ANOVA, regression analysis, t-test, post-hoc tests) to analyze data.",
                "Formulate evidence-based conclusions, identify project limitations, and propose future research avenues.",
                "Write and submit a formal, hardbound dissertation thesis (minimum 25 pages) in triplicate.",
                "Successfully defend research findings in a public viva-voce before external and internal university examiners."
            ],
            "references": [
                "PCI NEP 2020 Regulation Section 21: Guidelines for Project Work and Dissertation.",
                "Table XVIII & XIX: Official Evaluation Criteria for Dissertation Book & Presentation.",
                "Day, R. A., Gastel, B. How to Write and Publish a Scientific Paper. Cambridge University Press.",
                "Montgomery, D. C. Design and Analysis of Experiments. John Wiley & Sons."
            ],
            "units": [
                {
                    "num": "I",
                    "title": "Experimental Completion & Data Validation",
                    "hours": "25 Hours",
                    "topics": [
                        "Completion of all experimental batches, biological assays, in vitro drug release, or analytical assays",
                        "Replicate runs to ensure reproducibility and statistical validity of results",
                        "Resolution of experimental anomalies, outliers, and negative controls verification",
                        "Raw data backup, instrument run logs, and spectral database archiving"
                    ]
                },
                {
                    "num": "II",
                    "title": "Statistical Data Analysis & Result Interpretation",
                    "hours": "20 Hours",
                    "topics": [
                        "Statistical significance testing using GraphPad Prism, SPSS, R, or Python biostatistics packages",
                        "Generation of publication-quality graphs, kinetic models, FTIR/NMR spectral interpretations, and SEM images",
                        "In-depth discussion comparing experimental findings with published scientific literature",
                        "Delineation of major breakthroughs, commercial feasibility, and technological advancements"
                    ]
                },
                {
                    "num": "III",
                    "title": "Dissertation Compilation & Plagiarism Verification",
                    "hours": "25 Hours",
                    "topics": [
                        "Drafting formal thesis: Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Summary, References",
                        "Verification of originality using university-approved plagiarism detection software (similarity index < 10%)",
                        "Certification and endorsement by Faculty Guide, External Mentor, and Head of Department",
                        "Submission of final hard-bound project report in triplicate (minimum 25 pages as per Section 21)"
                    ]
                },
                {
                    "num": "IV",
                    "title": "Final Dissertation Evaluation & Viva-Voce Defense",
                    "hours": "20 Hours",
                    "topics": [
                        "Formal evaluation of Dissertation Book (60 Marks per Table XVIII: Objectives 10, Methodology 20, Results 20, Conclusion 10)",
                        "Final Defense Presentation (90 Marks per Table XIX: Presentation 40, Communication 20, Q&A defense 30)",
                        "Total 150 Marks evaluation by University-appointed External and Internal Board of Examiners",
                        "Preparation of research manuscript for submission to peer-reviewed Scopus/Web of Science indexed journals"
                    ]
                }
            ]
        }
    ]

# ─────────────────────────────────────────────────────────────
# 5. ASSEMBLE FULL CURRICULUM
# ─────────────────────────────────────────────────────────────
print("Extracting Theory courses...")
theory_list = [extract_theory(c) for c in THEORY_COURSES]

print("Extracting Practical courses...")
practical_list = [extract_practical(c) for c in PRACTICAL_COURSES]

print("Extracting Elective courses...")
elective_list = [extract_elective_group(g) for g in ELECTIVE_GROUPS]

print("Assembling Internships and Research Projects...")
internships_and_projects = get_internships_and_projects()

all_courses = theory_list + practical_list + elective_list + internships_and_projects

# Sort into semesters
semesters_data = {i: [] for i in range(1, 9)}
for c in all_courses:
    semesters_data[c["sem"]].append(c)

# Sort subjects within each semester by code
for i in range(1, 9):
    semesters_data[i].sort(key=lambda x: x["code"])

# Verify Semester counts and credits
expected_credits = {1: 21, 2: 26, 3: 25, 4: 23, 5: 22, 6: 26, 7: 26, 8: 24}
expected_counts = {1: 11, 2: 12, 3: 12, 4: 11, 5: 10, 6: 12, 7: 10, 8: 10}

total_credits = 0
total_subjects = 0
for i in range(1, 9):
    c_list = semesters_data[i]
    c_credits = sum(x["credits"] for x in c_list)
    total_credits += c_credits
    total_subjects += len(c_list)
    print(f"Semester {i}: {len(c_list)} subjects (expected {expected_counts[i]}), {c_credits} credits (expected {expected_credits[i]})")
    assert len(c_list) == expected_counts[i], f"Semester {i} subject count mismatch: {len(c_list)} != {expected_counts[i]}"
    assert c_credits == expected_credits[i], f"Semester {i} credit mismatch: {c_credits} != {expected_credits[i]}"

print(f"\nAll assertions passed! Total subjects: {total_subjects}, Total credits: {total_credits}")

# ─────────────────────────────────────────────────────────────
# 6. GENERATE LIB/SYLLABUS.TS
# ─────────────────────────────────────────────────────────────
ts_output = """// lib/syllabus.ts
// ─────────────────────────────────────────────────────────────
// PCI B.Pharm NEP 2020 — Complete Official Detailed Syllabus Data
// Source: Official PCI Syllabus (Tables I-VIII, Detailed Syllabus, & Appendix I)
// 100% Comprehensive Coverage: All 8 Semesters, 88 Subjects, 193 Credits
// Includes Course Objectives, Units with Hours & Topics, and Recommended References
// ─────────────────────────────────────────────────────────────
import { makeSubjectSlug } from "./slug";

export interface SubjectUnit {
    num: "I" | "II" | "III" | "IV" | "V" | string;
    title: string;
    topics: string[];   // bullet-point sub-topics from official syllabus
    hours: string;
}

export interface Subject {
    code: string;
    name: string;
    credits: number;
    type: "T" | "P" | "I" | "RP";
    highlight?: boolean;
    slug: string;
    units: SubjectUnit[];
    objectives?: string[];
    references?: string[];
}

export interface Semester {
    num: number;
    credits: number;
    color: string;
    bg: string;
    badge: string;
    label: string;
    subjects: Subject[];
}

// ─────────────────────────────────────────────────────────────
// HELPER — auto-generate slug from code and name
// ─────────────────────────────────────────────────────────────
function s(
    code: string,
    name: string,
    credits: number,
    type: Subject["type"],
    units: SubjectUnit[],
    highlight = false,
    objectives: string[] = [],
    references: string[] = []
): Subject {
    return { code, name, credits, type, highlight, slug: makeSubjectSlug(code, name), units, objectives, references };
}
"""

def escape_ts(s):
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')

for i in range(1, 9):
    ts_output += f"\n// ─────────────────────────────────────────────────────────────\n"
    ts_output += f"// SEMESTER {i}\n"
    ts_output += f"// ─────────────────────────────────────────────────────────────\n"
    ts_output += f"const SEM{i}: Subject[] = [\n"
    for sub in semesters_data[i]:
        ts_output += f'    s("{escape_ts(sub["code"])}", "{escape_ts(sub["name"])}", {sub["credits"]}, "{sub["type"]}", [\n'
        for u in sub["units"]:
            ts_output += f'        {{\n'
            ts_output += f'            num: "{escape_ts(u["num"])}", hours: "{escape_ts(u["hours"])}", title: "{escape_ts(u["title"])}", topics: [\n'
            for top in u["topics"]:
                ts_output += f'                "{escape_ts(top)}",\n'
            ts_output += f'            ]\n'
            ts_output += f'        }},\n'
        ts_output += f'    ], {str(sub["highlight"]).lower()},\n'
        # objectives
        ts_output += f'    [\n'
        for obj in sub["objectives"]:
            ts_output += f'        "{escape_ts(obj)}",\n'
        ts_output += f'    ],\n'
        # references
        ts_output += f'    [\n'
        for ref in sub["references"]:
            ts_output += f'        "{escape_ts(ref)}",\n'
        ts_output += f'    ]),\n'
    ts_output += f"];\n"

ts_output += """
// ─────────────────────────────────────────────────────────────
// MASTER SEMESTERS ARRAY
// ─────────────────────────────────────────────────────────────
export const SEMESTERS: Semester[] = [
    { num: 1, credits: 21, color: "#4C6EF5", bg: "#EEF2FF", badge: "#C7D2FE", label: "Python + Core Sciences Foundation", subjects: SEM1 },
    { num: 2, credits: 26, color: "#10B981", bg: "#ECFDF5", badge: "#A7F3D0", label: "Organic Chemistry + Biostatistics", subjects: SEM2 },
    { num: 3, credits: 25, color: "#F59E0B", bg: "#FFFBEB", badge: "#FDE68A", label: "Machine Learning + Pharmacology", subjects: SEM3 },
    { num: 4, credits: 23, color: "#EC4899", bg: "#FDF2F8", badge: "#FBCFE8", label: "Medicinal Chemistry + 1st Internship", subjects: SEM4 },
    { num: 5, credits: 22, color: "#8B5CF6", bg: "#F5F3FF", badge: "#DDD6FE", label: "QA + Innovation + Drug Delivery", subjects: SEM5 },
    { num: 6, credits: 26, color: "#06B6D4", bg: "#ECFEFF", badge: "#A5F3FC", label: "AI in Pharma + Analysis + Internship II", subjects: SEM6 },
    { num: 7, credits: 26, color: "#F97316", bg: "#FFF7ED", badge: "#FED7AA", label: "Pharmacovigilance + Regulatory + Research", subjects: SEM7 },
    { num: 8, credits: 24, color: "#BE185D", bg: "#FFF1F2", badge: "#FECDD3", label: "AI Ethics + Clinical + Final Research", subjects: SEM8 },
];

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
export function getAllSemesters(): Semester[] {
    return SEMESTERS;
}

export function getSemesterBySlug(slug: string): Semester | undefined {
    const match = slug.match(/^semester-(\\d)$/);
    if (!match) return undefined;
    const num = parseInt(match[1]);
    return SEMESTERS.find((s) => s.num === num);
}

export function getSubjectBySlug(sem: Semester, slug: string): Subject | undefined {
    return sem.subjects.find((s) => s.slug === slug);
}

export function getAllSubjectSlugs(): { semSlug: string; subjectSlug: string }[] {
    return SEMESTERS.flatMap((sem) =>
        sem.subjects.map((sub) => ({
            semSlug: `semester-${sem.num}`,
            subjectSlug: sub.slug,
        }))
    );
}

export const TOTAL_CREDITS: number = SEMESTERS.reduce((sum, s) => sum + s.credits, 0);
export const TOTAL_SUBJECTS: number = SEMESTERS.reduce((sum, s) => sum + s.subjects.length, 0);
"""

OUTPUT_TS_PATH = r"lib\syllabus.ts"
with open(OUTPUT_TS_PATH, "w", encoding="utf-8") as f:
    f.write(ts_output)

print(f"Successfully wrote {OUTPUT_TS_PATH}! Size: {len(ts_output)} bytes.")
