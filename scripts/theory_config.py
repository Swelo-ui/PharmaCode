import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

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
    m = re.search(r"(?:COURSE OBJECTIVES|Course Objectives):?([\s\S]*?)(?:COURSE OUTCOMES|Course Outcomes|Detailed Syllabus|List of practical)", text, re.IGNORECASE)
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
    m = re.search(r"(?:Recommended References|Recommended Books|Reference Books)[\s\S]*?:([\s\S]*?)(?:## PDF Page|\n\s*Course Code|\n\s*Unit No|$)", text, re.IGNORECASE)
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

# Mapping of all theory courses and curated unit titles
THEORY_COURSES = [
    # Sem 1
    {
        "sem": 1, "code": "BP101T", "name": "Basics of Python Programming for Pharmaceutical Sciences", "credits": 2, "type": "T", "highlight": True,
        "start": 54, "end": 56,
        "unit_titles": [
            "Introduction to Python Programming",
            "Control Structures & Functions",
            "Data Structures & File Handling",
            "Data Handling with Pandas",
            "Data Visualization with Matplotlib"
        ]
    },
    {
        "sem": 1, "code": "BP102T", "name": "General Pharmacy", "credits": 3, "type": "T", "highlight": False,
        "start": 57, "end": 59,
        "unit_titles": [
            "Introduction to the Profession of Pharmacy",
            "Pharmaceutical Calculations and Posology",
            "Solid Dosage Forms — Powders, Tablets and Capsules",
            "Monophasic and Biphasic Liquid Dosage Forms",
            "Semisolid Dosage Forms and Suppositories"
        ]
    },
    {
        "sem": 1, "code": "BP103T", "name": "Healthcare Psychology and Communication Skills", "credits": 1, "type": "T", "highlight": False,
        "start": 60, "end": 62,
        "unit_titles": [
            "Introduction to Psychology in Healthcare",
            "Developmental and Behavioural Psychology",
            "Foundations of Health Communication",
            "Professional Communication in Healthcare Settings",
            "Health Psychology and Behavioural Interventions"
        ]
    },
    {
        "sem": 1, "code": "BP104T", "name": "Human Anatomy, Physiology and Pathophysiology I", "credits": 4, "type": "T", "highlight": False,
        "start": 63, "end": 65,
        "unit_titles": [
            "Introduction to Human Body, Cell and Tissues",
            "Integumentary and Skeletal Systems",
            "Body Fluids, Blood and Lymphatic System",
            "Peripheral Nervous System and Special Senses",
            "Cardiovascular System and Pathophysiology"
        ]
    },
    {
        "sem": 1, "code": "BP105T", "name": "Introduction to Pharmacognosy", "credits": 3, "type": "T", "highlight": False,
        "start": 66, "end": 67,
        "unit_titles": [
            "Introduction to Pharmacognosy and Sources of Crude Drugs",
            "Classification of Crude Drugs",
            "Quality Control of Drugs of Natural Origin (WHO Guidelines)",
            "Conservation of Medicinal Plants and Good Agricultural Practices",
            "Plant Secondary Metabolites and Primary Metabolites"
        ]
    },
    {
        "sem": 1, "code": "BP106T", "name": "Pharmaceutical Inorganic and Analytical Chemistry", "credits": 3, "type": "T", "highlight": False,
        "start": 68, "end": 70,
        "unit_titles": [
            "Introduction to Pharmaceutical Analysis and Impurities",
            "Acid-Base Chemistry, Buffers and Major Intra/Extracellular Electrolytes",
            "Titrimetric Methods of Analysis",
            "Gastrointestinal Agents and Topical Agents",
            "Dental Products, Radiopharmaceuticals and Miscellaneous Inorganic Compounds"
        ]
    },

    # Sem 2
    {
        "sem": 2, "code": "BP201T", "name": "Applied Biostatistics and Data Analytics for Pharmaceutical Sciences", "credits": 2, "type": "T", "highlight": True,
        "start": 82, "end": 84,
        "unit_titles": [
            "Introduction to Data Analytics & Descriptive Statistics",
            "Probability & Probability Distributions",
            "Inferential Statistics & Hypothesis Testing",
            "Correlation & Regression Analysis",
            "Experimental Design & Statistical Quality Control"
        ]
    },
    {
        "sem": 2, "code": "BP202T", "name": "Biochemistry", "credits": 3, "type": "T", "highlight": False,
        "start": 85, "end": 87,
        "unit_titles": [
            "Biomolecules and Bioenergetics",
            "Carbohydrate Metabolism",
            "Lipid Metabolism",
            "Amino Acid and Protein Metabolism",
            "Nucleic Acid Metabolism and Genetic Information Transfer"
        ]
    },
    {
        "sem": 2, "code": "BP203T", "name": "Human Anatomy, Physiology and Pathophysiology II", "credits": 4, "type": "T", "highlight": False,
        "start": 88, "end": 90,
        "unit_titles": [
            "Digestive System and Nutrition",
            "Respiratory System and Pathophysiology",
            "Endocrine System and Hormonal Regulation",
            "Renal System, Fluid Balance and Pathophysiology",
            "Reproductive System and Energetics"
        ]
    },
    {
        "sem": 2, "code": "BP204T", "name": "Pharmaceutical Organic Chemistry", "credits": 4, "type": "T", "highlight": False,
        "start": 91, "end": 93,
        "unit_titles": [
            "Aliphatic Saturated Hydrocarbons (Alkanes & Cycloalkanes)",
            "Aliphatic Unsaturated Hydrocarbons (Alkenes & Conjugated Dienes)",
            "Alkyl Halides (SN1, SN2, E1, E2 & Elimination Reactions)",
            "Benzene and Its Derivatives (Electrophilic Aromatic Substitution)",
            "Carbonyl Compounds (Aldehydes and Ketones)"
        ]
    },
    {
        "sem": 2, "code": "BP205T", "name": "Pharmacognosy and Phytochemistry", "credits": 4, "type": "T", "highlight": False,
        "start": 94, "end": 97,
        "unit_titles": [
            "Metabolic Pathways in Higher Plants & Biogenesis",
            "Alkaloids and Glycosides",
            "Terpenoids, Volatile Oils and Resins",
            "Tannins, Flavonoids and Phenylpropanoids",
            "Extraction, Isolation and Standardization of Phytoconstituents"
        ]
    },
    {
        "sem": 2, "code": "BP206T", "name": "Physical Pharmaceutics", "credits": 3, "type": "T", "highlight": False,
        "start": 98, "end": 100,
        "unit_titles": [
            "Solubility Distribution Phenomenon and Buffers",
            "Interfacial Phenomenon",
            "Colloidal and Coarse Dispersions",
            "Rheological Studies",
            "Micromeritics and Powder Flow Properties"
        ]
    },

    # Sem 3
    {
        "sem": 3, "code": "BP301T", "name": "Introduction to Machine Learning in Pharmaceutical Sciences", "credits": 2, "type": "T", "highlight": True,
        "start": 113, "end": 115,
        "unit_titles": [
            "Introduction to Machine Learning in Pharmaceutical Sciences",
            "Supervised Learning — Regression and Classification",
            "Unsupervised Learning and Dimensionality Reduction",
            "Model Evaluation and Validation Techniques",
            "Pharmaceutical Applications of Machine Learning"
        ]
    },
    {
        "sem": 3, "code": "BP302T", "name": "Environmental Sciences", "credits": 1, "type": "T", "highlight": False,
        "start": 116, "end": 117,
        "unit_titles": [
            "Ecosystems and Natural Resources",
            "Biodiversity and Its Conservation",
            "Environmental Pollution and Control",
            "Pharmaceutical Effluents, Biomedical Waste Management and Green Chemistry",
            "Environmental Legislation, Disaster Management and Sustainability"
        ]
    },
    {
        "sem": 3, "code": "BP303T", "name": "Ethics and Universal Human Values", "credits": 1, "type": "T", "highlight": False,
        "start": 118, "end": 119,
        "unit_titles": [
            "Introduction to Value Education and Self-Exploration",
            "Harmony in the Human Being",
            "Harmony in Family and Society",
            "Harmony in Nature and Existence",
            "Professional Ethics and Holistic Living"
        ]
    },
    {
        "sem": 3, "code": "BP304T", "name": "General Pharmacology", "credits": 3, "type": "T", "highlight": False,
        "start": 120, "end": 122,
        "unit_titles": [
            "Introduction to Pharmacology & Pharmacokinetics",
            "Pharmacodynamics & Mechanisms of Drug Action",
            "Adverse Drug Effects & Drug Interactions",
            "Discovery and Development of New Drugs",
            "Preclinical Safety & General Toxicology"
        ]
    },
    {
        "sem": 3, "code": "BP305T", "name": "Heterocyclic Compounds and Stereochemistry", "credits": 3, "type": "T", "highlight": False,
        "start": 123, "end": 125,
        "unit_titles": [
            "Conformational Analysis and Stereochemistry",
            "Five-Membered Heterocycles",
            "Six-Membered Heterocycles",
            "Fused Heterocyclic Systems",
            "Biological Significance and Synthesis of Heterocyclic Drugs"
        ]
    },
    {
        "sem": 3, "code": "BP306T", "name": "Pharmaceutical Dosage Forms I", "credits": 3, "type": "T", "highlight": False,
        "start": 126, "end": 128,
        "unit_titles": [
            "Fundamentals of Preformulation & Formulation Development",
            "Solid Dosage Forms — Compressed Tablets",
            "Hard and Soft Gelatin Capsules",
            "Liquid Orals and Dispersions",
            "Suppositories and Novel Oral Delivery Concepts"
        ]
    },
    {
        "sem": 3, "code": "BP307T", "name": "Pharmaceutical Engineering", "credits": 3, "type": "T", "highlight": False,
        "start": 129, "end": 130,
        "unit_titles": [
            "Flow of Fluids and Size Reduction",
            "Size Separation and Mixing",
            "Heat Transfer and Evaporation",
            "Distillation and Drying",
            "Filtration, Centrifugation, Materials and Corrosion"
        ]
    },
    {
        "sem": 3, "code": "BP308T", "name": "Pharmaceutical Microbiology", "credits": 3, "type": "T", "highlight": False,
        "start": 131, "end": 133,
        "unit_titles": [
            "Introduction to Microbiology, Bacteria and Viruses",
            "Identification and Cultivation of Microorganisms",
            "Sterilization Methods and Validation",
            "Disinfectants, Antiseptics and Microbial Assays",
            "Microbial Contamination, Cleanroom Engineering and Preservation"
        ]
    },

    # Sem 4
    {
        "sem": 4, "code": "BP401T", "name": "Herbal Drug Technology", "credits": 3, "type": "T", "highlight": False,
        "start": 143, "end": 145,
        "unit_titles": [
            "Plant Tissue Culture and Standardized Extracts",
            "Herbal Formulations, Excipients and Cosmetics",
            "Quality Control and Standardisation of Herbal Medicines",
            "Herb–Drug / Food / Herb Interactions",
            "Regulatory Requirements of Herbal Drugs and Botanicals"
        ]
    },
    {
        "sem": 4, "code": "BP402T", "name": "Medicinal Chemistry", "credits": 3, "type": "T", "highlight": False,
        "start": 146, "end": 148,
        "unit_titles": [
            "Fundamentals of Medicinal Chemistry and Drug Metabolism",
            "Drugs Acting on the Autonomic Nervous System",
            "Drugs Acting on the Cardiovascular System",
            "Drugs Acting on Blood and Renal System",
            "Autacoids, Antihistamines, PPIs and NSAIDs"
        ]
    },
    {
        "sem": 4, "code": "BP403T", "name": "Pharmaceutical Biotechnology", "credits": 3, "type": "T", "highlight": False,
        "start": 149, "end": 150,
        "unit_titles": [
            "Recombinant DNA Technology and Genetic Engineering",
            "Bioprocess Technology and Industrial Fermentation",
            "Immunology, Vaccines and Diagnostic Kits",
            "Enzyme Immobilization and Biosensors in Healthcare",
            "Regulatory Aspects, Biosafety and Biopharmaceuticals"
        ]
    },
    {
        "sem": 4, "code": "BP404T", "name": "Social Pharmacy and Public Health", "credits": 2, "type": "T", "highlight": False,
        "start": 151, "end": 153,
        "unit_titles": [
            "Introduction to Social Pharmacy and Public Health",
            "Epidemiology and Disease Prevention",
            "National Health Programs and Policies in India",
            "Health Education, Nutrition and Health Promotion",
            "Environmental Health, Disaster Response and Global Health"
        ]
    },
    {
        "sem": 4, "code": "BP405T", "name": "Systemic Pharmacology I", "credits": 3, "type": "T", "highlight": False,
        "start": 154, "end": 156,
        "unit_titles": [
            "Pharmacology of the Autonomic Nervous System",
            "Pharmacology of the Cardiovascular System",
            "Pharmacology of Drugs Acting on Blood and Renal System",
            "Autacoids, Histamine, Serotonin and Prostaglandins",
            "Pharmacology of the Respiratory System"
        ]
    },

    # Sem 5
    {
        "sem": 5, "code": "BP501T", "name": "Biomedicinal Chemistry", "credits": 3, "type": "T", "highlight": False,
        "start": 169, "end": 172,
        "unit_titles": [
            "Drugs Acting on the Central Nervous System",
            "Anti-Infective Chemotherapeutic Agents",
            "Antiprotozoals, Antivirals, Antifungals, Anthelmintics and Quinolones",
            "Antibiotics, Sulfa Drugs and Antineoplastic Agents",
            "Endocrine Drugs, Antidiabetic Agents and Narcotic Analgesics"
        ]
    },
    {
        "sem": 5, "code": "BP502T", "name": "Industrial Pharmacognosy", "credits": 3, "type": "T", "highlight": False,
        "start": 173, "end": 175,
        "unit_titles": [
            "Industrial Extraction and Scale-Up Processing",
            "Standardization of Extracts by Advanced Chromatography",
            "Quality Assurance and Stability of Herbal Products",
            "Industrial Production and Commercialization of Bioactives",
            "Global Regulatory Framework for Botanicals"
        ]
    },
    {
        "sem": 5, "code": "BP503T", "name": "Innovation and Startup Ecosystem", "credits": 2, "type": "T", "highlight": False,
        "start": 176, "end": 180,
        "unit_titles": [
            "Fundamentals of Innovation and Entrepreneurship",
            "Design Thinking and Problem Validation in Healthcare",
            "Business Model Development and Feasibility Analysis",
            "Startup Financing, Incubation and Commercialization",
            "IP Management and Regulatory Pathways for Health Startups"
        ]
    },
    {
        "sem": 5, "code": "BP504T", "name": "Pharmaceutical Dosage Form II", "credits": 2, "type": "T", "highlight": False,
        "start": 181, "end": 183,
        "unit_titles": [
            "Modified Release Drug Delivery Systems",
            "Transdermal and Mucosal Drug Delivery Systems",
            "Ocular, Nasal and Pulmonary Drug Delivery Systems",
            "Microencapsulation and Colloidal Drug Delivery Systems",
            "Targeted Drug Delivery Systems and Nanocarriers"
        ]
    },
    {
        "sem": 5, "code": "BP505T", "name": "Pharmaceutical Quality Assurance", "credits": 3, "type": "T", "highlight": False,
        "start": 184, "end": 185,
        "unit_titles": [
            "Quality Assurance and Good Manufacturing Practice (GMP)",
            "Quality Management Systems and ICH Guidelines",
            "Equipment Qualification, Calibration and Validation",
            "In-Process Quality Control (IPQC) and Documentation",
            "Complaints, Recalls, Audits and Quality Risk Management"
        ]
    },
    {
        "sem": 5, "code": "BP506T", "name": "Systemic Pharmacology II", "credits": 3, "type": "T", "highlight": False,
        "start": 186, "end": 188,
        "unit_titles": [
            "Pharmacology of the Central Nervous System",
            "Chemotherapy of Infectious Diseases and Cancer",
            "Immunopharmacology and Autacoids",
            "Endocrine Pharmacology",
            "Toxicology and Principles of Pharmacovigilance"
        ]
    },

    # Sem 6
    {
        "sem": 6, "code": "BP601T", "name": "Advanced Pharmacognosy", "credits": 3, "type": "T", "highlight": False,
        "start": 199, "end": 201,
        "unit_titles": [
            "Biotechnological Production of Secondary Metabolites",
            "Marine Pharmacognosy and Novel Bioactives",
            "Herbal Drug Standardization by Hyphenated Techniques",
            "Nutraceuticals, Cosmeceuticals and Functional Foods",
            "Intellectual Property Rights and Commercialization of Botanicals"
        ]
    },
    {
        "sem": 6, "code": "BP602T", "name": "Biopharmaceutics and Pharmacokinetics", "credits": 3, "type": "T", "highlight": False,
        "start": 202, "end": 204,
        "unit_titles": [
            "Introduction to Biopharmaceutics and Drug Absorption",
            "Drug Distribution, Binding and Elimination",
            "Pharmacokinetics — One-Compartment and Multicompartment Models",
            "Non-Linear Pharmacokinetics",
            "Bioavailability, Bioequivalence and Clinical Pharmacokinetics"
        ]
    },
    {
        "sem": 6, "code": "BP603T", "name": "Intellectual Property Rights", "credits": 2, "type": "T", "highlight": False,
        "start": 205, "end": 206,
        "unit_titles": [
            "Introduction to Intellectual Property and Patents",
            "Patent Search, Drafting and Filing in India & Globally",
            "Trademarks, Copyrights and Trade Secrets in Pharma",
            "Patent Infringement, Licensing and Patent Opposition",
            "TRIPS, Traditional Knowledge and Patent Strategies in Pharma"
        ]
    },
    {
        "sem": 6, "code": "BP604T", "name": "AI Applications in Pharmaceutical Sciences", "credits": 2, "type": "T", "highlight": True,
        "start": 207, "end": 209,
        "unit_titles": [
            "AI in Natural Products & Pharmacognostic Data Modeling",
            "AI in Drug Discovery and Structure-Activity Modeling",
            "AI in Formulation Design and Drug Delivery Optimization",
            "AI in Pharmaceutical Manufacturing and Process Analytical Technology (PAT)",
            "Emerging Trends, Generative AI and Case Studies in Pharma"
        ]
    },
    {
        "sem": 6, "code": "BP605T", "name": "Pharmaceutical Analysis", "credits": 3, "type": "T", "highlight": False,
        "start": 210, "end": 212,
        "unit_titles": [
            "UV-Visible and Fluorescence Spectroscopy",
            "Infrared (IR) and Raman Spectroscopy",
            "Nuclear Magnetic Resonance (NMR) Spectroscopy",
            "Mass Spectrometry (MS) and Hyphenated Techniques",
            "Chromatographic Techniques and Method Validation (ICH Q2)"
        ]
    },
    {
        "sem": 6, "code": "BP606T", "name": "Pharmaceutical Jurisprudence", "credits": 3, "type": "T", "highlight": False,
        "start": 213, "end": 215,
        "unit_titles": [
            "Pharmacy Act 1948 and Ethics in Pharmacy Practice",
            "Drugs and Cosmetics Act 1940 and Rules 1945 (Import, Manufacture, Sale)",
            "Schedules to D&C Act, Good Manufacturing Practices (Schedule M)",
            "Narcotic Drugs and Psychotropic Substances (NDPS) Act 1985 & Medical Termination of Pregnancy Act",
            "DPCO, Patent Act, Prevention of Cruelty to Animals Act & CDSCO Regulatory System"
        ]
    },

    # Sem 7
    {
        "sem": 7, "code": "BP701T", "name": "Biostatistics Research Methodology", "credits": 3, "type": "T", "highlight": False,
        "start": 224, "end": 227,
        "unit_titles": [
            "Research Design, Sampling Techniques and Data Collection",
            "Hypothesis Testing and Parametric Tests",
            "Non-Parametric Tests and Categorical Data Analysis",
            "Design of Experiments (DoE) and Factorial Designs",
            "Statistical Software (SPSS, R) and Scientific Research Writing"
        ]
    },
    {
        "sem": 7, "code": "BP702T", "name": "Cosmetics and Cosmeceuticals", "credits": 2, "type": "T", "highlight": False,
        "start": 228, "end": 229,
        "unit_titles": [
            "Biological Foundations and Cosmetic Formulation Science",
            "Skin Care, Hair Care and Oral Care Cosmetics",
            "Active Ingredients and Cosmeceuticals",
            "Safety Evaluation and Toxicity Testing of Cosmetics",
            "Cosmetic Regulations, Quality Control and BIS Guidelines"
        ]
    },
    {
        "sem": 7, "code": "BP703T", "name": "AI in Clinical Applications", "credits": 2, "type": "T", "highlight": True,
        "start": 230, "end": 232,
        "unit_titles": [
            "AI in Pharmacokinetics & Dose Optimization",
            "AI in Drug Safety & Pharmacovigilance",
            "AI in Personalized Medicine & Risk Stratification",
            "AI in Clinical Decision Support & Real-World Data",
            "Guided Supervised Learning Project — Pharmaceutical and Clinical Applications"
        ]
    },
    {
        "sem": 7, "code": "BP704T", "name": "Modern Analytical Techniques", "credits": 3, "type": "T", "highlight": False,
        "start": 233, "end": 234,
        "unit_titles": [
            "Thermal Analysis Techniques (DSC, TGA, DTA)",
            "X-Ray Diffraction (XRD) and Electron Microscopy (SEM, TEM)",
            "Hyphenated Mass Spectrometry (LC-MS/MS, GC-MS/MS)",
            "Supercritical Fluid Chromatography and Advanced Electrophoresis",
            "Bioanalytical Method Development and Validation"
        ]
    },
    {
        "sem": 7, "code": "BP705T", "name": "Pharmacovigilance", "credits": 3, "type": "T", "highlight": False,
        "start": 235, "end": 237,
        "unit_titles": [
            "Introduction to Pharmacovigilance and Drug Safety",
            "Adverse Drug Reactions (ADR) Monitoring and Reporting",
            "Signal Detection, Causality Assessment and Risk Management",
            "Good Pharmacovigilance Practices (GVP) and Safety Databases",
            "Pharmacovigilance Programme of India (PvPI) and Global Regulatory Standards"
        ]
    },
    {
        "sem": 7, "code": "BP706T", "name": "Pharmacy Practice", "credits": 3, "type": "T", "highlight": False,
        "start": 238, "end": 241,
        "unit_titles": [
            "Hospital Pharmacy Organization and Management",
            "Drug Distribution Systems in Hospitals",
            "Community Pharmacy and Patient Counseling",
            "Clinical Pharmacy, Ward Round Participation and Drug Therapy Monitoring",
            "Medication Errors, Drug Information Services and Pharmacoeconomics"
        ]
    },
    {
        "sem": 7, "code": "BP707T", "name": "Regulatory Affairs", "credits": 2, "type": "T", "highlight": False,
        "start": 242, "end": 244,
        "unit_titles": [
            "Drug Regulatory Agencies and Global Harmonization (ICH, WHO)",
            "New Drug Approval Process and Clinical Trials (IND, NDA, ANDA)",
            "Common Technical Document (CTD) and Electronic CTD (eCTD)",
            "Regulatory Submission and Dossier Preparation for USFDA, EMA and MHRA",
            "Indian Regulatory Requirements (CDSCO, DCGI) and Post-Marketing Surveillance"
        ]
    },

    # Sem 8
    {
        "sem": 8, "code": "BP801T", "name": "Ethical Considerations and Translational Applications of AI in Pharmacy", "credits": 2, "type": "T", "highlight": True,
        "start": 250, "end": 252,
        "unit_titles": [
            "Ethical Frameworks, Bias and Fairness in Healthcare AI",
            "Transparency, Explainable AI (XAI) and Accountability",
            "Regulatory Guidelines for AI-Powered Software as a Medical Device (SaMD)",
            "Data Privacy, Security and Governance in Healthcare AI",
            "Translational AI, Commercialization and Future Competencies for Pharmacists"
        ]
    },
    {
        "sem": 8, "code": "BP802T", "name": "Clinical Pharmacotherapeutics", "credits": 2, "type": "T", "highlight": False,
        "start": 253, "end": 254,
        "unit_titles": [
            "Principles of Pharmacotherapeutics and Cardiovascular Disorders",
            "Pharmacotherapy of Respiratory and Renal Disorders",
            "Pharmacotherapy of Endocrine and Nervous System Disorders",
            "Pharmacotherapy of Gastrointestinal and Joint Disorders",
            "Pharmacotherapy of Infectious and Hematological Diseases"
        ]
    },
    {
        "sem": 8, "code": "BP803T", "name": "Industrial Pharmacy and Facility Design", "credits": 3, "type": "T", "highlight": False,
        "start": 255, "end": 257,
        "unit_titles": [
            "Regulatory Guidelines for Formulation Development",
            "Technology Development and Transfer",
            "Facility Considerations: Non-Sterile",
            "Facility Considerations: Sterile",
            "Advances in Facility Design"
        ]
    },
    {
        "sem": 8, "code": "BP804T", "name": "Pharmaceutical Management", "credits": 2, "type": "T", "highlight": False,
        "start": 258, "end": 259,
        "unit_titles": [
            "Introduction to Pharmaceutical Management",
            "Marketing Management in Pharmaceuticals",
            "Pharmaceutical Product Management",
            "Financial Planning and Human Resource Management",
            "Operations & Supply Chain Management in Pharmaceuticals"
        ]
    },
    {
        "sem": 8, "code": "BP805T", "name": "Sterile Dosage Forms and Novel Drug Delivery System", "credits": 3, "type": "T", "highlight": False,
        "start": 260, "end": 262,
        "unit_titles": [
            "Fundamentals, Polymers & Materials for NDDS",
            "Controlled, Targeted and Vesicular Delivery Systems",
            "Stimuli-Responsive and Chronotherapeutic Systems",
            "Transdermal, Mucosal and Implantable Systems",
            "Sterile Dosage Forms (Parenteral & Ophthalmic)"
        ]
    }
]

print(f"Theory courses configured: {len(THEORY_COURSES)}")
