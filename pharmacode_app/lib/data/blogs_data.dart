import '../models/blog_model.dart';

/// 6 Core Pharma Industry Career Domains (Matching website /career/)
const List<CareerDomain> careerDomainsData = [
  CareerDomain(
    id: 'pharmacovigilance',
    title: 'Pharmacovigilance (PV)',
    shortName: 'PV',
    tag: 'High Demand',
    colorHex: '#DC2626',
    bgHex: '#FEF2F2',
    iconType: 'pv',
    description: 'ICSR case processing, MedDRA coding, adverse event reporting, WHO-UMC causality assessment, and safety signal detection.',
    topRoles: [
      'Drug Safety Associate (DSA)',
      'Safety Data Specialist',
      'ICSR Case Processor',
      'PV Quality Analyst',
    ],
    coreSkills: [
      'Argus Safety & ArisG Databases',
      'MedDRA & WHODrug Coding',
      'ICH-E2B & GVP Compliance',
      'Narrative Writing & Triage',
    ],
    targetGuideId: 'pharmacovigilance-interview-preparation-kit',
    eligibility: 'B.Pharm, M.Pharm, Pharm.D, MBBS, BDS, Life Sciences',
    avgSalary: '₹3.6 LPA - ₹6.5 LPA (Freshers in MNCs like IQVIA, Cognizant, TCS)',
    detailedOverview: '''
Pharmacovigilance is the science and activities relating to the detection, assessment, understanding, and prevention of adverse effects or any other drug-related problems.

Key Responsibilities:
• ICSR (Individual Case Safety Report) collection, triage, and data entry.
• Medical coding of adverse events using MedDRA hierarchy (SOC, HLGT, HLT, PT, LLT).
• Causality assessment using WHO-UMC criteria and Naranjo algorithm.
• Aggregate safety report compilation (PSUR, PBRER, DSUR).
• Safety signal detection and risk management plan (RMP) execution.
''',
  ),
  CareerDomain(
    id: 'regulatory-affairs',
    title: 'Regulatory Affairs (RA)',
    shortName: 'RA',
    tag: 'Core Sector',
    colorHex: '#2563EB',
    bgHex: '#EFF6FF',
    iconType: 'ra',
    description: 'eCTD dossiers, FDA/EMA filings, drug approval workflows, labeling compliance (BP707T), and regulatory audit prep.',
    topRoles: [
      'Junior Regulatory Associate',
      'CMC Documentation Specialist',
      'Dossier Publishing Executive',
      'Regulatory Compliance Officer',
    ],
    coreSkills: [
      'eCTD Modules 1 to 5 Compilation',
      'DMF, IND, NDA & ANDA Filings',
      'USFDA 21 CFR & EU Centralised Procedures',
      'CDSCO Sugam Portal & Form 44',
    ],
    targetGuideId: 'regulatory-affairs-complete-guide',
    eligibility: 'B.Pharm, M.Pharm (Pharmaceutics/RA preferred), MS Pharm',
    avgSalary: '₹3.8 LPA - ₹7.0 LPA (Freshers/Trainees in Sun Pharma, Cipla, Dr. Reddy\'s)',
    detailedOverview: '''
Regulatory Affairs professionals act as the crucial link between pharmaceutical companies and global regulatory bodies like USFDA, EMA, PMDA, and CDSCO.

Key Responsibilities:
• Preparation and submission of Common Technical Document (CTD) and electronic CTD (eCTD).
• Managing Drug Master Files (DMF) for active pharmaceutical ingredients (API).
• Post-approval variation filings, annual reports, and labeling updates.
• Ensuring compliance with ICH guidelines (Q1 to Q14 quality standards).
''',
  ),
  CareerDomain(
    id: 'quality-assurance-qc',
    title: 'Quality Assurance & QC',
    shortName: 'QA / QC',
    tag: 'Industry Standard',
    colorHex: '#059669',
    bgHex: '#ECFDF5',
    iconType: 'qa',
    description: 'HPLC, Dissolution, GMP, GLP, validation, OOS/OOT investigation (BP505T), and ICH Q8/Q9/Q10 quality systems.',
    topRoles: [
      'Quality Assurance (QA) Officer',
      'Quality Control (QC) Chemist',
      'IPQC In-Process Executive',
      'Validation & Qualification Specialist',
    ],
    coreSkills: [
      'cGMP & ALCOA+ Data Integrity Principles',
      'HPLC, GC, UV-Vis Spectroscopy Analysis',
      'Deviation, OOS, OOT, & CAPA Management',
      'Cleanroom Standards (ISO 14644 & Schedule M)',
    ],
    targetGuideId: 'free-pharmaceutical-quality-assurance-certification',
    eligibility: 'B.Pharm, M.Pharm (Quality Assurance/Analysis), B.Sc/M.Sc Chemistry',
    avgSalary: '₹2.8 LPA - ₹5.0 LPA (Plant-based & corporate roles)',
    detailedOverview: '''
Quality Assurance ensures that medicinal products are systematically manufactured and controlled to the quality standards appropriate to their intended use.

Key Responsibilities:
• Line clearance and in-process quality checks (IPQC) across tablet/capsule/liquid lines.
• Analytical testing of raw materials, in-process bulk, and finished formulations.
• Execution of root cause analysis using Ishikawa (Fishbone) diagrams and the 5 Whys.
• Internal audits and preparation for USFDA/MHRA/WHO inspections.
''',
  ),
  CareerDomain(
    id: 'clinical-research',
    title: 'Clinical Research (CRO)',
    shortName: 'CRO',
    tag: 'Growing Field',
    colorHex: '#7C3AED',
    bgHex: '#F5F3FF',
    iconType: 'cro',
    description: 'GCP guidelines, clinical trial monitoring (CRA), protocol development, ethics committee filings, and clinical data management.',
    topRoles: [
      'Clinical Research Coordinator (CRC)',
      'Clinical Research Associate (CRA)',
      'Clinical Data Management (CDM) Trainee',
      'Ethics Committee Liaison',
    ],
    coreSkills: [
      'ICH-GCP E6(R2) Guidelines',
      'Electronic Data Capture (EDC) Systems',
      'Informed Consent Form (ICF) Protocols',
      'Trial Master File (TMF/eTMF) Management',
    ],
    targetGuideId: 'free-pharmacovigilance-courses-who-umc',
    eligibility: 'B.Pharm, Pharm.D, M.Pharm, BDS, Nursing, Life Sciences',
    avgSalary: '₹3.2 LPA - ₹6.0 LPA (Freshers in CROs like Syneos, Parexel, IQVIA)',
    detailedOverview: '''
Clinical Research encompasses human clinical trials conducted to determine the safety and efficacy of investigational new drugs across Phases I to IV.

Key Responsibilities:
• Assisting principal investigators at clinical sites during patient enrollment.
• Verifying source documents against Case Report Forms (CRFs).
• Investigational product accountability and temperature monitoring.
• Expedited Serious Adverse Event (SAE) reporting within 24 hours to Sponsor and EC.
''',
  ),
  CareerDomain(
    id: 'python-ai-pharma',
    title: 'Python & AI in Pharma',
    shortName: 'AI Pharma',
    tag: 'NEP 2020 New Age',
    colorHex: '#D97706',
    bgHex: '#FFFBEB',
    iconType: 'ai',
    description: 'Drug discovery algorithms (BP604T), QSAR modeling, clinical trial analytics, and automated data pipelines (BP101T).',
    topRoles: [
      'Healthcare Data Analyst',
      'Computational Chemist Trainee',
      'AI & Machine Learning Pharmacist',
      'Cheminformatics Associate',
    ],
    coreSkills: [
      'Python Programming (NumPy, Pandas, Matplotlib)',
      'QSAR & Molecular Docking Workflows',
      'Bioactivity Prediction Models',
      'Automated ADR Data Extraction Pipelines',
    ],
    targetGuideId: 'python-programming-for-pharmacy',
    eligibility: 'B.Pharm with Python knowledge (NEP 2020 BP101T), M.Pharm, Bioinformatics',
    avgSalary: '₹4.5 LPA - ₹9.0 LPA (High growth niche in Pharma Tech startups & MNCs)',
    detailedOverview: '''
PCI NEP 2020 syllabus brings Python and Artificial Intelligence directly into pharmaceutical science, creating high-value roles bridging pharmacy and computational chemistry.

Key Responsibilities:
• Building Python automation scripts for dissolution profile comparison (f1 and f2 factors).
• Applying machine learning models for drug-target interaction and toxicity prediction.
• Cleaning, filtering, and visualising large-scale clinical trial datasets.
• Natural Language Processing (NLP) for automated adverse event literature scanning.
''',
  ),
  CareerDomain(
    id: 'production-manufacturing',
    title: 'Production & Manufacturing',
    shortName: 'Production',
    tag: 'Plant Operations',
    colorHex: '#0891B2',
    bgHex: '#ECFEFF',
    iconType: 'prod',
    description: 'Formulation of sterile dosage forms (BP805T), solid dosage forms (BP504T), HVAC, and cleanroom operations.',
    topRoles: [
      'Production Executive',
      'Formulation Chemist',
      'Packaging Line Supervisor',
      'Sterile Manufacturing Chemist',
    ],
    coreSkills: [
      'Tablet Granulation, Compression, & Coating',
      'Sterile Aseptic Processing & Autoclaves',
      'Schedule M & WHO Technical Report Series',
      'Batch Manufacturing Record (BMR/BPR) Documentation',
    ],
    targetGuideId: 'free-pharmaceutical-quality-assurance-certification',
    eligibility: 'B.Pharm, D.Pharm (Apprentice), M.Pharm (Pharmaceutics)',
    avgSalary: '₹2.5 LPA - ₹4.5 LPA (Extensive plant opportunities across India)',
    detailedOverview: '''
Production pharmacists oversee large-scale commercial manufacturing of tablets, capsules, injectables, ointments, and vaccines in compliance with cGMP.

Key Responsibilities:
• Managing machinery operations (Fluid Bed Dryers, Rotary Tablet Presses, Blister Packing).
• Maintaining HVAC air balance, differential pressure, and particulate count records.
• Accurate execution and sign-off of Batch Manufacturing Records (BMR).
• Yield calculation, reconciliation, and waste minimization.
''',
  ),
];

/// Rich Career Guides, Kits, and Certification Masterclasses
const List<Blog> blogsData = [
  Blog(
    id: 'pharmacovigilance-interview-preparation-kit',
    tag: 'PV Interview Kit',
    title: 'Pharmacovigilance (PV) — Complete Guide & Interview Preparation Kit (44 Pages)',
    date: 'Aug 2026',
    colorHex: '#DC2626',
    bgHex: '#FEF2F2',
    readTime: '15 min read',
    isNew: true,
    category: 'KIT',
    actionUrl: 'https://pharmacode.vercel.app/blog/pharmacovigilance-interview-preparation-kit/',
    actionLabel: 'Download 44-Page Kit PDF',
    description: 'The definitive 44-page PV interview handbook for freshers & professionals. Covers 15 structured chapters: ICSR case processing, MedDRA coding, WHO-UMC causality, Argus Safety, and 100+ solved interview questions.',
    content: '''
SECTION: 15-Chapter Curriculum Overview
Chapter 01: PV Fundamentals, Terminology & History (Thalidomide Tragedy & Evolution)
Chapter 02: Global & Indian Regulatory Frameworks (USFDA, EMA, CDSCO & PvPI)
Chapter 03: ICSR Lifecycle & Step-by-Step Case Processing Workflow
Chapter 04: The 4 Minimum Validity Criteria for an ICSR Case
Chapter 05: MedDRA & WHODrug Dictionary Hierarchy & Coding Rules
Chapter 06: Causality Assessment Algorithms (WHO-UMC & Naranjo Scale)
Chapter 07: Safety Signal Detection & Disproportionality Metrics (PRR, ROR)
Chapter 08: Periodic Aggregate Safety Reports (PSUR, PBRER, DSUR)
Chapter 09: Risk Management Plans (RMP) & REMS Programs
Chapter 10: Good Pharmacovigilance Practices (EU GVP Modules I-XVI)
Chapter 11: Safety Databases (Argus Safety, ArisGlobal, Oracle AERS)
Chapter 12: High-Yield HR & Behavioural Interview Questions
Chapter 13: Core Technical Interview Questions & Model Answers
Chapter 14: Real-World Scenario Questions & Case Studies
Chapter 15: ATS-Friendly Resume Tips, Mock Strategy & Cheat Sheet

SECTION: Top 5 Technical Interview Questions Solved
Q1: What are the 4 mandatory elements required for an ICSR to be valid?
Answer: 1) Identifiable Patient (initials, age, sex, patient ID), 2) Identifiable Reporter (physician, pharmacist, consumer), 3) At least one Suspect Drug, 4) At least one Adverse Event. If any one of these is missing, the case is considered invalid until follow-up information is obtained.

Q2: What is the difference between an Adverse Event (AE) and an Adverse Drug Reaction (ADR)?
Answer: An Adverse Event is any untoward medical occurrence that happens during treatment, but does NOT necessarily have a causal relationship with the drug. An ADR has a reasonable possibility of a causal relationship between the medicinal product and the event.

Q3: What are the regulatory reporting timelines for expedited serious ICSRs?
Answer: Fatal or life-threatening unexpected ADRs must be reported within 7 calendar days (with complete report within 8 additional days). All other serious unexpected adverse reactions must be reported within 15 calendar days.

Q4: Explain the 5 levels of the MedDRA coding hierarchy.
Answer: System Organ Class (SOC) -> High Level Group Term (HLGT) -> High Level Term (HLT) -> Preferred Term (PT) -> Lowest Level Term (LLT). Medical coding is performed at the LLT level, but safety analysis is conducted at the PT and SOC levels.

Q5: What are the 6 criteria that define a Serious Adverse Event (SAE)?
Answer: 1) Death, 2) Life-threatening condition, 3) In-patient hospitalization or prolongation of existing hospitalization, 4) Persistent or significant disability/incapacity, 5) Congenital anomaly/birth defect, 6) Other medically important event requiring medical intervention.
''',
  ),
  Blog(
    id: 'regulatory-affairs-complete-guide',
    tag: 'RA Complete Guide',
    title: 'Regulatory Affairs (RA) — Complete Guide: From Dossier to Drug Approval',
    date: 'Sep 2026',
    colorHex: '#2563EB',
    bgHex: '#EFF6FF',
    readTime: '12 min read',
    isNew: true,
    category: 'KIT',
    actionUrl: 'https://pharmacode.vercel.app/blog/regulatory-affairs-complete-guide/',
    actionLabel: 'View Full Guide on Website',
    description: 'A comprehensive handbook for B.Pharm and M.Pharm students covering eCTD Modules 1-5, DMF filings, IND/NDA pathways, USFDA, EMA, CDSCO regulations, and freshers interview questions.',
    content: '''
SECTION: Overview & Industry Importance
Regulatory Affairs (RA) is the critical bridge between pharmaceutical companies and global health authorities like the US FDA, EMA (Europe), and CDSCO (India). It ensures medicines are safe, effective, and manufactured to high quality standards before reaching patients.

SECTION: eCTD 5-Module Structure
Module 1: Administrative Information & Prescribing Information (Region-Specific, e.g. FDA Form 356h, Package Insert, Labeling).
Module 2: Common Technical Document Summaries (Quality Overall Summary - QOS, Nonclinical Overview, Clinical Overview).
Module 3: Quality (CMC — Chemistry, Manufacturing & Controls for Drug Substance and Drug Product, Stability Data).
Module 4: Nonclinical Study Reports (In-vitro pharmacology, pharmacokinetics, single/repeat-dose toxicology).
Module 5: Clinical Study Reports (Phase I-IV human clinical trial data, bioequivalence studies, statistical analysis).

SECTION: Dossier Filing Pathways
IND (Investigational New Drug): Application submitted to the FDA before starting human clinical trials.
NDA (New Drug Application): For brand-new chemical entities seeking market commercialization.
ANDA (Abbreviated New Drug Application): For generic medications proving bioequivalence (80-125% 90% Confidence Interval).
DMF (Drug Master File): Confidential submission of API synthesis details: Type II (Drug Substance), Type III (Packaging), Type IV (Excipients).

SECTION: Global Regulatory Agencies
US FDA (United States): Regulated under 21 CFR rules (21 CFR Part 312 for IND, Part 314 for NDA/ANDA, Part 211 for cGMP).
EMA (European Union): Centralized procedure (EMA Committee for Medicinal Products for Human Use - CHMP) and Decentralized procedures.
CDSCO (India): Headed by DCGI, managed through Sugam online portal under New Drugs and Clinical Trials Rules 2019.
''',
  ),
  Blog(
    id: 'free-pharmaceutical-quality-assurance-certification',
    tag: 'Free QA Course',
    title: 'Free Pharmaceutical Quality Assurance (QA) Course with Certificate — Pharma Lesson',
    date: 'Aug 2026',
    colorHex: '#059669',
    bgHex: '#ECFDF5',
    readTime: '8 min read',
    isNew: true,
    category: 'COURSE',
    actionUrl: 'https://courses.pharmalesson.com/courses/introduction-to-pharmaceutical-quality-assurance/',
    actionLabel: 'Enroll for Free (Pharma Lesson)',
    description: 'Enroll in the 100% Free Pharmaceutical Quality Assurance (QA) certification course by Pharma Lesson. Master GMP, ALCOA+, IPQC, CAPA, and Audits. Pass the 80% test and claim your verified certificate.',
    content: '''
SECTION: Course Overview & Certification
Quality Assurance ensures that medicinal products are of the quality required for their intended use. This certified online masterclass by Pharma Lesson covers core compliance standards required in pharma manufacturing, and upon scoring 80% on the quiz, provides a verifiable certificate for your CV!

SECTION: Core Learning Modules
Module 1: Introduction to QA & ALCOA+ Principles
Understanding why quality cannot be tested into a finished product. Deep dive into ALCOA+ data integrity: Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available.

Module 2: Current Good Manufacturing Practice (cGMP)
Cleanroom classification standards (ISO 14644 & Schedule M). HVAC systems, airlocks, HEPA filtration (99.97% efficiency at 0.3 microns), and cross-contamination prevention.

Module 3: In-Process Quality Control (IPQC) & Line Clearance
Physical and chemical checks during granulation, compression (weight variation, hardness, friability, disintegration), coating, and blistering. Strict line clearance protocols between batches.

Module 4: Deviation Management, OOS & CAPA
Root Cause Analysis using Fishbone diagrams and the 5 Whys methodology. Handling Out of Specification (OOS) results (Phase I lab investigation vs Phase II manufacturing investigation) and executing Corrective and Preventive Actions.

Module 5: Regulatory Audits & Inspection Readiness
Preparing for inspections from USFDA, MHRA, and CDSCO. Best practices and documentation during auditor interviews.
''',
  ),
  Blog(
    id: 'free-pharmacovigilance-courses-who-umc',
    tag: 'Free PV Courses',
    title: '10 Free Pharmacovigilance Courses with Certificates — WHO-UMC Platform',
    date: 'Aug 2026',
    colorHex: '#7C3AED',
    bgHex: '#F5F3FF',
    readTime: '10 min read',
    isNew: true,
    category: 'COURSE',
    actionUrl: 'https://pharmacode.vercel.app/blog/free-pharmacovigilance-courses-who-umc/',
    actionLabel: 'Explore All 10 Courses',
    description: 'Complete list of 10 free Pharmacovigilance (PV) courses offered directly by the WHO Uppsala Monitoring Centre (UMC). Learn ICSR processing, MedDRA coding, signal detection, and aggregate reporting.',
    content: '''
SECTION: About WHO-UMC E-Learning
Uppsala Monitoring Centre (UMC), the collaborating centre for the WHO Programme for International Drug Monitoring in Sweden, provides world-standard e-learning for drug safety professionals completely free of charge!

SECTION: 10 Featured Free Courses
Course 1: Signal Detection in Pharmacovigilance — Statistical methods including disproportionality analysis (PRR, ROR, Information Component) and qualitative clinical evaluation.
Course 2: Introduction to MedDRA — Standardized medical terminology structure (SOC, HLGT, HLT, PT, LLT) and coding rules for adverse events and medical history.
Course 3: Individual Case Safety Reports (ICSR) Fundamentals — The 4 mandatory elements of a valid case: Identifiable Patient, Identifiable Reporter, Suspect Drug, and Adverse Event.
Course 4: Serious Adverse Event (SAE) Criteria — Understanding death, life-threatening events, hospitalization, disability, and congenital anomalies.
Course 5: Causality Assessment Methods — Evaluation using WHO-UMC causality categories (Certain, Probable, Possible, Unlikely) and the Naranjo Probability Scale.
Course 6: Communicating Pharmacovigilance — Effective risk communication to healthcare providers and consumers.
Course 7: Vaccine Pharmacovigilance — Adverse Events Following Immunization (AEFI) investigation and reporting.
Course 8: Pharmacovigilance in Public Health Programmes — Safety monitoring in large-scale mass drug administration.
Course 9: Active Surveillance Methods — Registries, cohort event monitoring, and targeted hospital-based surveillance.
Course 10: Good Pharmacovigilance Practices — Core principles of international GVP inspection compliance.
''',
  ),
  Blog(
    id: 'ats-resume-interview-preparation-guide',
    tag: 'Career Toolkit',
    title: 'ATS-Friendly Resume & Fresher Interview Cheat Sheet for Pharmacy Students',
    date: 'Aug 2026',
    colorHex: '#0891B2',
    bgHex: '#ECFEFF',
    readTime: '9 min read',
    isNew: false,
    category: 'KIT',
    actionUrl: 'https://pharmacode.vercel.app/career/',
    actionLabel: 'Explore Career Resources',
    description: 'How to build an ATS-compliant CV for pharma MNCs (IQVIA, Cognizant, TCS, Novartis). Essential keywords for PV, RA, QA, and high-impact project descriptions.',
    content: '''
SECTION: The ATS Resume Golden Rules
Modern pharmaceutical MNCs use Applicant Tracking Systems (ATS) to filter resumes before HR ever sees them. Follow these essentials:
• Format: Single-column standard layout, clean margins, saved as PDF or DOCX.
• Font: Clean sans-serif fonts like Arial, Calibri, or Helvetica (10-12pt).
• Section Headings: Use standard headers: "Education", "Certifications", "Technical Skills", "Academic Projects", "Internships".
• Avoid: Two-column tables, infographics, skill rating bars, or photo boxes that confuse ATS parsers.

SECTION: High-Value Keywords by Domain
For Pharmacovigilance: ICSR, MedDRA, Argus Safety, WHO-UMC, Naranjo Algorithm, SAE, ADR, GVP Modules, Triage, Aggregate Reports.
For Regulatory Affairs: eCTD, Module 1-5, DMF, IND, NDA, ANDA, 21 CFR, USFDA, EMA, CDSCO, CMC Documentation, ICH Q-series.
For QA & QC: cGMP, ALCOA+, Deviation, CAPA, OOS, OOT, HPLC, UV-Vis, Dissolution, ISO 14644, Schedule M.
For Python/AI: Python, Pandas, NumPy, Matplotlib, Data Cleaning, QSAR, Dissolution Profile Analysis.

SECTION: Interview Etiquette & Tips
• Elevator Pitch: Prepare a crisp 60-second summary highlighting your B.Pharm degree, top certification (e.g. WHO-UMC or Pharma Lesson), and domain passion.
• Case Study Readiness: Practice explaining the 4 criteria of a valid ICSR and ALCOA+ data integrity with clear everyday analogies.
''',
  ),
  Blog(
    id: 'python-programming-for-pharmacy',
    tag: 'Python in Pharma',
    title: 'BP101T Python Programming — Beginner’s Guide for Pharmacy Students',
    date: 'May 2026',
    colorHex: '#D97706',
    bgHex: '#FFFBEB',
    readTime: '6 min read',
    isNew: false,
    category: 'TECH',
    actionUrl: 'https://pharmacode.vercel.app/syllabus/semester-1/bp101t-basics-of-python-programming-for-pharmaceutical-sciences/',
    actionLabel: 'View BP101T Syllabus & Code',
    description: 'How to score top marks in BP101T Python programming even if you have zero prior coding experience. Key code snippets for dosage calculations and dissolution curve plotting.',
    content: '''
SECTION: Overview & Why Python in Pharmacy?
Under PCI NEP 2020, Semester 1 mandates BP101T (Basics of Python Programming for Pharmaceutical Sciences). Python is the language of modern drug design, biostatistics, and healthcare data analytics!

SECTION: High-Yield Python Topics for BP101T
Variables & Math Operations: Formulating clinical dosage calculations (Clark's rule, Young's rule) and BMI formulas.
NumPy Arrays: Fast array manipulation for pharmacokinetic concentrations and statistical averages.
Pandas DataFrames: Importing CSV files of adverse drug reactions, patient records, and assay readings.
Matplotlib Visualisation: Plotting zero-order and first-order drug dissolution release curves.
''',
  ),
  Blog(
    id: 'bpharm-nep-2020-vs-old-curriculum',
    tag: 'Syllabus Guide',
    title: 'B.Pharm NEP 2020 vs Old Curriculum — Complete Comparison',
    date: 'May 2026',
    colorHex: '#4C6EF5',
    bgHex: '#EEF2FF',
    readTime: '7 min read',
    isNew: false,
    category: 'SYLLABUS',
    actionUrl: 'https://pharmacode.vercel.app/syllabus/',
    actionLabel: 'Browse NEP 2020 Syllabus',
    description: 'Detailed analysis of how PCI National Education Policy (NEP) 2020 transforms the B.Pharm syllabus: inclusion of Python, AI, Biostatistics, and mandatory 4th & 6th semester internships.',
    content: '''
SECTION: Overview of PCI NEP 2020 Reforms
The Pharmacy Council of India (PCI) has introduced revolutionary changes aligned with the National Education Policy (NEP) 2020, replacing rote learning with practical skills, computational tools, and real industry exposure.

SECTION: 3 Major Pillars of NEP 2020
1. Computational & AI Skills: Semester 1 introduces BP101T (Python Programming). Semester 6 introduces BP604T (Artificial Intelligence in Pharmaceutical Sciences).
2. Mandatory Internships: Semester 4 mandates a 150-hour Hospital / Clinical Internship. Semester 6 mandates a 150-hour Pharmaceutical Industry Internship.
3. Choice-Based Credit System (CBCS): 212 systematic credits across 8 semesters with continuous internal evaluations.
''',
  ),
];
