// lib/syllabus.ts
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

// ─────────────────────────────────────────────────────────────
// SEMESTER 1
// ─────────────────────────────────────────────────────────────
const SEM1: Subject[] = [
    s("BP101T", "Basics of Python Programming for Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Python Programming", topics: [
                "Installing Python and an Integrated Development Environment (IDE) [Jupyter Notebook, PyCharm, VS Code etc.], Advantages of IDEs over text editors.",
                "Python variables and data types (integers, floats, strings, booleans), Type casting and basic operators (arithmetic, comparison, logical), Input and output operations.",
                "Basic string operations and manipulation techniques.",
                "Introduction to standard libraries and third-party libraries, installing and uninstalling libraries.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Control Structures & Functions", topics: [
                "Conditional statements (if, if-else, if-elif-else), nested conditions.",
                "Loops (for loop, while loop).",
                "Break and continue statements.",
                "Defining and calling functions, passing arguments and returning values.",
                "Writing modular programs for simple pharmaceutical applications- dosage calculation and BMI calculation.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Data Structures & File Handling", topics: [
                "Lists, tuples, and dictionaries.",
                "Indexing and slicing lists, basic operations on lists and dictionaries, string manipulation techniques.",
                "Introduction to NumPy arrays, basic operations using NumPy (array creation, arithmetic operations).",
                "Reading and writing CSV files.",
                "Understanding structured healthcare datasets.",
                "Importing small pharmaceutical datasets and performing basic data access and manipulation tasks.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Data Handling with Pandas", topics: [
                "Introduction to Pandas library.",
                "Pandas Series and DataFrame structures.",
                "Reading CSV and Excel files-PK study datasets and ADR reports.",
                "Inspecting datasets using functions such as head(), tail(), info(), and describe().",
                "Data cleaning techniques and handling missing values.",
                "Filtering and selecting data based on conditions.",
                "Grouping data and performing aggregation functions.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Data Visualization with Matplotlib", topics: [
                "Introduction to Matplotlib.",
                "Creating line plots, histograms, scatter plots, and box plots.",
                "Labeling axes, titles, and legends.",
                "Create plots and visualize pharmaceutical datasets concentration-time curves for oral and IV administration, ADR reporting rates across drugs, dissolution profiles.",
                "Scientific interpretation of plots.",
            ]
        },
    ], true,
    [
        "Introduce the fundamentals of Python programming for pharmaceutical sciences.",
        "Develop basic programming skills using control structures, functions, and data structures.",
        "Provide knowledge of data handling techniques for structured dataset management.",
        "Familiarize students with data analysis tools such as NumPy and Pandas for healthcare datasets.",
        "Enable students to visualize and interpret pharmaceutical data.",
    ],
    [
        "Weiss, C.J., 2017. Scientific Computing for Chemists with Python. Available at: https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.ht ml",
        "Perkovic, L., 2015. Introduction to Computing Using Python: An Application Development Focus. 2nd ed. Hoboken: Wiley.",
        "Sweigart, A., 2025. Automate the Boring Stuff with Python. 3rd ed. Available at: https://automatetheboringstuff.com/",
        "W3Schools, n.d. Python Tutorial. Available at: https://www.w3schools.com/python/",
        "Datasets for Education and Research: Mentors and students can access healthcare datasets from sources such as Kaggle (healthcare records), government agencies (healthdata.gov, WHO, https://www.data.gov.in/), and clinical trial registries (https://ctri.nic.in/, https://clinicaltrials.gov/). Always use data responsibly.",
    ]),
    s("BP102T", "General Pharmacy", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Introduction to the Profession of Pharmacy", topics: [
                "History of the Profession of Pharmacy in India: In relation to pharmacy education, pharmaceutical industries and organizations – evolution, development and milestones.",
                "SCOPE OF THE PHARMACY PROFESSION: Role and responsibilities of pharmacists in retail/community pharmacy, hospital and clinical pharmacy, and industrial pharmacy including research and development.",
                "PHARMACOPOEIAS: Introduction to IP, BP, USP, BPC, International Pharmacopoeia, other pharmacopoeias and the National Formulary of India; structure and content of the Indian Pharmacopoeia; study of one model IP monograph.",
                "INTRODUCTION TO PRESCRIPTION: Structure and format/parts of prescription, handling of prescriptions, Latin terminology related to prescriptions.",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Introduction to Pharmaceutical Calculations and Dosage Forms", topics: [
                "Metric system of weights and measures; calculations based on alligation, proof spirit, isotonic solutions, dilute solutions (percentage and ratio) and geometric dilution; scientific notation of units and measures.",
                "POSOLOGY: Definition and dose calculation based on age, body weight and body surface area.",
                "INTRODUCTION TO DOSAGE FORMS: Routes of administration and classification of dosage forms.",
                "Introduction to Active Pharmaceutical Ingredients and Excipients:",
                "Definition, ideal characteristics and importance.",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Solid Dosage Forms", topics: [
                "POWDERS: Classification, advantages and disadvantages; dusting powders, effervescent powders, efflorescent powders, hygroscopic powders and eutectic mixtures; introduction to excipients and methods of preparation.",
                "TABLETS: Definition, types of tablets including moulded tablets and pills with examples; advantages and disadvantages; introduction to excipients and methods of preparation.",
                "CAPSULES: Definition, types of capsules, advantages and disadvantages, capsule sizes; introduction to excipients and methods of preparation.",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Monophasic and Biphasic Liquids", topics: [
                "FOR INTERNAL USE: aromatic waters, syrups, elixirs and linctus (definition and preparation).",
                "For external use and body cavities – liniments, lotions, throat paints, applications, gargles, mouthwashes, enemas, eye drops, ear drops, nasal drops and tinctures with examples.",
                "Study of official preparations- Introduction to excipients and methods of preparation.",
                "Suspensions- Definition and types (flocculated and deflocculated), advantages and disadvantages, formulation excipients and general methods of preparation.",
                "Emulsions- Definition and types, emulsifying agents, tests for identification of types of emulsions, formulation excipients and general methods of preparation.",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Semisolid Dosage Forms", topics: [
                "Definitions, classification, advantages and disadvantages, ointment bases and other excipients used in semisolid dosage forms; general methods of preparation of ointments, pastes, creams and gels.",
                "SUPPOSITORIES / PESSARIES: Definition, types of suppositories, advantages and disadvantages, formulation excipients used in suppositories, properties of ideal suppository bases, types of suppository bases, displacement value and general method of preparation.",
            ]
        },
    ], false,
    [
        "Provide knowledge about evolution and development of Pharmacy profession in India and the growth of the Pharmaceutical Industries over the years.",
        "Provide understanding of different types of pharmacopoeias and other official books in maintaining the standards of medicines.",
        "Provide knowledge about the basic pharmaceutical calculations used in dispensing and compounding.",
        "Understand the role of active pharmaceutical ingredients and pharmaceutical excipients in drug formulations",
        "Impart basic knowledge about formulation and preparation of Various solid, liquid and semisolid dosage forms",
    ],
    [
        "1. Ansel, H.C., Allen, L.V. and Popovich, N.G., Pharmaceutical Dosage Forms and Drug Delivery Systems. Lippincott Williams & Wilkins, New Delhi.",
        "Carter, S.J., Cooper and Gunn’s Dispensing for Pharmaceutical Students. CBS Publishers, New Delhi.",
        "Indian Pharmacopoeia Commission, Indian Pharmacopoeia. Ghaziabad.",
        "Indian Pharmacopoeia Commission, National Formulary of India. Ghaziabad, India.",
        "British Pharmacopoeia Commission, British Pharmacopoeia. London.",
        "United States Pharmacopeial Convention, United States Pharmacopeia (USP–NF). Rockville, Maryland, USA.",
        "Lachman, L., Lieberman, H.A. and Kanig, J.L., The Theory and Practice of Industrial Pharmacy. Lea & Febiger, University of Michigan.",
        "Gennaro, A.R., Remington: The Science and Practice of Pharmacy. Lippincott Williams & Wilkins, New Delhi.",
        "Rawlins, E.A., Bentley’s Textbook of Pharmaceutics. Elsevier Health Sciences, USA.",
        "Nieloud, F. and Marti-Mestres, G., Pharmaceutical Emulsions and Suspensions. Marcel Dekker Inc., New York.",
    ]),
    s("BP103T", "Healthcare Psychology and Communication Skills", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Introduction to Psychology in Healthcare", topics: [
                "Definition, scope, and relevance of psychology in health sciences.",
                "Branches of psychology with healthcare relevance: clinical, health, behavioural, and developmental psychology. Sensation, perception, and attention in clinical assessment. Learning and memory: reinforcement in health behaviour change. Emotion and motivation: theories and implications in health contexts.",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Developmental and Behavioural Psychology", topics: [
                "Human developmental stages and healthcare needs. Personality theories and patient interaction styles. Psychological factors affecting illness perception and recovery. Common psychological disorders in healthcare: anxiety, depression, and somatization. Coping strategies, resilience, and stress management techniques.",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Foundations of Health Communication", topics: [
                "Elements and models of communication in healthcare. Types of communication: interpersonal, group, mass, and telehealth communication. Barriers to effective communication in clinical settings.",
                "Active listening, questioning techniques, and empathy. Culturally appropriate and inclusive communication.",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Professional Communication in Healthcare Settings", topics: [
                "Communication with patients, caregivers, and interdisciplinary teams.",
                "Delivering difficult news and handling emotionally charged situations.",
                "Legal and ethical issues in health communication (confidentiality, consent). Writing patient records, reports, and discharge summaries. Use of technology and digital communication tools in healthcare services.",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Health Psychology and Behavioural Interventions", topics: [
                "Health belief models and illness behaviour. Psychosomatic illnesses and the mind–body connection. Behaviour change theories (e.g., CBT, TTM) in treatment adherence. Psychological first aid and crisis communication. Mental health promotion and stigma reduction through communication.",
            ]
        },
    ], false,
    [
        "Introduce the fundamental concepts and branches of psychology relevant to healthcare.",
        "Help students understand human behavior, development, and psychological responses to illness.",
        "Develop awareness of common psychological disorders and coping mechanisms in healthcare contexts.",
        "Equip students with effective health communication skills for clinical and community settings.",
        "Promote professional interaction with patients, caregivers, and healthcare teams through ethical and empathetic communication.",
    ],
    [
        "Feldman, R.S., Understanding Psychology. McGraw-Hill Education, New York.",
        "Taylor, S.E., Health Psychology. McGraw-Hill Education, New York.",
        "Hargie, O., The Handbook of Communication Skills. Routledge, London.",
        "Nevid, J.S., Rathus, S.A. and Greene, B., Psychology and the Challenges of Life: Adjustment and Growth. Wiley, New York.",
        "Atkinson, R.L., Atkinson, R.C., Smith, E.E., Bem, D.J. and Nolen-Hoeksema, S., Introduction to Psychology. Wadsworth Publishing, Belmont.",
        "Kumar, A., Communication Skills for Health Professionals. Jaypee Brothers Medical Publishers, New Delhi.",
        "Park, K., Park’s Textbook of Preventive and Social Medicine. Banarsidas Bhanot Publishers, Jabalpur.",
    ]),
    s("BP104T", "Human Anatomy, Physiology and Pathophysiology I", 4, "T", [
        {
            num: "I", hours: "12 Hours", title: "Introduction to Human Body", topics: [
                "Cellular and tissue level of organization.",
                "Definition and scope of anatomy, physiology and pathophysiology.",
                "Levels of structural organization and body systems, basic life processes, homeostasis, basic anatomical terminologies.",
                "Structure and functions of cell, transport across cell membrane, cell division, cell junctions. General principles of cell communication, forms of intracellular signallinga) Contact-dependent, b) Paracrine, c) Synaptic, d) Endocrine Classification of tissues, structure, location and functions of epithelial, muscular and nervous and connective tissues.",
                "Basic principles of cell injury and adaptation Components and types of feedback systems, causes of cellular injury, pathogenesis (cell membrane damage, mitochondrial damage, ribosome damage and nuclear damage), morphology of cell injury – adaptive changes (atrophy, hypertrophy, hyperplasia, metaplasia, dysplasia), cell swelling, intra cellular accumulation and cell death.",
                "Definitions of commonly used relevant medical terminologies.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Integumentary System and Wound Healing", topics: [
                "Structure and functions of skin. Skin disorders: Psoriasis and dermatitis and pathophysiology of Leprosy. Basic principles of wound healing.",
                "Skeletal system and joints Divisions of skeletal system, types of bones, salient features and functions of bones of axial and appendicular skeletal system.",
                "Organization of skeletal muscle, physiology of muscle contraction, neuromuscular junction. Structural and functional classification of joints.",
                "Diseases of bones and joints Pathophysiology of rheumatoid arthritis, osteoporosis and gout.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Body Fluids, Blood and Lymphatic System", topics: [
                "Body fluids, composition and functions of blood, hemopoiesis, formation of haemoglobin, mechanisms of coagulation, blood grouping, Rh factors and transfusion.",
                "Lymphatic organs and tissues, lymphatic vessels, lymph formation, circulation and functions of lymphatic system.",
                "Basic mechanism of inflammation and repair Introduction, classification and pathophysiology of inflammation, mediators of inflammation.",
                "Haematological diseases Pathophysiology of iron deficiency, megaloblastic anaemia (Vit B12 and folic acid), sickle cell anaemia, Thalassemia, hereditary acquired anaemia and haemophilia.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Peripheral Nervous System", topics: [
                "CLASSIFICATION OF PERIPHERAL NERVOUS SYSTEM: structure and functions of sympathetic and parasympathetic nervous system. Origin and functions of spinal and cranial nerves.",
                "Special senses Structure and functions of eye, ear, nose and tongue. Pathophysiology of special sense disorders- glaucoma, cataract, myopia, otitis externa, otitis media, vertigo and anosmia.",
            ]
        },
        {
            num: "V", hours: "12 Hours", title: "Cardiovascular System", topics: [
                "Anatomy of heart, blood circulation, blood vessels, structure and functions of artery, vein and capillaries, elements of conduction system of heart and heartbeat, its regulation by autonomic nervous system, cardiac output, cardiac cycle, of blood pressure, pulse, electrocardiogram.",
                "Pathophysiology of hypertension, cardiac arrhythmias, congestive heart failure, ischemic heart disease (angina, myocardial infarction, atherosclerosis and coronary artery disease).",
            ]
        },
    ], false,
    [
        "Understand the structural organization of the human body from cells to systems.",
        "Comprehend physiological functions of various body systems and the principles of homeostasis.",
        "Learn the cellular basis of disease including injury, adaptation, and inflammation.",
        "Recognize common pathological conditions related to skin, bones, joints, blood, cardiovascular system, and special senses.",
        "Establish the groundwork for clinical interpretation of symptoms and disease mechanisms relevant to pharmacy and therapeutics.",
    ],
    [
        "Sembulingam, K. and Sembulingam, P., Essentials of Medical Physiology. Jaypee Brothers Medical Publishers, New Delhi.",
        "Guyton, A.C. and Hall, J.E., Textbook of Medical Physiology. Elsevier Saunders, Philadelphia, USA.",
        "Tortora, G.J. and Grabowski, S.R., Principles of Anatomy and Physiology. Wiley, Palmetto, GA, USA.",
        "Kumar, V., Cotran, R.S. and Robbins, S.L., Basic Pathology. W.B. Saunders Company, Philadelphia.",
    ]),
    s("BP105T", "Introduction to Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Fundamentals of Pharmacognosy", topics: [
                "Definition, history, present status, scope and development of pharmacognosy.",
                "SOURCES OF DRUGS: Plants, animals, microbial, marine, mineral and plant tissue culture.",
                "HISTORICAL MILESTONES IN DRUG DISCOVERY: Morphine, quinine, aspirin, warfarin, penicillin, cephalosporin, taxol and artemisinin.",
                "Introduction to different herbal / traditional pharmacopoeias: Indian Pharmacopoeia, British Herbal Pharmacopoeia, United States Pharmacopeia – Herbal Medicines and Dietary Supplements, Ayurvedic Pharmacopoeia of India, Unani Pharmacopoeia of India and American Herbal Pharmacopoeia.",
                "Official and non-official; codified and non-codified drugs. Classification of crude drugs: alphabetical, morphological, taxonomical, chemical, pharmacological and chemotaxonomic classification along with their merits and limitations.",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Cultivation, Collection, Processing and Storage of Drugs of Natural Origin", topics: [
                "Methods of plant cultivation and Good Agricultural and Collection Practices (WHO /GAP / GCP guidelines) for medicinal plants. Factors influencing cultivation, collection and storage of medicinal plants.",
                "Plant hormones and their applications in cultivation of medicinal plants. Application of polyploidy, mutation and hybridization concepts with reference to secondary metabolites. Ex-situ and in-situ conservation and strategies for value addition of medicinal plants. Role of eco-pharmacognosy in sustainable conservation of endangered medicinal plants such as kutki and chirata.",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Quality Control of Drugs of Natural Origin (who Guidelines)", topics: [
                "Adulteration of drugs of natural origin. Evaluation of drugs using organoleptic, microscopic (qualitative and quantitative), physical, chemical and biological methods. Physicochemical parameters: extractive values, moisture content, foreign organic matter, ash values, bitterness value, foaming index, haemolytic potential, swelling index, viscosity, optical rotation, refractive index, acid value and saponification value. DNA barcoding.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Introduction to Metabolites of Plant Origin", topics: [
                "Definition and general properties of plant metabolites. Primary and secondary metabolites such as carbohydrates, proteins, lipids, alkaloids, glycosides, flavonoids, tannins, terpenoids, volatile oils and resins.",
                "Traditional Systems of Medicine Basic principles of treatment of diseases in different systems of medicine including AYUSH and TCM. Types of dosage forms in AYUSH medicines. Role of pharmacognosy in allopathy and traditional systems of medicine such as AYUSH and TCM.",
            ]
        },
        {
            num: "V", hours: "7 Hours", title: "Phyto-therapeutic Agents", topics: [
                "Biological source, major constituents and uses of the following classes of drugs.",
                "ADAPTOGENS AND IMMUNOMODULATORS: Ashwagandha, Tulsi, Amla • Hepatoprotectives: Milk thistle, Kutki • Cardiovascular drugs: Garlic, Arjuna • Antidiabetics: Gymnema, Fenugreek • Anti-inflammatory and analgesics: Turmeric, Boswellia • CNS drugs: Brahmi • Antimicrobial and antivirals: Giloy, Neem, Andrographis • Gastrointestinal drugs: Psyllium • Dermatological agents: Aloe • Drugs used in women’s health: Chasteberry, Shatavari • Respiratory drugs: Vasaka.",
            ]
        },
    ], false,
    [
        "Explain the origin, history, and classification of natural drugs.",
        "Understand cultivation and conservation methods for medicinal plants.",
        "Study quality control and evaluation of crude drugs.",
        "Study primary and secondary metabolites with their therapeutic relevance",
        "Introduce traditional systems of medicine and phyto-therapeutic agents.",
    ],
    [
        "Evans, W.C., Trease and Evans Pharmacognosy. 16th ed. London: W.B. Saunders & Co., 2009.",
        "Tyler, V.E., Brady, L.R. and Robbers, J.E., Pharmacognosy. 9th ed. Philadelphia: Lea & Febiger,",
        "3. Wallis, T.E., Textbook of Pharmacognosy. London: J. & A. Churchill Ltd.",
        "World Health Organization (2002) WHO traditional medicine strategy 2002–2005. Geneva: World Health Organization",
    ]),
    s("BP106T", "Pharmaceutical Inorganic and Analytical Chemistry", 3, "T", [
        {
            num: "I", hours: "7 Hours", title: "Introduction to Pharmaceutical Analysis", topics: [
                "Different techniques of analysis, Methods of expressing strength of solutions, Primary and secondary standards with examples.",
                "Errors Sources of errors, types of errors, methods of minimizing errors, accuracy, precision and significant figures.",
                "Impurities Definition, types, contents and regulatory importance. Sources and types of impurities in Pharmaceuticals, limit tests for chloride, sulphate, iron, arsenic, lead, heavy metals, and modified limit test for chloride and sulphate.",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Acid-base Chemistry and Buffer Systems in Pharmacy", topics: [
                "Definition of acids, bases, buffers, pH Scale and its significance, Buffer equation, calculation of pH for Buffer solution. Isotonicity and its application in IV Fluids and Ophthalmic Solutions.",
                "Major extra and intracellular electrolytes Functions of major physiological ions, Electrolytes used in the replacement therapy: Sodium chloride*, Potassium chloride, Calcium chloride and Oral Rehydration Salt (ORS), Physiological acid base balance.",
                "Acid base titrations Theories of acid base indicators, classification of acid base titrations.",
                "Preparation and standardization of titrants viz. hydrochloric acid and sodium hydroxide. Theory involved in titrations of strong, weak, and very weak acids and bases, neutralization curves. Assay of Ammonium hydroxide.",
                "Non-aqueous titrations Types of solvents used, acidimetric and alkalimetric titration using nonaqueous solvents. Preparation and standardization of acidic and basic titrants. Estimation of weakly acidic and basic substances using nonaqueous titrants, estimation of Sodium benzoate.",
            ]
        },
        {
            num: "III", hours: "14 Hours", title: "Precipitation Titrations and Gravimetry", topics: [
                "Principle and steps involved in gravimetric analysis, Mohr’s method, Volhard’s, Modified Volhard’s, Fajans method. Estimation of barium sulphate by gravimetry.",
                "Complexometric titrations Classification, metal ion indicators, masking and demasking reagents, preparation and standardization of disodium EDTA. Estimation of Magnesium sulphate and Calcium gluconate*.",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Redox Titrations", topics: [
                "Concepts of oxidation and reduction, Types of redox titrations viz, Permanganometry, Cerimetry, Iodimetry, Iodometry and titrations with potassium iodate.",
                "GASTROINTESTINAL AGENTS ACIDIFIERS: Sodium acid phosphate and Dilute Hydrochloric acid.",
                "ANTACIDS: Ideal properties of antacids, combinations of antacids, Sodium bicarbonate*, Aluminium hydroxide gel*.",
                "AGENTS PROMOTE BOWEL MOVEMENTS: Magnesium hydroxide, Sodium orthophosphate, Sodium Potassium tartrate and magnesium trisilicate.",
                "ANTIMICROBIALS: Mechanism, classification, Potassium permanganate, Boric acid, Hydrogen peroxide*, Chlorinated lime*, Iodine and its preparations.",
            ]
        },
        {
            num: "V", hours: "06 Hours", title: "Radiopharmaceuticals", topics: [
                "Basics of radioactivity, applications of radioisotopes of Sodium Iodide I-131, Technetium-99m, Cobalt-60, Phosphorus-32 including safe handling, storage, and disposal of radiopharmaceuticals, adhering to regulatory guidelines for safety.",
                "MISCELLANEOUS COMPOUNDS EXPECTORANTS: Potassium iodide, Ammonium chloride*.",
                "EMETICS: Copper sulphate*, Sodium potassium tartrate.",
                "HAEMATINICS: Ferrous sulphate*, Ferrous gluconate.",
                "POISON AND ANTIDOTE: Definition, classification of antidotes, Sodium thiosulphate.",
            ]
        },
    ], false,
    [
        "Understand the importance of errors, impurities in pharmaceuticals.",
        "Comprehend the principles of buffer systems.",
        "Develop skills in performing and interpreting limit tests and titrimetric analysis.",
        "Emphasize the importance of inorganic compounds and radiopharmaceuticals in Pharmacy",
        "Explain synthesis and analysis of inorganic compounds/products of pharmaceutical importance",
    ],
    [
        "Bentley, R. and Driver, J., Bentley and Driver's Textbook of Pharmaceutical Chemistry. Oxford: Oxford University Press.",
        "Vogel, A.I., Vogel’s Textbook of Quantitative Chemical Analysis. Essex: Pearson Education Limited.",
        "Beckett, A.H. and Stenlake, J.B., Practical Pharmaceutical Chemistry. Part I & II. London: The Athlone Press, University of London.",
        "Schroff, M.L., Inorganic Pharmaceutical Chemistry. New Delhi: Oxford Book Company.",
        "Indian Pharmacopoeia Commission, Indian Pharmacopoeia. Ghaziabad, India.",
    ]),
    s("BP107P", "General Pharmacy (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Pharmaceutical Calculations Solutions based on allegation and dilution methods",
                "2. Solutions; a) Strong solution of ammonium acetate – IP; b) Cresol with soap solution – IP; c) Lugol’s solution – BPC",
                "3. Syrups; a) Simple Syrup – IP",
                "4. Powders & Granules; a) ORS powder – WHO; b) Effervescent granules – IP; c) Dusting powder – IP; d) Divided powders – IP",
                "5. Suppositories; a) Glycerogelatin suppository – BPC; b) Cocoa butter suppository – IP; c) Zinc Oxide suppository – IP",
                "6. Semisolids; a) Sulphur ointment – IP; b) Non-staining iodine ointment with methyl salicylate – BPC",
            ]
        },
    ], false,
    [
        "Familiarize students with essential pharmaceutical calculations including dilution, concentration, and allegation methods required for accurate formulation of dosage forms.",
        "Impart practical skills in the preparation of official and non-official dosage forms such as solutions, syrups, powders, granules, suppositories, semisolids, gargles, and mouthwashes in accordance with pharmacopeial standards.",
        "Develop understanding of formulation principles related to selection of ingredients, dosage form design, stability, and patient acceptability.",
        "Train students in the application of pharmacopoeial specifications (IP, BPC, WHO) during compounding, labeling, and evaluation of pharmaceutical preparations.",
        "Enhance hands-on competency and professional confidence required for dispensing practice and pharmaceutical compounding in hospital and community pharmacy settings.",
    ],
    [
        "Carter, S.J., Cooper and Gunn’s Dispensing for Pharmaceutical Students. 12th ed. New Delhi: CBS Publishers.",
        "Indian Pharmacopoeia Commission, Indian Pharmacopoeia, Vol. I. Ghaziabad: IPC.",
        "United States Pharmacopeial Convention, United States Pharmacopeia–National Formulary (USP–NF). Rockville, MD, USA.",
        "British Pharmacopoeia Commission, British Pharmacopoeia Codex. London: The Stationery Office.",
        "World Health Organization, Oral Rehydration Salts (ORS) Formulation Guidelines. Geneva: WHO.",
    ]),
    s("BP108P", "Healthcare Psychology and Communication Skills (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Laboratory Practicals & Experiments (30 Hours)", topics: [
                "1. Role Plays and Simulations Counselling a patient with chronic illness Breaking bad news in a clinical setting Empathetic listening in crisis response",
                "2. Case Study Discussions Mental health cases in primary care Impact of miscommunication in healthcare errors",
                "3. Peer-to-Peer Practice Sessions Reflective listening and paraphrasing Effective team communication and decision-making",
                "4. Community Engagement Tasks Designing IEC materials for public health awareness Conducting mock health education sessions",
                "5. Journaling & Self-Reflection Logs Weekly reflection on emotional responses during care simulations Growth in communication skill development over the semester",
            ]
        },
    ], false,
    [
        "To develop effective communication skills essential for diverse clinical and community health scenarios.",
        "To enhance empathetic interaction through role plays, simulations, and reflective practices.",
        "To promote collaborative learning and peer feedback in communication-based tasks.",
        "To encourage application of psychological principles in real-life healthcare contexts.",
        "To build confidence in delivering health education and awareness activities in community settings.",
    ],
    [
        "Morgan, C.T. and King, R.A., Introduction to Psychology. New York: McGraw-Hill.",
        "Taylor, S.E., Health Psychology. New York: McGraw-Hill Education.",
        "Hargie, O., Skilled Interpersonal Communication: Research, Theory and Practice. London: Routledge.",
        "Balzer-Riley, J., Communication in Nursing and Healthcare. Boston: Pearson.",
        "Weinman, J., Petrie, K.J. and Moss-Morris, R., The Psychology of Health and Illness. London: Routledge.",
    ]),
    s("BP109P", "Human Anatomy, Physiology and Pathophysiology I (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "Practical HAPP allows the verification of physiological processes discussed in theory classes through experiments on living tissues, simulated videos, models and charts.",
                "1. Study of compound microscopes.",
                "2. Microscopic study of epithelial and connective tissue.",
                "3. Microscopic study of muscular and nervous tissue.",
                "4. Identification of axial bones.",
                "5. Identification of appendicular bones.",
                "6. Introduction to hemocytometry.",
                "7. Demonstration of total blood count by cell analyser.",
                "8. Enumeration and interpretation of white blood cell (WBC) count, differential count.",
                "9. Enumeration and interpretation of total red blood corpuscles (RBC) count.",
                "10. Determination of bleeding time and clotting time.",
                "11. Estimation and interpretation of hemoglobin content.",
                "12. Determination of blood group.",
                "13. Determination and interpretation of erythrocyte sedimentation rate (ESR).",
                "14. Determination of pulse rate, heart rate and blood pressure.",
                "15. Recording and interpretation of ECG.",
                "16. To study the cardiovascular system and integumentary system.",
                "17. Case studies/files of patients with anaemia, thalassemia, haemophilia, leprosy, gout, hypertension and ischemic heart disease.",
            ]
        },
    ], false,
    [
        "Provide fundamental knowledge of the structure and functions of various organ systems of the human body.",
        "Understand the mechanisms of homeostasis and their role in maintaining normal physiological functions.",
        "Introduce the basic concepts of pathophysiology and the causes of diseases affecting different organ systems.",
        "Explain the body’s physiological responses to disease-producing agents.",
        "Lay the foundation for understanding clinical conditions through the study of functional alterations in organs and systems.",
    ],
    [
        "Wilson, K.J.W., Anatomy and Physiology in Health and Illness. New York: Churchill Livingstone.",
        "Guyton, A.C. and Hall, J.E., Textbook of Medical Physiology. Philadelphia: Elsevier.",
        "Tortora, G.J. and Grabowski, S.R., Principles of Anatomy and Physiology. New York: Wiley.",
    ]),
    s("BP110P", "Introduction to Pharmacognosy (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Morphological study of medicinal plants (as mentioned in Unit V Theory).",
                "2. Organoleptic evaluation and powder microscopical characters of the following drugs: Tulsi and Ashwagandha.",
                "3. Organoleptic evaluation and powder microscopical characters of the following drugs: Amla and Arjuna.",
                "4. Organoleptic evaluation and powder microscopical characters of the following drugs: Turmeric and Psyllium husk.",
                "5. Organoleptic evaluation and powder microscopical characters of the following drugs: Brahmi and Fenugreek.",
                "6. Determination of moisture content of crude drugs.",
                "7. Determination of swelling index and foaming index of crude drugs.",
                "8. Determination of stomatal number and stomatal index of leaf.",
                "9. Determination of vein islet and vein termination number of leaf.",
                "10. Determination of ash value and extractive values of crude drugs.",
                "11. Determination of foreign organic matter of crude drugs.",
                "12. Determination of dimensions of calcium oxalate crystals and phloem fibers by eyepiece micrometry.",
                "13. Determination of percentage purity of powder drug using lycopodium spore method.",
                "14. Experiential learning-based experiments involving collection, identification of medicinal plant material, preparation of voucher specimens and excursion visits to medicinal plant garden.",
            ]
        },
    ], false,
    [
        "Identify medicinal plants and crude drugs using morphological and microscopical characters.",
        "Analyze powdered drugs and perform quantitative microscopy.",
        "Evaluate crude drugs using physicochemical parameters.",
        "Introduce standardization and quality control of herbal materials.",
        "Collect medicinal plants and prepare voucher specimens.",
    ],
    [
        "Evans, W.C., 2009. Trease and Evans Pharmacognosy. 16th ed. London: W.B. Saunders & Co.",
        "Tyler, V.E., Brady, L.R. and Robbers, J.E., 1988. Pharmacognosy. 9th ed. Philadelphia: Lea & Febiger.",
        "Wallis, T.E., Textbook of Pharmacognosy. London: J. & A. Churchill Ltd.",
    ]),
    s("BP111P", "Pharmaceutical Inorganic and Analytical Chemistry (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Limit tests (Any 4 Experiments) a. Limit test and modified limit test for Chloride as per Indian Pharmacopoeia b. Limit test and modified limit test for sulphate as per Indian Pharmacopoeia c. Limit test for Iron d. Limit test for Lead e. Limit test for arsenic",
                "2. Preparation of inorganic pharmaceuticals (Any 3 Experiments) a. Preparation of Aluminium hydroxide b. Preparation of potash alum c. Preparation of ferrous sulphate d. Preparation of Magnesium sulphate from magnesium hydroxide or magnesium carbonate",
                "3. Test for Purity (Any 2 Experiments) a. Assessment of swelling power of bentonite as per Indian Pharmacopoeia b. Evaluation of acid neutralizing capacity of aluminium hydroxide gel c. Determination of potassium iodate and iodine in potassium Iodide",
                "4. Assay of the following inorganic compounds including standardization of titrant (Any 5 Experiments) a. Assay of ammonium chloride by acid base titration, b. Assay of Ferrous sulphate by Cerimetry, c. Assay of Copper sulphate by Iodometry, d. Assay of Calcium gluconate by Complexometry, e. Assay of Hydrogen peroxide by Permanganometry, f. Assay of Sodium benzoate by non-aqueous titration, g. Assay of Sodium Chloride by precipitation titration (Modified Volhard’s method)",
            ]
        },
    ], false,
    [
        "Gain practical knowledge on various volumetric titration techniques.",
        "Learn the principles of volumetric analysis.",
        "Study the preparation and assessment of inorganic compounds.",
        "Determine the assay of various inorganic compounds in pharmaceutical use.",
        "Develop analytical skill for the qualitative and quantitative analysis of various inorganic compounds.",
    ],
    [
        "Bentley, R. and Driver, J., Bentley and Driver’s Textbook of Pharmaceutical Chemistry. Oxford: Oxford University Press.",
        "Vogel, A.I., Vogel’s Textbook of Quantitative Chemical Analysis. Essex: Pearson Education Limited.",
        "Beckett, A.H. and Stenlake, J.B., Practical Pharmaceutical Chemistry. Part I & II. London: The Athlone Press, University of London.",
        "Kennedy, J.H., Analytical Chemistry: Principles. New York: Saunders College Publishing.",
        "Schroff, M.L., Inorganic Pharmaceutical Chemistry. New Delhi: Oxford Book Company.",
        "Indian Pharmacopoeia Commission, Indian Pharmacopoeia. Ghaziabad, India.",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 2
// ─────────────────────────────────────────────────────────────
const SEM2: Subject[] = [
    s("BP201T", "Applied Biostatistics and Data Analytics for Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Descriptive Statistics", topics: [
                "Types of data in pharmaceutical sciences (nominal, ordinal, interval, ratio).",
                "SOURCES OF DATA IN PHARMACY: clinical trials, pharmacovigilance, quality control, PK studies.",
                "MEASURES OF CENTRAL TENDENCY: mean, median, mode, their calculation and interpretation.",
                "Measures of dispersion (range, variance, standard deviation) and their interpretation using pharmaceutical data.",
                "Skewness and understanding distribution shape in biological measurements.",
                "Perform descriptive statistical analysis using Python libraries such as NumPy and Pandas, with focus on Interpretation of results.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Probability & Statistical Distributions in Healthcare", topics: [
                "Basic probability concepts and laws (addition and multiplication rules), conditional probability and its interpretation.",
                "Bayes' theorem and its application in clinical decision-making.",
                "Concept of random variables (discrete and continuous).",
                "Normal distribution and its importance in biological and pharmaceutical measurements, • Binomial distribution demonstrating applications in clinical trial outcomes.",
                "Poisson distribution for modeling rare events such as adverse drug reactions.",
                "Graphical visualization of these probability distributions using Python.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Sampling & Statistical Inference", topics: [
                "Population versus sample, sampling techniques used in clinical research, Sampling error and bias.",
                "Conceptual understanding of the Central Limit Theorem.",
                "Confidence intervals and their interpretation.",
                "Hypothesis testing framework (null and alternative hypotheses).",
                "Type I and Type II errors, p-value and statistical significance.",
                "Demonstration, calculation and interpretation of these parameters using python with pharmaceutical data.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Basics of Correlation & Regression", topics: [
                "Conceptual understanding of the following concepts with emphasis on their interpretation• correlation and Pearson correlation coefficients.",
                "Interpretation of positive and negative correlations.",
                "Scatter plots and trend visualization using pharmaceutical data such as dose-response relationships.",
                "Simple linear regression concept, interpretation of regression coefficients.",
                "Introduction to odds ratio and its application in clinical risk analysis.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Statistical Analysis Using Python – Case Based Learning", topics: [
                "Demonstration of descriptive statistics, correlation analysis and linear regression using Python libraries- SciPy / Statsmodels / Scikit-learn on pharmaceutical datasets.",
                "Interpretation of the output summaries and p-values.",
                "Preparation of statistical reports.",
            ]
        },
    ], true,
    [
        "Explain fundamental statistical concepts relevant to pharmaceutical sciences.",
        "Develop the ability to interpret clinical and experimental data scientifically.",
        "Apply statistical methods for analysing pharmaceutical and biomedical data.",
        "Demonstrate the use of Python-based tools for statistical analysis and data handling.",
        "Recognize the role of statistical analysis in evidence-based decision making and machine learning applications in healthcare.",
    ],
    [
        "Lane, D.M., Introduction to Statistics. Houston: Rice University. Available at: https://onlinestatbook.com/2/index.html",
        "Walters, S.J., Campbell, M.J. and Machin, D., Medical Statistics: A Textbook for the Health Sciences. Hoboken, NJ: Wiley-Blackwell.",
        "Rowe, P., Essential Statistics for the Pharmaceutical Sciences. London: Pharmaceutical Press.",
        "Bolton, S. and Bon, C., Pharmaceutical Statistics: Practical and Clinical Applications. New York: Informa Healthcare.",
        "De Muth, J.E., Basic Statistics and Pharmaceutical Statistical Applications. Boca Raton, FL: CRC Press.",
    ]),
    s("BP202T", "Biochemistry", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Enzymology", topics: [
                "Introduction, properties, nomenclature, and IUB classification of enzymes and coenzymes. Enzyme kinetics (Michaelis plot, LineweaverBurk plot). Enzyme inhibitors with examples, of enzymes: enzyme induction and repression, allosteric enzyme regulation.",
                "Therapeutic and diagnostic application of enzymes and isoenzymes.",
                "Factors affecting enzyme activity. Digestion, absorption function of dietary Macro and Micronutrients, including Vitamins and Minerals, Biochemical functions of vitamins and associated diseases.",
                "CLINICAL CHEMISTRY: Liver function tests (routinely performed tests based on liver function). Renal function tests (routinely performed tests based on kidney function, ELISA test).",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Carbohydrate Metabolism", topics: [
                "INTRODUCTION ABOUT BIOMOLECULES: Introduction of carbohydrate, lipids, nucleic acids, amino acids and proteins.",
                "BIOENERGETICS: Concept of free energy; relationship between free energy, enthalpy, and entropy; redox potential; energy-rich compounds (ATP, GTP, etc.) and their biological significance.",
                "Carbohydrate Metabolism and their role in diabetis mellitus: Overview and significance of major pathways: Glycolysis, Citric Acid Cycle (TCA), Gluconeogenesis, Hexose Monophosphate (HMP) shunt, and Glycogen metabolism; regulation of blood glucose levels; metabolic adaptations during fed state, fasting, and prolonged starvation; metabolic derangements in diabetes mellitus and related disorders.",
                "BIOLOGICAL OXIDATION: Electron Transport Chain (ETC), oxidative phosphorylation, and mechanisms of ATP synthesis; regulation and clinical implications of mitochondrial dysfunction and oxidative stress.",
            ]
        },
        {
            num: "III", hours: "7 Hours", title: "Lipid Metabolism", topics: [
                "Classification, functions, and properties of lipids and lipoproteins.",
                "(HDL, LDL, VLDL, chylomicrons).",
                "β-oxidation and de-novo synthesis of fatty acids: Ketone bodies: synthesis, utilization, and clinical significance.",
                "Biological significance of cholesterol, lipid profile, and its clinical significance.",
                "DISORDERS ASSOCIATED WITH LIPID METABOLISM: Hyperlipidaemias and hypercholesterolemia, lipid storage diseases, atherosclerosis, fatty liver disease, and obesity.",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Amino Acids and Protein Metabolism", topics: [
                "CLASSIFICATION AND BIOLOGICAL FUNCTIONS: Classification and physiological roles of amino acids. Structure and functions of proteins and plasma proteins.",
                "GENERAL METABOLISM OF AMINO ACIDS: Transamination, oxidative and non-oxidative deamination, decarboxylation. Urea cycle – nitrogen disposal and detoxification. Fate of carbon skeletons of amino acids.",
                "(glucogenic vs ketogenic).",
                "Catabolism of Specific Amino Acids and Related Disorders:",
                "Catabolism of phenylalanine and tyrosine and their metabolic disorders (Phenylketonuria, Albinism, Alkaptonuria, Tyrosinemia) and Inborn errors of branched chain and aromatic amino acids.",
                "Biochemical significance of neurotransmitters and hormones derived from amino acids:",
                "5-HT (serotonin), melatonin, dopamine, noradrenaline, adrenaline.",
                "Catabolism of heme and related disorders (jaundice).",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Nucleic Acid Metabolism and Genetic Information Transfer", topics: [
                "Nucleotide Metabolism and their related disorders: Biosynthesis of purine and pyrimidine nucleotides. Catabolism of purine nucleotides (uric acid formation). Clinical significance of Hyperuricemia and Gout.",
                "GENOME STRUCTURE AND CENTRAL DOGMA: Organization of the mammalian genome. Introduction to DNA replication, Transcription, and Translation.",
                "Genetic Code and of Protein Synthesis: Properties of the genetic code: Inhibitors of transcription and translation (antibiotics, toxins).",
                "DNA REPAIR AND RELATED DISORDERS: DNA damage types, Repair mechanisms. Overview of clinical disorders associated with faulty DNA repair.",
            ]
        },
    ], false,
    [
        "Know about enzymology and various tests in clinical chemistry",
        "Understand the biochemical pathways and clinical relevance of carbohydrate, lipid and protein metabolism.",
        "Describe energetics and biological oxidation.",
        "Explain aminoacid and protein metabolism",
        "Understand Nucleic acid metabolism and genetic information.",
    ],
    [
        "Nelson, D.L., Cox, M.M. and Hoskins, A., Lehninger Principles of Biochemistry. New York: W.H. Freeman.",
        "Kennelly, P.J., Rodwell, V.W., Bender, D.A., Botham, K.M. and Weil, P.A., Harper’s Illustrated Biochemistry. New York: McGraw-Hill Education.",
        "Murray, R.K., Bender, D.A., Botham, K.M., Kennelly, P.J., Rodwell, V.W. and Weil, P.A., Harper’s Biochemistry. New York: McGraw-Hill.",
        "Voet, D. and Voet, J.G., Biochemistry. New York: John Wiley & Sons.",
        "Devlin, T.M., Textbook of Biochemistry with Clinical Correlations. New York: Wiley- Liss.",
        "Satyanarayana, U. and Chakrapani, U., Biochemistry. Kolkata: Books and Allied (P) Ltd.",
        "Stryer, L., Biochemistry. New York: W.H. Freeman.",
    ]),
    s("BP203T", "Human Anatomy, Physiology and Pathophysiology II", 4, "T", [
        {
            num: "I", hours: "14 Hours", title: "Nervous System", topics: [
                "Organization of nervous system, neuron, neuroglia, classification and properties of nerve fibre, electrophysiology, action potential, nerve impulse, receptors, synapse and neurotransmitters.",
                "CENTRAL NERVOUS SYSTEM: Meninges, ventricles of brain and cerebrospinal fluid. Structure and functions of brain (cerebrum, brain stem and cerebellum), spinal cord (gross structure, functions of afferent and efferent nerve tracts, reflex activity).",
                "Pathophysiology of epilepsy, Parkinson’s disease, stroke, migraine, depression, schizophrenia, Alzheimer’s disease and meningitis.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Gastrointestinal System", topics: [
                "Anatomy of GI tract with special reference to anatomy and functions of stomach (acid production in the stomach and its regulation through parasympathetic nervous system; role of pepsin in protein digestion).",
                "Anatomy and functions of small intestine and large intestine. Anatomy and functions of salivary glands, pancreas and liver. Movements of GIT, digestion and absorption of nutrients.",
                "Pathophysiology of inflammatory bowel diseases, peptic ulcer, jaundice, hepatitis, typhoid and alcoholic and non alcoholic fatty liver disease.",
                "Respiratory System.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Anatomy of Respiratory System with Special Reference to Anatomy of Lungs", topics: [
                "Mechanism of respiration and regulation of respiration. Lung volumes and capacities, transport of respiratory gases, artificial respiration and resuscitation methods.",
                "Pathophysiology of asthma, chronic obstructive pulmonary diseases and tuberculosis.",
                "Urinary System Anatomy of urinary tract with special reference to anatomy of kidney and nephrons. Functions of kidney and urinary tract. Physiology of urine formation, micturition reflex and role of kidneys in acid–base balance.",
                "Role of Renin Angitensin Aldosterone System in kidney.",
                "Pathophysiology of acute and chronic renal failure and urinary tract infections.",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Endocrine System", topics: [
                "Classification of hormones and mechanism of hormone action. Structure and functions of pituitary gland, thyroid gland, parathyroid gland, adrenal gland, pancreas, pineal gland and thymus.",
                "Pathophysiology of diabetes, hypothyroidism, hyperthyroidism, goitre and polycystic ovary syndrome.",
            ]
        },
        {
            num: "V", hours: "12 Hours", title: "Reproductive System and Cancer", topics: [
                "Anatomy of male and female reproductive system. Functions of male and female reproductive system, sex hormones, physiology of menstruation, fertilization, spermatogenesis, oogenesis, pregnancy and parturition.",
                "PATHOPHYSIOLOGY OF SEXUALLY TRANSMITTED DISEASES: AIDS, syphilis and gonorrhea., Etiology and pathogenesis of cancer.",
            ]
        },
    ], false,
    [
        "Understand the anatomy and physiology of major body systems.",
        "Learn mechanisms of neurological, gastrointestinal, respiratory, renal, endocrine, and reproductive functions.",
        "Identify common pathophysiological conditions affecting each organ system.",
        "Correlate structural and functional abnormalities with disease symptoms.",
        "Equip students with foundational knowledge for interpreting disease processes and planning rational pharmacotherapy.",
    ],
    [
        "Wilson, K.J.W., Ross and Wilson Anatomy and Physiology in Health and Illness. Churchill Livingstone, New York.",
        "Tortora, G.J. and Grabowski, S.R., Principles of Anatomy and Physiology. Palmetto, GA, U.S.A.",
        "Guyton, A.C. and Hall, J.E., Textbook of Medical Physiology. Elsevier.",
        "Chatterjee, C.C., Human Physiology (Vol. I & II). Academic Publishers, Kolkata.",
        "Mohan, H., Textbook of Pathology. Jaypee Publishers.",
        "Porth, C.M., Pathophysiology: Concepts of Altered Health States. Lippincott Williams & Wilkins.",
        "Kumar, V., Abbas, A.K., Aster, J.C. and Deyrup, A.T., Robbins and Kumar Basic Pathology. Elsevier.",
    ]),
    s("BP204T", "Pharmaceutical Organic Chemistry", 4, "T", [
        {
            num: "I", hours: "12 Hours", title: "Aliphatic Saturated Hydrocarbons Alkanes", topics: [
                "METHODS OF PREPARATION: Wurtz reaction, Kolbe’s reaction, Clemmensen reduction, Wolff–Kishner reduction, Chemical reactions of alkanes.",
                "Mechanism of free radical substitution (halogenation).",
                "PHARMACEUTICAL APPLICATIONS OF ALKANES: Liquid paraffin, soft paraffin, hard paraffin.",
                "Cycloalkanes.",
                "Baeyer’s strain theory and its limitations.",
                "COULSON: Moffitt modification.",
                "SACHSE: Mohr theory.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Aliphatic Unsaturated Hydrocarbons – Alkenes", topics: [
                "METHODS OF PREPARATION: Dehydration of alcohols.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Alkyl Halides (SN1, SN2, E1, E2 & Elimination Reactions)", topics: [
                "Dehydrohalogenation of alkyl halides.",
                "Dehalogenation of vicinal dihalides.",
                "Wittig reaction.",
                "Chemical reactions of alkenes.",
                "Mechanism of electrophilic addition reactions.",
                "Markovnikov’s and anti-Markovnikov’s rule.",
                "Ozonolysis.",
                "Conjugated Dienes.",
                "Stability of conjugated dienes.",
                "MECHANISM OF DIELS: Alder reaction Electrophilic and free radical addition reactions.",
                "1,2- and 1,4-addition reactions.",
                "Alkyl Halides.",
                "NUCLEOPHILIC SUBSTITUTION REACTIONS: SN1 and SN2.",
                "Mechanism, kinetics, substrate structure, solvent effect, stereochemistry.",
                "ELIMINATION REACTIONS: E1 and E2.",
                "Mechanism, kinetics, substrate structure, solvent effect, stereochemistry.",
                "Zaitsev’s (Saytzeff’s) rule with examples.",
                "Comparison of substitution vs elimination reactions.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Benzene and Its Derivatives (Electrophilic Aromatic Substitution)", topics: [
                ": Benzene and Its Derivatives – • IUPAC nomenclature of mono- and di-substituted benzene derivatives, Structure of benzene, Molecular orbital picture and resonance, Aromaticity and Hückel’s rule.",
                "ELECTROPHILIC AROMATIC SUBSTITUTION REACTIONS: Nitration, Halogenation.",
                "FRIEDEL: Crafts alkylation and its limitations.",
                "FRIEDEL: Crafts acylation.",
                "Sulphonation and desulphonation.",
                "Effect of substituents on reactivity and orientation.",
            ]
        },
        {
            num: "V", hours: "12 Hours", title: "Carbonyl Compounds Aldehydes and Ketones", topics: [
                "Preparation and properties of carbonyl compounds.",
                "Nucleophilic addition reactions.",
                "Aldol condensation and crossed aldol condensation.",
                "Cannizzaro and crossed Cannizzaro reactions.",
                "Benzoin and Perkin condensation.",
                "Oxidation and reduction reactions.",
                "PHARMACEUTICAL APPLICATIONS OF CARBONYL COMPOUNDS: Chloral, Paraldehyde, Ketoprofen.",
            ]
        },
    ], false,
    [
        "Develop a clear understanding of the chemistry of saturated hydrocarbons.",
        "Study the chemistry and reactions of unsaturated hydrocarbons.",
        "Understand the chemistry and reaction mechanisms of alkyl halides.",
        "Explain the chemistry of aromatic hydrocarbons and their derivatives.",
        "Provide an understanding of carbonyl compounds and fundamental organic reaction mechanisms relevant to pharmaceuticals.",
    ],
    [
        "Morrison, R.T., Boyd, R.N. and Bhattacharjee, S.K., Organic Chemistry. Pearson Education India.",
        "Finar, I.L., Organic Chemistry, Vol. I. Pearson Books.",
        "Bahl, B.S. and Bahl, A., Textbook of Organic Chemistry. S. Chand & Company.",
        "Furniss, B.S., Vogel’s Textbook of Practical Organic Chemistry.",
    ]),
    s("BP205T", "Pharmacognosy and Phytochemistry", 4, "T", [
        {
            num: "I", hours: "10 Hours", title: "Metabolic Pathways in Higher Plants & Biogenesis", topics: [
                "Metabolic Pathways and Biogenetic Studies Brief study of basic metabolic pathways and biosynthesis of secondary metabolites including: Shikimic acid pathway, Acetate pathway, Amino acid pathways Utilization of radioactive isotopes in biogenetic studies.",
                "Introduction to pathway prediction tools and modern genetic tools such as CRISPR/Cas9.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Primary Metabolites General Classification and Identification Tests", topics: [
                "Pharmacognostic study (biological source, distribution, identifying characters, chemical constituents, specific tests, therapeutic uses, and commercial applications):",
                "CARBOHYDRATES: Acacia, • Agar, Tragacanth, Honey.",
                "PROTEINS AND ENZYMES: Gelatin, Casein.",
                "PROTEOLYTIC ENZYMES: Papain, Bromelain, Serratiopeptidase, Urokinase, Streptokinase, Pepsin.",
                "Lipids (Waxes, Fats, Fixed Oils): Castor oil, Olive oil, Cocoa butter, Wool fat, Beeswax.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Secondary Metabolites General Classification and Identification Tests", topics: [
                "Pharmacognostic study (biological source, distribution, cultivation of underlined drugs, identifying characters, chemical constituents, specific tests, therapeutic uses, and commercial applications):",
                "ALKALOIDS: Vinca, Rauwolfia, Opium.",
                "VOLATILE OILS: Lemongrass, Clove, Cinnamon, Fennel.",
                "TANNINS: Myrobalans, Catechu, Pomegranate.",
                "RESINS: Guggul, Asafoetida.",
                "GLYCOSIDES: Senna, Liquorice, Digitalis.",
                "PHENYLPROPANOIDS AND FLAVONOIDS: Green Tea, Ginkgo, Flax seed Iridoids, Other Terpenoids and Naphthoquinones: Gentian.",
                "Artemisia.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Extraction Methods for Medicinal Plants Conventional Methods of Extraction", topics: [
                "Infusion, Decoction, Digestion, Maceration, Percolation, Reflux, Distillation, Soxhlet extraction, Successive solvent extraction.",
                "MODERN METHODS OF EXTRACTION: Supercritical fluid extraction, Microwave-assisted extraction, Ultrasonic-assisted extraction, Enzyme-assisted extraction, Pressurized liquid extraction.",
            ]
        },
        {
            num: "V", hours: "14 Hours", title: "Overview of Isolation, Identification and Characterization", topics: [
                "TECHNIQUESSEPARATION AND ISOLATION TECHNIQUES: Planar chromatography, Column chromatography, Preparative TLC, Flash chromatography.",
                "IDENTIFICATION TECHNIQUES: Phytochemical tests, Chromatographic techniques, Spectroscopic techniques Fingerprinting of medicinal plants using TLC/HPTLC.",
                "Types and significance of markers (phytochemical reference standards).",
                "Screening and analysis of major metabolites: Alkaloids, Glycosides, Saponins, Tannins, Resins, Flavonoids, Phenolics, Steroids.",
            ]
        },
    ], false,
    [
        "Understand major metabolic pathways and the biogenetic origin of primary and secondary phytoconstituents, including the use of modern tools for pathway studies.",
        "Study and interpret the pharmacognostic features of crude drugs containing primary metabolites such as carbohydrates, proteins/enzymes, and lipids.",
        "Study and interpret the pharmacognostic features of crude drugs containing secondary metabolites such as alkaloids, glycosides, tannins, resins, volatile oils, flavonoids, phenolics, and terpenoids.",
        "Impart knowledge of conventional and modern extraction techniques and enable selection of appropriate extraction methods.",
        "Develop competency in isolation, identification, characterization, and quality evaluation of medicinal plants and botanicals.",
    ],
    [
        "Dewick, P.M., Medicinal Natural Products: A Biosynthetic Approach. John Wiley & Sons.",
        "Evans, W.C., Trease and Evans’ Pharmacognosy. W.B. Saunders & Co., London.",
        "Wagner, H., and Bladt, S., Plant Drug Analysis: A Thin Layer Chromatography Atlas. Springer-Verlag.",
        "Harborne, J.B., Phytochemical Methods: A Guide to Modern Techniques of Plant Analysis. Chapman & Hall.",
    ]),
    s("BP206T", "Physical Pharmaceutics", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Solubility Distribution Phenomenon & Buffers", topics: [
                "Solubility expression, Solute solvent interactions, Solubility of liquid and liquids, Solubility of solids and liquids, Solubility of Gas in Liquids, Raoult’s Law. Factors affecting solubility, Measurement of saturation Solubility, Effect of pH on solubility, Partition Coefficient Measurement and significance, Critical Solution Temperature and Applications.",
                "Introduction to buffers, Buffers in pharmaceutical and biological system, pH determination methos (Electrometry and colorimetry). Buffer equation / Factor influencing the pH of buffer solutions, Factor influencing Buffer capacity, General procedure for preparing buffers, Indicators.",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Interfacial Phenomenon", topics: [
                "LIQUID INTERFACE: Surface and interfacial tension, surface free energy, Measurement of surface and interfacial tension, Spreading coefficient, surface active agent, HLB, detergency, types of monolayers at liquid surface. Adsorption at solid interface, Liquid Interface (contact angle, activated charcoal and Wetting). Adsorption of surface-active agents.",
                "Electric properties of interface / Electric double layer, Nernst and zeta potential effect of electrolytes.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Colloidal and Coarse Dispersion", topics: [
                "COLLOIDAL DISPERSIONS: Types of colloidal dispersions (Lyophobic, Lyophilic, Association colloids), Optical properties of colloids, Kinetic properties of colloids, Electrical properties of colloids, Size and shape of colloidal systems, Stability of colloidal system (peptization and protective action), Application of Colloidal System.",
                "COARSE DISPERSIONS: Suspensions, stokes law (Theory of sedimentation), Effect of Brownian movement / Sedimentation of flocculated particles, sedimentation parameters. Flocculation and controlled structure flocculation. Theories of emulsification and stabilizaition (DLVO Theory, Monomolecular adsorption, Multimolecular adsorption, Film formation, Solid particle adsorption). Physical instabilities of emulsions (creaming, coalescence and breaking, and phase inversion).",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Rheological Studies", topics: [
                "Newtonian systems and non-Newtonian systems. Thixotropy measurement / Bulges and spurs. Negative thixotropy, Determination of rheological properties (Viscometers / single and multi-point).",
                "Viscoelasticity, psycho-rheology. Applications of rheology in pharm.",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Micromeritics", topics: [
                "Particle size and size distribution, Particle Shape and Surface area:",
                "Methods for determination and significance. Flow properties of powders: determination, significance and methods of enhancement. Advanced flow properties of powers (Powder flow tester).",
            ]
        },
    ], false,
    [
        "Provide a comprehensive understanding of the theory and principles of pharmaceutical processes and unit operations involved in drug manufacturing.",
        "Impart knowledge of physicochemical phenomena such as solubility, dissolution, interfacial phenomena, rheology, and micromeritics relevant to dosage form design.",
        "Develop understanding of colloidal and coarse dispersions, including suspensions and emulsions, and their pharmaceutical applications.",
        "Familiarize students with rheological and micromeritic properties of powders and dispersions and their role in formulation development and evaluation.",
        "Build a strong foundation for formulation development, process optimization, and quality control of pharmaceutical dosage forms.",
    ],
    [
        "1. Sinko, P.J., Martin's Physical Pharmacy and Pharmaceutical Sciences.",
        "Allen, L.V. and McPherson, T.B., Ansel's Pharmaceutical Dosage Forms and Drug Delivery Systems.",
        "Adejare, A., Remington: The Science and Practice of Pharmacy.",
        "Aulton, M.E. and Taylor, K.M.G., Aulton Pharmaceutics: The Design and Manufacture of Medicines. Elsevier.",
        "Lachman, L. and Libbermann, H.A., The Theory and Practice of Industrial Pharmacy. Mendham, J., Denney, R.C., Barnes, J.D. and Thomas, M.J.K., Vogel's Textbook of",
        "Quantitative Chemical Analysis. Myers, D., Surfaces, Interfaces, and Colloids: Principles and Applications. Ladisch, M.R., Rheology of Fluid and Semisolid Foods. Springer.",
    ]),
    s("BP207P", "Biochemistry (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Identification tests for proteins (Albumin and Casein).",
                "2. Qualitative analysis of carbohydrates* (Glucose, Fructose, Lactose, Sucrose, and Starch).",
                "3. Qualitative analysis of urine for normal and abnormal constituents.",
                "4. Estimation of blood glucose.",
                "5. Estimation of total cholesterol and HDL cholesterol.",
                "6. Estimation of urea, creatinine, and uric acid in serum.",
                "7. Estimation of serum total protein and albumin.",
                "8. Study of enzymatic hydrolysis of starch.",
                "9. Study of the effect of temperature on salivary amylase activity.",
                "10. Study of the effect of substrate concentration on salivary amylase activity.",
                "11. Estimation of hemoglobin in blood by Sahli’s method / Cyanmethemoglobin method.",
                "12. Estimation of serum bilirubin (total and direct bilirubin).",
                "13. Estimation of glycogen content",
                "14. Estimation of SGOT and SGPT",
            ]
        },
    ], false,
    [
        "To develop skills to identify and differentiate carbohydrates and proteins through classical qualitative biochemical tests.",
        "To apply biochemical techniques for analysis of pathological conditions using urine and blood samples.",
        "To perform estimations of clinically important biomolecules such as glucose, cholesterol, urea, creatinine, uric acid, and proteins in biological fluids.",
        "To demonstrate enzymatic activity and study factors affecting enzyme function, including substrate concentration and temperature.",
        "To interpret biochemical results and correlate them with clinical conditions such as diabetes, renal dysfunction, and lipid disorders.",
    ],
    [
        "Plummer, D. T. An Introduction to Practical Biochemistry. McGraw-Hill, New York.",
        "Wilson, K., and Walker, J. Principles and Techniques of Biochemistry and Molecular Biology. Cambridge University Press.",
        "Varley, H., Gowenlock, A. H., Bell, M., and Bell, J. L. Varley’s Practical Clinical Biochemistry. Heinemann Medical Books.",
        "Burtis, C. A., Ashwood, E. R., and Bruns, D. E. Tietz Textbook of Clinical Chemistry and Molecular Diagnostics. Elsevier.",
        "Rodwell, V. W., Bender, D. A., Botham, K. M., Kennelly, P. J., and Weil, P. A. Harper’s Illustrated Biochemistry. McGraw-Hill.",
        "Freifelder, D. Essential Molecular Biology: A Practical Approach. Oxford University Press.",
    ]),
    s("BP208P", "Human Anatomy, Physiology and Pathophysiology II (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "Practical HAPP allows the verification of physiological processes discussed in theory classes through experiments on living tissues, simulated videos, models, and charts.",
                "1. Study of nervous system using specimens and models.",
                "2. Study of respiratory system using models.",
                "3. Study of gastrointestinal system using models.",
                "4. Study of reproductive system using models.",
                "5. Demonstration of general neurological examination.",
                "6. Demonstration of function of olfactory nerve.",
                "7. Examination of different types of taste.",
                "8. Demonstration of visual acuity.",
                "9. Demonstration of reflex activity.",
                "10. Recording of body temperature.",
                "11. Determination of tidal volume and vital capacity.",
                "12. Recording of body mass index (BMI).",
                "13. Study of family planning devices and pregnancy diagnosis tests.",
                "14. Understanding pathophysiology of IBD, peptic ulcer, jaundice, hepatitis, typhoid, asthma, tuberculosis, diabetes, and thyroid disorders through case files / case reports.",
                "15. Hands-on training in cardiopulmonary resuscitation (CPR).",
            ]
        },
    ], false,
    [
        "Provide foundational knowledge of the structure and functions of major organ systems of the human body.",
        "Develop understanding of physiological mechanisms responsible for maintenance of homeostasis.",
        "Explain the pathophysiology of diseases affecting different organ systems.",
        "Explore causes of diseases and the body’s responses to pathological conditions.",
        "Build a strong base for clinical learning through the study of functional and structural changes in disease states.",
    ],
    [
        "Wilson, K. J. W., and Waugh, A. Anatomy and Physiology in Health and Illness. Churchill Livingstone, New York.",
        "Best, C. H., and Taylor, N. B. The Physiological Basis of Medical Practice. Williams & Wilkins, Baltimore.",
        "Guyton, A. C., and Hall, J. E. Textbook of Medical Physiology. Elsevier / W.B. Saunders, Philadelphia.",
        "Tortora, G. J., and Grabowski, S. R. Principles of Anatomy and Physiology. John Wiley & Sons.",
        "Brunton, L., Chabner, B., and Knollmann, B. Goodman & Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill, New York.",
        "Colledge, N. R., Walker, B. R., and Ralston, S. H. Davidson’s Principles and Practice of Medicine. Churchill Livingstone, London.",
    ]),
    s("BP209P", "Pharmaceutical Organic Chemistry (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "2. Building Molecular Models: Students will use ball-and-stick models to create structures of molecules and understand their shapes and bonding.",
                "3. Crystallization Method Students will learn how to purify three organic compounds using the crystallization technique.",
            ]
        },
    ], false,
    [
        "Understand and follow essential laboratory safety protocols for handling chemicals, glassware, and equipment.",
        "Identify and analyze organic compounds through their physical properties and functional group reactivity.",
        "Apply ball-and-stick molecular models to visualize and interpret the structure of organic compounds.",
        "Perform purification techniques such as crystallization to isolate and refine organic substances.",
        "Synthesize simple organic compounds and their derivatives using standard laboratory methods.",
    ],
    [
        "Furniss, B. S., Hannaford, A. J., Smith, P. W. G. and Tatchell, A. R. Vogel’s Textbook of Practical Organic Chemistry. Longman Scientific & Technical, London.",
        "Mann, F. G. and Saunders, B. C. Practical Organic Chemistry. Pearson Education.",
        "Shriner, R. L., Hermann, C. K. F., Morrill, T. C., Curtin, D. Y. and Fuson, R. C. The Systematic Identification of Organic Compounds. John Wiley & Sons.",
        "Vogel, A. I. Elementary Practical Organic Chemistry. Longman Group Ltd.",
        "Pavia, D. L., Lampman, G. M., Kriz, G. S. and Engel, R. Introduction to Organic Laboratory Techniques. Cengage Learning.",
    ]),
    s("BP210P", "Pharmacognosy and Phytochemistry (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Chemical tests for identification of Agar, Acacia, Tragacanth, Honey.",
                "2. Chemical tests for identification of Castor oil, Olive oil, Wool fat, Beeswax.",
                "3. Chemical tests for identification of Asafoetida, Catechu, Aloe.",
                "4. Transverse section and powder microscopy of a vinca leaf.",
                "5. Transverse section and powder microscopy of a cinnamon bark.",
                "6. Transverse section and powder microscopy of a fennel fruit.",
                "7. Transverse section and powder microscopy of a clove flower bud.",
                "8. Transverse section and powder microscopy of a Tulsi stem.",
                "9. Transverse section and powder microscopy of a Liquorice roots.",
                "10. Study of effect on different extraction techniques on yield of crude extract (maceration, decoction, soxhlation).",
                "11. Isolation of volatile oil and it’s TLC.",
                "12. Isolation of caffeine from tea.",
                "13. Isolation of Hesperidin from lemon peel.",
                "14. Isolation of Glycyrhizin from liquorice roots.",
                "15. Isolation of Pectin from orange peel.",
                "16. Experiential learning based experiment involving evaluation and comparison of field/market collected herbal raw materials with Pharmacopoeial standards.",
            ]
        },
    ], false,
    [
        "Perform chemical tests for the identification of gums, resins, oils, fats, waxes, and unorganized drugs.",
        "Examine crude drugs using transverse section and powder microscopy for correct identification.",
        "Apply suitable extraction techniques and study their effect on yield of crude extracts.",
        "Isolate and identify important phytoconstituents and volatile oils using standard procedures.",
        "Evaluate herbal raw materials collected from field/market sources as per Pharmacopoeial standards.",
    ],
    [
        "1. Trease, G. E. and Evans, W. C. Pharmacognosy. Elsevier.",
        "Harborne, J. B. Phytochemical Methods: A Guide to Modern Techniques of Plant Analysis. Springer.",
        "Wallis, T. E. Textbook of Pharmacognosy. CBS Publishers & Distributors, New Delhi.",
        "Tyler, V. E., Brady, L. R. and Robbers, J. E. Pharmacognosy. Lea & Febiger.",
    ]),
    s("BP211P", "Physical Pharmaceutics (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Determination of surface tension of given liquids by drop count method and drop weight method.",
                "2. Determination of critical micellar concentration (CMC) of surfactants.",
                "3. Determination of viscosity of liquids using Ostwald’s viscometer and Brookfield viscometer.",
                "4. Determination of HLB value of a surfactant.",
                "5. Calculation of isotonicity by different methods (Sodium Chloride Equivalent Method).",
                "6. Determination of particle size and particle size distribution using sieving method.",
                "7. Determination of particle size and particle size distribution using microscopic method.",
                "8. Determination of densities and derived properties of powders (bulk density, tapped density, Hausner ratio, Carr’s compressibility index), true density, and porosity.",
                "9. Determination of angle of repose and influence of glidants on angle of repose.",
                "10. Determination of solubility of a drug at different pH/buffer systems at room temperature.",
                "11. Determination of partition coefficient of a drug in n-octanol and water system.",
                "12. Determination of partition coefficient of a drug in benzene and water system.",
                "13. Determination of critical solution temperature and composition of phenol–water system.",
                "14. Determination of specific surface area of charcoal by adsorption of acetic acid on activated charcoal.",
                "15. Determination of buffer capacity at various stages of titration of a weak acid against a strong base and determination of pKa. Note: Compare the values of various physicochemical properties with marketed formulations wherever possible.",
            ]
        },
    ], false,
    [
        "Introduce basic laboratory techniques for determining physicochemical properties such as surface tension, viscosity, and density in pharmaceutical systems.",
        "Develop understanding of interfacial phenomena and surfactant behavior, including micelles, critical micellar concentration (CMC), and HLB in formulation design.",
        "Train students in evaluating disperse systems through sedimentation studies and the effect of suspending agents.",
        "Provide practical experience in powder characterization, including particle size distribution, density, flow properties, porosity, and the role of glidants.",
        "Develop skills in determining solubility, partition coefficient, buffer capacity, and related equilibria relevant to drug formulation.",
    ],
    [
        "Sinko, P. J. Martin’s Physical Pharmacy and Pharmaceutical Sciences. Lippincott Williams & Wilkins.",
        "Aulton, M. E. and Taylor, K. M. G. Aulton’s Pharmaceutics: The Design and Manufacture of Medicines. Elsevier.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Allen, L. V., Popovich, N. G. and Ansel, H. C. Ansel’s Pharmaceutical Dosage Forms and Drug Delivery Systems. Lippincott Williams & Wilkins.",
        "Cooper, S. J. and Gunn, C. Cooper and Gunn’s Tutorial Pharmacy. CBS Publishers & Distributors.",
    ]),
    s("BP212P SEC", "SEC Elective — Communication Skills / Mental Well-Being / Basic Computer Operations (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP212P SEC1 — Communication Skills (30 Hours)", topics: [
                "1. Introduction to Communication in Pharmacy; • Types of communication: verbal, non-verbal, written; • Importance in clinical, academic, and retail pharmacy",
                "2. Listening and Observation Skills Workshop; • Active listening techniques, barriers to listening; • Observation of cues: patient posture, tone, compliance",
                "3. Role-play: Communicating with a Patient for Dispensing a Prescription; • Explanation of dosage, frequency, side effects, and precautions",
                "4. Role-play: Handling Difficult Conversations (e.g., Angry Patient or Confused Elderly); • Empathy, patience, tone modulation, de-escalation techniques",
                "5. Written Communication I: Professional Email Writing & Documentation; • Writing emails to doctors, suppliers, institutions; • Structure, etiquette, and clarity in pharmacy communications",
                "6. Written Communication II: Preparing Patient Information Leaflets and Drug Labels; • Use of simple language, drug facts, precautions, icons; • Creating flyers for common conditions (e.g., diabetes, asthma)",
                "7. Non-verbal Communication Skills; • Body language, eye contact, gestures, tone of voice; • Cross-cultural sensitivity in pharmacy communication",
                "8. Presentation Skills I – Basic Techniques; • Voice projection, clarity, use of visuals; • Individual practice with simple pharmacy topics",
                "9. Presentation Skills II – Group Presentations; • Topics: health awareness campaigns, drug education, OTC safety; • Peer and faculty feedback",
                "10. Patient Counseling Practice (Case-Based); • Counseling for chronic illness (e.g., hypertension, diabetes); • Role-playing real-life counseling situations",
                "11. Communicating with Healthcare Professionals; • Case handoff, drug information request, referral writing; • Using SBAR (Situation, Background, Assessment, Recommendation) format",
                "12. Mock Interview / Group Discussion Practice; • Industry/clinical job interview scenarios; • GD on topics like “Generic vs Branded Medicines”",
                "13. Digital Communication Skills for Pharmacists; • Creating a simple health blog, social media awareness post; • Basics of teleconsultation and ePharmacy chat support",
                "14. Ethics and Professionalism in Communication; • Confidentiality, patient rights, informed consent; • Role-play ethical dilemmas in pharmacy",
                "15. Assessment & Reflection; • Final presentation or counseling demo; • Feedback, self-evaluation, and faculty observation",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP212P SEC2 — Mental Well-Being, Stress & Conflict Management (30 Hours)", topics: [
                "1. Self-assessment of stress levels using Perceived Stress Scale (PSS)",
                "2. Journaling activity: Maintain a 7-day emotional diary",
                "3. Mindfulness breathing exercise and reflection",
                "4. Guided meditation session and feedback form",
                "5. Time management activity using Eisenhower Matrix",
                "6. Role-play exercise on workplace conflict resolution",
                "7. SWOT analysis of personal behavior and coping mechanisms",
                "8. Cognitive restructuring worksheet for negative thoughts",
                "9. Group discussion: “How do you respond to stress?”",
                "10. Conflict styles self-test (Thomas-Kilmann Conflict Mode Instrument)",
                "11. Visualization technique to reduce anxiety",
                "12. Progressive muscle relaxation practice",
                "13. Team activity: Building trust through icebreakers and communication",
                "14. Reflection report after practicing gratitude for 5 days",
                "15. Case study analysis: Conflict scenario in a healthcare/pharma setup",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Option 3: BP212P SEC3 — Basic Computer Operations & Information Technology (30 Hours)", topics: [
                "General Instruction on Digital Tools Open-source digital tools are preferred for teaching and learning purposes. However, institutions may choose appropriate software platforms, applications, or online services depending on availability, institutional policy, and infrastructure. The selected tools should enable students to perform the required digital and documentation tasks effectively. The specific software may vary, but the skills and competencies listed below must be achieved using suitable tools. Practical Components",
                "1. Basic operation and navigation of a computer operating system, including system settings and file explorer functions.",
                "2. Creating, renaming, organizing, moving, and deleting files and folders within a computer system.",
                "3. Preparing a structured academic or pharmacy-related report using a word-processing application with appropriate formatting, tables, headers, and page layout.",
                "4. Inserting equations, images, and formatted elements while preparing documents such as reports, notices, or certificates using document editing tools.",
                "5. Creating spreadsheets for pharmacy-related calculations such as dose calculations, inventory records, or sales data using spreadsheet applications.",
                "6. Applying basic spreadsheet formulas and functions such as summation, averaging, conditional calculations, and counting operations.",
                "7. Generating graphs, charts, and data visualizations from experimental or pharmaceutical data using spreadsheet tools.",
                "8. Preparing a short academic presentation (approximately five slides) using presentation software with text, images, and basic design elements.",
                "9. Performing effective internet browsing and academic search techniques using online scientific literature databases and search platforms.",
                "10. Writing and sending professional emails including file attachments, proper subject lines, and appropriate use of CC and BCC with correct communication etiquette.",
                "11. Introduction to digital systems used in pharmacy practice such as billing, inventory management, or prescription management through demonstration or simulation.",
                "12. Using cloud-based storage platforms for saving, organizing, and sharing academic or pharmacy-related files and data.",
                "13. Exploring digital health technologies such as pharmacy-related mobile applications or electronic health tools used in healthcare practice.",
                "14. Accessing and utilizing online learning platforms for professional education and course materials.",
                "15. Preparing and submitting digital assignments using word-processing, spreadsheet, or presentation tools.",
            ]
        },
    ], false,
    [
        "Enhance verbal and non-verbal communication skills in academic, clinical, and professional pharmacy settings.",
        "Develop competence in patient counselling, prescription communication, and interprofessional dialogue.",
        "Promote empathetic and ethical communication in diverse cultural and patient contexts.",
        "Use digital tools and professional formats (e.g., email, reports, posters) for effective communication.",
        "Foster confidence, active listening, and clarity in pharmacy-related presentations and conversations.",
        "Introduce students to the concepts of mental well-being and stress.",
    ],
    [
        "1. Communication Skills in Pharmacy Practice – E. M. Kelly & S. L. Svarstad, Lippincott Williams & Wilkins",
        "Developing Communication Skills for Pharmacy – Catherine Langford, Pharmaceutical Press",
        "1. The Relaxation and Stress Reduction Workbook – Martha Davis, Elizabeth Robbins Eshelman & Matthew McKay, New Harbinger Publications",
        "Managing Stress: Principles and Strategies for Health and Well-Being – Brian Luke Seaward, Jones & Bartlett Learning",
        "Emotional Intelligence – Daniel Goleman, Bantam Books",
        "The 7 Habits of Highly Effective People – Stephen R. Covey, Simon & Schuster",
        "Conflict Management: A Practical Guide to Developing Negotiation Strategies – Barbara A. Budjac Corvette, Pearson Education",
        "Mindfulness: An Eight-Week Plan for Finding Peace in a Frantic World – Mark Williams & Danny Penman, Rodale Books",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 3
// ─────────────────────────────────────────────────────────────
const SEM3: Subject[] = [
    s("BP301T", "Introduction to Machine Learning in Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Foundations of Machine Learning", topics: [
                "Definition and scope of Artificial Intelligence, Machine.",
                "Learning, and Data Science.",
                "TYPES OF MACHINE LEARNING: supervised, unsupervised, and reinforcement learning.",
                "Features and labels, training data and testing data.",
                "Concept of model building and prediction.",
                "Train-test split, overfitting and underfitting.",
                "Conceptual explanation of bias-variance trade-off.",
                "Overview of the basic ML workflow.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Regression Models in Healthcare", topics: [
                "Overview of the concepts in predictive modeling for continuous outcomes, with emphasis on interpretation of outputs, and applications in pharmaceutical sciences.",
                "Linear regression and multiple linear regression.",
                "Model coefficients and their interpretation.",
                "Residuals and goodness-of-fit.",
                "Performance metrics such as Mean Squared Error (MSE), Root Mean Squared Error (RMSE), R² score.",
                "Implementation of regression models on pharmaceutical data ( e.g. dose–response relationships, predicting drug dissolution rates, estimating PK parameters), and demonstration of predictive modeling using python libraries such as sklearn.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Classification Models in Clinical Applications", topics: [
                "Overview of the following ML models used for categorical prediction, with emphasis on conceptual understanding, interpretation of outputs and applications in pharmaceutical sciences.",
                "Logistic regression.",
                "Probability output and threshold selection.",
                "Confusion matrix.",
                "Accuracy, sensitivity, specificity, precision, recall.",
                "Intuitive understanding of ROC curve and AUC, and kNearest Neighbors.",
                "Demonstration of predictive modeling using pharmaceutical and clinical examples such as predicting adverse drug reactions, disease risk prediction, binary therapeutic outcome modeling.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Tree-based Models & Ensemble Learning", topics: [
                "Overview of the following ML models with emphasis on intuitive and conceptual understanding.",
                "Decision Trees (structure and splitting criteria), interpretation of decision paths and feature importance.",
                "Random Forest, overview of ensemble concept.",
                "Advantages and limitations of tree-based models.",
                "Demonstration of these models for pharmaceutical and clinical applications such as ADR risk stratification, Patient classification, Predicting treatment outcomes etc.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Unsupervised Learning & Practical Case Studies", topics: [
                "Overview of the unsupervised learning with emphasis on intuitive and conceptual understanding of pattern recognition and clustering, and their applications in pharmaceutical sciences.",
                "Concept of unsupervised learning.",
                "Clustering overview, K-means clustering, choosing number of clusters, Interpreting cluster outputs.",
                "Mini-case study integrating regression, classification, or clustering on healthcare datasets to demonstrate Patient segmentation, and drug grouping based on properties.",
            ]
        },
    ], true,
    [
        "Introduce the fundamental concepts of Artificial Intelligence, Machine Learning, and Data Science and their relevance to pharmaceutical sciences.",
        "Develop conceptual understanding of machine learning workflows, including model building, training–testing strategies, and evaluation.",
        "Explain the principles and applications of regression models for predicting continuous outcomes in pharmaceutical and healthcare data.",
        "Familiarize students with classification and tree-based models used for clinical prediction and decision-making.",
        "Introduce unsupervised learning techniques and demonstrate their applications in pattern recognition and healthcare data analysis.",
    ],
    [
        "James, G., Witten, D., Hastie, T. and Tibshirani, R. An Introduction to Statistical Learning with Applications in Python. Springer. Available at: statlearning.com.",
        "Simon, G. J. and Aliferis, C. Artificial Intelligence and Machine Learning in Health Care and Medical Sciences: Best Practices and Pitfalls. Springer.",
        "Brown, N. Artificial Intelligence in Drug Discovery. Royal Society of Chemistry.",
        "Walters, S. J., Campbell, M. J. and Machin, D. Medical Statistics: A Textbook for the Health Sciences. Wiley-Blackwell.",
        "Géron, A. Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow. O’Reilly Media.",
    ]),
    s("BP302T", "Environmental Sciences", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Environmental Pollution", topics: [
                "Definition, scope, and importance of environmental studies.",
                "Types, causes, effects, and control measures of Air, water, soil, noise, and nuclear pollution.",
                "Solid waste and hazardous waste management in pharmaceuticals.",
                "Role of pharmacists in conservation and sustainable use of resources.",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Pharmaceutical Waste and Effluent Management", topics: [
                "TYPES OF PHARMACEUTICAL WASTE: chemical, expired drugs, packaging, biomedical waste.",
                "Biomedical Waste Management Rules (2016) and CPCB guidelines.",
                "Effluent Treatment Plant (ETP) design and functioning.",
                "Water purification methods in pharmaceutical settings (RO, UV, distillation, filtration).",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Environmental Impact of the Pharmaceutical Industry", topics: [
                "Sources of pollution in pharmaceutical manufacturing.",
                "TYPES OF PHARMACEUTICAL WASTE: solid, liquid, and gaseous.",
                "Environmental risks of active pharmaceutical ingredients (APIs) and its dosage forms.",
                "Impact of pharmaceutical residues on ecosystems and human health.",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Sustainability in the Pharmaceutical Sector", topics: [
                "Principles of sustainable development in pharma.",
                "Principles and Practices of Green pharmacy.",
                "Energy conservation and resource optimization.",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Government Policies, Compliance, and Practical Exposure", topics: [
                "ENVIRONMENTAL LAWS: Environment (Protection) Act, 1986.",
                "Water (Prevention and Control of Pollution) Act.",
                "National Green Tribunal (NGT) and regulatory bodies (CPCB, SPCB).",
                "GOVERNMENT INITIATIVES: Swachh Bharat Abhiyan.",
                "River rejuvenation program- Namami Gange Programme.",
                "Jal Jeevan Mission.",
                "ISO-14000.",
            ]
        },
    ], false,
    [
        "Explain the environmental challenges and disaster risks relevant to human health and pharmaceutical activities.",
        "Demonstrate knowledge of waste management protocols and legal guidelines for pharmaceutical and biomedical waste handling.",
        "Apply technical understanding of effluent and sewage treatment technologies used in the pharmaceutical sector.",
        "Assess the ecological impact of APIs and recommend mitigation strategies for pollution control.",
        "Explain sustainable practices and energy-efficient operations within pharmaceutical industries.",
    ],
    [
        "1. Bharucha, E. Environmental Studies. University Grants Commission, New Delhi.",
        "Rajagopalan, R. Environmental Studies. Oxford University Press.",
        "Joseph, B. Environmental Studies. Tata McGraw Hill.",
    ]),
    s("BP303T", "Ethics and Universal Human Values", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Introduction to Value Education", topics: [
                "Concept, definition, and need for value education.",
                "Content and process of value education.",
                "Application of human values in everyday life.",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Self-exploration and Human Aspirations", topics: [
                "Self-exploration as a means of value education.",
                "Development of positive attitude and self-confidence.",
                "Right understanding of happiness and prosperity.",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Harmony in the Human Being", topics: [
                "Human being as more than just the physical body.",
                "Harmony between the Self (‘I’) and the Body.",
                "Understanding the coexistence of the Self and the Body.",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Harmony in the Individual and Society", topics: [
                "Understanding the needs of the Self and the needs of the Body.",
                "Activities of the Self and activities of the Body.",
                "Family as the basic unit of human interaction and the role of values in relationships.",
                "FOUNDATIONS OF RESPECT IN RELATIONSHIPS: affection, kindness, guidance, reverence, glory, gratitude, and love.",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Harmony in Society and Nature", topics: [
                "COMPREHENSIVE HUMAN GOAL: the five dimensions of human endeavour.",
                "Harmony in nature and the four orders in nature.",
                "Holistic perception of harmony in existence.",
            ]
        },
    ], false,
    [
        "Understand the concept, definition, scope, and need of Value Education in personal, social, and professional life.",
        "Develop self-exploration, positive attitude, confidence, and ethical sensitivity as foundations of value-based living.",
        "Comprehend the co-existence of Self (I) and Body and establish harmony between physical and psychological aspects.",
        "Analyze the importance of family, society, and relationships in promoting mutual respect, trust, and cooperation.",
        "Appreciate the concept of harmony in nature and existence, leading to sustainable and responsible human conduct.",
    ],
    [
        "Tripathi, A. N. Human Values. New Age International Publishers, New Delhi.",
        "Gaur, R. R., Asthana, R. and Bagaria, G. P. A Foundation Course in Human Values and Professional Ethics. Excel Books, New Delhi.",
        "Gaur, R. R., Asthana, R. and Bagaria, G. P. Teachers’ Manual for A Foundation Course in Human Values and Professional Ethics. Excel Books, New Delhi.",
        "Raghavan, V. Universal Human Values. Excel Books.",
        "Gaur, R. R., Sangal, R. and Bagaria, G. P. Human Values and Professional Ethics. Excel Books.",
        "Govindarajan, M., Natarajan, S. and Senthil Kumar, V. S. Engineering Ethics. Prentice Hall India.",
        "Velasquez, M. G. Business Ethics: Concepts and Cases. Pearson Education.",
    ]),
    s("BP304T", "General Pharmacology", 3, "T", [
        {
            num: "I", hours: "08 Hours", title: "Introduction to Pharmacology", topics: [
                "Definition, historical perspectives, branches of pharmacology and their scope, drug, nature and sources of drugs, International Classification of Diseases (ICD) and International Nonproprietary Names (INN) for drugs.",
                "Concept of generic medicines, essential drugs and rational drug use (RDU). Indian Government’s initiatives to promote these concepts.",
                "Routes of drug administration along with their advantages and disadvantages.",
            ]
        },
        {
            num: "II", hours: "07 Hours", title: "Pharmacokinetics", topics: [
                "Drug absorption, mechanisms of drug absorption, membrane transporters, bioavailability, bioequivalence, factors affecting drug absorption.",
                "Drug distribution in different compartments, volume of distribution, storage sites, plasma protein binding and its therapeutic importance.",
                "Drug biotransformation, microsomal, non- microsomal metabolism and cytochrome P450 enzyme system, phase I and II reactions, first-pass metabolism, entero-hepatic cycling, concept of prodrugs.",
                "Drug excretion and its kinetics.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Pharmacodynamics", topics: [
                "Types drug action and mechanisms of drug action, dose response relationship.",
                "Receptor theories, structure of receptors, classification and regulation of receptors, spare receptors. Concept of agonist, inverse agonist, partial agonist and antagonist.",
                "Signal transduction mechanisms of receptors.",
                "Factors modifying drug action including the concepts of tachyphylaxis, idiosyncrasy, drug tolerance, dependence, addiction, and the combined effect of drugs (Additive effect & Synergism).",
                "Adverse drug reactions (ADR) and types of ADRs.",
                "Drug interaction, types, pharmacokinetic and pharmacodynamic drug-drug interactions.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Overview of Drug Discovery and Evaluation of New Drug", topics: [
                "Brief discussion on drug discovery and preclinical evaluation of new drugs.",
                "HUMAN RELEVANT SCREENING TECHNIQUES: Reconstructed human epidermis, organ-on- Chip model, skin irritancy test by reconstructed corneal epithelium, skin corrosivity testing by Direct.",
                "Peptide Reactivity Assay.",
                "Advantages and disadvantages of in vitro and in silico Pharmacological screening and evaluation.",
                "Recent trends in pharmacology.",
                "CHRONOPHARMACOLOGY: Introduction, biological clock, types of rhythms, hormones, diseases and drugs affected by circadian rhythm. Introduction to chrono kinetics and importance of chronotherapeutic and future scope.",
                "Introduction, general principles, applications and scope of Pharmacogenomics, Gene therapy, Biosimilars and Precision medicine.",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Toxicology", topics: [
                "Introduction to toxicology and its branches.",
                "Classification of poisons based on actions and lethal doses, types of antidotes.",
                "General principles of treatment of acute poisoning include heavy metal poisoning. Management of poisoning.",
                "Definition and basic knowledge of preclinical toxicity testing-acute toxicity, sub-acute toxicity, combined chronic and carcinogenicity testing as per OECD norms.",
                "Basic understanding of principles of genotoxicity and teratogenicity as per OECD guidelines.",
                "Definition and concepts of safety pharmacology as per.",
                "ICH and OECD guidelines.",
            ]
        },
    ], false,
    [
        "To provide a foundational understanding of the history of pharmacology, focusing on the evolution of drug discovery and development.",
        "Introducing the concepts of pharmacodynamics and pharmacokinetics, helping students understand the mechanisms of drug action, absorption, distribution, metabolism, and excretion.",
        "To familiarize students with the principles behind new drug development, including preclinical testing, drug screening methods, and safety pharmacology.",
        "To enable students to learn about toxicity testing, ensuring they understand different methods of evaluating drug safety and the regulatory guidelines involved in toxicity assessment.",
        "To prepare students for understanding the pharmacology of different therapeutic drug classes, by applying basic pharmacological knowledge to current trends in drug development and screening.",
    ],
    [
        "Brunton, L., Hilal-Dandan, R. and Knollmann, B. Goodman and Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill Education.",
        "Rang, H. P., Dale, M. M., Ritter, J. M., Flower, R. J. and Henderson, G. Rang and Dale’s Pharmacology. Elsevier.",
        "Katzung, B. G. and Trevor, A. J. Basic and Clinical Pharmacology. McGraw-Hill Education.",
        "Whalen, K. and Finkel, R. Lippincott’s Illustrated Reviews: Pharmacology. Wolters Kluwer.",
        "Tripathi, K. D. Essentials of Medical Pharmacology. Jaypee Brothers Medical Publishers.",
    ]),
    s("BP305T", "Heterocyclic Compounds and Stereochemistry", 3, "T", [
        {
            num: "I", hours: "15 Hours", title: "Chemistry of Carboxylic Acids, Phenols, Amines and Polynuclear", topics: [
                "Aromatic hydrocarbons.",
                "Aliphatic and aromatic carboxylic acids.",
                "Methods to prepare carboxylic acids (Oxidation of alcohols, carbonation of Grignard reagent, Kolbe-Schmidt reaction).",
                "Study of acidity of carboxylic acids and effect of substituents on acidity.",
                "Study of chemical reactions of carboxylic acids [Mechanism of nucleophilic acyl substitution, Decarboxylation and Hell-VolhardZelinsky reaction]. Pharmaceutical applications of aromatic carboxylic acids (Benzoic acid, Salicylic acid, Acetyl Salicylic acid).",
                "Aliphatic and aromatic amines.",
                "Methods to prepare amines (Reduction of nitro compound, reduction of nitriles and Hofmann degradation of amides).",
                "Study of basicity of amines and effect of substituents on basicity.",
                "Study of mechanism a n d synthetic applications of diazonium salts including Sandmeyer’s and azo-dye coupling reaction.",
                "Alcohols and Phenols.",
                "Classification of alcohols, methods to prepare alcohols.",
                "(oxymercuration - demercuration, reduction of carbonyl compounds).",
                "Acidity of alcohols and Phenols including effect of substituent on acidity.",
                "Definition of phenols, method to prepare phenols by cumene process.",
                "Comparison of the acidity of phenol vs alcohol.",
                "Study of mechanism of chemical reactions of phenols (ReimerTiemann reaction, halogenation and nitration of phenols).",
                "Pharmaceutical applications of alcohols and phenols (Glycerine, Thymol, Paracetamol).",
                "Chemistry of polynuclear hydrocarbons Definition, and classification of polynuclear aromatic hydrocarbons, Study of synthesis (Haworth synthesis) and mechanism of electrophilic aromatic substitution reactions of naphthalene, phenanthrene and anthracene and medicinal uses of drugs containing Naphthalene (Propranolol, Naphazoline) and Phenanthrene.",
                "(Morphine, Codeine).",
            ]
        },
        {
            num: "II", hours: "7 Hours", title: "Optical Isomerism", topics: [
                "Definition of stereoisomerism and types of stereoisomerism with examples.",
                "Definition with examples for optical activity, origin of chirality, elements of symmetry, chiral and achiral molecules, enantiomerism, diastereoisomerism and meso compounds.",
                "Study of configuration including D & L system, sequence rules, R & S system. Medicinal importance of optical isomers with examples.",
                "Racemic mixture and resolution of racemic mixtures.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Geometrical Isomerism", topics: [
                "Nomenclature of geometrical isomers (Cis & Trans, E & Z, Syn & Anti system).",
                "Conformational isomerism and its analysis in ethane, butane and cyclohexane.",
                "Stereo isomerism in biphenyl compounds (Atropisomerism) and conditions for optical activity in biphenyl compounds.",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Chemistry of Five Membered Heterocycles", topics: [
                "IUPAC nomenclature and classification of heterocyclic compounds as per the Hansch- Widman system.",
                "Relative aromaticity and reactivity of pyrrole, furan and thiophene.",
                "Study of synthesis of pyrrole (Paal – Knorr synthesis), furan (FeistBénary reaction), thiophene (Hinsberg synthesis) and Mechanism of Electrophilic substitution reactions of pyrrole, furan and thiophene.",
                "Medicinal uses of drugs containing pyrrole (Ethosuximide, procyclidine), furan (Furosemide, Nitrofurazone) and thiophene.",
                "(Cephaloridine, Clopidogrel).",
            ]
        },
        {
            num: "V", hours: "07 Hours", title: "Chemistry of Other Heterocycles", topics: [
                "Study of nomenclature of fused heterocyclic compounds, synthesis for pyrazole (Knorr synthesis), imidazole (Debus-Radziszewski reaction), pyridine (The Hantzsch synthesis), quinoline (The Skraup synthesis) and Electrophilic aromatic substitution reactions of pyrazole and imidazole.",
                "Chemical structures of Indole, pyrimidine, benzimidazole, purine, azepine, pyrazole, oxazole, Phenothiazine, benzotriazole, quinoxaline.",
                "Basicity of imidazole, pyridine and quinolone.",
                "Medicinal uses of any two drugs containing pyrazole (Sildenafil, Celecoxib), imidazole (Metronidazole, Pilocarpine), pyridine (Isoniazid, Chlorpheniramine), quinoline (Chloroquine, Ciprofloxacin), indole (Indomethacin, Reserpine), benzimidazole (Albendazole, Mebendazole) pyrimidine (Fluorouracil, Sulphadiazine), purine (Mercaptopurine, Thioguanine), azepine.",
                "(Diazepam, Loxapine) heterocycles.",
            ]
        },
    ], false,
    [
        "Understand Chemistry of Carboxylic acids, Phenols, Amines and Polynuclear Aromatic hydrocarbons",
        "Explain the concepts of optical isomerism and their pharmaceutical significance.",
        "Explain the concepts of Geometrical isomerism and their pharmaceutical significance",
        "Know about IUPAC nomenclature and Chemistry of heterocycles",
        "Equip students with knowledge of organic reaction mechanisms and their applications in drug synthesis.",
    ],
    [
        "1. Finar, I. L. Organic Chemistry, Vol. 1. Pearson Education.",
        "Finar, I. L. Organic Chemistry: Stereochemistry and Natural Products, Vol. 2. Pearson Education.",
        "Smith, M. B. and March, J. March’s Advanced Organic Chemistry: Reactions, Mechanisms and Structure. Wiley.",
        "Bahl, B. S. and Bahl, A. Textbook of Organic Chemistry. S. Chand.",
        "Nadendla, R. R. Pharmaceutical Organic Chemistry: Heterocyclic and Natural Products. Vallabh Prakashan.",
        "Gilchrist, T. L. Heterocyclic Chemistry. Prentice Hall.",
        "Eliel, E. L. and Wilen, S. H. Stereochemistry of Organic Compounds. Wiley.",
    ]),
    s("BP306T", "Pharmaceutical Dosage Forms I", 3, "T", [
        {
            num: "I", hours: "07 Hours", title: "No", topics: [
                "FUNDAMENTALS OF DOSAGE FORM DEVELOPMENT",
                "PRE-FORMULATION STUDIES: concept, need, and parameters including solubility, pKa, physical nature (amorphous and crystalline), polymorphism, particle size and shape, and powder flow parameters.",
                "DRUG: excipient compatibility studies.",
                "Packaging selection for various dosage forms.",
                "Drug product and container-closure interaction.",
                "Introduction to stability guidelines of new drug substances and products.",
                "(ICH Q1).",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Compressed Solids", topics: [
                "Tablets Excipients (roles and examples); tooling (types and specifications); manufacturing methods and equipment; tablet defects and remedies; inprocess quality control (IPQC); finished-product tests; packaging.",
                "Tablet Coating Types of coating (sugar, film, compression, enteric); need, advantages, and limitations; polymers, process specifications, and equipment; coating defects; quality control of coated tablets.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Finely Divided and Filled Solids", topics: [
                "MEDICATED POWDERS AND GRANULES: formulation considerations, manufacturing processes (mixing, granulation), quality control, and packaging.",
                "GELATIN AND NON-GELATIN SHELLS: composition, empty shell manufacturing, quality control, and capsule sizes.",
                "HARD GELATIN CAPSULES: formulation design; filling methods (manual, semiautomatic, automatic); IPQC and finished-product tests; packaging.",
                "SOFT GELATIN CAPSULES: shell composition and plasticizers; fill materials; manufacturing methods (rotary die and others); defects; quality control and stability.",
            ]
        },
        {
            num: "IV", hours: "07 Hours", title: "Modified-release Solids", topics: [
                "TYPES OF TABLETS: sustained-release and controlled-release tablets.",
                "Concept, need, advantages, and disadvantages.",
                "Formulation design and drug-release mechanisms.",
                "Polymers used for sustained and controlled release.",
                "Evaluation of modified-release dosage forms.",
            ]
        },
        {
            num: "V", hours: "07 Hours", title: "Microencapsulation", topics: [
                "Concept, need, advantages, and disadvantages.",
                "METHODS OF MICROENCAPSULATION: spray drying, spray congealing, extrusion and spheronisation, fluidized bed coating, and phase-separation coacervation.",
                "Evaluation of microcapsules.",
            ]
        },
    ], false,
    [
        "Understand the fundamentals of dosage form development, including pre-formulation studies, drug–excipient compatibility, and stability considerations as per ICH guidelines.",
        "Acquire knowledge of formulation and manufacturing of compressed solid dosage forms, including tablets and coated tablets, along with quality control and packaging.",
        "Develop competence in the formulation and evaluation of finely divided and filled solid dosage forms, such as powders, granules, and hard and soft gelatin capsules.",
        "Understand the principles and formulation strategies of modified-release solid dosage forms, including sustained-release and controlled-release systems.",
        "Gain knowledge of microencapsulation techniques, their applications, advantages, limitations, and evaluation of microcapsules in pharmaceutical products.",
    ],
    [
        "Allen, L. V., Popovich, N. G. and Ansel, H. C. Ansel’s Pharmaceutical Dosage Forms and Drug Delivery Systems. Lippincott Williams & Wilkins.",
        "Aulton, M. E. and Taylor, K. M. G. Aulton’s Pharmaceutics: The Design and Manufacture of Medicines. Elsevier.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Troy, D. B. and Beringer, P. Remington: The Science and Practice of Pharmacy. Pharmaceutical Press.",
        "Robinson, J. R. and Lee, V. H. L. Controlled Drug Delivery: Fundamentals and Applications. CRC Press.",
        "Sinko, P. J. Martin’s Physical Pharmacy and Pharmaceutical Sciences. Lippincott Williams & Wilkins.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
        "United States Pharmacopeia. United States Pharmacopeial Convention.",
        "British Pharmacopoeia. British Pharmacopoeia Commission.",
    ]),
    s("BP307T", "Pharmaceutical Engineering", 3, "T", [
        {
            num: "I", hours: "12 Hours", title: "Unit Operations Associated with Solids", topics: [
                "Principle, construction, working, advantages and disadvantages and Pharmaceutical applications of size reduction, size separation and mixing equipment.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Unit Operations Associated with Liquids", topics: [
                "Principle, construction, working, advantages and disadvantages and Pharmaceutical applications of filtration, crystallization and centrifugation equipment.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Unit Operations Associated with Heat Transfer", topics: [
                "Principle, construction, working, advantages and disadvantages and Pharmaceutical applications of evaporation, drying, distillation and Heat transfer equipment.",
            ]
        },
        {
            num: "IV", hours: "05 Hours", title: "Materials and Material Handling", topics: [
                "Introduction to material handling equipment and techniques, Conveyors, hoists, and automated guided vehicles (AGVs), Storage systems: bins, silos in warehouses, Safety considerations in material handling and waste management. Types of corrosion and their impact on pharmaceutical processes and environment.",
            ]
        },
        {
            num: "V", hours: "04 Hours", title: "Flow of Fluids", topics: [
                "Types and measurement of flow, manometers, Reynolds number and its significance, Bernoulli’s theorem and its applications, Orifice meter, Venturimeter, Pitot tube and Rotometer.",
            ]
        },
    ], false,
    [
        "Provide fundamental knowledge of pharmaceutical engineering principles and common unit operations involved in solid and liquid pharmaceutical manufacturing.",
        "Develop an understanding of thermal operations such as drying, evaporation, distillation, and heat transfer used in pharmaceutical processing.",
        "Introduce material handling systems, corrosion control, and waste management practices relevant to pharmaceutical plants.",
        "Explain the principles of fluid flow and flow measurement used in pharmaceutical process equipment.",
        "Develop knowledge of the design, construction, working principles, and pharmaceutical applications of engineering equipment used in the pharmaceutical industry.",
    ],
    [
        "1. Banker, G. S. Pharmaceutical Engineering. Marcel Dekker.",
        "Sambamurthy, K. Introduction to Pharmaceutical Engineering. New Age International.",
        "Kennedy, T. F. Good Design Practices for GMP Pharmaceutical Facilities. CRC Press.",
        "Banker, G. S. and Rhodes, C. T. Modern Pharmaceutics. CRC Press.",
        "Hickey, A. J. Pharmaceutical Process Engineering. CRC Press.",
        "Cole, G. C. Pharmaceutical Facilities: Design, Layouts and Validation. CRC Press.",
        "Bertch, F. J. Fundamentals of Modern Pharmaceutical Process Engineering. Academic Press.",
        "Chase, A. G. Environmental Management in the Pharmaceutical Industry. Springer.",
        "Bunn, G. Pharmaceutical Production Facilities: Design and Applications. CRC Press.",
    ]),
    s("BP308T", "Pharmaceutical Microbiology", 3, "T", [
        {
            num: "I", hours: "09 Hours", title: "Introduction and Role of Microorganisms in Pharmaceutical Industry", topics: [
                "FUNDAMENTALS OF MICROBIOLOGY: Microorganisms and medicines, Introduction to various microorganisms, Microbial cultivation, isolation and enumeration.",
                "Pharmaceutical importance of microorganisms.",
                "Introduction to Microscope (Compound and Electron Microscope).",
                "Identification of bacteria using staining techniques (simple, Gram‘s &Acid-fast staining) and biochemical tests (IMViC).",
                "Antibiotics p r o d u c e d by microbiology (Production and uses streptomycin, cephalosporin).",
            ]
        },
        {
            num: "II", hours: "09 Hours", title: "Evaluation of Microbiological Contamination", topics: [
                "Sources and types of microbial contaminant.",
                "Control of microbial contamination during manufacture of Nonsterile dosage forms and sterile dosage forms (including Aseptic area), control of Atmosphere, Water, Raw material, Facility, Packaging, Equipment.",
                "Microbiological spoilage of pharmaceuticals, Factors affecting microbial spoilage of pharmaceuticals.",
                "Introduction to Fermentation, types and fermenters.",
            ]
        },
        {
            num: "III", hours: "09 Hours", title: "Microbial Control and Evaluation", topics: [
                "Designing of aseptic area. Laminar flow equipment’s, clean area classification, Biological Safety Level categories. Methods of prevention.",
                "Disinfectants, antiseptics, and preservatives, and their evaluation, Factors affecting the antimicrobial activity of disinfectants.",
            ]
        },
        {
            num: "IV", hours: "09 Hours", title: "Sterilization Procedures, Assurance and Evaluation", topics: [
                "Physical, chemical, gaseous, radiation and mechanical methods of sterilization, Advances sterilization technologies, Evaluation of efficiency of sterilization; Validation of sterilization procedures and Sterility indicators.",
                "Sterility assurance, Bioburden determination, Modelling in predicting microbial growth and death, Test for bacteriostatic, bactericidal activity.",
            ]
        },
        {
            num: "V", hours: "09 Hours", title: "Microbiological Quality Control", topics: [
                "Microbial limit tests and Microbial assay (antibiotics, vitamins and amino acids).",
                "Sterility testing of products according to IP, BP and USP.",
                "Methods for monitoring Water and Air Quality In vitro cell cultures, general procedure for cell culture, Application of cell cultures in pharmaceutical industry and research.",
            ]
        },
    ], false,
    [
        "Introduce the fundamental concepts of microbiology and its relevance to pharmaceutical sciences.",
        "Provide insights into the industrial application of microorganisms in the manufacture of pharmaceutical products.",
        "Provide knowledge Good Manufacturing Practices (GMP) related to microbial contamination control.",
        "Provide understanding in microbial evaluation techniques such as sterility testing, microbial limit tests, and microbial assay.",
        "Familiarize students with sterilization technologies, microbial spoilage control, and in vitro cell culture techniques for pharmaceutical research and quality assurance.",
    ],
    [
        "1. Pelczar, M. J., Chan, E. C. S. and Krieg, N. R. Microbiology: Concepts and Applications. McGraw-Hill.",
        "Prescott, L. M., Harley, J. P. and Klein, D. A. Microbiology. McGraw-Hill.",
        "Hugo, W. B. and Russell, A. D. Pharmaceutical Microbiology. Blackwell Science.",
        "Waites, M. J., Morgan, N. L., Rockey, J. S. and Higton, G. Industrial Microbiology: An Introduction. Blackwell Science.",
        "Denyer, S. P., Hodges, N. A. and Gorman, S. P. Hugo and Russell’s Pharmaceutical Microbiology. Wiley-Blackwell.",
        "Atlas, R. M. Handbook of Microbiological Media. CRC Press.",
        "Sandle, T. Pharmaceutical Microbiology: Essentials for Quality Assurance and Quality Control. Elsevier.",
        "Sutton, S. V. W. Microbiology in Pharmaceutical Manufacturing. PDA/DHI Publishing.",
    ]),
    s("BP309P", "General Pharmacology (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "1. To describe the contributions of renowned pharmacologists and their discoveries based on pharmacological experiments (Any 5 Noble Laureates whose research contributed to the development of Pharmacology).",
                "2. To study various laboratory safety precautions, hazards, personal hygiene, commonly used tools, devices and instruments in experimental pharmacology.",
                "3. To study common experimental animals including transgenic animals along with their applications in the pharmacological experiments in current drug discovery paradigm.",
                "4. To study concept of 6Rs along with the maintenance and experimentation on laboratory animals as per the CCSEA guidelines.",
                "5. To demonstrate collection/isolation of DNA and RNA using computer simulations and audiovisual aids.",
                "6. To study important anaesthetics and euthanasia procedures for experimental animals.",
                "7. To demonstrate different routes drug administration using computer simulation and understand the significance of each route along with the maximum administrable dose.",
                "8. To study preparation of different types of physiological salt solutions (PSS), cell culture media and to understand the role of each ingredient used in PSS preparation.",
                "9. To study the instrumentation used for isolated tissue experiments (students organ bath assembly) and recent development in recording of the responses of isolated tissues.",
                "10. To record the dose response curve of any two agonists on suitable isolated tissue preparation using computer simulation experiment.",
                "11. To study the potentiating effect of physostigmine on DRC of acetyl choline through interactive computer simulation.",
                "12. To study antagonizing effect of d-tubocurarine on the DRCs of acetylcholine through interactive computer simulation.",
                "13. To determine of PD2 of given agonists using isolated tissue preparation using computer simulation experiment.",
                "14. To study and determine various pharmacokinetic parameters (Cmax, Tmax, Ke, t½, Vd, Clt, AUC, AUMC) from given hypothetical data.",
                "15. To estimate LD₅₀ using hypothetical data through computer-simulated experimentation (as per OECD 425 guideline) using software.",
                "16. Software based quantification of micronucleus test and chromosomal aberration test",
                "17. Software based prediction of teratogenicity.",
            ]
        },
    ], false,
    [
        "Understand the historical and foundational aspects of experimental pharmacology",
        "Develop knowledge and practical awareness of ethical and regulatory standards in laboratory animal care and use, as outlined in CCSEA guidelines",
        "Acquire skills in pharmacological data acquisition and analysis",
        "Interpret and construct dose-response curves (DRCs) and calculate and interpret pharmacological indices such as LD50, threshold and ceiling dose, slope of DRC, and PD₂,",
        "Calculate the pharmacokinetic parameters and analyse the roles of pharmacokinetic parameters in the drug effects, and dosing schedule.",
    ],
    [
        "Ghosh, M. N. Fundamentals of Experimental Pharmacology. Hilton & Company, Kolkata.",
        "Vogel, H. G. Drug Discovery and Evaluation: Pharmacological Assays. Springer.",
        "Hofmann, F. B. Handbook of Experimental Pharmacology (HEP Series). Springer Nature.",
        "Organisation for Economic Co-operation and Development. OECD Guidelines for the Testing of Chemicals.",
        "International Council for Harmonisation. ICH Guideline S7A: Safety Pharmacology Studies for Human Pharmaceuticals.",
        "International Council for Harmonisation. ICH Guideline S7B: Nonclinical Evaluation of the Potential for Delayed Ventricular Repolarization.",
    ]),
    s("BP310P", "Heterocyclic Compounds and Stereochemistry (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "2. Qualitative analysis of binary mixture of organic compounds (any two) (Acid + Neutral and Base + Neutral).",
                "3. To draw and visualize 3D structures, calculate molecular properties and to draw Chemical reactions using software tools",
            ]
        },
    ], false,
    [
        "Understand basic laboratory safety rules and learn how to handle chemicals and glassware properly.",
        "Gain hands-on experience in preparing, purifying, and identifying organic compounds.",
        "Learn practical techniques to separate components of binary organic mixtures.",
        "Learn digital tools for drawing chemical structures and Chemical Reactions.",
        "Determine molecular properties of aromatic organic and heterocyclic compounds",
    ],
    [
        "Furniss, B. S., Hannaford, A. J., Smith, P. W. G. and Tatchell, A. R. Vogel’s Textbook of Practical Organic Chemistry. Pearson Education.",
        "Mann, F. G. and Saunders, B. C. Practical Organic Chemistry. Pearson Education.",
        "Pavia, D. L., Lampman, G. M. and Kriz, G. S. Introduction to Organic Laboratory Techniques: A Small Scale Approach. Brooks/Cole.",
    ]),
    s("BP311P", "Pharmaceutical Dosage Forms I (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Preformulation study of any drug/excipient as per pharmacopoeia.",
                "2. Evaluation of powder flow properties for tablet blends.",
                "3. Evaluation of effect of lubricating agents on powder flow properties.",
                "4. Preparation and evaluation of tablets by direct compression.",
                "5. Preparation and evaluation of tablets by dry granulation.",
                "6. Preparation and evaluation of tablets by wet granulation.",
                "7. Quality control of marketed tablets (IR, coated, enteric-coated).",
                "8. Preparation and evaluation of coated tablets.",
                "9. Comparison of dissolution profiles of marketed preparations.",
                "10. Preparation and evaluation of hard-/non-gelatin capsules (fill weight, disintegration).",
                "11. Virtual demonstration: hard-gelatin shell and soft-gel manufacturing (with overview of aseptic line/isolator).",
                "12. Evaluation of packaging materials: primary and secondary/tertiary.",
                "13. Preparation and evaluation of sustained-release tablets.",
                "14. Preparation and evaluation of enteric-coated tablets.",
            ]
        },
    ], false,
    [
        "Provide understanding on preformulation principles and evaluation of key parameters for drugs, excipients, and dosage forms.",
        "Provide understanding of drug–excipient compatibility testing during formulation development.",
        "Provide hands-on experience in manufacturing processes and evaluation for solid dosage forms.",
        "Provide hands-on experience in manufacturing processes and evaluation for sustained/controlled-release dosage forms and microcapsules.",
        "Provide fundamentals of packaging material evaluation.",
    ],
    [
        "1. Aulton, M. E. Aulton’s Pharmaceutics: The Science of Dosage Form Design. Elsevier.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Troy, D. B. and Beringer, P. Remington: The Science and Practice of Pharmacy. Pharmaceutical Press.",
        "Gibson, M. Pharmaceutical Preformulation and Formulation. CRC Press.",
        "Robinson, J. R. and Lee, V. H. L. Controlled Drug Delivery: Fundamentals and Applications. CRC Press.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
    ]),
    s("BP312P AEC", "AEC Elective — Nutraceuticals / Food Analysis / Yoga & Life Sciences (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP312P AEC1 — Nutraceuticals and Functional Foods (30 Hours)", topics: [
                "1. Identification and classification of nutraceuticals and functional foods from marketed products",
                "2. Preparation of a probiotic drink or yogurt using lactic acid bacteria",
                "3. Extraction of phytochemicals (flavonoids, alkaloids) from plant material",
                "4. Estimation of antioxidant activity using DPPH method",
                "5. Formulation of a herbal supplement capsule or powder",
                "6. Demonstration of dietary fiber content from cereals or vegetables",
                "7. Assessment of total polyphenol content using Folin–Ciocalteu reagent",
                "8. Label analysis of functional foods and dietary supplements (FSSAI standards)",
                "9. Case study presentation: Role of omega-3 fatty acids in cardiovascular health",
                "10. Demonstration of stability testing of a nutraceutical formulation",
                "11. Preparation of fortified food product (e.g., iron-fortified juice)",
                "12. Visit to a food testing laboratory or nutraceutical industry (or virtual tour)",
                "13. Evaluation of glycemic index of selected carbohydrate-rich foods (conceptual)",
                "14. Regulatory comparison of nutraceutical guidelines (FSSAI vs. FDA vs. EFSA)",
                "15. Preparation of a functional food label with nutrition facts and claims",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP312P AEC2 — Food Analysis (30 Hours)", topics: [
                "1. Determination of the acid value for the given oil/fat",
                "2. Determination of the ester value of the given oil/fat",
                "3. Determination of the saponification value of the given oil/fat",
                "4. Determination of total and free acidity in honey as per FSSAI method.",
                "5. Quantification of caffeine content in soft drinks.",
                "6. Determination of fat content in milk by gravimetric method",
                "7. Detection of starch and urea in milk as per FSSAI method.",
                "8. Assessment of fluoride content in drinking water",
                "9. Assessment of total hardness in drinking water",
                "10. Determination of the rancidity of the oil by UV Visible spectrophotometer",
                "11. Quantification of benzoic acid as preservative in beverages/jam/ jellies by titrimetric/spectrophotometric method.",
                "12. Isolation and identification of synthetic food colours by paper chromatography/Thin layer chromatography.",
                "13. Determination of total curcuminoid content in turmeric by UV visible spectrophotometer.",
                "14. Assessment of the total ash content for spices and condiments.",
                "15. Determination of gluten content in whole wheat/wheat flour.",
                "16. Determination of alcoholic acidity in bread and bread products.",
                "17. Determination of Caloric value of food and nutritional supplements.",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Option 3: BP312P AEC3 — Yoga and Life Sciences (30 Hours)", topics: [
                "1. Demonstration and practice of Surya Namaskar (Sun Salutation)",
                "2. Practice of basic asanas: Tadasana, Vrikshasana, Bhujangasana",
                "3. Practice of Pranayama techniques: Nadi Shodhana, Bhramari",
                "4. Meditation session: Focused awareness and breath control",
                "5. Yoga-based stretching and warm-up routine",
                "6. Recording physiological parameters (heart rate, BP) before and after yoga",
                "7. Yoga journal: Track weekly yoga practice and mood changes",
                "8. Poster presentation on “Scientific benefits of yoga on immunity”",
                "9. Yoga for specific health conditions: Back pain, asthma, stress",
                "10. Group chanting of Mantra – observation of mental state",
                "11. Learning the role of yoga in circadian rhythm regulation",
                "12. Visit to a yoga wellness center or attending a virtual session",
                "13. Assessment of flexibility using sit-and-reach test before/after practice",
                "14. Demonstration of Yog Nidra (guided relaxation technique)",
                "15. Case presentation: Impact of yoga on a chronic disease condition",
            ]
        },
    ], false,
    [
        "Introduce the concept and classification of nutraceuticals and functional foods.",
        "Explore the role of bioactive components in health promotion and disease prevention.",
        "Familiarize students with the formulation, labelling, and quality control of nutraceuticals.",
        "Understand the regulatory aspects governing nutraceuticals and dietary supplements.",
        "Develop practical skills in extraction, analysis, and preparation of functional foods.",
        "Understand to perform proximate analysis.",
    ],
    [
        "Functional Foods: Concept to Product by M. Guo, Woodhead Publishing (Elsevier)",
        "Handbook of Nutraceuticals and Functional Foods by Robert E.C. Wildman, CRC Press (Taylor & Francis Group)",
        "Nutraceuticals and Functional Foods in Human Health and Disease Prevention by Debasis Bagchi, CRC Press (Taylor & Francis Group)",
        "Functional Foods and Nutraceuticals: Sources and their Development Techniques by Rotimi E. Aluko, Springer Nature",
        "Dietary Supplements and Nutraceuticals: Market, s and Health Impacts by Yashwant Pathak, Academic Press (Elsevier)",
        "1. Food Analysis – Suzanne Nielsen, Springer",
        "Introduction to Food Analysis – S. Suzanne Nielsen, Springer",
        "Food Analysis: Theory and Practice – Y. Pomeranz & Clifton E. Meloan, Springer",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 4
// ─────────────────────────────────────────────────────────────
const SEM4: Subject[] = [
    s("BP401T", "Herbal Drug Technology", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Plant Tissue Culture and Standardized Extracts", topics: [
                "Plant tissue culture as an alternative source of medicine: Historical development, Types of cultures, Nutritional requirements.",
                "Growth and maintenance of callus and suspension culture.",
                "Role of elicitation, genetic transformation, biotransformation, precursor feeding, and somaclonal variation in biomass and secondary metabolite production.",
                "INTRODUCTION TO BIOMANUFACTURING: Medicinal plant–based biomanufacturing.",
                "Utilising plant factories in obtaining valuable ingredients for food, pharmaceutical, and cosmetic industries.",
                "EXAMPLES: Shikonin and Paclitaxel, Oral vaccines in healthcare Optimization and production of standardized extracts of medicinal plants:",
                "Strategies for preparation of desired quality extracts by optimizing and adjusting bioactives ensuring quality using analysis of metabolites and TLC fingerprints of the following.",
                "Aqueous and hydro-alcoholic extracts of Ashwagandha, Shatavari, Licorice, Neem, and Haritaki.",
                "Flavonoid-rich fraction of Sweet lime peel.",
                "Terpenoid-rich fraction of Bacopa.",
                "Phenol-rich fraction of Green Tea.",
                "Steroid-rich fraction of Tribulus.",
                "Alkaloid-rich fraction of Vasaka.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Herbal Formulations, Excipients and Cosmetics", topics: [
                "Herbal formulations.",
                "CONVENTIONAL HERBAL FORMULATIONS: syrups, mixtures, powders, capsules, tablets, creams, ointments.",
                "NOVEL DOSAGE FORMS: phytosomes (phytocomplexes), liposomes, nanoformulations.",
                "Composition, preparation, and characterization using standardized extracts and bioactives.",
                "Herbal cosmetics.",
                "Sources and description of raw materials of herbal origin as active agents in skincare, hair care, and oral hygiene products.",
                "Applications in skincare, hair care, and oral hygiene products such as: Sunscreen-lotion/gel, Hair oil, shampoo, herbal dye.",
                "Herbal mouthwash, chewing gums, candies, gargles.",
                "Face serums and herbal face packs.",
                "Excipients of Natural origin.",
                "Colorants, sweeteners, binders, diluents.",
                "Viscosity builders, disintegrants.",
                "Flavors and perfumes.",
                "Protective agents, waxes, bleaching agents and antioxidants.",
            ]
        },
        {
            num: "III", hours: "7 Hours", title: "Quality Control and Standardisation of Herbal Medicines", topics: [
                "WHO, AYUSH, and EU guidelines on quality control, stability, and shelf life studies of herbal medicines.",
                "Approaches for standardisation and quality control of botanicals and formulations.",
                "Testing methods and regulatory considerations.",
                "Role of DNA fingerprint and molecular markers such as rbcL, matK, and SCAR in quality control.",
                "FORENSIC PHARMACOGNOSY: Role in identification of illicit herbal drugs (e.g., Cannabis, Opium).",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Herb–drug / Food / Herb Interactions", topics: [
                "General introduction to interactions and role of ADME, Cytochrome P450, and P-gp.",
                "HERB: drug interactions: St. John’s Wort with warfarin, Ginkgo biloba with aspirin.",
                "HERB: food interactions: Licorice with salty foods, Turmeric with fats, Green tea with iron-rich foods.",
                "HERB: herb interactions: Ephedra with Ginseng, Chamomile with Valerian.",
                "Adverse reactions related to plants and foods such as allergy, intolerance, and toxicity.",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Regulatory Requirements of Herbal Drugs and Botanicals", topics: [
                "Regulatory framework in India for Herbal and ASU medicines: Role of regulatory bodies.",
                "ASU DTAB (Ayurveda, Siddha, and Unani Drugs Technical Advisory Board).",
                "ASU DCC (Drugs Consultative Committee for ASU drugs).",
                "SCHEDULE T: GMP requirements for ASU drugs.",
                "SCHEDULE E1: Poisonous drugs listed under AYUSH.",
                "DRUGS AND COSMETICS ACT: Regulatory provisions relevant to herbal/ASU medicines, procedures for registration, trade, and export.",
                "Concept of Phytopharmaceuticals and Ayush Aahara in bridging Indian traditional knowledge with modern science.",
            ]
        },
    ], false,
    [
        "Understand and apply plant tissue culture techniques and related approaches for biomass and secondary metabolite production.",
        "Introduce biomanufacturing concepts in herbal drug technology, including plant-based production systems and edible vaccines.",
        "Develop skills in the preparation and optimization of standardized herbal extracts using metabolite analysis and TLC fingerprinting.",
        "Study the formulation of herbal products using standardized extracts in conventional and novel dosage forms.",
        "Understand quality control, standardization, regulatory guidelines, and interaction studies for safe herbal drug development.",
    ],
    [
        "1. Waldesch, F. G. Herbal Medicinal Products. CRC Press.",
        "Indian Herbal Pharmacopoeia. Indian Drug Manufacturers’ Association.",
        "World Health Organization. Guidelines on Good Agricultural and Collection Practices (GACP) for Medicinal Plants.",
        "Drugs and Cosmetics Act and Rules (India). Government of India.",
    ]),
    s("BP402T", "Medicinal Chemistry", 3, "T", [
        {
            num: "I", hours: "7 Hours", title: "Fundamentals of Medicinal Chemistry and Drug Metabolism", topics: [
                "Classification, Structure, uses of drugs mentioned in the course, Structure activity relationship of selective class of drugs as specified in the course and Synthesis of selected drugs as superscripted (*).",
                "Fundamentals of Medicinal Chemistry.",
                "INTRODUCTION: History and scope of medicinal chemistry.",
                "Physicochemical properties in relation to biological action:",
                "Ionization, solubility, partition coefficient, hydrogen bonding, Chelation, Bioisosterism and protein binding.",
                "DRUG METABOLISM: Phase I & II reactions.",
            ]
        },
        {
            num: "II", hours: "15 Hours", title: "Drugs Acting on the Autonomic Nervous System", topics: [
                "ADRENERGIC OR SYMPATHOMIMETIC AGENTS: Nor-epinephrine, Epinephrine, Phenylephrine*, Dopamine, Methyldopa, Clonidine, Dobutamine, Isoproterenol, Terbutaline, Salbutamol*, Bitolterol, Naphazoline, Oxymetazoline and Xylometazoline, Hydroxyamphetamine, Pseudoephedrine, Propylhexedrine, Metaraminol.",
                "ANTI-ADRENERGIC OR SYMPATHOLYTIC AGENTS: Tolazoline*, Phentolamine, Phenoxybenzamine, Prazosin, Dihydroergotamine, Propranolol*, Metibranolol, Atenolol, Betazolol, Bisoprolol, Esmolol, Metoprolol, Labetalol, Carvedilol. SAR of beta adrenergic blockers.",
                "CHOLINERGIC OR PARASYMPATHOMIMETIC AGENTS: Acetylcholine, Carbachol*, Bethanechol, Methacholine, Pilocarpine, Physostigmine, Neostigmine, Pyridostigmine, Edrophonium chloride, Tacrine hydrochloride, Ambenonium chloride, Isofluorphate, Echothiophate iodide, Parathione, Malathion.",
                "Pralidoxime chloride.",
                "ANTI-CHOLINERGIC OR PARASYMPATHOLYTIC AGENTS: Atropine, Hyoscyamine, Scopolamine, Homatropine, Ipratropium*, Tropicamide, Cyclopentolate, Clidinium Glycopyrrolate, Dicyclomine*, Methantheline, Propantheline, Benztropine mesylate, Orphenadrine, Biperidine, Procyclidine, Tridihexethyl, Isopropamide, Ethopropazine, SAR of cholinergic blockers.",
                "LOCAL ANESTHETIC AGENTS: Cocaine, Hexylcaine, Meprylcaine, Cyclomethycaine, Piperocaine. Benzocaine, Butamben, Procaine*, Butacaine, Propoxycaine, Tetracaine, Benoxinate, Lignocaine, Mepivacaine, Prilocaine, Etidocaine, Phenacaine, Diperodon, Dibucaine.* SAR of Local anesthetics.",
            ]
        },
        {
            num: "III", hours: "09 Hours", title: "Drugs Acting on the Cardiovascular System", topics: [
                "ANTI-ANGINALS: Amyl nitrite, Nitroglycerin, Pentaerythritol, Isosorbide dinitrite*, Dipyridamole, Verapamil, Bepridil hydrochloride, Diltiazem, Nifedipine, Amlodipine, Felodipine, Nicardipine, Nimodipine.",
                "ANTI-HYPERTENSIVES: Timolol, Captopril, Lisinopril, Enalapril, Benazepril, Quinapril, Methyldopate,* Clonidine, Guanethidine, Guanabenz, Sodium nitroprusside, Diazoxide, Minoxidil, Reserpine, Hydralazine.",
                "Drugs to treat Congestive Heart Failure (CHF): Digoxin, Digitoxin, Nesiritide, Bosentan,Tezosentan.",
                "Anti-arrhythmics (Class I–IV): Quinidine sulphate, Procainamide, Disopyramide*, Phenytoin, Lidocaine, Tocainide, Mexiletine, Lorcainide, Amiodarone, Sotalol.",
            ]
        },
        {
            num: "IV", hours: "06 Hours", title: "Drugs Acting on Blood and Renal System", topics: [
                "ANTIHYPERLIPIDEMIC AGENTS: Fenofibrate*, Lovastatin, Cholesteramine and Cholestipol.",
                "COAGULANTS AND ANTI-COAGULANTS: Menadione, Acetomenadione, Warfarin, Anisindione, clopidogrel.",
                "DIURETICS: Acetazolamide*, Methazolamide, Dichlorphenamide, Chlorthiazide, Hydrochlorothiazide, Hydroflumethiazide, Cyclothiazide, Furosemide*, Bumetanide, Ethacrynic acid, Spironolactone, Triamterene, Amiloride. Mannitol. SAR of Thiazides.",
            ]
        },
        {
            num: "V", hours: "08 Hours", title: "Autacoids and Related Drugs", topics: [
                "Antihistamines.",
                "H1–antagonists: Diphenhydramine hydrochloride*, Dimenhydrinate, Doxylamines, Clemastine, Diphenylphyraline, Tripelenamine, Chlorcyclizine, Meclizine, Buclizine, Chlorpheniramine, Triprolidine, Phenindamine, Promethazine*, Trimeprazine, Cyproheptadine, Azatidine, Astemizole, Loratadine, Cetirizine, Levocetrizine Cromolyn.",
                "H2-ANTAGONISTS: Cimetidine*, Famotidine, Ranitidine.",
                "GASTRIC PROTON PUMP INHIBITORS: Omeprazole, Lansoprazole, Rabeprazole, Pantoprazole Non-Steroidal Anti-Inflammatory Drugs (NSAIDs), Antipyretics:",
                "Sodium salicylate, Aspirin, Diflunisal, Mefenamic acid*, Niflumic acid, Meclofenamate, Indomethacin, Sulindac, Tolmetin, Zomepirac, Diclofenac, Ketorolac, Ibuprofen*, Naproxen, Piroxicam, Phenacetin, Acetaminophen, Antipyrine, Phenylbutazone, Celecoxib, Etoricoxib, SAR of representative agents by class.",
            ]
        },
    ], false,
    [
        "Develop a comprehensive understanding of the fundamental principles of medicinal chemistry, including physicochemical properties, drug metabolism, and prodrug concepts.",
        "Classify and describe the chemical structures, therapeutic uses, and structure–activity relationships of drugs acting on the autonomic and cardiovascular systems.",
        "Apply the principles of structure–activity relationships (SAR) to explain and predict the pharmacological activity.",
        "Understand the synthetic pathways of drugs, emphasizing important reaction steps and chemical transformations.",
        "Analyze the relationship between drug structure and pharmacological activity in relation to therapeutic efficacy and safety.",
    ],
    [
        "1. Lemke, T. L., Williams, D. A. and Roche, V. F. Foye’s Principles of Medicinal Chemistry. Lippincott Williams & Wilkins.",
        "Beale, J. M., Thomas, J. T. and Duckett, M. H. Wilson and Gisvold’s Textbook of Organic Medicinal and Pharmaceutical Chemistry. Lippincott Williams & Wilkins.",
        "Abraham, D. J. and Griffin, J. L. Burger’s Medicinal Chemistry and Drug Discovery. Wiley.",
        "Patrick, G. L. An Introduction to Medicinal Chemistry. Oxford University Press.",
        "Lednicer, D. The Organic Chemistry of Drug Synthesis. Wiley.",
        "Furniss, B. S., Hannaford, A. J., Smith, P. W. G. and Tatchell, A. R. Vogel’s Textbook of Practical Organic Chemistry. Pearson Education.",
        "Brunton, L., Hilal-Dandan, R. and Knollmann, B. Goodman and Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill Education.",
        "Williams, D. A. Foye’s Principles of Medicinal Chemistry. Lippincott Williams & Wilkins.",
    ]),
    s("BP403T", "Pharmaceutical Biotechnology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Introduction to Pharmaceutical Biotechnology", topics: [
                "Introduction to biotechnology in pharmaceutical sciences; protein therapeutics; analytical characterization of proteins; monoclonal antibodies; antigens; enzyme immobilization; cell culture and immobilization techniques; pharmaceutical applications.",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Genetic Engineering and Recombinant DNA Technology", topics: [
                "Principles of genetic engineering; recombinant DNA technology; production of interferons, hepatitis-B vaccine, and insulin; polymerase chain reaction (PCR) and its applications; mutations and types of mutants.",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Microbial Biotransformation and Fermentation Technology", topics: [
                "Microbial biotransformation; fermentation principles and process control; industrial production of alcohol, penicillins, citric acid, and vitamin B₁₂; blood products—collection, processing, and storage.",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Gene Therapy, Genomics and Personalized Medicine", topics: [
                "Gene therapy—types and methodologies; delivery systems; ethical concerns and challenges; Human Genome Project; role of bioinformatics and artificial intelligence in personalized medicine.",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Immunology, Vaccines and Sera", topics: [
                "Basics of immunology; types and generations of vaccines; immunization strategies; vaccine preparation, evaluation, and standardization; regulatory aspects; sera therapy; marketed products; challenges and newer approaches.",
            ]
        },
    ], false,
    [
        "Understand and apply plant tissue culture techniques and related approaches for biomass and secondary metabolite production.",
        "Introduce biomanufacturing concepts in herbal drug technology, including plant-based production systems and edible vaccines.",
        "Develop skills in the preparation and optimization of standardized herbal extracts using metabolite analysis and TLC fingerprinting.",
        "Study the formulation of herbal products using standardized extracts in conventional and novel dosage forms.",
        "Understand quality control, standardization, regulatory guidelines, and interaction studies for safe herbal drug development.",
    ],
    [
        "1. Crommelin, D. J. A., Sindelar, R. D. and Meibohm, B. Pharmaceutical Biotechnology: Fundamentals and Applications. Springer.",
        "Walsh, G. Biopharmaceuticals: Biochemistry and Biotechnology. Wiley-Blackwell.",
        "Brown, T. A. Gene Cloning and DNA Analysis: An Introduction. Wiley-Blackwell.",
        "Glick, B. R., Pasternak, J. J. and Patten, C. L. Molecular Biotechnology: Principles and Applications of Recombinant DNA. ASM Press.",
        "Doran, P. M. Bioprocess Engineering Principles. Academic Press.",
        "Vogel, H. C. and Todaro, C. L. Fermentation and Biochemical Engineering Handbook. William Andrew.",
        "Primrose, S. B., Twyman, R. M. and Old, R. W. Principles of Gene Manipulation and Genomics. Wiley-Blackwell.",
        "Strachan, T. and Read, A. Human Molecular Genetics. Garland Science.",
        "Plotkin, S. A., Orenstein, W. A., Offit, P. A. and Edwards, K. M. Plotkin’s Vaccines. Elsevier.",
        "Kindt, T. J., Goldsby, R. A., Osborne, B. A. and Kuby, J. Kuby Immunology. W. H. Freeman.",
        "Janeway, C. A., Travers, P., Walport, M. and Shlomchik, M. Janeway’s Immunobiology. Garland Science.",
    ]),
    s("BP404T", "Social Pharmacy and Public Health", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Social Pharmacy and Public Health", topics: [
                "SOCIAL PHARMACY: Definition, scope, historical development, and importance. Social pharmacy as a multidisciplinary field.",
                "PUBLIC HEALTH: Definition, concepts, history, core functions, and ethical considerations.",
                "Interplay between Social Pharmacy and Public Health: The evolving role of the pharmacist in the public health arena.",
                "CONCEPT OF HEALTH AND DISEASE: WHO definition of health; dimensions of health – physical, mental, social, spiritual, and environmental.",
                "DETERMINANTS OF HEALTH: Social, economic, environmental, lifestyle, and healthcare service determinants and their impact on population health.",
                "HEALTH INDICATORS: Indicators used to measure health status and health outcomes in a population.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Health Systems, Policy, and Pharmacoepidemiology", topics: [
                "HEALTHCARE DELIVERY SYSTEMS: Overview of global healthcare systems.",
                "INDIAN HEALTHCARE SYSTEM: Structure, public and private sectors, primary, secondary, and tertiary levels of care.",
                "HEALTH POLICY: Introduction to health policy formulation and analysis; objectives of India’s National Health Policy.",
                "National Health Mission (NHM): NRHM and NUHM – goals, strategies, and impact on public health indicators.",
                "PHARMACOEPIDEMIOLOGY: Definition, aims, scope, and applications.",
                "Measures of Disease Frequency and Distribution: Incidence, prevalence, endemic, epidemic, pandemic; morbidity and mortality rates, Odds ratio and relative risk.",
                "INTRODUCTION TO BIOSTATISTICS: Role in public health; types of data; basic data presentation methods.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Preventive Healthcare, Health Promotion, and Communicable", topics: [
                "Diseases.",
                "LEVELS OF PREVENTION: Primordial, primary, secondary, and tertiary prevention with examples.",
                "Role of Pharmacists in Disease Prevention and Health Promotion:",
                "Immunization services, screening programs, lifestyle counselling.",
                "HEALTH EDUCATION: Definition, principles, methods, and importance; development of effective health education materials.",
                "Mother and Child Health (MCH): Antenatal care, postnatal care, breastfeeding, immunization schedules.",
                "COMMUNICABLE DISEASES: Modes of transmission, prevention, and control of tuberculosis, HIV/AIDS, malaria, dengue, typhoid, influenza; pharmacist’s role.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Non-communicable Diseases, Nutrition, Mental Health, and National", topics: [
                "Programs.",
                "Non-Communicable Diseases (NCDs): Diabetes, hypertension, cardiovascular diseases, chronic respiratory diseases, cancer; prevention and management.",
                "NUTRITION AND HEALTH: Balanced diet, macro- and micronutrients, malnutrition, nutritional deficiency disorders, food safety, and adulteration.",
                "MENTAL HEALTH: Common mental disorders, stigma, promotion of mental well-being; pharmacist’s role.",
                "NATIONAL HEALTH PROGRAMS IN INDIA: Programs related to MCH, NCDs, communicable diseases, tobacco control, and deafness prevention.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Environmental Health, Disaster Response and Global Health", topics: [
                "Pharmacoeconomics, Rational Use of Medicines, Professional Roles, and Future Trends.",
                "PHARMACOECONOMICS: Introduction, significance; Cost-Benefit Analysis (CBA), Cost-Effectiveness Analysis (CEA), Cost-Utility Analysis (CUA).",
                "Rational Use of Medicines (RUM): Definition, importance, problems of irrational drug use; pharmacist’s role.",
                "MEDICATION ADHERENCE: Factors affecting adherence, consequences of non-adherence, improvement strategies.",
                "DRUG MISUSE AND ABUSE: Alcohol, tobacco, opioids, prescription drug abuse; pharmacist’s role.",
                "Professionalism and Ethics in Social Pharmacy: Ethical dilemmas in public health pharmacy.",
                "DISASTER MANAGEMENT: Role of pharmacists.",
                "EMERGING TRENDS: Telepharmacy, digital health, personalized medicine, expanding public health responsibilities of pharmacists.",
            ]
        },
    ], false,
    [
        "Understand the concepts of social pharmacy, public health, and their interrelation.",
        "Identify the social determinants of health and their impact on health outcomes and medication use.",
        "Recognize the role of pharmacists in public health initiatives, health promotion, and disease prevention.",
        "To gain knowledge about the Indian healthcare system, national health policies, and important health programs.",
        "To understand basic epidemiological principles and their application in public health.",
    ],
    [
        "1. Anderson, S., Dedrick, R. and Tiffany, B. Community Pharmacy Practice for Public Health. McGraw-Hill Education.",
        "Desselle, S. Public Health and Pharmacy Practice. McGraw-Hill Education.",
        "Donyai, P. Social and Cognitive Pharmacy: Theory and Case Studies. Pharmaceutical Press.",
        "Gillam, S., Yates, J. and Badrinath, P. Essential Public Health: Theory and Practice. Cambridge University Press.",
        "Levin, B. L. and Hanson, A. Essentials of Public Health Pharmacy. Jones & Bartlett Learning.",
        "Park, K. Park’s Textbook of Preventive and Social Medicine. Banarsidas Bhanot Publishers.",
        "Schneider, M. J. Introduction to Public Health. Jones & Bartlett Learning.",
        "Taylor, K. and Harding, G. Pharmacy Practice. CRC Press.",
        "Wertheimer, A., Ibrahim, M. I. M. and Babar, Z. U. D. Social and Administrative Aspects of Pharmacy in Low- and Middle-Income Countries. Elsevier.",
    ]),
    s("BP405T", "Systemic Pharmacology I", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Pharmacology of Drugs Acting on the Peripheral Nervous System", topics: [
                "Organization and functions of PNS.",
                "Neurohumoral transmission, co-transmission. Neurotransmitters and their receptors, including non-adrenergic and non-cholinergic (NANC) neurotransmitters.",
                "Parasympathomimetic and Parasympatholytic drugs.",
                "Sympathomimetic and sympatholytic drugs.",
                "Skeletal muscle relaxants (peripheral and central).",
                "Drugs used in the treatment of myasthenia gravis and glaucoma.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Pharmacology of Drugs Acting on the Cardiovascular System", topics: [
                "Introduction to cardiovascular hemodynamic and cardiac electrophysiology.",
                "Drugs used in congestive cardiac failure.",
                "Anti-arrhythmic drugs.",
                "Anti-anginal and newer anti-ischemic drugs.",
                "Anti-hypertensive drugs.",
                "Shock, types of shocks and drugs used in their management.",
                "Stroke, types of strokes and drugs used in their management.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Pharmacology of Drugs Acting on Blood and Kidney", topics: [
                "Pharmacology of drugs acting on blood.",
                "Anti-platelet agents.",
                "Coagulants and anticoagulants.",
                "Fibrinolytics and Plasma expanders.",
                "Haematinics.",
                "Anti-hyperlipidaemic drugs.",
                "Pharmacology of drugs acting on kidney.",
                "Diuretics.",
                "Anti-diuretics.",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Pharmacology of Autacoids and Related Drugs", topics: [
                "Introduction to autacoids and their classification. Therapeutic significance of important agonists and antagonists of prostaglandins, thromboxane, leukotrienes, angiotensin, bradykinin and substance P.",
                "Histamine and antihistamines.",
                "5-HT, its agonists and antagonists, drugs used in migraine.",
                "Non-steroidal anti-inflammatory drugs, antipyretics and analgesics.",
                "Anti-gout and Antirheumatic drugs including Disease Modifying.",
                "Antirheumatic Drugs (DMARDs).",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Pharmacology of Drugs Acting on Respiratory System", topics: [
                "Drugs used in the treatment of bronchial asthma and COPD.",
                "Definitions, classification and therapeutic uses of nasal decongestants, mucolytics, expectorants and antitussives.",
                "Respiratory stimulants, ii) Pharmacology of Drugs acting on immune system Mechanism of action, adverse effects and therapeutic uses of important classes of immune stimulants and immunosuppressants.",
            ]
        },
    ], false,
    [
        "Develop a comprehensive understanding of neurohumoral transmission, neurotransmitters, and the organization and function of the autonomic nervous system.",
        "Provide knowledge of the classification, mechanisms of action, and pharmacological effects of various classes of drugs.",
        "Explain the pharmacology of drugs acting on the peripheral nervous system, cardiovascular system, and urinary system.",
        "Describe the physiological roles of autacoids and the pharmacology of drugs used in the management of pulmonary diseases and related disorders.",
        "Familiarize students with the pharmacology of drugs acting on the immune system, hematopoietic system, and blood, and relate pharmacological principles to clinical conditions through case-based learning.",
    ],
    [
        "1. Brunton, L., Hilal-Dandan, R. and Knollmann, B. Goodman and Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill Education.",
        "Craig, C. R. and Stitzel, R. E. Modern Pharmacology with Clinical Applications. Lippincott Williams & Wilkins.",
        "DiPiro, J. T., Talbert, R. L., Yee, G. C. and Matzke, G. R. Pharmacotherapy: A Pathophysiologic Approach. McGraw-Hill Education.",
        "Katzung, B. G. and Trevor, A. J. Basic and Clinical Pharmacology. McGraw-Hill Education.",
        "Rang, H. P., Dale, M. M., Ritter, J. M., Flower, R. J. and Henderson, G. Rang and Dale’s Pharmacology. Elsevier.",
        "Tripathi, K. D. Essentials of Medical Pharmacology. Jaypee Brothers Medical Publishers.",
    ]),
    s("BP406P", "Herbal Drug Technology (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. To establish seed germination and plant tissue culture of a medicinal plant.",
                "2. Preparation and standardization of extracts of Phenol-rich fraction of Green Tea.",
                "3. Preparation and standardisation of Aqueous and hydro-alcoholic extracts of Ashwagandha or Haritaki (as per IP procedure)",
                "4. Preparation and standardization of Flavonoid-enriched fraction of Sweet lime peel",
                "5. Preparation and standardization of Terpenoid-rich fraction of Bacopa.",
                "6. Preparation and standardization of Steroid-rich fraction of Tribulus",
                "7. Preparation and standardization of Alkaloid-rich fraction of Vasaka",
                "8. Evaluation of excipients of natural origin.",
                "9. To develop and evaluate herbal cosmetics in form of gel, cream, lotion using standardized herbal extract.",
                "10. To develop and evaluate herbal shampoo using standardized herbal extract.",
                "11. To develop herbal formulations in form of syrups and mixtures using standardized herbal extract and their evaluation as per Pharmacopoeial guidelines.",
                "12. To develop herbal tablets using standardized herbal extract and their evaluation as per Pharmacopoeial guidelines.",
                "13. Preparation of botanicals-based new herbal medicinal product delivery systems (phytosomes).",
                "14. Experiential learning-based experiments involving collection of herbal formulations/ extracts from the market and their quality evaluation as per Pharmacopoeial guidelines.",
                "15. Survey on different commercialized marketed herbal cosmetics.",
                "16. Survey on different commercialized marketed herbal medicine.",
            ]
        },
    ], false,
    [
        "To apply seed germination and plant tissue culture techniques for medicinal plants.",
        "To prepare and standardize herbal extracts and phytoconstituent-enriched fractions as per Pharmacopoeial procedures.",
        "To evaluate natural excipients and standardized herbal extracts for formulation development.",
        "To develop and evaluate herbal cosmetic, pharmaceutical, and novel delivery systems using standardized extracts.",
        "To assess the quality of marketed herbal formulations and extracts through experiential learning and surveys.",
    ],
    [
        "1. Evans, W. C. Trease and Evans’ Pharmacognosy. Elsevier.",
        "Harborne, J. B. Phytochemical Methods: A Guide to Modern Techniques of Plant Analysis. Springer.",
        "Houghton, P. J. and Raman, A. Laboratory Handbook for the Fractionation of Natural Extracts. Chapman & Hall.",
        "Indian Pharmacopoeia Commission. Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
        "Mukherjee, P. K. Quality Control and Evaluation of Herbal Drugs. Elsevier.",
        "Sarker, S. D., Latif, Z. and Gray, A. I. Natural Products Isolation. Humana Press.",
        "World Health Organization. WHO Guidelines on Good Agricultural and Collection Practices (GACP) for Medicinal Plants.",
        "World Health Organization. WHO Quality Control Methods for Herbal Materials.",
    ]),
    s("BP407P", "Medicinal Chemistry (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Preparation of Drugs / Intermediates a. Aspirin b. Benzotriazole c. Benzocaine d. Phenytoin e. Dibenzalacetone f. Paracetamol",
                "2. Assay of Drugs (Any 3) a. Aspirin b. Ibuprofen c. Furosemide d. Paracetamol",
                "3. Monograph Analysis (Any 3) a. Paracetamol b. Aspirin c. Phenobarbital d. Diclofenac e. Phenytoin",
            ]
        },
    ], false,
    [
        "Comprehend the fundamental principles of drug synthesis, assay, and monograph analysis.",
        "Acquire practical skills in the synthesis of selected drug molecules and intermediates.",
        "Develop proficiency in performing qualitative and quantitative assays of drugs.",
        "Understand the requirements and procedures involved in drug monograph analysis.",
        "Apply appropriate techniques and methodologies for the preparation, assay, and monograph analysis of various drugs.",
    ],
    [
        "1. Abraham, D. J. and Rotella, D. P. Burger’s Medicinal Chemistry, Drug Discovery and Development. John Wiley & Sons.",
        "Beckett, A. H. and Stenlake, J. B. Practical Pharmaceutical Chemistry. CBS Publishers & Distributors.",
        "Furniss, B. S., Hannaford, A. J., Smith, P. W. G. and Tatchell, A. R. Vogel’s Textbook of Practical Organic Chemistry. Pearson Education.",
        "Indian Pharmacopoeia Commission. Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
        "Kar, A. Advanced Practical Medicinal Chemistry. New Age International Publishers.",
        "Lednicer, D. The Organic Chemistry of Drug Synthesis. John Wiley & Sons.",
        "Moffat, A. C., Osselton, M. D. and Widdop, B. Clarke’s Analysis of Drugs and Poisons. Pharmaceutical Press.",
        "United States Pharmacopeial Convention. United States Pharmacopeia–National Formulary (USP–NF). United States Pharmacopeial Convention.",
        "Vogel, A. I. Vogel’s Textbook of Quantitative Chemical Analysis. Longman Scientific & Technical.",
    ]),
    s("BP408P", "Pharmaceutical Biotechnology (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Understanding Good microbiological laboratory practices while working in Microbiology laboratory aseptic handling in microbiology lab: growth and isolation of microbes using streaking, spreading and subculturing techniques: microbial staining, study of various equipments such as loop, straight wire, spreader, forceps, pipette, test tube, petridish, burner etc and apparatus used in microbiology lab- BOD incubator, laminar flow, aseptic hood, autoclave, hot air sterilizer, deep freezer and microscopes.",
                "2. Handling of biological spill, decontamination procedures and hygiene while handling microorganisms and disposal",
                "3. Sterilization and evaluation of glassware and apparatus using hot air oven",
                "4. Preparation and sterilization of solid and liquid culture medium using different techniques",
                "5. Determination of microbiological efficacy of disinfectant/ preservative efficacy test",
                "6. Tests for sterility of ophthalmic or parenteral marketed formulation according to IP.",
                "7. Analysis of Biotechnological product (Protein, nucleic acid materials) by UV Vis and FTIR spectrophotometer",
                "8. Production of alcohol using Fermentation process",
                "9. Practice Whole cell immobilization technique (any one)",
                "10. Practice Enzyme immobilization technique and its kinetics",
                "11. Isolation and estimation of DNA and RNA",
                "12. Isolation of plasmids and expression of protein",
                "13. Agarose gel electrophoresis of DNA/ RNA",
                "14. SDS – polyacrylamide gel electrophoresis for proteins.",
                "15. Microbiological assay of antibiotics.",
            ]
        },
    ], false,
    [
        "Provide fundamental knowledge of biotechnology concepts, including protein therapeutics, monoclonal antibodies, enzyme immobilization, and their pharmaceutical applications.",
        "Explain the principles and applications of genetic engineering and recombinant DNA technology in pharmaceutical sciences.",
        "Develop understanding of microbial biotransformation, fermentation processes, and large-scale production of pharmaceutical products such as alcohol, antibiotics, vaccines, and blood products.",
        "Describe the principles, methodologies, delivery systems, and ethical considerations associated with gene therapy and modern vaccine technologies.",
        "Introduce the regulatory requirements and standardization procedures for vaccines, sera, and other biopharmaceutical products.",
    ],
    [
        "1. Baltz, R. H., Davies, J. E. and Demain, A. L. Manual of Industrial Microbiology and Biotechnology. ASM Press.",
        "Carter, S. J. Cooper and Gunn’s Tutorial Pharmacy. CBS Publishers & Distributors.",
        "Chou, S. L. M. Practical Biotechnology: A Guide to Biochemical Engineering. Springer.",
        "Denyer, S. P., Hodges, N. A. and Gorman, S. P. Hugo and Russell’s Pharmaceutical Microbiology. Wiley-Blackwell.",
        "Glick, B. R., Pasternak, J. J. and Patten, C. L. Molecular Biotechnology: Principles and Applications of Recombinant DNA. ASM Press.",
        "Lachman, L., Lieberman, H. A., Kanig, J. L. and Khar, R. K. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Pelczar, M. J., Chan, E. C. S. and Krieg, N. R. Microbiology. McGraw-Hill.",
    ]),
    s("BP409P", "Social Pharmacy and Public Health (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Laboratory Practicals & Experiments (30 Hours)", topics: [
                "1. Training on health screening services (Blood pressure, body mass index (BMI), blood glucose levels, heart rate (pulse rate), respiratory rate, body temperature, oxygen saturation (SpO₂), hemoglobin levels (basic anemia screening)).",
                "2. Develop health promotion material for the prevention of communicable diseases.",
                "3. Role play- usage of different mental scales in patient screening.",
                "4. Case study on calculation of prevalence; incidence, odds ratio and relative risk.",
                "5. Design and demonstrate preventive strategies for major communicable diseases (group activity)",
                "6. Present a case study highlighting cost-benefit analysis in healthcare.",
                "7. Perform cost-effectiveness analysis for selected health interventions.",
                "8. Conduct cost-utility analysis to assess health program efficiency.",
                "9. Perform basic first aid techniques.",
                "10. Design informational leaflet on lifestyle modifications for disease prevention.",
                "11. Identify and illustrate irrational drug use with a real-world example.",
                "12. Prepare an immunization chart, interpret the vaccination schedule and perform patient counselling for vaccination*.",
                "13. Hand wash and hand sanitizing techniques*.",
                "14. Demonstration and practice of wound dressing in first aid and basic suturing techniques*.",
                "15. Practical training on routes of drug administration-oral, and other non-parenteral routes*.",
                "16. Practical training on routes of drug administration- parenteral routes*.",
                "17. Training on basic life support (BLS)*.",
            ]
        },
    ], false,
    [
        "Understand and apply basic health assessment techniques (blood pressure, BMI, and blood glucose levels), and perform essential first aid skills.",
        "Gain skills in the development of health education tools and communication strategies to promote prevention and control of communicable diseases and encourage healthy lifestyle modifications.",
        "Familiarize with mental health assessment tools and improve clinical communication skills through simulated role-play exercises focused on patient screening.",
        "Acquire practical knowledge of immunization practices and demonstrate correct vaccine administration techniques using simulation models.",
        "Understand the principles of epidemiology and designing preventive strategies for common communicable diseases. Develop foundational knowledge of Pharmacoeconomics and its applications. Evaluate health interventions, while identifying irrational drug use practices.",
    ],
    [
        "Drummond, M. F., Sculpher, M. J., Claxton, K., Stoddart, G. L. and Torrance, G. W. Methods for the Economic Evaluation of Health Care Programmes. Oxford University Press.",
        "Harding, G. and Taylor, K. Social Pharmacy. Pharmaceutical Press.",
        "Park, K. Park’s Textbook of Preventive and Social Medicine. Banarsidas Bhanot Publishers.",
    ]),
    s("BP410P", "Systemic Pharmacology I (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. To demonstrate Langendorff’s heart assembly and its applications in pharmacology (only video demonstration/or charts and illustrations).",
                "2. Recording of the effects of different electrolytes, agonists and antagonists on the isolated and perfused frog heart preparation using interactive computer simulation experiment.",
                "3. To study the effect of various drugs on blood pressure and heart rate anaesthetized dog using interactive computer simulation experiment.",
                "4. Demonstration of the estimation of intraocular pressure on rabbit eye and human eye by using conventional Schiotz tonometer and non-contact tonometer.",
                "5. To evaluate the muscle relaxant activity of drugs on Rota-rod apparatus using interactive computer simulation experiment.",
                "6. Demonstration of the effect of spasmogens and spasmolytic using rabbit jejunum using interactive computer simulation experiment.",
                "7. Determination of PA2 value of Atropine using a suitable isolated tissue preparation by Schild plot method with the help of hypothetical data using interactive computer simulation experiment.",
                "8. Determination of PA2 value of Prazosin using a suitable isolated tissue preparation by Schild plot method with the help of hypothetical data using interactive computer simulation experiment.",
                "9. To study the antiallergic effects of drugs using mast cell degranulation assay using interactive computer simulated experiment.",
                "10. Evaluation of diuretic activity of drugs in rats using metabolic cages (simulation) and estimation of electrolytes in the urine samples/serum using flame photometer/commercially available kits.",
                "11. Evaluation of effects of antihistaminic drugs on the histamine-induced bronchospasm in guinea pigs using interactive simulated experiment.",
                "12. To study and analyse drug-drug interaction/ rational drug management of asthma with the help of Case Study/ hypothetical data/ any clinical report.",
                "13. To study clinical pharmacology of the plasma volume expanders and their importance (using charts/open sources videos).",
                "14. Demonstration of evaluation of anti-inflammatory activity in paw oedema model using plethysmometer using simulations.",
                "15. Concept of Biobanking and its significance in drug screening.",
                "16. Isolation of Polymorphonuclear cells from blood and evaluation of endotoxin-induced oxidative stress in them using Nitrobluetetrazolium dye method by colourimetry.",
                "17. Determination of viability of cells (using isolated polymorphonuclear cells) by Trypan blue dye exclusion assay to determine cell viability using microscopy method.",
                "18. Determination of anti-inflammatory activity of durgs in vitro using RBC membrane stabilization assay",
                "19. Determination of protein concentrations using Bradford reagent and plotting of standard curve of bovine serum albumin.",
                "20. Estimation of anticholinesterase inhibitory activity of drugs using Ellman’s reagent (DTNB)",
            ]
        },
    ], false,
    [
        "Provide understanding of the theoretical and practical aspects of different pharmacological experiments using virtual simulations and video demonstrations.",
        "Develop skills to assess drug effects on various systems such as cardiovascular, respiratory, skeletal muscle, and gastrointestinal tract using simulation models.",
        "Familiarize the learners with experimental methodologies such as Langendorff’s heart preparation, spasmogen and spasmolytic effects, and PA2 value determination using Schild plot.",
        "Provide knowledge of modern techniques for drug evaluation.",
        "Explore clinical pharmacology aspects through case studies on drug interactions, management of cardiovascular and respiratory diseases, and plasma volume expanders.",
    ],
    [
        "1. Ghosh, M. N. Fundamentals of Experimental Pharmacology. Hilton & Company.",
        "Hofmann, F. B. Handbook of Experimental Pharmacology (HEP Series). Springer Nature.",
        "Computer Assisted Learning (CAL) software packages for experimental pharmacology simulations.",
    ]),
    s("BP411I", "Internship I (Mandatory)", 4, "I", [
        {
            num: "I", hours: "30 Hours", title: "Industrial & Manufacturing Operations Exposure", topics: [
                "Observation of pharmaceutical production lines (solid orals, liquid orals, injectables, semi-solids)",
                "cGMP compliance, cleanroom classification, HVAC systems, and gowning procedures",
                "Raw material procurement, quarantine, testing, and warehouse management",
                "In-process quality control (IPQC) testing and batch manufacturing record (BMR) documentation",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Hospital & Clinical Pharmacy Operations", topics: [
                "Inpatient and outpatient pharmacy dispensing procedures and computerized prescription handling",
                "Medication reconciliation, drug-drug interaction screening, and adverse drug reaction reporting",
                "Ward rounds observation and understanding hospital drug formulary management",
                "Cold chain maintenance and storage of vaccines, biologicals, and narcotic drugs",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Community Pharmacy & Patient Care Practice", topics: [
                "Prescription auditing, dispensing protocols, and patient counseling techniques",
                "OTC medication management, minor ailment triage, and first-aid advisory",
                "Digital pharmacy management software, inventory control, and supply chain tracking",
                "Community health awareness, rational drug use education, and public health campaigns",
            ]
        },
        {
            num: "IV", hours: "30 Hours", title: "Regulatory Documentation & Technical Report Submission", topics: [
                "Daily training logbook maintenance verified and countersigned by industrial/hospital mentor",
                "Case studies on quality issues, deviation handling, and corrective and preventive action (CAPA)",
                "Formal internship report preparation (minimum 25 pages) as per PCI Regulation Section 22",
                "Evaluation criteria: Certificate & report submission (75 marks), Viva voce presentation (25 marks)",
            ]
        },
    ], true,
    [
        "Expose students to real-world pharmaceutical manufacturing, healthcare systems, or community pharmacy practice.",
        "Understand standard operating procedures (SOPs), cGMP, quality systems, and regulatory documentation in industrial settings.",
        "Gain hands-on exposure to formulation compounding, dispensing, inventory management, and patient counseling.",
        "Develop professional work ethics, teamwork, and communication skills in organizational environments.",
        "Synthesize experiential learning into a comprehensive internship portfolio and technical report.",
    ],
    [
        "Pharmacy Council of India (PCI) Guidelines for Practice Training and Internship in B.Pharm (NEP 2020 Regulation Section 22).",
        "WHO Guidelines on Good Manufacturing Practices (GMP) and Good Distribution Practices (GDP).",
        "Indian Pharmacopoeia Commission (IPC) Guidance on Pharmacovigilance and Quality Standards.",
        "Remington: The Science and Practice of Pharmacy, 23rd Edition.",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 5
// ─────────────────────────────────────────────────────────────
const SEM5: Subject[] = [
    s("BP501T", "Biomedicinal Chemistry", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Drugs Acting on the Central Nervous System", topics: [
                "General Anesthetics Halothane, Methoxyflurane, Enflurane, Sevoflurane, Isoflurane, Desflurane, Methohexital, Thiamylal, Thiopental, Ketamine*, Ramelteon, Remimazolam, Fospropofol, Dexmedetomidine.",
                "Sedatives and Hypnotics Barbital, Phenobarbital*, Mephobarbital, Amobarbital, Butabarbital, Pentobarbital, Secobarbital, Chlordiazepoxide, Diazepam*, Oxazepam, Chlorazepate, Lorazepam, Alprazolam, Zolpidem, Glutethimide, Meprobamate, Ethchlorvynol, Triclofos, Paraldehyde.",
                "SAR of Barbiturates and Benzodiazepines.",
                "Antipsychotics Promazine, Chlorpromazine*, Triflupromazine, Thioridazine, Piperacetazine, Prochlorperazine, Trifluoperazine, Chlorprothixene, Thiothixene, Loxapine, Clozapine, Haloperidol, Droperidol, Risperidone, Molindone, Sulpiride, Brexpiprazole, Lumateperone, Pimavanserin, Samidorphan.",
                "SAR of Phenothiazines.",
                "Anticonvulsants Phenobarbitone, Methabarbital, Phenytoin*, Mephenytoin, Ethotoin, Oxazolidinediones: Trimethadione, Paramethadione Succinimides: Phensuximide, Methsuximide, Ethosuximide Phenacemide, Carbamazepine*, Clonazepam, Primidone, Valproic acid, Gabapentin, Felbamate, Perampanel, Lacosamide, Retigabine.",
                "SAR of Anticonvulsants.",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Anti-infective Chemotherapeutic Agents", topics: [
                "Antitubercular Agents Isoniazid*, Ethionamide, Ethambutol, Pyrazinamide, Para-amino salicylic acid*, Rifampicin, Rifabutin, Cycloserine, Streptomycin, Capreomycin, Pretomanid, Clofazimine, Levofloxacin, Bedaquiline, Linezolid, Delamanid.",
                "Antimalarials Quinine, Chloroquine*, Amodiaquine, Primaquine, Pamaquine, Quinacrine, Mefloquine, Cycloguanil pamoate, Proguanil, Pyrimethamine, Artesunate, Artemether, Atovaquone.",
                "SAR of Quinoline derivatives.",
                "Antiprotozoals Metronidazole*, Tinidazole, Ornidazole, Diloxanide, Iodoquinol, Pentamidine isethionate, Atovaquone,Eflornithine, Paromomycin, Nitazoxanide.",
                "Antivirals Amantadine, Rimantadine, Idoxuridine, Acyclovir*, Ganciclovir, Zidovudine, Didanosine, Zalcitabine, Lamivudine,Loviride, Delavirdine, Ribavirin, Saquinavir, Indinavir, Ritonavir, Valganciclovir, Peramivir, Lenacapavir.",
                "Antifungals Amphotericin-B, Nystatin, Natamycin, Griseofulvin, Clotrimazole, Econazole, Butoconazole, Oxiconazole, Tioconazole, Miconazole, Ketoconazole*, Terconazole, Itraconazole, Fluconazole, Naftifine, Tolnaftate, Posaconazole, Isavuconazole.",
                "Anthelmintics Diethylcarbamazine, Thiabendazole, Mebendazole, Albendazole*, Niclosamide, Oxamniquine, Praziquantel, Ivermectin.",
                "Urinary Tract Anti-infective Agents Nalidixic acid, Norfloxacin, Enoxacin, Ciprofloxacin*, Ofloxacin, Lomefloxacin, Sparfloxacin, Gatifloxacin, Furazolidone, Nitrofurantoin, Methenamine, Moxifloxacin.",
                "SAR of Quinolones.",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Antibiotics and Sulfa Drugs", topics: [
                "Antibiotics Penicillins, Cephalosporins, β-Lactamase inhibitors, Monobactams Aminoglycosides: Streptomycin, Neomycin, Kanamycin, Tetracyclines:",
                "TETRACYCLINE, OXYTETRACYCLINE, MINOCYCLINE, DOXYCYCLINE, MACROLIDES",
                "Erythromycin, Clarithromycin, Azithromycin Chloramphenicol*, Clindamycin, Clavulanic acid SAR of Penicillins, Tetracyclines, and Cephalosporins.",
                "Sulfa Drugs Sulphamethizole, Sulfisoxazole, Sulphapyridine, Sulphathiazole, Sulfacetamide, Sulphamethoxazole,Sulphadiazine, Mefenide, Sulfasalazine, Trimethoprim, Cotrimoxazole, Dapsone*.",
                "SAR of Sulfonamides.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Antineoplastic Agents", topics: [
                "Mechlorethamine, Cyclophosphamide, Melphalan, Chlorambucil, Busulfan, Thiotepa, Mercaptopurine*, Thioguanine, Fluorouracil, Floxuridine, Cytarabine, Methotrexate*, Azathioprine, Dactinomycin, Daunorubicin, Doxorubicin, Bleomycin, Etoposide, Vinblastine, Vincristine, Paclitaxel, Camptothecin, Cisplatin, Mitotane, Carboplatin.",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Endocrine Drugs, Antidiabetic Agents and Narcotic Analgesics", topics: [
                "ENDOCRINE DRUGS SEX HORMONES: Testosterone, Nandrolone, Progesterone, Oestriol, Oestradiol, Oestrone, Diethylstilbestrol Drugs for erectile dysfunction: Sildenafil, Tadalafil Oral contraceptives: Mifepristone, Norgestrel, Levonorgestrel Corticosteroids: Cortisone, Hydrocortisone, Prednisolone, Betamethasone, Dexamethasone Thyroid and antithyroid drugs: L-Thyroxine, L-Thyronine, Propylthiouracil, Methimazole.",
                "Antidiabetic Agents Insulin and preparations, Tolbutamide*, Chlorpropamide, Glipizide, Glimepiride.",
                "BIGUANIDES: Metformin Thiazolidinediones: Pioglitazone, Rosiglitazone Repaglinide, Nateglinide, Acarbose, Voglibose.",
                "Narcotic Analgesics Morphine, Codeine, Meperidine, Anilerdine, Diphenoxylate, Loperamide, Fentanyl*, Methadone, Propoxyphene, Pentazocine, Levorphanol.",
                "Nalorphine, Levallorphan, Naloxone.",
                "SAR of Morphine analogues.",
            ]
        },
    ], false,
    [
        "Provide comprehensive knowledge of drugs acting on the central nervous system, including anesthetics, sedatives, antipsychotics, and anticonvulsants, with emphasis on their chemical classification and structure–activity relationships (SAR).",
        "Familiarize students with anti-infective chemotherapeutic agents used against tuberculosis, malaria, protozoal, viral, fungal, helminthic, and urinary tract infections, including their chemical structures and SAR.",
        "Impart understanding of antibiotics and sulfa drugs, focusing on their chemical classes, mechanisms, therapeutic relevance, and structure–activity relationships.",
        "Introduce antineoplastic agents and endocrine drugs, highlighting their chemical nature, classification, therapeutic applications, and structure–activity correlations.",
        "Develop knowledge of antidiabetic agents and narcotic analgesics, including opioid antagonists, with emphasis on medicinal chemistry principles and SAR of key drug classes.",
    ],
    [
        "Abraham, D. J. and Griffin, J. L. Burger’s Medicinal Chemistry and Drug Discovery. Wiley.",
        "Brunton, L., Hilal-Dandan, R. and Knollmann, B. Goodman and Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill Education.",
        "Kar, Ashuthosh. Medicinal Chemistry. New Age International.",
        "Lednicer, D. The Organic Chemistry of Drug Synthesis. Wiley.",
        "Li, J. J. Modern Drug Synthesis. Wiley.",
        "Patrick, G. L. An Introduction to Medicinal Chemistry. Oxford University Press.",
        "Vogel, A. I. Vogel’s Textbook of Practical Organic Chemistry. Pearson Education.",
        "Williams, D. A., Lemke, T. L. and Roche, V. F. Foye’s Principles of Medicinal Chemistry. Lippincott Williams & Wilkins.",
        "Wilson, C. O., Beale, J. M. and Block, J. H. Wilson and Gisvold’s Textbook of Organic Medicinal and Pharmaceutical Chemistry. Lippincott Williams & Wilkins.",
    ]),
    s("BP502T", "Industrial Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "8 Hours", title: "Industrial Extraction and Scale-Up Processing", topics: [
                "General Introduction to Herbal Industries, institutions and trade status of herbals.",
                "Role of medicinal and aromatic plants trade in national economy of a country and introduction of Current trade status and potential of some commercially important medicinal plants/natural products like Ashwagandha, Turmeric, Ginseng, Amla and essential oils.",
                "A brief account of bioeconomy, biodiversity hot spots and plantbased industries and institutions involved in research work on medicinal and aromatic plants in India.",
                "Emerging therapeutic categories of Herbal Medicinal Products available in market, their composition with rationale for Aphrodisiac, Antistress, anti-diabetics, antihyperlipidemic, immunomodulator, hepatoprotective and kidney disorders.",
                "EMERGING HERBAL COSMECEUTICALS: Anti-Aging, Depigmenting, antiacne, sunscreen, detoxifying, anti-irritant, nutricosmetics.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Commercial Production and Standardization of Botanicals", topics: [
                "Significance of AYUSH/ WHO-GMP, GLP and USFDA compliant facility in production of quality herbal products.",
                "Commercial production of standardized herbal extracts with clinical relevance: Coleus, Amla, Turmeric, Ashwagandha and Senna.",
                "Commercial production and standardization of volatile oils:",
                "Eucalyptus oils, Lavender oil and Peppermint oil, Rosemary oil Preparation and standardization of Ayush formulations viz Aristas and Asawas, Ghutika/Habb, Churna/ Shafoof Arq, Sharbat, Tincture and Bhasma.",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Modern Methods of Analysis of Plants and Plant-based Products", topics: [
                "Basic principles and applications in analysis of botanicals:",
                "SPECTROSCOPIC METHODS: UV-Visible spectroscopy, IR Spectroscopy, NMR spectroscopy and Mass spectroscopy, Atomic Absorption Scpectroscopy Chromatographic methods: HPTLC, HPLC, UPLC, GC.",
            ]
        },
        {
            num: "IV", hours: "08 Hours", title: "Industrial Production and Commercialization of Bioactives", topics: [
                "Isolation, Characterization, Commercial Production and analysis of bioactive phytoconstituents Isolation, characterization with commercial production, identification and analysis of bioactive phytoconstituents:",
                "Artemisinin, Sennosides, Withanolids, Boswellic acid, Atropine, and Lycopene.",
            ]
        },
        {
            num: "V", hours: "07 Hours", title: "International Regulatory Perspectives", topics: [
                "Overview of global regulations for herbal products (e.g., World Health Organization, United States Food and Drug Administration – Dietary Supplement Health and Education Act, European Medicines Agency, TGA-ARG Therapeutic Goods Administration Australian Regulatory Guidelines for Complementary Medicines, Natural Health Products (Canada) (b) Harmonization challenges and mutual recognition of traditional medicine (c) Importance of safety, efficacy and pharmacovigilance in herbal product regulation (d) Study of Monographs on herbal drugs and botanicals related to Indian Pharmacopoeia, United States Pharmacopoeia Herbal Medicine and Dietary Supplement, Ayurvedic Pharmacopoeia of India and Unani Pharmacopoeia of India.).",
            ]
        },
    ], false,
    [
        "Introduce students to the industrial, commercial, and economic aspects of herbal drugs in national and global markets.",
        "Knowledge of commercial production, quality assurance, and standardization of herbal extracts, volatile oils, and traditional AYUSH formulations",
        "Train students in modern analytical techniques for the identification, characterization, and quality evaluation of plant-based drugs and herbal products",
        "Develop skills in isolation, characterization, commercial production, and analysis of bioactive phytoconstituents.",
        "Familiarize students with national and international regulatory frameworks, pharmacopoeial standards, and safety, efficacy, and pharmacovigilance requirements governing herbal medicinal products.",
    ],
    [
        "Ayurvedic Pharmacopoeia Committee. Ayurvedic Pharmacopoeia of India. Government of India, Ministry of AYUSH.",
        "European Medicines Agency. Herbal Monographs and Regulatory Guidelines.",
        "Indian Drug Manufacturers’ Association. Indian Herbal Pharmacopoeia.",
        "Indian Pharmacopoeia Commission. Indian Pharmacopoeia. Government of India.",
        "International Council for Harmonisation. ICH Guidelines on Quality, Safety, Efficacy and Multidisciplinary Topics.",
        "Natural Health Products Directorate. Regulatory Framework for Natural Health Products.",
        "Unani Pharmacopoeia Committee. Unani Pharmacopoeia of India. Government of India, Ministry of AYUSH.",
        "United States Pharmacopeial Convention. United States Pharmacopeia.",
        "World Health Organization. Guidelines on Good Agricultural and Collection Practices (GACP) for Medicinal Plants.",
        "Drugs and Cosmetics Act and Rules (India). Government of India.",
    ]),
    s("BP503T", "Innovation and Startup Ecosystem", 2, "T", [
        {
            num: "I", hours: "06 Hours", title: "Introduction to Innovation and Entrepreneurship", topics: [
                "Defining Innovation and Entrepreneurship.",
                "What is Innovation?",
                "TYPES OF INNOVATION: Product, Process, Business.",
                "Model, Social.",
                "What is Entrepreneurship?",
                "Characteristics of an Entrepreneur.",
                "Invention vs Innovation.",
                "Distinction between Invention and Innovation.",
                "Importance of Innovation in the 21st Century.",
                "Economic growth and job creation.",
                "Solving societal problems.",
                "Disruptive technologies and their impact.",
                "Case Studies.",
                "Innovative companies (e.g., Apple, Google, Tesla).",
                "Introduction to the Startup Ecosystem.",
                "KEY COMPONENTS: Entrepreneurs, Incubators/Accelerators, Mentors, Investors, Government, Academia, Support Services.",
                "Role of each component in fostering innovation.",
                "PRACTICAL ASPECT",
                "Participation in National Innovation Day and National Startup Day.",
            ]
        },
        {
            num: "II", hours: "06 Hours", title: "Ideation and Opportunity Identification", topics: [
                "Identifying Problems and Market Gaps.",
                "Problem-solving approach to entrepreneurship.",
                "TECHNIQUES FOR PROBLEM IDENTIFICATION: Observation, Empathy mapping, User interviews.",
                "Market research basics.",
                "Understanding customer needs and pain points.",
                "Generating Innovative Ideas.",
                "BRAINSTORMING TECHNIQUES: SCAMPER, Mind Mapping, Design Thinking principles for ideation, Lateral thinking and divergent thinking.",
                "FROM PROBLEM TO SOLUTION: developing initial concepts.",
                "Opportunity Analysis and Feasibility.",
                "Market sizing and potential.",
                "Competitive analysis.",
                "SWOT analysis for new ventures.",
                "PRACTICAL ASPECT",
                "Participation in Ideation Challenges or Hackathons (e.g., Smart India Hackathon or IIC internal ideation competitions).",
            ]
        },
        {
            num: "III", hours: "06 Hours", title: "Building a Minimum Viable Product", topics: [
                "(MVP) and Validation.",
                "Lean Startup Methodology.",
                "Introduction to Lean Startup principles.",
                "BUILD: Measure–Learn feedback loop.",
                "CONCEPT OF MVP: Importance, Scope and objectives.",
                "Designing and Developing an MVP.",
                "Different types of MVPs.",
                "Tools and resources for rapid prototyping.",
                "User experience basics for MVPs.",
                "Validation.",
                "Customer interviews and feedback collection.",
                "A/B testing and split testing.",
                "Pivoting vs Persevering.",
                "PRACTICAL ASPECT",
                "Participation in sessions/workshops on Prototype, MVP, and Product Development.",
            ]
        },
        {
            num: "IV", hours: "06 Hours", title: "Business Models and Startup Operations", topics: [
                "Business Model Canvas (BMC).",
                "Introduction to the 9 building blocks of BMC.",
                "Developing a BMC for a new venture.",
                "Value Proposition Design Legal and Financial Aspects for Startups.",
                "LEGAL STRUCTURES: Sole Proprietorship, Partnership, Private Limited Company.",
                "Intellectual Property Rights (IPR): Patents, Trademarks, Copyrights.",
                "STARTUP FUNDING: Bootstrapping, Angel investors, Venture capital.",
                "Team Building and Mentorship.",
                "Importance of a strong founding team.",
                "Roles and responsibilities in a startup.",
                "Value of mentors and advisors.",
                "PRACTICAL ASPECT",
                "Participation in IPR awareness programs or startup funding sessions.",
            ]
        },
        {
            num: "V", hours: "06 Hours", title: "Scaling, Ecosystem Engagement, and Future Trends", topics: [
                "Growth Strategies and Scaling Up.",
                "Marketing and sales for startups.",
                "User acquisition and retention.",
                "Challenges of scaling and solutions.",
                "EXIT STRATEGIES: Acquisition, IPO.",
                "Engaging with the Startup Ecosystem.",
                "Networking with investors, mentors, and entrepreneurs.",
                "Participation in startup competitions and pitch events.",
                "Leveraging incubators and accelerators Future Trends in Innovation and Entrepreneurship.",
                "EMERGING TECHNOLOGIES: Artificial Intelligence, Blockchain, Internet of Things (IoT), Sustainable Technologies.",
                "Social entrepreneurship and impact investing.",
                "Global startup trends.",
                "PRACTICAL ASPECT",
                "Participation in National Innovation Day and student engagement activities to prepare and deliver a concise pitch for their developed idea, simulating a startup pitch event.",
            ]
        },
    ], false,
    [
        "Introduce students to the fundamental concepts, principles, and significance of innovation and entrepreneurship in contemporary economic and social contexts.",
        "Familiarize students with the structure, components, and key stakeholders of the startup and innovation ecosystem.",
        "Provide students with an understanding of the startup lifecycle, including ideation, opportunity analysis, product development, validation, and scaling.",
        "Equip students with practical tools and techniques for problem identification, opportunity recognition, business model development, and idea validation.",
        "Foster an entrepreneurial mindset by encouraging active participation in innovation- related events, stakeholder interactions, and experiential learning activities.",
    ],
    [
        "Eric Ries. The Lean Startup: How Today’s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses. Crown Business.",
        "Thiel, P. and Masters, B. Zero to One: Notes on Startups, or How to Build the Future. Crown Business.",
        "Bansal, R. Stay Hungry Stay Foolish. Westland.",
        "Dalal, M. Big Billion Startup: The Untold Flipkart Story. Pan Macmillan India.",
        "Ivaturi, V. K. The Manual for Indian Start-Ups: Tools to Start and Scale-Up Your New Venture. Notion Press.",
        "Mishra, S., Patjoshi, P. K. and Patnaik, S. K. Innovation and Entrepreneurship. Pearson India.",
        "Sardar, R. and Waghmare, G. Startup Ecosystem in India: Text and Cases. Himalaya Publishing House.",
    ]),
    s("BP504T", "Pharmaceutical Dosage Form II", 2, "T", [
        {
            num: "I", hours: "06 Hours", title: "Monophasic Liquids & Pressurised Dosage Forms", topics: [
                "FOUNDATIONS: Need, advantages/limitations; monophasic vs biphasic; solubility-enhancement techniques.",
                "Vehicles & solvents: Pharmaceutical waters (types; manufacturing & Quality Control of Purified/Distilled); classes of solvents as per toxicity.",
                "Formulation & manufacturing: Raw-material considerations and additives; processing; Quality Control of solutions/syrups/elixirs; powders for reconstitution as solutions.",
                "Measuring, filling & packaging: Techniques; containerclosure integrity; automation in liquid manufacturing.",
            ]
        },
        {
            num: "II", hours: "06 Hours", title: "Biphasic Liquids - Suspensions", topics: [
                "Formulation & manufacturing: Additives; classification of suspending agents; IPQC & Quality Control; instabilities and packaging.",
                "ADVANCES: Nanosuspensions; dry powder for reconstitution as suspensions; raft- forming systems.",
            ]
        },
        {
            num: "III", hours: "06 Hours", title: "Biphasic Liquids - Emulsions", topics: [
                "Formulation & manufacturing: Additives; classification of emulsifying agents; IPQC & Quality Control; instabilities and packaging.",
                "ADVANCES: Nano-emulsions, micro-emulsions, SMEDDS/SNEDDS.",
                "(overview, applications).",
            ]
        },
        {
            num: "IV", hours: "06 Hours", title: "Pressurized Dosage Forms (aerosols/mdis)", topics: [
                "Concepts; propellant classification/selection; valves & containers; formulation, manufacturing, and Quality Control (leak, spray pattern, delivered dose, particle- size/aerodynamic performance).",
                "DRY POWDER INHALERS: valves & containers; formulation, manufacturing, and Quality Control.",
            ]
        },
        {
            num: "V", hours: "06 Hours", title: "Semisolid Dosage Form", topics: [
                "THEORY OF SEMISOLID DOSAGE FORMS: Definition & Purpose, Drug Permeation Pathways through skin ,Factors affecting Permeation, Permeation enhancers: Physical and Chemical.",
                "Types of semisolid dosage form.",
                "OINTMENTS: Base Selection, Formulation , Manufacturing and Evaluation.",
                "CREAMS: Formulation, Manufacturing and Evaluation.",
                "GELS/JELLIES: Formulation, Manufacturing and Evaluation.",
                "PASTES: Formulation, Manufacturing and Evaluation.",
                "SUPPOSITORIES AND PESSARIES: Formulation, Manufacturing and Evaluation Advances: Xerogels, emulgels (overview, applications).",
            ]
        },
    ], false,
    [
        "Understand the principles of formulation and development of monophasic liquid dosage forms, including solvent selection and solubility enhancement techniques.",
        "Acquire knowledge of biphasic liquid dosage forms, including physicochemical principles, formulation strategies, manufacturing processes, and stability considerations.",
        "Develop competence in pressurised dosage forms such as aerosols, metered-dose inhalers, and dry powder inhalers, with emphasis on formulation design, device components, manufacturing, and quality evaluation.",
        "Understand the formulation, manufacturing, and evaluation of semisolid dosage forms, with emphasis on drug permeation through the skin and factors affecting topical drug delivery.",
        "Gain exposure to advanced drug delivery systems such as nanosuspensions, nanoemulsions, SMEDDS/SNEDDS, xerogels, and emulgels for improved therapeutic performance.",
    ],
    [
        "1. Aulton, M. E. Aulton’s Pharmaceutics: The Science of Dosage Form Design. Elsevier.",
        "Gibson, M. Pharmaceutical Preformulation and Formulation. CRC Press.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Robinson, J. R. and Lee, V. H. L. Controlled Drug Delivery: Fundamentals and Applications. CRC Press.",
        "Troy, D. B. and Beringer, P. Remington: The Science and Practice of Pharmacy. Pharmaceutical Press.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
    ]),
    s("BP505T", "Pharmaceutical Quality Assurance", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Quality Assurance and Quality Management Systems", topics: [
                "Quality Assurance and Quality Management concepts: Definition and concepts of Quality Control, Quality Assurance, and GMP.",
                "Total Quality Management (TQM): Definition, elements, and philosophies.",
                "ICH GUIDELINES: Purpose, process of harmonization, overview of QSEM with special emphasis on Q-series guidelines.",
                "Quality by Design (QbD): Definition, overview, elements of QbD program, and tools.",
                "ISO 9000 AND ISO 14000: Overview, benefits, elements, and steps for registration.",
                "NABL ACCREDITATION: Principles and procedures.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Organization, Personnel, Premises, and Materials Management", topics: [
                "ORGANIZATION AND PERSONNEL: Responsibilities, training, hygiene, and personal records.",
                "PREMISES: Design, construction, plant layout, maintenance, sanitation, environmental control, utilities, and control of contamination.",
                "EQUIPMENT AND RAW MATERIALS: Equipment selection, User Requirement Specifications (URS), handling and maintenance of raw materials.",
                "WAREHOUSING: Good warehousing practices and materials management.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Quality Control and Good Laboratory Practices", topics: [
                "QUALITY CONTROL TESTS FOR FORMULATIONS",
                "In-process and finished product quality control tests for tablets, capsules, ointments, creams, ophthalmic and parenteral preparations.",
                "Quality Control of Raw Materials and Packaging Materials:",
                "Tests for raw materials, containers, rubber closures, and secondary packing materials.",
                "Good Laboratory Practices (GLP):",
                "General provisions, organization and personnel, facilities and equipment, ALCOA principles, reference standards, testing facility operations, records and reports, and disqualification of testing facilities.",
            ]
        },
        {
            num: "IV", hours: "08 Hours", title: "Documentation, Complaints, and Product Recall", topics: [
                "DOCUMENTATION IN THE PHARMACEUTICAL INDUSTRY",
                "Batch Formula Record, Master Formula Record, Drug Master File, SOPs, quality audits, preparation, handling, archival, and distribution of records.",
                "COMPLAINTS AND PRODUCT RECALL",
                "Handling of complaints, evaluation of complaints, returned goods, recalls, and waste disposal.",
            ]
        },
        {
            num: "V", hours: "07 Hours", title: "Calibration and Validation", topics: [
                "CALIBRATION AND VALIDATION",
                "Introduction, definitions, importance, and general principles Calibration of weights and measures, pH meter Qualification of UV-Visible spectrophotometer, electronic balance, IR spectrophotometer, and HPLC.",
                "ANALYTICAL METHOD VALIDATION",
                "General principles of analytical method validation as per ICH Q2 guidelines.",
            ]
        },
    ], false,
    [
        "Introduce the concepts and systems of pharmaceutical quality management",
        "Provide an overview of regulatory frameworks governing pharmaceutical quality.",
        "Familiarize students with organizational, infrastructural, and operational requirements of pharmaceutical manufacturing and quality control.",
        "Explain quality control testing of pharmaceutical products",
        "Understand the documentation, validation, calibration, and data integrity essential for regulatory compliance.",
    ],
    [
        "1. Godfrey, A. B. and Juran, J. M. Juran’s Quality Handbook. McGraw-Hill Education.",
        "Organisation of Pharmaceutical Producers of India. Quality Assurance Guide. OPPI.",
        "Weinberg, S. Good Laboratory Practice s. Marcel Dekker.",
        "World Health Organization. Quality Assurance of Pharmaceuticals: A Compendium of",
    ]),
    s("BP506T", "Systemic Pharmacology II", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Pharmacology of Drugs Acting on Central Nervous System", topics: [
                "Neurohumoral transmission in the CNS; physiological roles of GABA, glutamate, glycine, serotonin, and dopamine.",
                "General anesthetics, pre-anaesthetic medications, and local anaesthetic agents.",
                "SEDATIVE: hypnotics.",
                "Alcohol and disulfiram.",
                "Opioids, opiate analgesics, and antagonists.",
                "Drugs used in epilepsy.",
                "Drugs used in Parkinson’s and Alzheimer’s diseases.",
            ]
        },
        {
            num: "II", hours: "07 Hours", title: "Pharmacology of Drugs Used in Psychiatry", topics: [
                "Antipsychotics, antidepressants, anti-anxiety drugs, mood stabilizers, CNS stimulants, and hallucinogens.",
                "Substance abuse, drug addiction, and general principles of deaddiction.",
            ]
        },
        {
            num: "III", hours: "14 Hours", title: "Chemotherapy", topics: [
                "Introduction.",
                "Definitions of chemotherapy, chemotherapeutic index, antibiotics, and antimicrobial agents.",
                "Concept of selective targeting in chemotherapy.",
                "Classification of antimicrobial agents based on mechanism of action.",
                "Concept of superinfection, chemoprophylaxis, and combined use of antibiotics.",
                "ANTIMICROBIAL RESISTANCE: causes, mechanisms, and preventive measures ii) Antimicrobial Agents Classification, mechanism of action, adverse drug reactions, and therapeutic uses of: Sulphonamides and cotrimoxazole.",
                "Fluoroquinolones.",
                "Penicillins and cephalosporins.",
                "Macrolides and tetracyclines.",
                "Linezolid.",
                "Carbapenems and monobactams.",
                "Chloramphenicol and aminoglycosides.",
                "iii) Chemotherapy of Diseases.",
                "Drugs used in the treatment of: Fungal infections, Viral infections, Helminthiasis, Urinary tract infections, Tuberculosis, Leprosy, Malaria, Amoebiasis, Neoplastic diseases.",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Pharmacology of Drugs Acting on Endocrine System", topics: [
                "Introduction to basic concepts of endocrinology.",
                "Thyroid and antithyroid agents.",
                "Parathormone, calcitonin, and vitamin D.",
                "Insulin and oral hypoglycaemic agents.",
                "ACTH and corticosteroids.",
                "Oral contraceptives.",
                "Drugs acting on the uterus, PCOD.",
            ]
        },
        {
            num: "V", hours: "04 Hours", title: "Drugs Acting on Gastrointestinal Tract", topics: [
                "Drugs used in peptic ulcer.",
                "Drugs used for constipation and diarrhoea.",
                "Emetics and anti-emetics.",
                "Digestants, carminatives, appetizers, and anorectics definitions and examples.",
            ]
        },
    ], false,
    [
        "Understand the neurohumoral transmission in the central nervous system and the role of neurotransmitters and their modulators in CNS disorders.",
        "Learn the pharmacology of drugs used in pathological conditions of CNS, GIT, and endocrine system.",
        "Familiarize learners with concepts of drug abuse, addiction, dependence, tolerance, and their management.",
        "Impart comprehensive knowledge of chemotherapeutic agents including anticancer drugs.",
        "Introduce the principles of rational use of chemotherapeutic agents.",
    ],
    [
        "1. Brunton, L., Hilal-Dandan, R. and Knollmann, B. Goodman and Gilman’s The Pharmacological Basis of Therapeutics. McGraw-Hill Education.",
        "Craig, C. R. and Stitzel, R. E. Modern Pharmacology with Clinical Applications. Lippincott Williams & Wilkins.",
        "DiPiro, J. T., Talbert, R. L., Yee, G. C. and Matzke, G. R. Pharmacotherapy: A Pathophysiologic Approach. McGraw-Hill Education.",
        "Katzung, B. G. and Trevor, A. J. Basic and Clinical Pharmacology. McGraw-Hill Education.",
        "Rang, H. P., Dale, M. M., Ritter, J. M., Flower, R. J. and Henderson, G. Rang and Dale’s Pharmacology. Elsevier.",
        "Tripathi, K. D. Essentials of Medical Pharmacology. Jaypee Brothers Medical Publishers.",
    ]),
    s("BP507P", "Biomedicinal Chemistry (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "1. Preparation of Drugs / Intermediates (Any 4); • 7-Hydroxy-4-methyl coumarin; • Thiobarbituric acid; • 2,3-Diphenylquinoxaline; • Sulphanilamide; • Triphenyl imidazole; • Perform synthesis of intermediate/drug using microwave irradiation or green chemistry techniques.",
                "2. Assay of Drugs (Any 4); • Sulpha drugs; • Metronidazole; • Isoniazid; • Phenobarbitone; • Benzyl penicillin; • Chloroquine",
                "3. Drug Design & Computational Tools (Any 4); • Calculate physicochemical and ADME properties using Swiss ADME (e.g. logP, molecular weight, H-bond donors/acceptors); • Perform basic molecular docking studies using any of open-source academic tools.",
            ]
        },
    ], false,
    [
        "Comprehend the fundamental principles of drug synthesis and apply them to the preparation of selected drug molecules and intermediates.",
        "Develop practical skills in performing laboratory techniques for the synthesis of organic compounds, including the use of microwave irradiation.",
        "Understand and apply the principles of drug assay to quantitatively analyze the purity and concentration of given drug samples.",
        "Learn and utilize computational tools to predict physicochemical and ADME properties of drug molecules.",
        "Apply molecular docking techniques to predict drug-target interactions.",
    ],
    [
        "1. Abraham, D. J. and Griffin, J. L. Burger’s Medicinal Chemistry and Drug Discovery. Wiley.",
        "Finar, I. L. Organic Chemistry. Pearson Education.",
        "Furniss, B. S., Hannaford, A. J., Smith, P. W. G. and Tatchell, A. R. Vogel’s Textbook of Practical Organic Chemistry. Pearson Education.",
        "Lednicer, D. The Organic Chemistry of Drug Synthesis. Wiley.",
        "Patrick, G. L. An Introduction to Medicinal Chemistry. Oxford University Press.",
        "Remington. The Science and Practice of Pharmacy. Pharmaceutical Press.",
        "Williams, D. A., Lemke, T. L. and Roche, V. F. Foye’s Principles of Medicinal Chemistry. Lippincott Williams & Wilkins.",
        "Wilson, C. O., Beale, J. M. and Block, J. H. Wilson and Gisvold’s Textbook of Organic Medicinal and Pharmaceutical Chemistry. Lippincott Williams & Wilkins.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
        "Brown, N. Artificial Intelligence in Drug Discovery. Cambridge: Royal Society of Chemistry.",
    ]),
    s("BP508P", "Industrial Pharmacognosy (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. To perform column chromatography for isolation of phytochemicals.",
                "2. Preparative TLC of curcuminoids.",
                "3. Isolation and identification of Piperine.",
                "4. Isolation and identification of Sennoside.",
                "5. Isolation and identification of Withanolide.",
                "6. Isolation and identification of Lycopene.",
                "7. Acid – base purification process for the separation of alkaloids.",
                "8. Chemoprofiling of purified alkaloidal fraction.",
                "9. Separation of amino acid by paper chromatography.",
                "10. TLC/HPTLC/HPLC of herbal extracts/ botanicals.",
                "11. Isolation and determination of total aldehyde content in volatile oil.",
                "12. Preparation of monographs on herbal drugs wrt IP, API, IHP.",
                "13. Determination of the alcohol content of Asava and Arista.",
                "14. Standardization of any two Ayurvedic formulations using UV-spectroscopy.",
                "15. Preparation and evaluation of Ayurvedic churna.",
                "16. Experiential learning-based experiments focused on the preparation and practical applications of folkloric or region-specific traditional formulations within the community.",
                "17. Case studies analyzing community awareness and usage patterns of various traditional formulations.",
            ]
        },
    ], false,
    [
        "Apply knowledge of chromatographic and spectroscopic techniques for the separation, isolation, and analysis of phytoconstituents.",
        "Learn isolation and characterization of major secondary metabolites and volatile oil constituents using standard laboratory methods.",
        "Perform chemoprofiling, purification, and quantitative estimation of herbal and Ayurvedic formulations.",
        "Prepare and document herbal drug monographs and traditional formulations as per IP, API, and IHP guidelines.",
        "Integrate experiential learning and community-based studies for understanding the use, quality, and awareness of traditional medicines.",
    ],
    [
        "1. Mukherjee, P. K. Quality Control of Herbal Drugs: An Approach to Evaluation of Botanicals. Business Horizons.",
        "Sinha, D., Mukherjee, S. and Chowdhury, S. Methods of Extraction of Phytochemicals. IGI Global.",
        "Zhang, J., Wen, C., Zhang, H., Duan, Y. and Ma, H. Extraction of Bioactive Compounds with Subcritical Water. Elsevier.",
    ]),
    s("BP509P", "Pharmaceutical Dosage Form II (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. To enhance the solubility of a BCS Class II drug by solid dispersion technique.",
                "2. To enhance the solubility of a BCS Class II drug by cyclodextrin complexation.",
                "3. Preparation and evaluation of medicated syrups using simple and artificial syrup bases.",
                "4. Preparation and evaluation of different types of pharmaceutical emulsions.",
                "5. Preparation and evaluation of an emulsion with a small-dose oily active (e.g., calciferol).",
                "6. Preparation and evaluation of an oral suspension.",
                "7. To study the effect of different suspending agents/concentrations on sedimentation volume.",
                "8. Preparation and evaluation of a dry powder for reconstitution as a suspension.",
                "9. Preparation and evaluation of pharmaceutical creams.",
                "10. Preparation and evaluation of pharmaceutical gels.",
                "11. To study the effect of different gelling agents/concentrations on viscosity of gels.",
                "12. Preparation and evaluation of medicated suppositories.",
                "13. Preparation and evaluation of medicated pessaries.",
                "14. Preparation and evaluation of in-situ gels.",
                "15. Preparation and evaluation of emulgels.",
            ]
        },
    ], false,
    [
        "Understand various solubility enhancement techniques.",
        "Provide hands-on experience in manufacturing processes and evaluation of monophasic and biphasic liquid dosage forms.",
        "Provide hands-on experience in manufacturing processes and evaluation of semisolid dosage forms.",
        "Learn manufacturing processes and evaluation of pressurised dosage forms.",
        "Understand the effects of formulation parameters on the performance of biphasic and semisolid dosage forms.",
    ],
    [
        "Aulton, M. E. Aulton’s Pharmaceutics: The Science of Dosage Form Design. Elsevier.",
        "Gibson, M. Pharmaceutical Preformulation and Formulation. CRC Press.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Robinson, J. R. and Lee, V. H. L. Controlled Drug Delivery: Fundamentals and Applications. CRC Press.",
        "Troy, D. B. and Beringer, P. Remington: The Science and Practice of Pharmacy. Pharmaceutical Press.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
    ]),
    s("BP510P", "Systemic Pharmacology II (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "1. Evaluation of analgesic activity of centrally and peripherally acting analgesics using Eddie's hot plate, tail-flick, tail immersion, and acetic acid-induced writhing methods through interactive computer simulation.",
                "2. Evaluation of antiepileptic activity using maximal electroconvulsive shock (MES)- induced seizures through interactive computer simulation.",
                "3. Demonstration of the antiepileptic activity using pentylenetetrazol-induced seizures through interactive computer simulation.",
                "4. Evaluation of antidepressant activity of drugs using the tail suspension test through interactive computer simulation.",
                "5. Demonstration and study of locomotor activity using actophotometer through interactive computer simulation.",
                "6. Evaluation of antianxiety activity using the elevated plus maze or zero maze model through interactive computer simulation.",
                "7. Evaluation of antipsychotic activity of drugs using inhibition of conditioned response on Cook's pole climbing apparatus through interactive computer simulation.",
                "8. Study of the effect of drugs on learning and memory using the Morris water maze test through interactive computer simulation.",
                "9. Study of antiulcer activity using indomethacin-induced or pylorus ligation-induced ulcer models.",
                "10. Estimation of the concentration of oxytocin on isolated rat uterus preparation using a suitable method through interactive computer-based simulation.",
                "11. Estimation of drug concentration by 3-point or 4-point bioassay through interactive computer simulation.",
                "12. Bioassay of histamine using matching, bracketing, or interpolation methods on suitable isolated tissue preparation with the help of interactive computer simulation.",
                "13. Study of cell culture techniques, including types of cell culture, laboratory instruments/equipment, culture media, and growth of cell cultures in laboratory facilities.",
                "14. Study of antibacterial sensitivity testing of urine culture using techniques such as the disc diffusion method (theoretical details/case studies).",
                "15. Demonstration using databases and software packages for predicting drug activity, ADME properties, and toxicity.",
                "16. Study of electrophoresis of protein and DNA samples and gel visualization techniques.",
            ]
        },
    ], false,
    [
        "Provide understanding of the theoretical and practical aspects of different pharmacological experiments using virtual simulations and video demonstrations.",
        "Develop skills to assess drug effects on various systems such as cardiovascular, respiratory, skeletal muscle, and gastrointestinal using simulation models.",
        "Familiarize the learners with experimental methodologies such as Langendorff’s heart preparation, spasmogenic and spasmolytic effects, and PA2 value determination using Schild plot.",
        "Provide knowledge of the modern techniques for drug evaluation, such as intraocular pressure measurement, nitric oxide estimation, neutrophil function tests and spirometry.",
        "Explore clinical pharmacology aspects through case studies on drug interactions, management of cardiovascular and respiratory diseases, and plasma volume expanders.",
    ],
    [
        "Ghosh, M. N. Fundamentals of Experimental Pharmacology. Hilton & Company.",
        "Vogel, H. G. Drug Discovery and Evaluation: Pharmacological Assays. Springer.",
        "Hofmann, F. B. Handbook of Experimental Pharmacology (HEP Series). Springer Nature.",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 6
// ─────────────────────────────────────────────────────────────
const SEM6: Subject[] = [
    s("BP601T", "Advanced Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "6 Hours", title: "Reverse Pharmacology and Integrative Approaches", topics: [
                "Reverse pharmacology and integrative approaches from the AYUSH perspective.",
                "Ethnopharmacological approach to bioprospecting. Traditional medicine databases: AYUSH Research Portal, ICMR Standards on Indian Medicinal Plants, TKDL, NAPRALERT, Super Natural, etc. Molecular docking and ADMET screening of bioactives. Concept of adjuvant therapy with herbals in metabolic and non-communicable diseases.",
            ]
        },
        {
            num: "II", hours: "11 Hours", title: "Metabolomics and Systems Biology", topics: [
                "Introduction to metabolomics and its tools: applications of NMR and HRMS in metabolomics, Metabolomics profiling and dereplication studies, Role of metabolomics in quality control, scientific, validation of traditional claims and pharmacological evaluation, Network pharmacology and systems biology approaches to herbal medicine, Significance of spectral libraries and chemoinformatics databases in drug discovery.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Modern Techniques in Natural Product Discovery", topics: [
                "Role of artificial intelligence (AI), Machine learning and big data in Drug discovery from natural Products. Molecular docking, Virtual Screening and Pharmacophore modelling, Use of Genomic and transcriptomic tools in medicinal plant research, High-throughput screening (HTS) and bioautography, .",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Validation and Development of Herbal Leads", topics: [
                "Bioactivity Guided Fractionation, characterization /Structure Elucidation, Optimization of lead compounds for better efficacy, safety, and stability through SAR and QSAR modelling for semi-synthetic compounds of Salicin, Artemisinin, Piperine, Papaverine and Andrographolides.",
                "Preclinical, Clinical Evaluation and New Drug approvals: Testing for toxicity as per OECD guidelines, pharmacokinetics, and bioavailability of herbal products, extracts and lead compounds, assessment of safety and efficacy, clinical trials with or without placebo for clinical endpoints based on assessment of quality of life reporting adverse events if any, filing IND application, NDA submission, Regulatory review and post marketing surveillance.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Patenting of Natural Products", topics: [
                "KEY TERMINOLOGIES AND CONCEPTS: Definitions and distinctions: Patent, Intellectual Property Rights (IPR) Farmers' Rights and Breeders' Rights, Bioprospecting and Biopiracy Patenting Aspects of Natural Products and Traditional Knowledge: Legal frameworks and challenges in patenting natural substances, Traditional Knowledge Digital Library (TKDL) and its role in protecting indigenous knowledge. Role of National Biodiversity Authority in patenting natural products and NAGOYA protocol. Case Studies: Turmeric– U.S. patent on wound healing and its revocation, Neem– Biopiracy issue and patent cancellation.",
            ]
        },
    ], false,
    [
        "Understand reverse pharmacology and integrative approaches in natural drug discovery.",
        "Apply metabolomics and systems biology tools for quality control and bioactivity evaluation of herbal medicines.",
        "Explore modern AI-driven, in-silico, and high-throughput techniques for identification and optimization of natural product leads.",
        "Study validation, safety, and development pathways of herbal leads including preclinical and clinical evaluation.",
        "Understand legal, ethical, and patenting frameworks related to bioprospecting, traditional knowledge protection, and natural product innovation.",
    ],
    [
        "Bhat, S. V., Nagasampagi, B. A. and Sivakumar, M. Chemistry of Natural Products. Springer.",
        "Gräbley, S. and Thiericke, R. Drug Discovery from Nature. Springer.",
        "Hanessian, S. Natural Products in Medicinal Chemistry. Wiley-VCH.",
        "Ikan, R. Natural Products: A Laboratory Guide. Academic Press.",
        "Kemp, W. Spectroscopic Methods in Organic Chemistry. Macmillan.",
        "Narayanan, P. Intellectual Property Law. Eastern Law House.",
        "Sarker, S. D., Latif, Z. and Gray, A. I. Natural Products: Isolation, Structure Elucidation and History. Elsevier.",
    ]),
    s("BP602T", "Biopharmaceutics and Pharmacokinetics", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Introduction to Biopharmaceutics and Pharmacokinetics", topics: [
                "Introduction to various Pharmacokinetic parameters (using Plasma drug Concentration vs Time curve) and Pharmacodynamic parameters and drug delivery index.",
                "Absorption; Mechanisms of drug absorption through GIT, Physicochemical, Biological and Dosage form related factors influencing drug absorption though GIT, methods of Assessment of GIT absorption, Distribution Tissue permeability of drugs, binding of drugs, apparent volume of drug distribution, plasma and tissue protein binding of drugs, factors affecting protein-drug binding. Kinetics of protein binding, Clinical significance of protein binding of drugs.",
                "Elimination (Metabolism and Elimination): Drug metabolism and basic understanding of metabolic pathways renal excretion of drugs, factors affecting renal excretion of drugs, renal clearance, non renal routes of drug excretion of drugs.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Drug Distribution, Binding and Elimination", topics: [
                "BIOAVAILABILITY AND BIOEQUIVALENCE: Definition and Objectives of bioavailability, absolute and relative bioavailability, Introduction to BCS and biopharmaceutical drug disposition classification system, methods of measurement of bioavailability (Plasma data, Urinary excretion data), Protocol for assessment of bioavailability and bioequivalence studies. invitro drug dissolution methods (test apparatus I-VII), biorelevant dissolution mediums, in-vitro in-vivo correlations: Concept and Applications, Biowaivers, Methods of enhancement of bioavailability.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Pharmacokinetics — One-Compartment and Multicompartment Models", topics: [
                "PHARMACOKINETIC MODELS: Compartment Models: Definition, Basis of classification, Properties of compartment, Advantages and disadvantages of compartment modelling. Kinetic considerations of One compartment open model. (a). Intravenous Injection (Bolus/rapid) (b). Intravenous infusion and (c) Extra-vascular administration. (with emphasis on Curve Fitting, Wagner –Nelson, Loo Riegelman) Introduction to non - compartment model: Principles, estimation of PK parameters (AUC, AUMC, MRT, MAT statistical moment theory).",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Non-Linear Pharmacokinetics", topics: [
                "MULTICOMPARTMENT MODELS: Multiple dosage regimen: dosing interval, drug accumulation, loading dose, maintenance dose, PK Parameters Kinetic consideration of two compartment open model (a) Intravenous Injection (Bolus/rapid) and (b) Extra vascular administrations (oral administration).",
                "Kinetics of multiple dosing, steady state drug levels, calculation of loading and maintenance doses and their clinical significance. Multiple dosage regimen.",
                "Introduction to pharmacokinetic consideration of Modified release drug products.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Bioavailability, Bioequivalence and Clinical Pharmacokinetics", topics: [
                "NONLINEAR PHARMACOKINETICS: Introduction, Reasons for Non-linearity, Michaelis-menton method of estimating parameters, Explanation with example of drugs.",
                "APPLICATION OF PK SOFTWARE: Introduction of various in -silico methods for calculating various PK parameters.",
            ]
        },
    ], false,
    [
        "Describe fundamental biopharmaceutics and pharmacokinetic principles governing drug absorption, distribution, metabolism, and excretion.",
        "Analyze the physicochemical and biological factors that determine drug bioavailability, protein binding, and elimination pathways.",
        "Illustrate compartmental pharmacokinetic models, and their evaluations through application of mathematical equations to calculate key parameters.",
        "Design, conduct, and interpret bioavailability, bioequivalence, and in vitro–in vivo correlation studies.",
        "Apply pharmacokinetic principles to optimize dosing regimens—including loading and maintenance doses and steady-state kinetics—and utilize software tools to analyze both linear and non-linear drug kinetics.",
    ],
    [
        "1. Shargel, L. and Yu, A. B. C. Applied Biopharmaceutics and Pharmacokinetics. McGraw-Hill Education.",
        "Gibaldi, M. Biopharmaceutics and Clinical Pharmacokinetics. Lea & Febiger.",
        "Rowland, M. and Tozer, T. N. Clinical Pharmacokinetics and Pharmacodynamics: Concepts and Applications. Wolters Kluwer.",
        "Bonate, P. L. Pharmacokinetic-Pharmacodynamic Modeling and Simulation. Springer.",
        "Brahmankar, D. M. and Jaiswal, S. B. Biopharmaceutics and Pharmacokinetics: A Treatise. Vallabh Prakashan.",
        "Eddy, D. M. Modeling and Simulation in the Medical and Health Sciences. Springer.",
    ]),
    s("BP603T", "Intellectual Property Rights", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Intellectual Property", topics: [
                "Definition and scope of Intellectual Property (IP), Importance and types of IP: Patents, Trademarks, Copyrights and Trade Secrets, Overview of the origin and progression of intellectual property rights in India and internationally, Role of IP in the pharmaceutical industry.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Patents – Fundamentals and Process", topics: [
                "Definition and objectives of patents, Criteria for patentability such as Novelty/innovations, Non-obviousness, Utility, Types of patents and nonpatentable inventions in India, Procedure for filing a patent in India, Rights of a patent holder and term of patent protection.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Patent Laws and Acts", topics: [
                "Overview of Indian Patent Act, 1970 (latest amendments and key provisions under the act), TRIPS Agreement and its implications on the Indian pharmaceutical sector, Compulsory licensing, patent opposition, and revocation, Indian pharmaceutical patents: Case studies.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Other Forms of Intellectual Property", topics: [
                "TRADEMARKS, COPYRIGHTS, INDUSTRIAL DESIGNS: Definition, importance, registration process, Basics and protection in scientific work, Importance and legal framework, Trade secrets and geographical indications in pharma industry.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Ipr Management and Commercialization", topics: [
                "Valuation and strategies for commercialization of intellectual property; processes of technology transfer, licensing agreements, and collaborative ventures; issues related to IP infringement and available legal remedies; management practices of IPR in the pharmaceutical industry supported by relevant case studies.",
            ]
        },
    ], false,
    [
        "Introduce the fundamental concepts and types of intellectual property (IP) and highlight their importance in the pharmaceutical and healthcare sectors.",
        "Understand the procedures and legal frameworks related to patent filing, granting, and protection of intellectual property.",
        "Develop awareness of international and national IP laws and treaties, including the TRIPS agreement and Indian Patent Act, and their implications for the pharmaceutical industry.",
        "Provide insights into the management and commercialization of IP, including licensing, technology transfer, and joint ventures.",
        "Familiarize with common IP infringement issues and remedies, using real-world case studies from the pharmaceutical industry to illustrate key principles.",
    ],
    [
        "World Intellectual Property Organization. Introduction to Intellectual Property. WIPO.",
        "Indian IPR. https://ipindia.gov.in/",
        "Ahuja, V. K. Law Relating to Intellectual Property Rights. LexisNexis.",
        "Bouchoux, D. Intellectual Property. Cengage Learning.",
        "Ganguli, P. Intellectual Property Rights: Unleashing the Knowledge Economy. Tata McGraw-Hill.",
        "Narayanan, P. Intellectual Property Law. Eastern Law House.",
        "Ramakrishna, T. Basic Principles and Acquisition of Intellectual Property Rights. CIPRA.",
        "Sreenivasulu, N. S. Law Relating to Intellectual Property. Partridge Publishing.",
        "Vaidhyanathan, S. Intellectual Property: A Very Short Introduction. Oxford University Press.",
        "Wadehra, B. L. Law Relating to Intellectual Property. Universal Law Publishing.",
    ]),
    s("BP604T", "AI Applications in Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI in Natural Products & Pharmacognostic Data Modeling", topics: [
                "Overview of ML applications in natural products.",
                "Representation of crude drug data (morphological, microscopic, phytochemical, chromatographic features).",
                "Structuring herbal datasets for predictive modeling.",
                "Classification models for authentication of crude drugs.",
                "(authentic vs adulterated).",
                "Regression models for prediction of secondary metabolite yield.",
                "Application of AI in phytochemical screening and prioritization.",
                "Herb-drug interaction prediction using database-driven approaches.",
                "Limitations of predictive modeling in natural products.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "AI in Medicinal & Pharmaceutical Chemistry", topics: [
                "Overview of the role of AI applications in pharmaceutical chemistry with focus on drug discovery concepts.",
                "Conversion of molecular structures into numerical descriptors.",
                "(MW, logP, HBD/HBA, TPSA).",
                "Structured chemical datasets and QSAR modeling.",
                "Regression and classification models for predicting biological activity (IC₅₀, solubility, ADMET properties), toxicities.",
                "Virtual screening and lead optimization concepts.",
                "Limitations of ML models and importance of chemical reasoning.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in Drug Product Design & Performance Prediction", topics: [
                "Overview of AI models across formulation development stages, with emphasis on the applications and limitations.",
                "Overview of dosage form development and formulation variables.",
                "Machine learning in formulation optimization and excipient selection.",
                "Regression modeling for solubility and bioavailability enhancement.",
                "Time-concentration modeling for drug release interpretation.",
                "Stability study design and modeling degradation trends.",
                "Shelf-life estimation using regression-based approaches.",
                "Practical limitations of extrapolation in formulation science.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "AI in Process Monitoring & Production Systems", topics: [
                "Overview of introduces multivariate analysis in pharmaceutical analytical techniques with focus on the different models and their applications.",
                "Digital data acquisition in pharmaceutical production.",
                "Critical Quality Attributes (CQAs) and Critical Process.",
                "Parameters (CPPs).",
                "Correlation analysis for identifying process variability.",
                "Logistic regression models for batch pass/fail prediction.",
                "Feature importance in process monitoring, predictive maintenance concepts.",
                "Ethical and regulatory considerations in automated decisionmaking, and limitations of predictive models in manufacturing environments.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "AI in Pharmaceutical Analysis & Chemometrics", topics: [
                "Overview of multivariate analysis in pharmaceutical analytical techniques with focus on the different models and their applications.",
                "Introduction to chemometrics and multivariate analytical data.",
                "Spectroscopic data modeling (UV/IR interpretation).",
                "Regression analysis in quantitative pharmaceutical analysis.",
                "Chromatographic peak modeling and interpretation.",
                "Classification models for genuine vs counterfeit detection.",
                "Handling noise and variability in analytical datasets.",
                "Limitations of AI models in analytical decision-making.",
            ]
        },
    ], true,
    [
        "Introduce applications of artificial intelligence and machine learning across major pharmaceutical disciplines.",
        "Understand the structured data in natural products, medicinal chemistry, formulation science, and manufacturing",
        "Interpret regression and classification models in drug discovery, product performance, and quality monitoring.",
        "Build awareness of predictive modeling for pharmaceutical decision-making.",
        "Understand multivariate analysis in pharmaceutical analytical techniques.",
    ],
    [
        "Bakeev, K. A. Process Analytical Technology: Spectroscopic Tools and Implementation Strategies for the Chemical and Pharmaceutical Industries. Wiley.",
        "Brown, N. Artificial Intelligence in Drug Discovery. Royal Society of Chemistry.",
        "Chavda, V., et al. Bioinformatics Tools for Pharmaceutical Drug Product Development.",
        "Gibson, M. Pharmaceutical Preformulation and Formulation. CRC Press.",
        "Hanessian, S. Natural Products in Medicinal Chemistry. Wiley.",
        "Pais, A., et al. Artificial Intelligence for Drug Product Lifecycle Applications.",
        "Schlindwein, W. S. and Gibson, M. Pharmaceutical Quality by Design: A Practical Approach. Wiley.",
        "World Health Organization. Quality Assurance of Pharmaceuticals: A Compendium of Guidelines and Related Materials. WHO Press",
    ]),
    s("BP605T", "Pharmaceutical Analysis", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Electrochemical Methods of Analysis", topics: [
                "POTENTIOMETRY: Electrode potential, electrochemical cell, construction and working of reference and indicator electrodes including membrane electrodes, measurement of potential and pH, potentiometric titrations, methods of detecting end point and Karl Fischer titration.",
                "CONDUCTOMETRY: Introduction, conductivity cell, conductometric titrations and applications.",
                "POLAROGRAPHY: Introduction, residual current, migration current, diffusion current and limiting current, DME, polarographic wave, Ilkovic’s equation (Statement Only), and applications.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Spectroscopy", topics: [
                "FUNDAMENTALS OF SPECTROSCOPY: Properties of electromagnetic radiation, electromagnetic spectrum.",
                "UV VISIBLE SPECTROSCOPY: Beer and Lambert’s law, Derivation and deviations. Electronic transitions, chromophores, auxochromes, spectral shifts, solvent effect on absorption spectra, Instrumentation - Sources of radiation, wavelength selectors, sample cells, detectors (Photo tube, Photomultiplier tube, Photo voltaic cell, Silicon Photodiode). Applications single and multi component analysis of pharmaceuticals.",
                "IR SPECTROSCOPY: Introduction, fundamental modes of vibrations in poly atomic molecules, factors affecting vibrations, Instrumentation of dispersive Infrared spectrophotometer (including sample handling Techniques) and FTIR.",
                "Pharmaceutical applications.",
            ]
        },
        {
            num: "III", hours: "7 Hours", title: "Fluorometric Analysis", topics: [
                "Theory, luminescence, factors affecting fluorescence, quenching. Instrumentation and pharmaceutical applications.",
                "Flame Photometry and Atomic Absorption Spectrometry:",
                "Theory, nebulisation, flame and flame temperature, interferences, instrumentation and pharmaceutical applications.",
                "NEPHELOTURBIDOMETRY: Principle, instrumentation and applications.",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Introduction to Chromatographic Techniques", topics: [
                "Principle, various stationary and mobile phases, diverse development and detection techniques and applications of column, paper and thin layer chromatography.",
                "ION-EXCHANGE CHROMATOGRAPHY: Introduction, principles, types of ions exchange resins, factors affecting ion exchange, methodology and applications.",
                "GEL FILTRATION AND AFFINITY CHROMATOGRAPHY: Principles and applications.",
                "ELECTROPHORESIS: Introduction, factors affecting electrophoretic mobility, Techniques of paper, gel, capillary electrophoresis, applications.",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Chromatographic Techniques and Method Validation (ICH Q2)", topics: [
                "GAS CHROMATOGRAPHY: Introduction, theory, instrumentation, derivatization, temperature programming, advantages, disadvantages and applications.",
                "HIGH PERFORMANCE LIQUID CHROMATOGRAPHY: Introduction, theory, instrumentation, advantages and applications.",
                "HPTLC: Principle, instrumentation and applications.",
            ]
        },
    ], false,
    [
        "Understand the interaction of matter with electromagnetic radiation and its application in spectroscopic methods for pharmaceutical drug analysis.",
        "Study the principles, instrumentation, and pharmaceutical applications of electroanalytical techniques such as potentiometry, conductometry, polarography, and amperometry.",
        "Understand and apply various chromatographic and electrophoretic separation techniques used for qualitative and quantitative analysis of drugs.",
        "Impart knowledge of instrumental methods used for accurate qualitative and quantitative analysis of pharmaceutical substances.",
        "Develop the ability to select, optimize, and validate suitable analytical techniques, interpret analytical data.",
    ],
    [
        "Braun, R. D. Analytical Chemistry: A Modern Approach to Analytical Science. McGraw-Hill.",
        "Dyer, J. R. Applications of Absorption Spectroscopy of Organic Molecules. Prentice Hall.",
        "Harvey, D. Modern Analytical Chemistry. McGraw-Hill.",
        "Sharma, Y. R. Organic Spectroscopy. S. Chand.",
        "Skoog, D. A., Holler, F. J. and Crouch, S. R. Principles of Instrumental Analysis. Cengage Learning.",
        "Watson, D. G. Pharmaceutical Analysis. Elsevier.",
    ]),
    s("BP606T", "Pharmaceutical Jurisprudence", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Drugs and Cosmetics Act, 1940 and Its Rules 1945", topics: [
                "Objectives, Definitions, Legal definitions of schedules to the Act and Rules, CDSCO guidelines for Import & export of Pharmaceuticals Manufacture of drugs – Prohibition of manufacture and sale of certain drugs, Conditions for grant of license and conditions of license for manufacture of drugs, Manufacture of drugs for test, examination and analysis, manufacture of new drug, loan license and repacking license.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Drugs and Cosmetics Act, 1940 and Its Rules 1945", topics: [
                "Detailed study of Schedule G, H, H1, M, N, P, T, U, V, X, Y, Sch F, Part XII B.",
                "SALE OF DRUGS: Wholesale, Retail sale and Restricted license.",
                "Offences and penalties.",
                "Labeling & packing of drugs- General labeling requirements and specimen labels for drugs and cosmetics, List of permitted colors. Offences and penalties.",
                "Administration of the Act and Rules – Drugs Technical Advisory Board, Central drugs Laboratory, Drugs Consultative Committee, Government drug analysts, Licensing authorities, controlling authorities, Drugs Inspectors.",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Schedules to D&C Act, Good Manufacturing Practices (Schedule M)", topics: [
                "PHARMACY ACT: 1948: Objectives, Definitions, Pharmacy Council of India; its constitution and functions, Education s including ER20, State and Joint state pharmacy councils; constitution and functions, Registration of Pharmacists, Offences and Penalties.",
                "MEDICINAL AND TOILET PREPARATION ACT: 1955: Objectives, Definitions, Licensing, Manufacture In bond and Outside bond, Export of alcoholic preparations, Offences and Penalties.",
                "Narcotic Drugs and Psychotropic substances Act-1985 and Rules: Objectives, Definitions, Authorities and Officers, Constitution and Functions of narcotic &Psychotropic Consultative Committee, National Fund for Controlling the Drug Abuse, Prohibition, Control and , opium poppy cultivation and production of poppy straw, manufacture, sale and export of opium, Offences and Penalties.",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Narcotic Drugs and Psychotropic Substances (NDPS) Act 1985 & Medical Termination of Pregnancy Act", topics: [
                "Study of Salient Features of Drugs and Magic Remedies Act and its rules: Objectives, Definitions, Prohibition of certain advertisements, Classes of Exempted advertisements, Offences and Penalties.",
                "Prevention of Cruelty to animals Act-1960: Objectives, Definitions, Institutional Animal Ethics Committee, CCSEA guidelines for Breeding and Stocking of Animals, Performance of Experiments, Transfer and acquisition of animals for experiment, Records, Power to suspend or revoke registration, Offences and Penalties.",
                "NATIONAL PHARMACEUTICAL PRICING AUTHORITY: Drugs Price Control Order (DPCO)- 2013. Objectives, Definitions, Sale prices of bulk drugs, Retail price of formulations, Retail price and ceiling price of scheduled formulations, National List of Essential Medicines (NLEM).",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "DPCO, Patent Act, Prevention of Cruelty to Animals Act & CDSCO Regulatory System", topics: [
                "PHARMACEUTICAL LEGISLATIONS: A brief review, Introduction, Study of drugs enquiry committee, Health survey and development committee, Hathi committee and Mudaliar committee.",
                "CODE OF PHARMACEUTICAL ETHICS: Definition, Pharmacist in relation to his job, trade, medical profession and his profession, • Medical Termination of Pregnancy Act.",
                "Brief Introduction to Right to Information Act.",
                "Introduction New Drugs and Clinical Trials Rules, 2019 and amendments.",
                "Cosmetic rules 2020.",
                "Regulatory guidelines on similar biologics.",
                "Overview of Medical Device s, Guidelines on Probiotics, Food Safety and Standards (Health Supplements, Nutraceuticals, Food for Special Dietary Use, Food for Special Medical Purpose, Functional Food and Novel Food) s, 2016.",
            ]
        },
    ], false,
    [
        "Understand the fundamental principles and scope of pharmaceutical legislations governing drug development, manufacture, distribution, and marketing.",
        "Gain comprehensive knowledge of Indian pharmaceutical Acts and Rules, including Drugs and Cosmetics Act, Pharmacy Act, NDPS Act, and related regulations.",
        "Learn the roles, responsibilities, and functions of regulatory authorities involved in regulation and control of pharmaceuticals in India.",
        "Learn the code of pharmaceutical ethics and legal responsibilities in professional pharmacy practice.",
        "Develop the ability to analyse regulatory frameworks, pricing controls, and emerging regulations, and assess their impact on public health, industry compliance, and patient safety.",
    ],
    [
        "1. Government of India. Drugs and Cosmetics Act and Rules. Government of India.",
        "Government of India. Drugs and Magic Remedies (Objectionable Advertisements) Act. Government of India.",
        "Government of India. Medicinal and Toilet Preparations (Excise Duties) Act. Government of India.",
        "Government of India. Narcotic Drugs and Psychotropic Substances Act. Government of India.",
        "Government of India. New Drugs and Clinical Trials Rules, 2019. Government of India.",
        "Central Drugs Standard Control Organization and Department of Biotechnology. Guidelines on Similar Biologics: Regulatory Requirements for Marketing Authorization in India. Government of India.",
    ]),
    s("BP607T AEC", "AEC Elective — Green Chemistry / Materiovigilance / Scientific Writing / Drug Store Management / Medicinal Plant Cultivation / API Sciences", 1, "T", [
        {
            num: "I", hours: "15 Hours", title: "Option 1: BP607T AEC1 — Green Chemistry (15 Hours)", topics: [
                "Introduction to Green Chemistry in Pharmacy",
                "Definition and scope of green chemistry in pharmaceutical sciences",
                "Principles of Green Chemistry with pharmaceutical examples Environmental Aspects and Metrics in Green Pharmacy",
                "Comparison of traditional vs. green chemical approaches in drug synthesis",
                "Environmental impact of pharmaceutical manufacturing",
                "Overview of pharmaceutical pollutants and their life cycle",
                "Metrics: Atom economy, E-factor, Process Mass Intensity (PMI) Green Techniques in Pharmaceutical Synthesis – I",
                "Green Solvents and use of green solvents (e.g. water, supercritical fluids, ionic liquids) in drug synthesis",
                "Solvent-free reactions in pharmaceutical synthesis",
                "Green Catalysis and Reaction Enhancement in pharmaceutical green chemistry – Overview of catalysis in pharmaceutical green chemistry, Photochemical Transformations, Phase Transfer Catalysis Green Techniques in Pharmaceutical Synthesis – II",
                "Microwave assisted reactions: Merit and demerits of its use",
                "Mechanism, superheating effects of microwave",
                "Effects of solvents in microwave assisted synthesis",
                "Microwave technology in process optimization",
                "Applications in various organic reactions and heterocycles synthesis Green Chemistry in Industrial and Regulatory Aspects",
                "Green chemistry in pharmaceutical manufacturing processes",
                "Ultrasound assisted reactions: Types of sonochemical reactions, synthetic applications",
                "Continuous flow reactors: Working principle, advantages and synthetic applications",
                "Waste minimization and pollution control in formulation industries",
                "Role of green chemistry in Good Manufacturing Practices (GMP)",
            ]
        },
        {
            num: "II", hours: "15 Hours", title: "Option 2: BP607T AEC2 — Materiovigilance and Hemovigilance (15 Hours)", topics: [
                "Introduction to Vigilance Systems",
                "Overview of Materiovigilance, Hemovigilance and other vigilance system in Healthcare",
                "Importance of post-marketing surveillance in patient safety",
                "Scope and objectives of materiovigilance and hemovigilance programs",
                "Basic concepts of adverse event reporting and safety monitoring",
                "Historical evolution and global relevance of Materiovigilance, Hemovigilance practices Materiovigilance – Principles and Practices",
                "Introduction to Materiovigilance Programme of India (MvPI)",
                "Roles of NCC-MvPI and technical collaborators (e.g., Sree Chitra Tirunal Institute)",
                "Classification of medical devices (Class A to D) based on risk",
                "Identification and documentation of Medical Device Adverse Events (MDAEs)",
                "Medical device reporting forms, process flow, and responsibilities",
                "Causality assessment of Medical Device Adverse Events Hemovigilance – Principles and Practices",
                "Overview of Hemovigilance Programme of India (HvPI)",
                "Organizational structure: NIB, NBTC, hospital-based hemovigilance",
                "Adverse Transfusion Reactions (ATRs): Types and clinical manifestations",
                "Use of TRRF (Transfusion Reaction Reporting Form) and Haemo- Vigil software",
                "Responsibilities of blood banks, transfusion officers, and healthcare providers",
                "Case examples along with Causality assessment of Hemolytic reactions, TRALI, TACO, allergic responses. Global s, Risk Assessment & Root Cause Analysis",
                "International frameworks: US FDA (MAUDE), EU MDR, SHOT (UK), French Hemovigilance",
                "Comparison of Indian and global materiovigilance/hemovigilance practices",
                "Signal detection and evaluation of adverse events",
                "Root cause analysis (RCA) and implementation of corrective & preventive actions (CAPA)",
                "Risk communication and role of healthcare teams in mitigation Reporting Systems, Quality Assurance, and Professional Role Demonstration: Reporting of MDAEs and ATRs using mock forms",
                "Practical exercises in form-filling and event documentation",
                "Integration of vigilance into hospital quality systems (e.g., NABH, ISO)",
                "Strategies to enhance adverse event reporting culture",
                "Ethical considerations and communication with patients/families",
                "Role of pharmacists, nurses, clinicians, biomedical engineers in vigilance programs",
            ]
        },
        {
            num: "III", hours: "15 Hours", title: "Option 3: BP607T AEC3 — Scientific Writing (15 Hours)", topics: [
                "Introduction to Scientific Writing",
                "Overview of the course",
                "Principles of scientific writing",
                "Overview of scientific research",
                "Introduction to Microsoft tools and its application Writing Literature Reviews and Scientific Papers",
                "Structure and format of literature reviews",
                "Conducting a literature review",
                "Analyzing literature and developing themes",
                "Writing a compelling introduction",
                "Developing a clear methodology",
                "Results and analysis Communicating Results and Data",
                "Understanding data presentation",
                "Developing tables and figures",
                "Using effective graphic design Scientific Citation and Referencing",
                "Understanding citation styles",
                "Citation and plagiarism",
                "Referencing in scientific writing Ethical Issues in Scientific Writing and Peer Review and Revision",
                "Ethical principles in scientific writing",
                "Misconduct and fraud in scientific writing",
                "Peer review and publication ethics",
                "Providing Constructive feedback",
                "Responding to feedback",
            ]
        },
        {
            num: "IV", hours: "15 Hours", title: "Option 4: BP607T AEC4 — Drug Store and Business Management (15 Hours)", topics: [
                "Introduction to Trade and Industry",
                "Objectives and scope of business",
                "Classification of business activities – industry, commerce, trade",
                "Forms of business organization: sole proprietorship, partnership, cooperatives, corporations",
                "Features and merits/demerits of each form Pharmacy business and its legal considerations Drug Store Management",
                "Selection of site, space, and layout of a drug store",
                "Types of drug stores – hospital pharmacy, community pharmacy, chain pharmacy",
                "Procurement of drugs and inventory control",
                "Storage conditions and stock maintenance (cold storage, poisonous drugs, etc.)",
                "Records and registers to be maintained Inventory Control and Sales Promotion",
                "Introduction to inventory control: need and methods",
                "Economic Order Quantity (EOQ), Reorder Level (ROL), Lead time",
                "FIFO and LIFO methods",
                "Sales promotion techniques: advertising, displays, discounts",
                "Customer relationship management (CRM) in pharmacy Financial Management and Bookkeeping",
                "Basics of accounting: journal, ledger, trial balance",
                "Introduction to financial statements: profit and loss account, balance sheet",
                "Pricing policies: markup, markdown, break-even analysis",
                "Bank transactions: types of accounts, cheques, drafts",
                "Taxation basics: GST, income tax (as applicable to pharmacies) Pharmaceutical Marketing and Entrepreneurships",
                "Definition and scope of pharmaceutical marketing",
                "Elements of marketing mix (4Ps) for pharmacy",
                "Drug distribution channels: wholesale and retail",
                "Entrepreneurship development in pharmacy",
                "Regulatory aspects of retail drug licensing (Drug and Cosmetics Act overview)",
            ]
        },
        {
            num: "V", hours: "15 Hours", title: "Option 5: BP607T AEC5 — Career Building in Cultivation of Medicinal Plants (15 Hours)", topics: [
                "Introduction and Industry Overview",
                "Definition, importance, and cultural background (Ayurveda & ethnobotany)",
                "Global and Indian demand, healthcare and pharma role",
                "Key stakeholders: farmers, traders, processors, exporters",
                "Value chain, supply-demand, government/private initiatives (NMPB, AYUSH, NABARD) Key Medicinal Plants and Cultivation Basics",
                "Botanical characteristics and uses of major plants: Ashwagandha, Tulsi, Aloe vera, Shatavari, Brahmi, etc.",
                "Regional suitability and agro-climatic zones",
                "Factors affecting Cultivation: Soil, propagation, irrigation, pest control, organic inputs",
                "Harvesting, post-harvest management and storage Organic Farming and Market Linkages",
                "Organic certification and sustainable farming practices",
                "Biodiversity conservation and agroforestry integration",
                "Processing, drying, packaging, branding",
                "Market linkages: pharma, cooperatives, online platforms, export guidelines Policy, Entrepreneurship and Digital Tools",
                "Government schemes and legal frameworks (NMPB, AYUSH, forest laws, GACP)",
                "Entrepreneurship: starting herbal farms, franchises, consulting, contract farming",
                "Digital tools: farm management software, GIS, mobile apps, e- commerce marketing Practical Exposure and Project Presentation",
                "Virtual/shortened farm/nursery visit or guest lecture (can be online)",
                "Group/individual project: business plan or herbal enterprise pitch presentation",
            ]
        },
        {
            num: "VI", hours: "15 Hours", title: "Option 6: BP607T AEC6 — Active Pharmaceutical Ingredients and Excipient Sciences (15 Hours)", topics: [
                "Introduction to APIs and Excipients",
                "Definitions, classifications, and sources (synthetic, natural, biotech APIs; functional excipients).",
                "Physicochemical properties: Solubility, polymorphism, hygroscopicity, particle characteristics.",
                "Roles in formulations: Bioavailability enhancement, stability, manufacturability.",
                "Industry overview: Global market trends, common examples (e.g., paracetamol API, HPMC excipient). Methodologies for Selection and Pre-formulation",
                "Excipient selection criteria: Functionality-related characteristics (FRC).",
                "Compatibility studies: Binary mixtures via DSC, FTIR, XRD.",
                "Analytical methodologies: HPLC/GC for purity, Karl Fischer titration, laser diffraction for PSD.",
                "QbD approach: Risk assessment for API-excipient interactions. Manufacturing Protocols",
                "API processes: Synthesis routes, crystallization, drying, milling",
                "lab- to-pilot scale-up.",
                "Excipient handling: Sieving, blending, lubrication protocols.",
                "GMP essentials: Equipment qualification, process validation.",
                "Unit operations: Wet/dry granulation, direct compression. Quality Control and Stability Protocols",
                "QC tests: Assay, dissolution, content uniformity (IP/USP methods).",
                "Stability studies: ICH Q1A zones, accelerated/forced degradation.",
                "Impurity profiling: Genotoxic impurities (ICH M7), residual solvents.",
                "In-process controls: Blend uniformity, weight variation. Regulatory Compliance and Industry Practices",
                "ICH Q7 guidelines for APIs",
                "USP-NF excipient monographs and Schedule M requirements",
                "Drug Master File (DMF) for APIs",
                "Certificate of Suitability (COS) for excipients",
                "Process and cleaning validation protocols",
                "Regulatory inspections (USFDA 483, EMA expectations)",
                "Emerging trends: green chemistry and bio-based excipients",
            ]
        },
    ], false,
    [
        "Comprehend the foundational principles and overarching scope of green chemistry within pharmaceutical sciences.",
        "Analyze and evaluate the environmental impact of traditional pharmaceutical manufacturing processes and the significance of green chemistry metrics.",
        "Acquire knowledge of diverse green chemical techniques, including alternative solvents and various catalytic approaches, for sustainable drug synthesis.",
        "Recognize the industrial application of green chemistry principles in pharmaceutical manufacturing processes, focusing on waste minimization and pollution control.",
        "To articulate the principles of green chemistry.",
        "Understand the concepts, scope, and importance of materiovigilance and hemovigilance systems in ensuring patient safety in healthcare.",
    ],
    [
        "Anastas, P.T. and Warner, J.C., 2000. Green chemistry: theory and practice. Oxford university press.",
        "Lancaster, M. (2016). Green Chemistry: An Introductory Text (3rd ed.). Royal Society of Chemistry.",
        "Green Chemistry in the Pharmaceutical Industry, Edited by Peter J. Dunn, Andrew Wells, and Michael T. Williams, 2010.",
        "Green Chemistry and Sustainable Technology: Biological, Pharmaceutical, and Macromolecular Systems, Edited by Satish A. Dake, Ravindra S. Shinde, Suresh C. Ameta, A. K. Haghi, 2022.",
        "Scalable Green Chemistry: Case Studies from the Pharmaceutical Industry, Edited by Stefan Koenig, 2013.",
        "1. Bertil Jacobson - Medical Device Safety: The of Medical Devices for Public Health and Safety, CRC Press",
        "Jack Wong - Handbook of Medical Device Regulatory Affairs in Asia, Pan Stanford Publishing",
        "Denise M. Harmening - Modern Blood Banking and Transfusion Practices, F.A. Davis Company",
    ]),
    s("BP608P", "Biopharmaceutics and Pharmacokinetics (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. To calculate MRT from the given data.",
                "2. To assess the effect of protein binding of a drug",
                "3. To report relative bioavailability of given drug product using urinary excretion data",
                "4. To report relative bioavailability of given drug product using plasma data",
                "5. Establish IVIVC from the given in vitro and in vivo data.",
                "6. To calculate pharmacokinetic parameters of a drug using given plasma level data.",
                "7. To report bioequivalence of drug products using given urinary excretion data administered",
                "8. To calculate absorption rate constant, elimination rate constant and elimination half- life of given excretion data by sigma minus method.",
                "9. To calculate absorption rate constant, elimination rate constant and elimination half- life of the given drug data administered by IV bolus injection represented by one compartment model.",
                "10. To calculate the absorption rate constant by using curve fitting method.",
            ]
        },
    ], false,
    [
        "Understand the dissolution profiles of pharmaceutical formulations using various media and conditions.",
        "Apply in vitro and ex vivo techniques to assess drug absorption, dissolution, and bioavailability.",
        "Interpret pharmacokinetic parameters using plasma and urinary excretion data.",
        "Establish in vitro–in vivo correlation (IVIVC) for drug products based on experimental datasets.",
        "Utilize software tools to simulate and analyze pharmacokinetic and pharmacodynamic data.",
    ],
    [
        "Bonate, P. L. Pharmacokinetic-Pharmacodynamic Modeling and Simulation. Springer.",
        "Brahmankar, D. M. and Jaiswal, S. B. Biopharmaceutics and Pharmacokinetics: A Treatise. Vallabh Prakashan.",
        "Eddy, D. M. Modeling and Simulation in the Medical and Health Sciences. Springer.",
        "Gibaldi, M. Biopharmaceutics and Clinical Pharmacokinetics. Lea & Febiger.",
        "Rowland, M. and Tozer, T. N. Clinical Pharmacokinetics and Pharmacodynamics. Wolters Kluwer.",
        "Shargel, L. and Yu, A. B. C. Applied Biopharmaceutics and Pharmacokinetics. McGraw- Hill Education.",
    ]),
    s("BP609P", "Pharmaceutical Analysis (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "1. Determination of the endpoint of a acid base titration by potentiometric method.",
                "2. Determination of end point of acid base titrations by conductometry.",
                "3. Determination of absorption maxima and effect of solvents on absorption maxima of organic compounds",
                "4. Assay of APIs by colorimetry.",
                "5. Assay of single component by UV- Spectrophotometer.",
                "6. Simultaneous estimation of multicomponent formulations by UV spectrophotometer.",
                "7. Identification of various functional groups in official compounds by FTIR as per IP.",
                "8. Assay of quinine sulphate by fluorimetry",
                "9. Determination of quenching effect by fluorimetry",
                "10. Assay of sodium chloride by flame photometry",
                "11. Assay of potassium chloride by flame photometry",
                "12. Determination of chlorides and sulphates by nephelo turbidometry",
                "13. Separation of amino acids by paper chromatography",
                "14. Separation of mixture of components by thin layer chromatography",
                "15. Demonstration experiment on GC",
                "16. Determination of official compounds by HPLC (anyone)",
                "17. Demonstration experiment on HPTLC.",
            ]
        },
    ], false,
    [
        "Understand the fundamental principles behind various analytical techniques including titrations, spectrophotometry, fluorimetry, flame photometry, and chromatography.",
        "Develop proficiency in performing quantitative and qualitative analyses of pharmaceutical compounds using classical and instrumental methods.",
        "Learn to operate and maintain laboratory instruments such as potentiometers, conductometers, spectrophotometers, fluorimeters, flame photometers, and chromatographic systems.",
        "Apply appropriate analytical techniques for specific analytical challenges and interpretation, including single and multi-component assays, identification of functional groups, and separation of mixtures.",
        "Learn good laboratory practices and safety protocols in handling chemicals and operating instruments.",
    ],
    [
        "Vogel, A.I., Textbook of Quantitative Chemical Analysis. Longman Scientific & Technical.",
        "Beckett, A.H., and Stenlake, J.B., Practical Pharmaceutical Chemistry: Part II. Athlone Press.",
        "Skoog, D.A., Holler, F.J., and Crouch, S.R., Principles of Instrumental Analysis. Cengage Learning.",
    ]),
    s("BP610P SEC", "SEC Elective — Computer-Aided Drug Design / Analytical Method Development / Principles of Preclinical Studies (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP610P SEC1 — Computer-Aided Drug Design (30 Hours)", topics: [
                "General Instruction on Computational Tools Open-source computational tools are preferred for teaching and learning purposes. However, institutions may select appropriate software platforms or online resources based on availability, institutional policy, and technical feasibility. The choice of software should enable students to perform the required computational tasks effectively. The specific software used may vary, but the learning outcomes and computational procedures described below must be achieved using suitable tools.",
                "1. Target Identification and Preparation; • Retrieve protein sequence or structural information from publicly available biological databases.; • Prepare the target protein by removing unwanted molecules, correcting structural issues, and adding necessary atoms or charges using appropriate molecular visualization or preparation tools.; • Identify potential binding or active sites using computational methods that analyze structural pockets and cavities.",
                "2. Ligand Design and Optimization; • Design or sketch candidate molecules using suitable molecular drawing tools.; • Convert structures into three-dimensional form and optimize their geometry using computational chemistry methods.; • Generate multiple conformations of the molecule and perform energy minimization to obtain stable structures.",
                "3. Molecular Docking; • Perform docking simulations using computational docking platforms to predict the interaction between ligands and the target protein.; • Examine binding orientations and molecular interactions using visualization tools.; • Rank compounds based on predicted binding affinity and interaction quality.",
                "4. Pharmacophore Modeling; • Identify essential molecular features responsible for biological activity such as hydrogen bond donors/acceptors, hydrophobic regions, and aromatic centers.; • Construct pharmacophore models representing these key features.; • Use these models to screen compound libraries for molecules that match the required feature pattern.",
                "5. QSAR Modeling; • Calculate molecular descriptors that represent structural and physicochemical properties of compounds.; • Develop predictive statistical or machine learning models that relate these descriptors to biological activity.; • Validate models using appropriate validation techniques such as cross-validation and external datasets.",
                "6. ADMET Prediction; • Evaluate pharmacokinetic and toxicity properties computationally, including:; o Absorption; o Distribution; o Metabolism; o Excretion; o Toxicity; • Use predictive computational models and online resources to assess drug- likeness and safety profiles.",
                "7. Molecular Dynamics Simulations; • Conduct simulations to study the dynamic behavior of the protein–ligand complex over time.; • Analyze parameters such as structural stability, atomic fluctuations, hydrogen bonding, and interaction persistence.; • Visualize simulation trajectories to understand conformational changes and binding stability.",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP610P SEC2 — Analytical Method Development and Validation (30 Hours)", topics: [
                "1. Development of a UV-Visible spectrophotometric method for the assay of paracetamol API. Construction of calibration curve for a model API using UV-Visible spectrophotometry.",
                "2. Determination of solid dosage form by using dissolution method.",
                "3. Analytical method development and validation of Atenolol/metformin by using HPLC.",
                "4. Investigation of different columns for HPLC separation of a Multi-component Drug Mixture.",
                "5. Optimization of mobile Phase composition for HPLC analysis of a selected drug.",
                "6. Optimization of Flow rate and temperature in HPLC for paracetamol/ caffeine.",
                "7. Selection of wavelength for spectrophotometric analysis by HPLC of Marketed drugs.",
                "8. Determination of λmax and calibration curve for qualitative analysis of paracetamol.",
                "9. Determination of effect of pH on Retention time in RP-HPLC.",
                "10. Validation of HPLC method : Determination of LOD and LOQ for paracetamol by HPLC",
                "11. Preliminary Investigation of forced Degradation studies on Ibuprofen by HPLC.",
                "12. Method development for related substances of a drug substance using HPLC.",
                "13. Determination of residual solvent analysis for ethanol/acetone in API by using Gas Chromatography.",
                "14. Development of titrimetric method for the assay of marketed drugs(Ascorbic acid/sodium bicarbonate).",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Option 3: BP610P SEC3 — Principles of Preclinical Studies (30 Hours)", topics: [
                "1. Handling, restraining, and sex differentiation of laboratory animals (demo/video)",
                "2. Calculation of dose for animals based on body surface area",
                "3. Routes of administration: oral, intraperitoneal, subcutaneous (simulation)",
                "4. Observation of behavioral effects using actophotometer/rotarod (if available)",
                "5. Determination of acute toxicity (LD50 concept) – case-based calculation",
                "6. Planning a 28-day sub-acute toxicity study protocol",
                "7. Pharmacokinetic study: Cmax, Tmax, AUC calculation (sample dataset)",
                "8. Observation of histopathological slides from toxicity studies",
                "9. Demonstration of sampling methods – blood, urine (case or video)",
                "10. Writing an animal study protocol using CPCSEA format",
                "11. Identification of organs for toxicity evaluation – liver, kidney, brain",
                "12. Visit to CPCSEA-approved animal house/laboratory",
                "13. Observation of animal behavior – grooming, nesting (case-based)",
                "14. Simulated ethics committee approval process (IAEC)",
            ]
        },
    ], false,
    [
        "Familiarize students with target identification and protein preparation using biological databases and molecular visualization tools.",
        "Develop skills in ligand design, optimization, and 3D conformer generation using computational chemistry software.",
        "Provide practical understanding of molecular docking and interaction analysis for structure-based drug design.",
        "Introduce pharmacophore modelling and QSAR techniques for virtual screening and predictive modelling.",
        "Train students in ADMET prediction and molecular dynamics simulations for evaluating drug-likeness and stability of drug–target complexes.",
        "Provide practical exposure to analytical method development using spectrophotometric, chromatographic, and titrimetric techniques for pharmaceutical analysis.",
    ],
    [
        "1. Leach, A.R., Molecular Modelling: Principles and Applications. Harlow: Prentice Hall.",
        "Todeschini, R. and Consonni, V., Molecular Descriptors for Chemoinformatics. Weinheim: Wiley-VCH.",
        "Gupta, S.P., QSAR and Molecular Modeling. Berlin: Springer.",
        "Jorgensen, W.L., Efficient Drug Discovery and Development. Hoboken, NJ: Wiley.",
        "Bultinck, P., De Winter, H., Langenaeker, W. and Tollenaere, J.P., Computational Medicinal Chemistry for Drug Discovery. New York: Marcel Dekker.",
        "Andrew, L.H. and Brown, F.K., Rational Drug Design: Novel Methodology and Practical Applications. Washington, DC: American Chemical Society.",
        "Ward, S.E. and Davis, A., The Handbook of Medicinal Chemistry: Principles and Practice.",
        "1. Ahuja S, Dong MW, editors. Handbook of pharmaceutical analysis by HPLC. Amsterdam: Elsevier; 2005.",
    ]),
    s("BP611P VAC", "VAC Elective — Professional Skills / Process Analytical Technology & Quality by Design (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP611P VAC1 — Professional Skills (30 Hours)", topics: [
                "1. Self-introduction exercise – verbal and written presentation",
                "2. Resume/CV writing – using current industry formats",
                "3. Mock job interview – panel-based or peer-reviewed",
                "4. Group discussion (GD) – on current healthcare or industry topics",
                "5. Public speaking practice – impromptu and prepared speeches",
                "6. Email etiquette and writing professional emails",
                "7. Time management matrix creation (Eisenhower box)",
                "8. Body language analysis – observe and present feedback",
                "9. Conflict resolution role play – team-based activity",
                "10. Creating a LinkedIn profile and optimizing it professionally",
                "11. Debate session – critical thinking and communication",
                "12. Listening skills test – audio-based task with Q&A",
                "13. Workplace scenario simulation – ethics, teamwork, communication",
                "14. Presentation skills – create and deliver PowerPoint presentations",
                "15. Goal-setting and career mapping – using SMART goals",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP611P VAC2 — Process Analytical Technology & Quality by Design (30 Hours)", topics: [
                "1. Identify Critical Quality Attributes (CQAs) – Brainstorm and list five tablet CQAs (hardness, dissolution, etc.) and link each to patient safety or efficacy.",
                "2. Ishikawa (Fish-Bone) Diagram – Draw a cause-and-effect diagram for poor tablet dissolution, categorising factors into Materials, Methods, Machines and Manpower.",
                "3. Blend-Uniformity by NIR Probe – Collect in-line near-infrared spectra during 10 min of blender operation and plot real-time API concentration trends.",
                "4. Moisture Tracking with NIR – Use a portable NIR gun to measure LOD in wet granules every 2 min, stopping when the plot hits the 3 % target.",
                "5. Mini DoE for Granulation – Run a 2² design varying impeller speed and granulation time; measure granule mean size and create main-effects plots.",
                "6. Real-Time Release Test (RTRT) – Set up an at-line NIR hardness prediction model, test 20 tablets, and compare predicted vs. actual hardness.",
                "7. Control Chart of Particle Size (FBRM) – Stream Focused Beam Reflectance data during milling; plot X̄ and R for d₅₀ and decide if the process is in control.",
                "8. Multivariate Calibration Model – Build a partial-least-squares (PLS) model correlating NIR spectra to drug content; report R² and RMSEP.",
                "9. FMEA Risk-Priority Number – Score severity, occurrence and detectability for three high-risk process variables; rank them by RPN and suggest mitigation.",
                "10. PAT Model Verification Batch – Run the optimised process, capture PAT data, and confirm that all CQAs meet specification without end-product testing.",
            ]
        },
    ], false,
    [
        "Develop effective verbal and interpersonal communication skills required for professional environments.",
        "Train students in workplace etiquette, interview preparation, and team collaboration.",
        "Enhance problem-solving, time management, and critical thinking abilities relevant to professional settings.",
        "Promote personal grooming, digital professionalism, and responsible social media etiquette.",
        "Prepare students to face professional challenges through experiential learning, role play, and interactive activities.",
        "Introduce PAT concepts so students grasp how in-line sensors monitor critical quality attributes (CQAs).",
    ],
    [
        "Soft Skills: Enhancing Employability by Meenakshi Raman & Sangeeta Sharma, Oxford University Press",
        "The 7 Habits of Highly Effective People by Stephen R. Covey, Simon & Schuster",
        "Personality Development and Soft Skills by Barun K. Mitra, Oxford University Press",
        "Effective Technical Communication by M. Ashraf Rizvi, Tata McGraw-Hill Education",
        "The Art of Public Speaking by Stephen E. Lucas, McGraw-Hill Education",
        "1. Bakeev KA, editor. Process Analytical Technology: Spectroscopic Tools and Implementation Strategies for the Chemical and Pharmaceutical Industries. 2nd ed. Chichester: Wiley; 2010.",
        "Rathore AS, Winkle H. Quality by Design for Biopharmaceuticals. 2nd ed. Hoboken: Wiley; 2019.",
        "Kourti T, Bakeev K. Process Analytical Technology: Theory and Applications. 1st ed. Oxford: Butterworth-Heinemann; 2022.",
    ]),
    s("BP612I", "Internship II (Mandatory)", 4, "I", [
        {
            num: "I", hours: "30 Hours", title: "Formulation R&D and Process Development", topics: [
                "Pre-formulation testing, excipient compatibility studies, and solubility enhancement strategies",
                "Pilot plant scale-up, technology transfer, and process validation protocols",
                "Novel drug delivery formulation trials (nanoparticles, liposomes, sustained-release matrices)",
                "Formulation troubleshooting, stability testing according to ICH Q1A guidelines",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Advanced Quality Assurance & Regulatory Affairs", topics: [
                "Analytical method validation (ICH Q2R1) using HPLC, GC, LC-MS, and FTIR instrumentation",
                "Out of Specification (OOS), Out of Trend (OOT), and CAPA investigation methodologies",
                "CTD/eCTD dossier module preparation (Module 3 Quality, Module 4 Nonclinical, Module 5 Clinical)",
                "Regulatory audit preparation, data integrity compliance (ALCOA+), and electronic signatures",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Pharmacovigilance & Clinical Research Practice", topics: [
                "Individual Case Safety Report (ICSR) processing, MedDRA coding, and causality assessment",
                "Periodic Safety Update Reports (PSUR/PBRER) and Signal Detection methodologies",
                "Clinical trial protocol review, GCP compliance, informed consent documentation, and trial monitoring",
                "Regulatory submission of adverse events to PvPI (NCC-IPC) and CDSCO portal",
            ]
        },
        {
            num: "IV", hours: "30 Hours", title: "Advanced Dissertation Report & Viva-Voce Evaluation", topics: [
                "Compilation of comprehensive technical internship thesis with experimental or observational data",
                "Evaluation criteria per Section 22: Certificate & report submission (75 Marks), Oral defense (25 Marks)",
                "Presentation of project outcomes before internal and external university-appointed evaluators",
                "Integration of findings into professional career development or research publication",
            ]
        },
    ], true,
    [
        "Provide advanced specialized training in pharmaceutical R&D, quality assurance, regulatory affairs, or clinical pharmacovigilance.",
        "Understand advanced analytical method validation, dissolution testing, stability studies, and dossier preparation.",
        "Apply pharmaceutical knowledge to industry-scale problem solving, troubleshooting, and continuous quality improvement.",
        "Understand national and international regulatory compliance (CDSCO, USFDA, EMA, WHO).",
        "Demonstrate executive report writing, presentation, and defense skills before academic and industry evaluators.",
    ],
    [
        "PCI Regulations on Experiential Learning and Advanced Internship (NEP 2020 Section 22).",
        "ICH Guidelines (Q1A Stability, Q2 Analytical Validation, Q7 GMP for APIs, Q8 Pharmaceutical Development).",
        "CDSCO Guidance on Clinical Trials, Bioavailability/Bioequivalence Studies, and New Drug Applications.",
        "US FDA Code of Federal Regulations (21 CFR Part 210/211).",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 7
// ─────────────────────────────────────────────────────────────
const SEM7: Subject[] = [
    s("BP701T", "Biostatistics Research Methodology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Basic Concepts of Biostatistics", topics: [
                "Definition, meaning and type of variables.",
                "DATA: Meaning and methods of data collection, data preprocessing and cleaning Population and sample, Importance of sampling, Sampling methods Probability and non-probability sampling.",
                "PROBABILITY SAMPLING: Random, systematic, stratified, cluster sampling.",
                "NON-PROBABILITY SAMPLING: Convenience sampling, purposive sampling, snowball sampling.",
                "TYPES OF STATISTICS: Descriptive statistics and inferential statistics.",
                "DESCRIPTIVE STATISTICS: Meaning and types of descriptive statistics.",
                "Frequency distribution, measures of central tendency.",
                "MEASURES OF DISPERSION: Range, variance and standard deviation.",
                "Concept of degrees of freedom, quartiles, skewness and kurtosis Diagrammatic representation of frequency distribution.",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Probability and Probability Distributions", topics: [
                "Probability and probability distributions- Classical probability and statistical probability Probability of union, intersection and complement of events, conditional probability, marginal probability.",
                "Probability distributions- Meaning of a probability distribution Discrete probability distribution- Meaning and examples of discrete probability distribution, meaning of PMF Continuous probability distribution – Meaning and examples of normally distributed data, meaning of PDF.",
                "NORMAL DISTRIBUTION: Meaning and characteristics of a normal distribution, parameters of a normal distribution, equation for PDF of a normal distribution. Pharmaceutical examples of data which can be modelled with Poisson Normal distribution.",
                "Standard normal distribution, Z transformation, reading the table of Z values Problems based on standard normal distribution, binomial and Poisson distributions.",
                "SAMPLING DISTRIBUTIONS: Meaning of sampling distributions.",
                "T DISTRIBUTION: the t statistic, equation for calculating t statistic, meaning of t distribution, meaning of degrees of freedom and their relevance to t distribution, reading and interpreting table of t values, applications of t distribution.",
                "F DISTRIBUTION: the F statistic, equation for calculating F statistic, meaning of F distribution, reading and interpreting table of F values.",
                "CHI SQUARE DISTRIBUTION: the Chi square statistic, meaning of chi square distribution, reading and interpreting the table of chi square values, applications of chi square distribution.",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Correlation and Regression Analysis", topics: [
                "CORRELATION ANALYSIS: Introduction to the concept of correlation between two variables, positive and negative correlation, no correlation, examples of positive, negative and no correlation Measurement of correlation • Pearson’s Correlation Co-efficient – Definition and formula, assumptions, range of Pearson’s correlation co-efficient, interpretation of sign and magnitude.",
                "Spearman’s Rank Correlation Co- efficient – Concept and when to use, procedure for calculation Spearman’s Rank Correlation Coefficient.",
                "Real life applications in pharmaceutical and health sciences Problems on calculation of these two types of correlation co-efficient, use of scatter plot.",
                "MULTIPLE CORRELATION: Concept and applications.",
                "REGRESSION ANALYSIS: Concept of regression, dependent and independent variables in regression analysis, simple linear regression, simple linear regression equation (method of least squares), calculation of slope and intercept, co-efficient of determination, interpretation of output of regression analysis, applications of regression analysis. Relationship between regression co-efficient and correlation co-efficient Problems on simple linear regression analysis for predicting values of dependent variables (pharmaceutical examples) Multiple linear regression-Concept and applications, meaning of overfitting and underfitting.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Inferential Statistics", topics: [
                "STATISTICAL ESTIMATION: Point estimates and interval estimates of population parameters from sample statistics Concept of confidence intervals. Confidence intervals for means using t values. Problems on generating confidence intervals.",
                "Hypothesis testing Concept, steps involved, type I and type II error, sample size and power of the test, p values, applications of hypothesis testing Parametric tests - t- tests (single sample t test, two independent samples t test, paired t test) ANOVA (one way and two way).",
                "Assumptions, procedure and applications (case studies using t tests and ANOVA) Hypothesis testing in regression analysis and correlation Non-parametric tests Mann Whitney U test, Wilcoxon Sign Rank test, Kruskal Wallis test, Friedman test, Chi square tests.",
                "Assumptions, procedure and applications (problems on non-parametric tests).",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Research Methodology", topics: [
                "RESEARCH: Meaning, importance and types.",
                "Types of research designs Research methodology – Based on the research question, selection of research design, defining the population and sample, selecting the sample size and sampling method, method of data collection and data analysis.",
                "Decision tree approach for selection of statistical tests on the basis of research question and type of data Descriptive research design – Examples of application Observational research design – Examples of application Experimental research design Examples of application Scientific report writing, plagiarism, referencing styles, selection of research journals, abstracting services and databases Screening and Optimization – Concept and experimental designs used for screening and optimization including Plackett Burman design, factorial designs, D optimal design, sequential simplex design, central composite design and response surface methodology, blocking and confounding in experimental designs.",
            ]
        },
    ], false,
    [
        "Introduce the fundamental concepts of biostatistics including types of variables, data collection methods, sampling techniques, and descriptive statistical measures used in pharmaceutical and biomedical research.",
        "Develop understanding of probability theory, probability distributions, and sampling distributions used in the analysis of biological and pharmaceutical data.",
        "Explain the principles of correlation and regression analysis for studying relationships between variables and predicting outcomes in pharmaceutical and healthcare datasets.",
        "Provide knowledge of inferential statistical methods including estimation, confidence intervals, hypothesis testing, parametric and non-parametric tests, and analysis of variance.",
        "Familiarize students with research methodology, experimental design, and scientific reporting practices relevant to pharmaceutical research and data interpretation.",
    ],
    [
        "1. Bolton, S. Pharmaceutical Statistics: Practical and Clinical Applications. Marcel Dekker.",
        "Daniel, W. W. Biostatistics: A Foundation for Analysis in the Health Sciences. Wiley.",
        "Montgomery, D. C. Design and Analysis of Experiments. Wiley.",
    ]),
    s("BP702T", "Cosmetics and Cosmeceuticals", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Biological Foundations and Cosmetic Formulation Science", topics: [
                "Cosmetics and cosmeceuticals, Classification of Cosmetics (Cosmetics and Cosmeceuticals for Skin Care, Hair Care, Oral Care, foot care, body cavities, Decorative Cosmetics, Cleansing cosmetics, Perfumes and Fragrances.) Types of various dosage forms for Cosmetics, Common excipients for cosmetic.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Skin Care, Hair Care and Oral Care Cosmetics", topics: [
                "Common skin problems (Dry Skin, Oily skin, Pimples and acne, Pigmentation, Prickly heat and Sun burn) and general composition, method for preparation, packing and evaluation of the skin Cosmetics and cosmeceuticals. Herbal cosmetics for skin.",
                "Types of soaps, syndet bars, general composition, method for preparation, packing and evaluation of soaps.",
                "Introduction to Perfumes and toiletries.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Common Hair Problems, Hair Cosmetics and Cosmeceuticals", topics: [
                "Types of shampoos, general composition, method for preparation, packing and evaluation of shampoos.",
                "Introduction to hair oils, hair serums, conditioners, hair colors, Depilatory and shaving products. Herbal hair care products.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Safety Evaluation and Toxicity Testing of Cosmetics", topics: [
                "Various problems of oral cavity, Oral Cosmetics, and cosmeceuticals: general composition, method for preparation, packing and evaluation of mouth wash and toothpaste. Herbal oral care cosmetics.",
                "Types of Cosmetics for nails, eyes, body odor, lip care and cleansing.",
                "Intimate hygiene products for males and females.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Role of Regulatory Authorities for Cosmetics and Cosmeceuticals", topics: [
                "(CDSCO and FDA). Cosmetics regulations 2020 and role of BIS.",
                "Role of certifying bodies like ECCERT and COSMOS in herbal cosmetics. Labeling requirement of cosmetics and Packaging of cosmetics.",
                "Testing as per BIS specification and analytical methods (including sensory test, sensitivity test).",
            ]
        },
    ], false,
    [
        "Recognize the fundamental concepts and classification of cosmetics and cosmeceutical formulations and their packaging and testing.",
        "Develop knowledge of some common dermatological, hair, and oral care issues and their respective cosmetic products.",
        "Develop an understanding of herbal cosmetics and their principles of formulation.",
        "Learn regulatory guidelines, labeling protocols, and packaging regulations for cosmetics and cosmeceuticals.",
        "Study the recent trends of research in artificial intelligence (AI) in customized skincare and cosmetic innovation.",
    ],
    [
        "1. Baki, G. and Alexander, K. S. Introduction to Cosmetic Formulation and Technology. Wiley.",
        "Barel, A. O., Paye, M. and Maibach, H. I. Handbook of Cosmetic Science and Technology. CRC Press.",
        "Benson, H. A. E. and Watkinson, A. C. Cosmetic Formulation: Principles and Practice. CRC Press.",
        "Chisvert, A. and Salvador, A. Cosmetic Formulation of Skin, Hair and Nails. Wiley.",
        "Dweck, A. C. and Santos, P. F. Formulating Natural Cosmetics. Allured Publishing.",
        "Matsumoto, M. Cosmetic Science and Technology. Elsevier.",
        "Rosen, M. R. Harry’s Cosmeticology. Chemical Publishing.",
    ]),
    s("BP703T", "AI in Clinical Applications", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI in Pharmacokinetics & Dose Optimization", topics: [
                "Review of pharmacokinetic parameters (Cmax, Tmax, AUC, clearance).",
                "MODELING CONCENTRATION-TIME RELATIONSHIPS: Linear regression in PK data modeling, multiple regression for dose adjustment based on patient variables (age, weight, renal function).",
                "Interpretation of regression coefficients in clinical context.",
                "Error metrics (RMSE, R²) in PK modeling.",
                "Limitations of linear modeling in nonlinear pharmacokinetics.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "AI in Drug Safety & Pharmacovigilance", topics: [
                "Overview of pharmacovigilance systems.",
                "Structure and data formats from real systems (e.g. FAERS, EudraVigilance).",
                "Conceptual overview of frequency analysis and signal detection.",
                "Logistic regression for ADR risk prediction.",
                "Confusion matrix and clinical performance metrics.",
                "Sensitivity, specificity, precision, recall.",
                "Bias and confounding in observational datasets.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in Personalized Medicine & Risk Stratification", topics: [
                "Concept of precision medicine.",
                "Patient covariates and therapeutic response.",
                "Logistic regression for disease risk prediction.",
                "Classification of responders vs non-responders.",
                "Evaluation metrics in healthcare prediction.",
                "Ethical implications of predictive modeling.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "AI in Clinical Decision Support & Real-world Data", topics: [
                "Structure of Electronic Health Records (EHR).",
                "AI in Clinical Decision Support Systems (CDSS).",
                "Regression models for outcome prediction.",
                "Classification models for risk scoring.",
                "Real-world data analytics.",
                "Limitations of AI in clinical environments.",
                "Accountability and interpretabilit.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Guided Supervised Learning Project – Pharmaceutical and Clinical Applications", topics: [
                "Students will undertake a guided supervised learning project (individually or in groups) applying regression or classification models to pharmaceutical or clinical datasets.",
                "The project should include the following steps.",
                "Identification and definition of a relevant pharmaceutical or clinical problem.",
                "Selection of an appropriate publicly available dataset.",
                "Identification of predictor variables and outcome variables.",
                "Data preprocessing and preparation for analysis.",
                "Application of suitable supervised learning methods (e.g., linear regression or logistic regression).",
                "Evaluation of model performance using appropriate metrics.",
                "Interpretation of results in the context of pharmaceutical or clinical relevance.",
                "Discussion of limitations, potential biases, and ethical considerations.",
                "Presentation of findings to faculty mentors or peers.",
                "Suggested project topics (not limited to):",
                "Dissolution rate prediction, tablet hardness prediction, stability degradation modelling, quality control batch failure prediction, assay variability modelling, impurity prediction, moisture impact on formulation stability, coating thickness prediction, solubility enhancement modelling, tablet defect classification, adverse drug reaction (ADR) prediction, therapeutic response prediction using patient datasets, hospital readmission risk prediction, dose requirement prediction using pharmacokinetic data, diabetes risk prediction from health markers, antibiotic treatment success prediction, ICU stay duration prediction, medication adherence analysis, and disease severity classification.",
            ]
        },
    ], true,
    [
        "Introduce AI applications in pharmacology, pharmacokinetics, and drug safety.",
        "Enable students to apply supervised ML models to clinical and pharmacovigilance datasets.",
        "Develop interpretation skills for predictive modeling in healthcare.",
        "Build understanding of real-world healthcare data analytics.",
        "Promote responsible and ethical AI usage in patient care.",
    ],
    [
        "1. Aggarwal, C. C. and Reddy, C. K. Healthcare Data Analytics. CRC Press.",
        "Bonate, P. L. Pharmacokinetic–Pharmacodynamic Modeling and Simulation. Springer.",
        "Campbell, M. J., Machin, D. and Walters, S. J. Medical Statistics: A Textbook for the Health Sciences. Wiley-Blackwell.",
        "Schmidt, S. and Derendorf, H. Applied Pharmacometrics. Springer.",
        "Steyerberg, E. W. Clinical Prediction Models: A Practical Approach to Development, Validation, and Updating. Springer.",
        "Strom, B. L., Kimmel, S. E. and Hennessy, S. Pharmacoepidemiology. Wiley- Blackwell.",
    ]),
    s("BP704T", "Modern Analytical Techniques", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Thermal Analysis Techniques (DSC, TGA, DTA)", topics: [
                "NUCLEAR MAGNETIC RESONANCE SPECTROSCOPY",
                "Principles of ¹H-NMR and ¹³C-NMR, various solvents used, chemical shift, factors affecting chemical shift, coupling constant, spin–spin coupling, relaxation, instrumentation of FT-NMR and its applications.",
                "MASS SPECTROMETRY",
                "Principles, fragmentation and its rules, ionization techniques Electron impact, chemical ionization, MALDI, FAB, API, analyzers – Time of flight and quadrupole, ion trap, detectors and applications.",
            ]
        },
        {
            num: "II", hours: "08 Hours", title: "X-Ray Diffraction (XRD) and Electron Microscopy (SEM, TEM)", topics: [
                "X-RAY DIFFRACTION METHODS",
                "Origin of X-Rays, basic aspects of crystals, X-Ray crystallography, rotating crystal technique, single crystal diffraction, powder diffraction, structural elucidation and applications.",
                "THERMAL ANALYSIS",
                "Introduction, instrumentation, factors affecting measurements, applications of TGA, DSC (types) and DTA.",
            ]
        },
        {
            num: "III", hours: "10 Hours", title: "Hyphenated Mass Spectrometry (LC-MS/MS, GC-MS/MS)", topics: [
                "UPLC AND NANO LC: Principle, advantages over LC and applications.",
                "Principle and applications of hyphenated techniques: GC-MS, LCMS/MS, ICP-MS.",
                "SUPERCRITICAL CHROMATOGRAPHY AND FLASH CHROMATOGRAPHY: principles and applications.",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Supercritical Fluid Chromatography and Advanced Electrophoresis", topics: [
                "GREEN ANALYTICAL CHEMISTRY",
                "Types of green solvents, various computational tools used to assess the greenness and its applications in sample preparation and analytical method development.",
                "BIO-ANALYTICAL METHODS",
                "Introduction to bioanalytical method development, extraction of drugs and metabolites from biological fluids – SPE, LLE, PPE, BCS classification, PK-PD interaction, microsomal assays, MTT assay, BA & BE study protocol, biosimilars.",
                "RADIO IMMUNE ASSAYS AND ELISA",
                "Importance, various components, principle, different methods, limitations and applications of radio immunoassay and ELISA.",
            ]
        },
        {
            num: "V", hours: "5 Hours", title: "Bioanalytical Method Development and Validation", topics: [
                "MICROSCOPY-BASED ANALYTICAL TECHNIQUES",
                "Principle, instrumentation, and applications of optical microscopy, scanning electron microscopy and transmission electron microscopy.",
            ]
        },
    ], false,
    [
        "Introduce advanced instrumental techniques used in pharmaceutical analysis,.",
        "Provide conceptual understanding of modern separation and hyphenated analytical techniques.",
        "Familiarize students with principles and applications of green analytical chemistry and sustainable analytical method development.",
        "Explain the fundamentals of bioanalytical methods and immunoassays.",
        "Introduce microscopy-based analytical techniques and highlight their role in structural characterization and pharmaceutical research.",
    ],
    [
        "Brown, M. E. Introduction to Thermal Analysis: Techniques and Applications. Springer.",
        "Cullity, B. D. and Stock, S. R. Elements of X-Ray Diffraction. Prentice Hall.",
        "Dong, M. W. Modern HPLC for Practicing Scientists. Wiley.",
        "Friebolin, H. Basic One- and Two-Dimensional NMR Spectroscopy. Wiley.",
        "Niessen, W. M. A. Liquid Chromatography–Mass Spectrometry. CRC Press.",
        "Poole, C. F. The Essence of Chromatography. Elsevier.",
        "Silverstein, R. M., Webster, F. X., Kiemle, D. J. and Bryce, D. L. Spectrometric Identification of Organic Compounds. Wiley.",
        "Skoog, D. A., Holler, F. J. and Crouch, S. R. Principles of Instrumental Analysis. Cengage Learning.",
    ]),
    s("BP705T", "Pharmacovigilance", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Fundamentals of Pharmacovigilance", topics: [
                "Concept, history, and importance of pharmacovigilance.",
                "Basic drug classification systems (introductory overview only): ATC classification, ICD, ATC system, ICD.",
                "Drug-related problems and medication safety.",
                "Drug safety considerations in special populations: Paediatrics, Geriatrics, Pregnancy and lactation.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Pharmacovigilance Systems and Regulatory Framework", topics: [
                "Objectives and functions of pharmacovigilance.",
                "METHODS OF PHARMACOVIGILANCE DATA COLLECTION: Spontaneous reporting, Cohort and case-control studies.",
                "Global pharmacovigilance systems.",
                "WHO International Drug Monitoring Programme.",
                "Role of CIOMS and major regulatory agencies (e.g., USFDA, EMA).",
                "Pharmacovigilance Programme of India (PvPI).",
                "Establishment and role of ADR Monitoring Centres.",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Adverse Drug Reactions (adrs)", topics: [
                "Classification and types of ADRs.",
                "Mechanisms and risk factors for ADRs.",
                "Methods of ADR monitoring, detection, and reporting.",
                "Assessment of causality, severity, predictability, and preventability of ADRs.",
                "Management of ADRs.",
                "Online reporting mechanisms and databases (WHO-ART, VigiBase, Vigiflow, Oracle Argus, OpenVigil software)., MEDRA.",
            ]
        },
        {
            num: "IV", hours: "7 Hours", title: "Immunovigilance and Other Disciplines of Pharmacovigilance", topics: [
                "Definition, scope, and significance of immunovigilance, cosmetovigilance, nutraceutical-vigilance, materiovigilance, herbovigilance, ecopharmacovigilance, and hemovigilance.",
                "Vaccination failure and vaccine pharmacovigilance.",
                "Overview of adverse events following immunization (AEFIs).",
                "Immunization safety monitoring systems in India.",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Risk Communication, Evaluation, Management, and ICH", topics: [
                "Guidelines.",
                "Risk evaluation and management strategies in pharmacovigilance and immunovigilance.",
                "Communication in drug safety crisis management.",
                "Communication with regulatory agencies, business partners, and healthcare facilities.",
                "Analysis of real-world case studies and lessons learnt.",
                "Emerging trends and challenges in pharmacovigilance and immunovigilance.",
                "Overview of safety data generation.",
                "Objectives of ICH guidelines.",
                "Expedited and aggregate reporting.",
                "Individual Case Safety Reports (ICSRs).",
                "Periodic Safety Update Reports (PSURs).",
                "Post-approval expedited reporting.",
                "Good Clinical Practices (GCPs) regulation 2019.",
                "Application of pharmacogenomics and pharmacometrics in pharmacovigilance.",
            ]
        },
    ], false,
    [
        "Understand the principles, scope, and importance of pharmacovigilance in ensuring drug safety and patient care.",
        "Familiarize students with the classification of adverse drug reactions and the methods used for their detection, assessment, monitoring, and prevention within healthcare systems.",
        "Explain the concepts and significance of immunovigilance in monitoring and managing adverse events following immunization.",
        "Learn national and international regulatory frameworks, guidelines, and reporting systems related to pharmacovigilance and immunovigilance.",
        "Analyze pharmacovigilance data and apply risk management strategies to enhance medication and vaccine safety.",
    ],
    [
        "1. Andrews, E. B. and Moore, N. Mann’s Pharmacovigilance. Wiley Blackwell.",
        "Cobert, B. Cobert’s Manual of Drug Safety and Pharmacovigilance. World Scientific Publishing.",
        "Jose, J., Cox, A. R. and Paudyal, V. Principles and Practice of Pharmacovigilance and Drug Safety. Springer.",
        "Strom, B. L., Kimmel, S. E. and Hennessy, S. Textbook of Pharmacoepidemiology. Wiley.",
        "Talbot, J. and Waller, P. Stephens’ Detection of New Adverse Drug Reactions. Wiley.",
        "Waller, P. and Harrison-Woolrych, M. An Introduction to Pharmacovigilance. Wiley Blackwell.",
    ]),
    s("BP706T", "Pharmacy Practice", 3, "T", [
        {
            num: "I", hours: "8 Hours", title: "Introduction to Pharmacy Practice", topics: [
                "Definition, scope and evolution of: Hospital and clinical pharmacy.",
                "Pharmacist's role from dispenser to healthcare provider.",
                "WHO and FIP guidelines on pharmacy practice.",
                "Pharmacy practice regulations in India.",
                "Role of pharmacy in public health and policymaking.",
                "Promoting rational use of medicines.",
                "Concepts of Good Pharmacy Practice.",
                "PHARMACY PRACTICE SETTINGS: inpatient, outpatient.",
                "Concept of healthcare delivery system and interprofessional collaboration.",
                "Primary (PHC), Secondary (CHC), Tertiary (District Hospitals, Medical Colleges) – role of pharmacists at various levels of care.",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Hospital and Community Pharmacy", topics: [
                "Hospital and its Organization Classification of hospitals, organizational structure of a hospital, healthcare staff involved in hospital services and their functions.",
                "Hospital Pharmacy and its Organization Definition, organization structure, location, layout, and staff requirements, responsibilities and functions of hospital pharmacists.",
                "Pharmacy and Therapeutic Committee Organization, functions, and policies, drug inclusion into formulary, inpatient and outpatient prescriptions, automatic stop order, emergency drug list preparation.",
                "Hospital Formulary Definition of hospital formulary, contents of hospital formulary, differentiation between hospital formulary and drug list, preparation and revision of hospital formulary.",
                "Drug Distribution System in a Hospital Drug procurement and inventory control, dispensing of drugs to inpatients, types of drug distribution systems, charging policy and labeling, dispensing of drugs to ambulatory patients, dispensing of controlled drugs, outpatient medication dispensing, NABH standards for medication management in hospital settings.",
                "Community Pharmacy Organization and structure of retail and wholesale drug stores, types and design of a drug store, legal requirements for establishment and maintenance of a drug store, dispensing of proprietary products, maintenance of records of retail and wholesale drug stores, prescription handling, labelling, and patient counselling, introduction, definition, sale, and OTC medication list, vaccination services.",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Clinical Pharmacy Services", topics: [
                "Introduction to clinical pharmacy and its concept.",
                "Drug therapy monitoring.",
                "Medication chart review.",
                "Clinical review.",
                "Pharmacist intervention.",
                "Ward round participation.",
                "Medication history.",
                "Pharmaceutical care.",
                "Drug information services.",
                "Drug/Medication related problems.",
                "Drug and poison information services.",
                "Therapeutic drug monitoring (TDM).",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Patient-oriented Services", topics: [
                "Medication Adherence and Non-Adherence.",
                "Definition.",
                "Factors influencing non-adherence Pharmacist’s role in medication adherence Monitoring of patient medication adherence Tools used to assess medication adherence.",
                "Strategies to overcome non-adherence Patient Counselling Techniques and Communication Skills.",
                "Definition of patient counselling.",
                "Steps involved in patient counselling.",
                "COMMUNICATION SKILLS: communication with prescribers and patients Types of educational materials used in patient counselling.",
                "BARRIERS TO EFFECTIVE COUNSELLING: types and strategies to overcome barriers.",
                "Health Screening Services.",
                "Definition and importance.",
                "METHODS FOR SCREENING",
                "Blood pressure, Blood sugar, Body Mass Index, Lung function test Role of pharmacist in health screening services.",
                "Telemedicine.",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Prescribing Guidelines, Essential Drug Concept and Rational Drug", topics: [
                "Therapy.",
                "Prescribing Guidelines Pediatrics, geriatrics, pregnant and lactating women.",
                "ISMP guidelines for high risk medicines.",
                "Essential Drug Concept.",
                "WHO definition.",
                "Core principles and key features Procedure involved in adding a drug into the essential drug list.",
                "Rational Use of Medications.",
                "Antibiotics.",
                "Antibiotic stewardship program.",
                "Injections.",
                "OTC drugs.",
                "Consequences of irrational drug use.",
                "Dose calculations in chemotherapy, renal and hepatic failure patients.",
            ]
        },
    ], false,
    [
        "Understand the evolution, scope, and various roles of pharmacists in healthcare delivery systems.",
        "Describe the structure and functions of hospital and community pharmacy, including drug distribution systems and regulatory standards.",
        "Demonstrate knowledge of clinical pharmacy services and their application in drug therapy monitoring and patient care.",
        "Develop skills in patient counseling, medication adherence strategies, and basic health screening services.",
        "Apply prescribing guidelines, essential drug concepts, and principles of rational drug use to ensure safe and effective pharmacotherapy.",
    ],
    [
        "1. Hassan, W. E. Hospital Pharmacy. Lea & Febiger.",
        "Harman, R. J. Handbook of Pharmacy – Health Care. Pharmaceutical Press.",
        "Merchant, S. H. and Qadry, J. S. A Textbook of Hospital Pharmacy. CBS Publishers & Distributors.",
        "Parmar, N. S. Health Education and Community Pharmacy. CBS Publishers & Distributors.",
        "Parthasarathi, G., Hansen, K. N. and Nahata, M. C. A Textbook of Clinical Pharmacy Practice. Universities Press.",
        "Shargel, L. Comprehensive Pharmacy Review. Lippincott Williams & Wilkins.",
    ]),
    s("BP707T", "Regulatory Affairs", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Fundamentals of Regulatory Affairs", topics: [
                "Introduction to Drug Regulatory Affairs, Overview of regulatory authorities in India and major international markets (US FDA, EMA, PMDA), Role and responsibilities of Regulatory Affairs Professionals, Organizational structure of regulatory bodies.",
                "BASIC REGULATORY TERMINOLOGIES: Guidance, Guidelines, s, Laws, Acts.",
                "REGULATORY REFERENCE RESOURCES: Orange Book, Purple Book, Federal Register, Code of Federal s (CFR).",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Regulatory Requirements in Drug Development", topics: [
                "Drug discovery and development process, Drug development teams and their functions.",
                "NON-CLINICAL DRUG DEVELOPMENT: Pharmacology, Drug metabolism, Toxicology.",
                "REGULATORY DOCUMENTATION: Investigational New Drug (IND) application, Investigator’s Brochure (IB), Clinical research protocols, Biostatistics in pharmaceutical product development, Bioequivalence (BE) studies, Data presentation for regulatory submissions.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Indian Regulatory Framework and Approval Process", topics: [
                "Central Drugs Standard Control Organization (CDSCO) and State Licensing Authorities: Organization and responsibilities, Regulatory requirements for import, manufacture, and sale of pharmaceuticals in India, Certificate of Pharmaceutical Product (COPP), Regulatory approval procedure for new drugs in India, Clinical trial regulatory requirements in India, phytopharmaceutical regulations, Good Clinical Practice (GCP) guidelines and Schedule Y, Innovator and generic drugs, Generic drug product development.",
                "Phytopharmaceutical regulation by AYUSH and CDSCO.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "International Regulatory Systems & Global Drug Registration", topics: [
                "TYPES OF REGULATORY APPLICATIONS: Investigational New Drug (IND), New Drug Application (NDA), Abbreviated New.",
                "Drug Application (ANDA).",
                "Drug Master Files (DMF), Common Technical Document (CTD), electronic CTD (eCTD), ASEAN CTD (ACTD), • Registration procedure for Indian drug products in overseas markets, Post-approval changes to NDA and ANDA.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Clinical Trials, Ethics, and Post-marketing Surveillance", topics: [
                "Clinical research phases (I-IV), Clinical trial documents, Institutional Review Board (IRB) and Independent Ethics Committee (IEC): Formation and functions.",
                "Informed consent process and documentation, Good Clinical Practice (GCP) obligations of investigators, sponsors, and monitors, Management and monitoring of clinical trials, Pharmacovigilance: Safety monitoring during clinical trials and post- marketing.",
            ]
        },
    ], false,
    [
        "Understand the drug discovery and development process.",
        "Identify key regulatory authorities and their roles in drug regulation.",
        "Describe the regulatory approval processes in India and international markets.",
        "Understand the documentation and registration procedures for drug products.",
        "Describe the laws and guidelines governing the pharmaceutical industry.",
    ],
    [
        "1. Berry, I. R. and Martin, R. P. The Pharmaceutical Regulatory Process. Informa Healthcare.",
        "Gallin, J. I. and Ognibene, F. P. Principles and Practice of Clinical Research. Academic Press.",
        "Guarino, R. A. New Drug Approval Process: Accelerating Global Registrations. CRC Press.",
        "Ng, R. Drugs: From Discovery to Approval. Wiley.",
        "Pisano, D. J. and Mantus, D. S. Textbook of FDA Regulatory Affairs. Informa Healthcare.",
        "Weinberg, S. Guidebook for Drug Regulatory Submissions. Wiley.",
    ]),
    s("BP708T AEC", "AEC Elective — Current Good Manufacturing Practices / Pharmaceutical Automation / Cellular Biology / Medical Devices / Food Waste Products / Biosimilars", 1, "T", [
        {
            num: "I", hours: "15 Hours", title: "Option 1: BP708T AEC1 — Current Good Manufacturing Practices (cGMP) (15 Hours)", topics: [
                "Standard Operating Procedures (SOP), Systems for Training & Development in Pharmaceuticals",
                "Introduction to SOPs, SOP on SOP, Contents of a standard SOP, Writing a good SOP, Distribution and control of SOPs.",
                "Introduction to Training and development, Training needs identification, Training and evaluation. A comprehensive review of cGMP and various important FDA guidelines",
                "List of major guidelines referred in pharmaceuticals",
                "Effectively reading and understanding the guidelines Important Quality Assurance and cGMP systems adopted in Pharmaceuticals",
                "Introduction to Quality Management Systems (QMS), Manufacturing Assurance, Analytical Assurance, Developments Quality Assurance, Engineering Assurance.",
                "Concepts of corrective and preventive actions (CAPA), Deviations and Incidents handling. Handling of non-conforming materials Handling of Customer Complaints",
                "Introduction to complaints, Types of complaints",
                "Understanding Manufacturing defects and Quality issues",
                "Handling and investigation of customer complaints Regulatory Audits",
                "Introduction to audits and Types of audits.",
                "Preparation for a successful audit, Audit teams and internal audits.",
                "Handling of FDA inspections: FDA observations, Compliance and replying to an audit report.",
            ]
        },
        {
            num: "II", hours: "15 Hours", title: "Option 2: BP708T AEC2 — Pharmaceutical Automation (15 Hours)", topics: [
                "Introduction to Automation in Pharmaceuticals",
                "Definition and scope of automation in pharmaceutical industry",
                "Importance and benefits: accuracy, efficiency, cost-effectiveness, compliance",
                "Types of automation: fixed, programmable, flexible",
                "Application areas: production, packaging, quality control, warehousing",
                "Challenges and limitations of automation Automated Manufacturing Systems",
                "Principles of automated tablet compression, capsule filling, liquid filling, and coating machines",
                "PLC-based machinery in granulation and drying",
                "Robotics in sterile product manufacturing (isolators, RABS)",
                "Continuous manufacturing vs. batch processing",
                "Automation in aseptic processing and lyophilization Process Control and Instrumentation",
                "Sensors and transducers: temperature, pressure, flow, pH, conductivity",
                "Introduction to SCADA (Supervisory Control and Data Acquisition) systems",
                "Distributed Control Systems (DCS) in pharma",
                "Process Analytical Technology (PAT) – definition and applications",
                "Basics of automation programming (ladder diagrams, logic gates – overview only) Quality Control and Laboratory Automation",
                "Automation in analytical laboratories: HPLC, UV, FTIR, dissolution testers",
                "Laboratory Information Management System (LIMS)",
                "Integration of instruments with software and data loggers",
                "Automated sampling and testing methods",
                "Role of AI/ML in predictive quality assurance Regulatory Aspects and Emerging Trends",
                "Regulatory expectations: USFDA, WHO, EMA on automation & electronic systems",
                "21 CFR Part 11 – electronic records and signatures",
                "Data integrity and ALCOA",
                "Emerging trends: IoT, Industry 4.0, cloud-based manufacturing, AI in pharma",
                "Case studies: automated systems in top pharma companies",
            ]
        },
        {
            num: "III", hours: "15 Hours", title: "Option 3: BP708T AEC3 — Modern Techniques in Cellular Biology (15 Hours)", topics: [
                "CRISPR & Genome Editing CRISPR-Cas9 mechanics, guide-RNA design and DNA repair outcomes, contrasts knock-outs, knock-ins and base-editing, and shows how dCas9 fusions enable gene activation or repression. Students compare delivery routes—plasmid, ribonucleoprotein, viral and lipid-nanoparticle—then evaluate off-target detection strategies before a mini-lab in which they design a gRNA and screen predicted off-targets. Flow Cytometry & Cell Sorting Learners review flow-cytometer fluidics, optics and fluorochrome chemistry, interpret forward/side scatter plots for cell size and granularity, and build multi-colour antibody panels with compensation. They perform cell-cycle, apoptosis and immunophenotyping assays, study FACS sorting logic and viability checks, and finish with a hands-on run of a four-colour immunophenotyping panel. Live-Cell Imaging This unit covers phase-contrast, DIC and fluorescence time-lapse microscopy, stressing environmental control through on-stage incubators and microfluidic perfusion. Students deploy fluorescent reporters such as GFP fusions and calcium biosensors to track motility, division and signalling, learn to minimise phototoxicity and manage large image datasets, then conduct a 12-hour GFP-cell time-lapse demo. Single-Cell RNA-Seq & Multi-Omics Participants examine single-cell isolation by droplets, microwells or FACS, walk through barcoding, library preparation and sequencing, and run a basic bioinformatics pipeline for quality control, normalisation, clustering and UMAP/t-SNE visualisation. They identify cell types, trajectories and rare populations, glimpse CITE-seq and spatial transcriptomics, and explore a public scRNA-seq dataset in R/Python during a workshop. Advanced Fluorescence & Super-Resolution Microscopy Confocal and two-photon fundamentals, followed by super-resolution strategies—STED, SIM and PALM/STORM—plus functional techniques such as FRET, FRAP and FLIM for probing protein interactions and dynamics. Learners plan multiplexed staining with spectral imaging, discuss clinical applications including FISH and diagnostic immunofluorescence, and acquire and process a confocal z-stack in a practical sessions.",
            ]
        },
        {
            num: "IV", hours: "15 Hours", title: "Option 4: BP708T AEC4 — Medical Devices (15 Hours)", topics: [
                "Introduction to Medical Devices: History and Overview of Medical Device Industry and evolving market Trends",
                "(India + WW)",
                "GOI’s initiatives and National Medical Device Policy.",
                "Regulatory frameworks (CDSCO; State FDA; USFDA; EU-CE, etc.)",
                "Medical device design and development process",
                "Definition and Classification of Medical Devices (India; US; EU) Medical Device Design, Biomaterials and Biocompatibility:",
                "Medical Device Design principles and methodologies, safety analysis",
                "Properties and selection of materials &amp",
                "biomaterials for devices",
                "Tissue engineering and regenerative medicine",
                "Biocompatibility Testing and Standards (ISO 10993) Manufacturing and Quality Systems: (based on ISO 13485 Fifth Sch of IMDR 2017)",
                "Good Manufacturing Practices (GMP) &amp",
                "Infrastructure requirements",
                "Quality assurance and quality control in Medical Devices",
                "Supply chain management (warehousing distribution)",
                "Risk Management (ISO 14971) Regulatory Affairs, Regulatory strategies for global market access",
                "Medical device regulations and standards (IMDR 2017)",
                "Understanding Regional Differences in Regulatory Pathways",
                "Regulatory submissions and approvals (India)",
                "Post-market surveillance and vigilance (India)",
                "Global Regulatory Requirements (USFDA, CE Mark, etc.)",
                "Case Studies of Global Regulatory Challenges Biomedical Engineering",
                "Instrumentation: Emerging Technologies",
                "Principles of biomedical sensors and transducers",
                "Medical imaging techniques (X-ray, CT, MRI, ultrasound)",
                "Telemedicine and remote monitoring",
                "Integration of Electronics and Software in Medical Devices",
                "Wearable Devices and Remote Monitoring",
                "Ethical issues in device development and use",
            ]
        },
        {
            num: "V", hours: "15 Hours", title: "Option 5: BP708T AEC5 — Transformation of Food Waste into Medicinal Products (15 Hours)", topics: [
                "Introduction to Food Waste Food waste: Definition, Types, Sources, Causes, Problems, Impacts Advantages, Challenges, Solutions and Future directions Indian and International regulations for food waste management Sustainable Management of Food Waste Principles of Food waste Management Technologies and Processes: Thermo-chemical Processes, Biological Processes, Green extraction, Pyrolytic and Enzymatic techniques Byproducts from Food Waste Production of Biohydrogen, Biogas, Organic acids, Vermicompost, and Biopolymers Bioactive Compounds from Food Waste Antimicrobial, Antioxidants, Anti-inflammatory agents, Antibiotics, Prebiotics, Nutritional Supplements, Cosmetics and Biopolymers 3D printed medicines: Customized dosages and Scaffolds Role of AI in Food waste management Machine learning, Internet of Things (IoT) and Blockchain",
            ]
        },
        {
            num: "VI", hours: "15 Hours", title: "Option 6: BP708T AEC6 — Biosimilars, Vaccines & Macromolecules (15 Hours)", topics: [
                "Introduction to Biosimilars, Vaccines and Macromolecules",
                "Classes: Monoclonal antibodies (mAbs), cytokines, insulin, growth factors",
                "primary/secondary/tertiary structures.",
                "Biosimilars: Definition, rationale, types (e.g., erythropoietin, filgrastim).",
                "Vaccines: Generations (live, subunit, viral vector, mRNA)",
                "adjuvants and delivery systems.",
                "Industry landscape: Blockbuster biologics (Humira, Keytruda), Indian biosimilar market. Characterization Methodologies",
                "Physicochemical: SDS-PAGE, SEC-HPLC, peptide mapping, mass spectrometry.",
                "Glycosylation analysis: N-linked glycans (HILIC, lectin arrays).",
                "Functional assays: Cell-based potency, binding ELISA, ADCC.",
                "Comparability for biosimilars: Fingerprinting (ICH Q5E). Manufacturing Protocols",
                "Upstream: Cell line development (CHO, HEK), bioreactors, media optimization.",
                "Downstream: Harvesting, chromatography (affinity, ion-exchange), viral clearance.",
                "Fill-finish: Lyophilization, aseptic processing, cold chain.",
                "Process analytical technology (PAT) in biologics. Quality Control and Stability Protocols",
                "Release testing: Host cell proteins (HCP), DNA, sterility, endotoxin (LAL).",
                "Stability: ICH Q5C for biologics",
                "subvisible particles, aggregation.",
                "Immunogenicity assessment: ADA assays, neutralizing antibodies.",
                "Vaccine QC: Potency, identity, safety (animal models). Regulatory Compliances and Case Studies",
                "Global: USFDA 351(k) biosimilar pathway, EMA guidelines, WHO prequalification.",
                "India: CDSCO Biosimilar Guidelines 2021, DCGI vaccine approvals.",
                "Documentation: BLA/CMC modules, PK/PD comparability studies.",
                "Case studies: COVID-19 mRNA vaccines (Pfizer), Indian trastuzumab biosimilars.",
            ]
        },
    ], false,
    [
        "Explain the structure, purpose, and implementation of Standard Operating Procedures (SOPs) in pharmaceutical operations.",
        "Develop understanding of training and development systems, including training needs assessment and evaluation methods used in the pharmaceutical industry.",
        "Describe the principles of current Good Manufacturing Practices (cGMP) and key regulatory guidelines relevant to pharmaceutical quality assurance.",
        "Examine core pharmaceutical quality systems such as Quality Management Systems (QMS), CAPA, deviation management, and non-conformance handling.",
        "Understand procedures for managing customer complaints, investigating quality issues, and ensuring product safety and regulatory compliance.",
        "Introduce the fundamental concepts of automation technologies used in the pharmaceutical industry.",
    ],
    [
        "1. Good Manufacturing Practices for Pharmaceuticals – Joseph D. Nally, CRC Press",
        "Quality Assurance of Pharmaceuticals: A Compendium of Guidelines and Related Materials (Vol. 1 & 2) – World Health Organization (WHO), WHO Press",
        "Guidance for Industry: Quality Systems Approach to Pharmaceutical CGMP s – U.S. FDA, CDER/CDRH Guidance Document",
        "Pharmaceutical Production and Packaging Technologies – Michael J. Groves, CRC Press",
        "Pharmaceutical Quality by Design: A Practical Approach – Walkiria S. Schlindwein & Mark Gibson, Wiley",
        "Government of India, Ministry of Health and Family Welfare (2023) Drugs and Cosmetics Rules, 1945: Amendment introducing revised Schedule M – Good Manufacturing Practices. Gazette of India, Notification G.S.R. 922(E), 28 December.",
        "1. Automation and Control in the Pharmaceutical Industry by Burton H. Sage, CRC Press",
        "Pharmaceutical Engineering by K. Sambamurthy, New Age International Publishers",
    ]),
    s("BP709P", "Modern Analytical Techniques (Practical)", 1, "P", [
        {
            num: "I", hours: "45 Hours", title: "Laboratory Practicals & Experiments (45 Hours)", topics: [
                "1. Interpretation of Proton NMR spectra of known compound (any two)",
                "2. Interpretation of Carbon NMR spectra of known compound (any two)",
                "3. Interpretation of mass spectrum of known compound (any two)",
                "4. Interpretation of X-Ray diffraction spectrum (any one)",
                "5. Interpretation of DSC Thermogram (any one)",
                "6. Preparation and Evaluation of Green Analytical Solvents",
                "7. Analytical method development by using Green chemistry",
                "8. Quantification of pharmaceuticals in biological fluids using Solid Phase Extraction (SPE)",
                "9. Quantification of pharmaceuticals in biological matrix by PPE",
                "10. Quantification of pharmaceuticals in biological matrix by LLE",
                "11. Demonstration of Cell Viability evaluation using MTT Assay",
                "12. Demonstration on residual solvent analysis using GC",
                "13. Assay of drug using HPLC (any two)",
                "14. Analysis of drug from biological fluid using HPLC/ UV spectroscopy.",
            ]
        },
    ], false,
    [
        "Provide practical training in interpretation of advanced instrumental data used for structural and physicochemical characterization.",
        "Introduce quantitative analytical techniques using modern separation methods, such as UHPLC and HPLC, for the estimation of pharmaceutical substances.",
        "Familiarize students with the principles and practice of green analytical chemistry, including preparation of green solvents and development of environmentally sustainable analytical methods.",
        "Develop understanding of bioanalytical sample preparation techniques for pharmaceutical analysis in biological matrices, including solid phase extraction, liquid– liquid extraction, and protein precipitation.",
        "Learn applied pharmaceutical analysis and methods including cell viability assays, residual solvent analysis, and estimation of drugs from biological fluids.",
    ],
    [
        "1. Beckett, A. H. and Stenlake, J. B. Practical Pharmaceutical Chemistry. CBS Publishers & Distributors.",
        "Brittain, H. G. Analytical Profiles of Drug Substances and Excipients. Elsevier.",
        "Kemp, W. Organic Spectroscopy. Palgrave Macmillan.",
        "Munson, J. W. Pharmaceutical Analysis: Modern Methods. Marcel Dekker.",
        "Sharma, Y. R. Organic Spectroscopy. S. Chand.",
        "Silverstein, R. M., Webster, F. X., Kiemle, D. J. and Bryce, D. L. Spectrometric Identification of Organic Compounds. Wiley.",
        "Willard, H. H., Merritt, L. L., Dean, J. A. and Settle, F. A. Instrumental Methods of Analysis. Brooks/Cole.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
    ]),
    s("BP710RP", "Research Project (Major)", 6, "RP", [
        {
            num: "I", hours: "20 Hours", title: "Topic Selection, Hypothesis & Literature Review", topics: [
                "Identification of research gap across pharmaceutics, medicinal chemistry, pharmacology, or pharmacognosy",
                "Comprehensive database search using PubMed, Scopus, Web of Science, Google Scholar, and SciFinder",
                "Formulation of clear scientific hypothesis, aims, and specific measurable objectives",
                "External mentor alignment from Industry, Hospital, or NABL/CDSCO-approved laboratory",
            ]
        },
        {
            num: "II", hours: "20 Hours", title: "Research Design & Ethical Clearances", topics: [
                "Detailed experimental methodology, study design, and statistical power analysis",
                "Institutional Animal Ethics Committee (IAEC) or Institutional Ethics Committee (IEC) protocol submission",
                "Chemical safety, hazardous waste disposal, bio-safety cabinet handling, and GLP compliance",
                "Procurement of active pharmaceutical ingredients, excipients, analytical reagents, and standard references",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Method Standardization & Pilot Experimentation", topics: [
                "Calibration and standardization of analytical instruments (UV, FTIR, HPLC, TLC-densitometry)",
                "Pilot scale synthesis of lead molecules, extract isolation, or prototype formulation compounding",
                "Optimization of process variables using Quality by Design (QbD) or Design of Experiments (DoE)",
                "Recording raw data in bound research notebooks adhering to ALCOA+ principles",
            ]
        },
        {
            num: "IV", hours: "20 Hours", title: "Interim Milestone Report & Semester VII Evaluation", topics: [
                "Compilation of Semester VII progress report (minimum 15 pages) detailing literature, methodology, and initial findings",
                "Table XVIII & XIX criteria alignment: Objectives evaluation (10 marks), Methodology adopted (20 marks)",
                "Group presentation before University-appointed external and internal evaluation committee",
                "Formulation of work plan for final experimental completion in Semester VIII",
            ]
        },
    ], true,
    [
        "Develop independent research thinking, scientific hypothesis generation, and literature survey methodology.",
        "Design rigorous experimental or computational protocols to address unmet pharmaceutical research questions.",
        "Execute laboratory synthesis, formulation design, in silico modeling, or pharmacological evaluations.",
        "Maintain accurate research laboratory notebooks complying with data integrity and bioethics standards.",
        "Complete Semester VII milestone evaluation including problem formulation, methodology, and interim progress.",
    ],
    [
        "PCI NEP 2020 Regulation Section 21: Guidelines for Project Work and Dissertation.",
        "Kothari, C. R., Research Methodology: Methods and Techniques. New Age International Publishers.",
        "Booth, W. C., Colomb, G. G., Williams, J. M. The Craft of Research. University of Chicago Press.",
        "Guidelines of Committee for Control and Supervision of Experiments on Animals (CCSEA) and Institutional Ethics Committee (IEC).",
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER 8
// ─────────────────────────────────────────────────────────────
const SEM8: Subject[] = [
    s("BP801T", "Ethical Considerations and Translational Applications of AI in Pharmacy", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI Lifecycle, Validation & Model Auditing", topics: [
                "OVERVIEW OF AI SYSTEM LIFECYCLE: data collection, preprocessing, modeling, validation, deployment, and monitoring.",
                "Importance of data quality in healthcare datasets.",
                "Training vs testing vs validation datasets.",
                "Cross-validation (conceptual understanding).",
                "Model drift and performance degradation, data leakage in modeling.",
                "DOCUMENTATION PRACTICES: Documentation and reproducibility, Basics of model auditing.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Regulatory Framework & Explainable AI", topics: [
                "Overview of AI in regulatory submissions.",
                "Explainable AI (XAI) concept.",
                "Transparency and interpretability.",
                "Overview of regulatory guidance on AI (EU AI Act, FDA/CDSCO frameworks).",
                "Accountability in automated decision systems.",
                "Risk-based classification of AI systems.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in in Pharmacy Automation & Supply Chain", topics: [
                "Overview of AI in automated dispensing systems.",
                "Inventory prediction models.",
                "Case studies on regression-based demand forecasting, different forecasting methods.",
                "Medication adherence monitoring systems.",
                "AI in supply chain risk prediction.",
                "Predictive analytics in pharmaceutical logistics.",
                "Advantages, limitations, legal & privacy considerations of AI in pharmacy automation.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "AI in in Public Health & Real-world Data Analytics", topics: [
                "Overview of real-world data sources (EHR, claims, surveillance systems).",
                "Conceptual knowledge of AI in outbreak prediction, Population-level risk modeling.",
                "Regression models in epidemiology.",
                "AI in vaccination forecasting.",
                "CASE STUDIES: AI applications in epidemiological trend analysis (e.g. COVID-19 vaccination hesitancy, diabetes prevalence forecasting, antibiotic resistance trends etc.).",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Guided Project - Translational AI in Pharmacy", topics: [
                "Students implement a supervised ML model (regression, logistic regression, or others) using real-world pharmacy data from domains like formulation, pharmacokinetics (PK), ADR detection, quality control (QC), automation, or public health. They validate the model, analyze regulatory implications, identify ethical risks (e.g., bias, privacy), and present a structured AI implementation plan for peer/faculty review.",
                "Suggested topics (not exhaustive): ADR prediction system, stability forecasting, demand prediction, QC failure model, disease risk prediction, medication adherence.",
            ]
        },
    ], true,
    [
        "Introduce the lifecycle of artificial intelligence systems used in pharmaceutical and healthcare applications, including data management, model development, validation, and deployment.",
        "Provide an understanding of model validation, auditing procedures, and documentation practices required for reliable and reproducible AI systems.",
        "Familiarize students with regulatory, governance, and ethical frameworks guiding the implementation of AI in pharmaceutical and healthcare environments.",
        "Explore applications of artificial intelligence in pharmacy automation, supply chain management, and public health data analytics.",
        "Develop practical understanding of AI implementation in pharmaceutical and healthcare domains through case studies and guided project work.",
    ],
    [
        "1. Germanakos, P. Human-Centered AI: An Illustrated Scientific Quest.",
        "Matheny, M., et al. Artificial Intelligence in Health Care: The Hope, the Hype, the Promise, the Peril. National Academy of Medicine.",
        "Mittal, M. and Bhushan, B. Generative AI in Healthcare: Concepts, Methodologies, Tools, and Applications.",
        "Steyerberg, E. W. Clinical Prediction Models: A Practical Approach to Development, Validation, and Updating. Springer.",
        "Steyerberg, E. W. Practical Predictive Analytics and Decisioning Systems for Medicine. Academic Pres",
    ]),
    s("BP802T", "Clinical Pharmacotherapeutics", 2, "T", [
        {
            num: "I", hours: "5 Hours", title: "Cardiovascular System", topics: [
                "Definition, etiopathogenesis, clinical manifestations, overview of management of the diseases associated with:",
                "CARDIOVASCULAR SYSTEM: Ischemic Heart Disease, Hypertension, heart failure, myocardial infarction, hyperlipidaemia, arrhythmia.",
            ]
        },
        {
            num: "II", hours: "2 Hours", title: "Respiratory System", topics: [
                "RESPIRATORY SYSTEM: Asthma, COPD.",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Renal System", topics: [
                "RENAL SYSTEM: acute renal failure, chronic renal failure, renal replacement therapy.",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Endocrine System", topics: [
                "ENDOCRINE SYSTEM: diabetes, thyroid disorders.",
            ]
        },
        {
            num: "V", hours: "5 Hours", title: "Nervous System", topics: [
                "NERVOUS SYSTEM: epilepsy, stroke, parkinsonism.",
            ]
        },
        {
            num: "VI", hours: "2 Hours", title: "Gastrointestinal System", topics: [
                "GASTROINTESTINAL SYSTEM: peptic ulcer disease, GERD.",
            ]
        },
        {
            num: "VII", hours: "3 Hours", title: "Diseases of Bones and Joints", topics: [
                "DISEASES OF BONES AND JOINTS: rheumatoid arthritis, osteoarthritis.",
            ]
        },
        {
            num: "VIII", hours: "4 Hours", title: "Infectious Diseases", topics: [
                "INFECTIOUS DISEASES: tuberculosis, pneumonia, UTI, malaria, HIV.",
            ]
        },
        {
            num: "IX", hours: "3 Hours", title: "Hematological Diseases", topics: [
                "HEMATOLOGICAL DISEASES: Anemia.",
            ]
        },
    ], false,
    [
        "Explain the pathophysiology and clinical manifestations of selected disease conditions and their relevance to drug therapy.",
        "Provide an understanding of the pharmacological and therapeutic approaches used in the management of these diseases.",
        "Develop the ability to design individualized therapeutic plans based on diagnosis and patient characteristics.",
        "Enable identification of patient-specific parameters required for initiating, monitoring, and modifying drug therapy.",
        "Familiarize students with evidence-based therapeutic guidelines and non- pharmacological approaches in disease management.",
    ],
    [
        "Bauer, L. A. Applied Clinical Pharmacokinetics. McGraw-Hill Education.",
        "DiPiro, J. T., Yee, G. C., Posey, L. M., Haines, S. T., Nolin, T. D. and Ellingrod, V. Pharmacotherapy: A Pathophysiologic Approach. McGraw-Hill Education.",
        "Herfindal, E. T. and Gourley, D. R. Clinical Pharmacy and Therapeutics. Williams & Wilkins.",
        "Walker, R. and Whittlesea, C. Clinical Pharmacy and Therapeutics. Elsevier.",
        "Zeind, C. S. and Carvalho, M. G. Applied Therapeutics: The Clinical Use of Drugs. Wolters Kluwer.",
    ]),
    s("BP803T", "Industrial Pharmacy and Facility Design", 3, "T", [
        {
            num: "I", hours: "12 Hours", title: "Regulatory Guidelines for Formulation Development", topics: [
                "ICH Q8, QbD and optimization (Fundamental terminologies, process and applications).",
                "ICH guidelines of stability testing Industrial aspects of Product development Pilot Plant and Scale up: General considerations including significance of personnel requirements, space requirements, raw materials, Pilot plant scale up considerations for solids, liquid orals, semi solids and relevant documentation, SUPAC guidelines, Introduction to platform technology.",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Technology Development and Transfer", topics: [
                "WHO guidelines for Technology Transfer(TT): Terminology, Technology transfer protocol, Quality risk management, Transfer from R & D to production (Process, packaging and cleaning), Granularity of TT Process (API, excipients, finished products, packaging materials) Documentation, Premises and equipments, qualification and validation, quality control and analytical method transfer.",
                "TT AGENCIES IN INDIA: APCTD, NRDC, TIFAC, BCIL, TBSE / SIDBI; TT related documentation - confidentiality agreement, licensing, MoUs, legal issues.",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Facility Considerations: Non Sterile", topics: [
                "Facility design according to schedule M for various dosage forms, Water purification system: design and operation, Storage, distribution, and validation of water systems. Different types of waters. Steam systems and Clean Steam, Compressed air, Vacuum, CIP. Industry standards for water and steam systems. Effluent testing facility: Design and significance.",
                "Layout design for various non- sterile dosage forms (Process flow) Cleaning and disinfection protocols, cleaning types (Type A, B and C), Cleaning validation methods and acceptance criteria.",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Facility Considerations: Sterile", topics: [
                "OVERVIEW OF STERILE PHARMACEUTICAL MANUFACTURING: layout as per schedule M and cGMP, clean room concept -Importance of sterility and contamination control, SIP. efficient material and personnel flow to maintain sterility, zoning and segregation, Guidelines, standards and Cleanroom classifications from FDA, EMA, WHO and ISO.",
                "Heating, ventilation and air conditioning system (HVAC):",
                "Significance, components, testing (including efficiency and integrity testing of HEPA).",
                "Parameters for qualification and validation (routine monitoring) of clean area.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Advances in Facility Design", topics: [
                "Modular concept of manufacturing facilities with significance and suitable examples, Advances in clean room technology: pass- through chambers, isolators, Modular cleanrooms Automation and robotics in pharmaceutical manufacturing operations.",
            ]
        },
    ], false,
    [
        "Introduce regulatory guidelines such as ICH, WHO, Schedule M, cGMP, and SUPAC governing pharmaceutical formulation development, stability testing, and scale-up processes.",
        "Develop an understanding of industrial product development processes including pilot plant operations, scale-up considerations, and platform technologies used in pharmaceutical manufacturing.",
        "Explain the principles and procedures involved in technology transfer from research and development to commercial production, including documentation, quality risk management, and regulatory compliance.",
        "Introduce the design and operational requirements of pharmaceutical facilities for sterile and non-sterile manufacturing, including layout planning, utilities, and contamination control systems.",
        "Familiarize students with modern pharmaceutical facility design concepts such as modular cleanrooms, isolators, automation, and advanced contamination control technologies to ensure product quality and regulatory compliance.",
    ],
    [
        "Akers, M. J. Sterile Product Development: Formulation, Process and Regulatory Considerations. CRC Press.",
        "Beg, S., Abbas, M. Z. and Hossain, M. A. Pharmaceutical Quality by Design: A Practical Approach. Academic Press.",
        "Bunn, G. Pharmaceutical Production Facilities: Design and Applications. CRC Press.",
        "Francke, R. M. and Meissner, H. Cleaning Validation: Practical Compliance Solutions for Pharmaceutical Manufacturing. CRC Press.",
        "Gad, S. C. Pharmaceutical Manufacturing Handbook: Production and Processes. Wiley.",
        "Levin, M. Pharmaceutical Process Scale-Up. CRC Press.",
        "McCormick, K. Pharmaceutical Facility Design. CRC Press.",
        "Nally, J. D. Good Manufacturing Practices for Pharmaceuticals. CRC Press.",
        "Sandle, T. Advanced Cleanroom Technology. Wiley-Blackwell.",
        "Steinborn, L. GMP/ISO Quality Audit Manual for Healthcare Manufacturers and Their Suppliers. CRC Press.",
        "Teasdale, A., Elder, D. and Greenwood, R. W. ICH Quality Guidelines: An Implementation Guide. Wiley.",
        "Whyte, W. Cleanroom Technology: Fundamentals of Design, Testing and Operation. Wiley-Blackwell.",
    ]),
    s("BP804T", "Pharmaceutical Management", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Pharmaceutical Management", topics: [
                "Introduction to management. Overview of Indian & Global pharmaceutical industry, Role and responsibilities of a pharmaceutical manager. Functions and importance of Key Management Principles:",
                "Planning, organizing, leading, controlling, Decision-making and Time management.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Marketing Management in Pharmaceuticals", topics: [
                "Definition and uniqueness of pharmaceutical marketing, Pharmaceutical Marketing Overview; Global & Indian Scenario, Marketing Mix, 4 Ps of Marketing: Product, Price, Place, Promotion, Strategic marketing and competitive analysis, Pharmaceutical Sales: Role of a medical representative, Digital marketing of pharmaceutical products, Ethical considerations in pharmaceutical marketing and promotion, E pharmacies.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Pharmaceutical Product Management", topics: [
                "Introduction to Pharmaceutical Product Management, role of product management in the pharmaceutical industry, Key responsibilities of a pharmaceutical product manager, Product Lifecycle Management, Branding and Promotional Strategies in pharmaceutical sector, Importance of market segmentation, targeting, and positioning in product management, Market Research and Analysis in pharmaceutical sector:",
                "Techniques for conducting market research.",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Financial Planning and Human Resource Management", topics: [
                "Budgeting, financial forecasting, cost control, Pricing of Pharmaceuticals as per DPCO, Importance of human resource management in pharmaceutical organizations, Recruitment, selection, and training of pharmaceutical professionals, Performance appraisal and employee motivation, Behaviour, Leadership styles and their impact on the pharmaceutical industry, Team building and conflict resolution.",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Operations & Supply Chain Management in Pharmaceuticals", topics: [
                "Operations Management, Production planning and control in pharmaceutical manufacturing, Inventory management and optimization, Lean manufacturing and Six Sigma in the pharmaceutical industry, Supply Chain Management, Logistics management and drug distribution channels, Cold chain management and the role of technology in SCM, Ecommerce and its role in pharmaceutical distribution, Risk Management and Sustainability.",
            ]
        },
    ], false,
    [
        "Gain a deep understanding of the pharmaceutical sector, including the development, production, and distribution of pharmaceutical products.",
        "Familiarize with the global and local pharmaceutical landscape, trends, regulations, and the competitive environment.",
        "Learn how to formulate and implement effective business strategies specific to the pharmaceutical industry.",
        "Analyze the dynamics of pharmaceutical marketing, product life cycles, and strategic decision-making processes.",
        "Understand the principles and practices of marketing pharmaceutical products, including branding, pricing, distribution, and promotion.",
    ],
    [
        "1. Dessler, G. Human Resource Management. Pearson.",
        "Drucker, P. F. Principles of Management. Harper Business.",
        "Joseph, A. S. Pharmaceutical Management and Marketing. CBS Publishers & Distributors.",
        "Pandey, I. M. Financial Management. Vikas Publishing House.",
    ]),
    s("BP805T", "Sterile Dosage Forms and Novel Drug Delivery System", 3, "T", [
        {
            num: "I", hours: "12 Hours", title: "Fundamentals, Polymers & Materials for NDDS", topics: [
                "Limitations of conventional dosage forms (e.g., solubility, permeability, toxicity, first-pass metabolism).",
                "CLASSIFICATION OF NDDS: Controlled Release, Targeted, StimuliResponsive (Smart), Chronotherapeutic, Transdermal and Mucosal, Implantable and Injectable Depot Systems, Vesicular, Polymeric, Ocular, Pulmonary, and Nasal Drug Delivery Systems.",
                "BIODEGRADABLE AND BIOCOMPATIBLE POLYMERS: PLA, PLGA, PCL, chitosan, gelatin.",
                "LIPIDS AND SURFACTANTS: lecithin, phospholipids, Span/Tween, SLNs.",
                "INORGANIC SYSTEMS: silica, gold nanoparticles, iron oxide, MOFs.",
                "EXCIPIENTS IN NDDS: GRAS substances, IIG database, regulatory constraints.",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Oral and Mucosal Delivery Systems", topics: [
                "GASTRO-RETENTIVE SYSTEMS: floating, bioadhesive, expandable systems.",
                "COLON-TARGETED SYSTEMS: pH-triggered, microbially-triggered, timedependent systems.",
                "BUCCAL, NASAL, AND PULMONARY CARRIERS: films, sprays, DPIs, liposomes.",
                "IVIVC and biorelevant dissolution testing.",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Transdermal NDDS", topics: [
                "INTRODUCTION TO TRANSDERMAL DRUG DELIVERY: Need, advantages disadvantages, basic structure and components. Formulation aspects including permeation enhancers.",
                "LONG-ACTING SYSTEMS: in-situ gels, microspheres, implants, ocular inserts.",
                "TRANSDERMAL AND MICRONEEDLE TECHNOLOGIES: iontophoresis, sonophoresis, micro needles Aseptic manufacturing, scale-up challenges, and process analytical tools (PAT).",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Evaluation, Quality, and Translation", topics: [
                "PREFORMULATION AND QBD: QTPP, CQAs, CPPs.",
                "CHARACTERIZATION METHODS: particle size, zeta potential, SEM/TEM, in-vitro release, permeability assays (PAMPA, Caco-2).",
                "NON-CLINICAL EVALUATION: PK/PD modeling, biodistribution, toxicology.",
                "REGULATORY PATHWAYS: 505(b)(2), complex generics, ICH Q8–Q10, EMA pathways.",
                "CASE STUDIES: Liposomal Amphotericin B for Fungal Infections, mRNA-Lipid Nanoparticle Vaccines (e.g., COVID-19 Vaccines), Depot Antipsychotic Injections (e.g., Risperidone Microspheres), Transdermal Patch for Hormone Replacement Therapy, Ocular Inserts for Glaucoma Management, Oral Colon-Targeted Delivery for Inflammatory Bowel Disease, Inhalable Insulin for Diabetes Mellitus, Dendrimers for Targeted Cancer Therapy, Chronotherapeutic Drug Delivery in Hypertension., Nanosystems and precision medicine.",
                "Liposomes, niosomes, transferosomes, polymeric nanoparticles, solid-lipid nanoparticles, dendrimers.",
                "PRECISION MEDICINE: definition and scope, evolution from” onesize-fits-all” to personalized approaches.",
            ]
        },
        {
            num: "V", hours: "14 Hours", title: "Sterile Dosage Forms (parenteral & Ophthalmic)", topics: [
                "Introduction & classification: SVP vs LVP; routes; Advantages/limitations.",
                "Water for Injection (WFI): Types, preparation, storage/distribution; pharmacopoeial requirements.",
                "FORMULATION COMPONENTS: Vehicles, buffers, co-solvents, surfactants, antioxidants, preservatives, chelators; isotonicity & osmolality.",
                "MANUFACTURING: Aseptic vs terminal sterilisation; filtration; lyophilisation principles; environmental controls.",
                "Containers & closures: Glass/Plastic systems; elastomers; selection factors; evaluation & container– closure integrity. Form fill Seal and Blow Fill Seal Technology Ophthalmics: Solutions/suspensions/ointments/gels/inserts; physiological factors (pH, tonicity, viscosity); residence-time enhancers; preservative-free systems (e.g., BFS).",
                "Quality control & compliance: Sterility tests, LAL/endotoxins, particulate matter, clarity, extractable volume; labelling & documentation; overview of cGMP/cleanrooms and environmental monitoring.",
            ]
        },
    ], false,
    [
        "Understand the scientific and technological foundations of advanced and novel drug delivery systems, including their classification, design rationale, materials, and formulation development challenges.",
        "Examine the role of polymers, lipids, and excipients in formulating biodegradable, targeted, and controlled-release drug delivery systems.",
        "Study specialized drug delivery routes such as oral, mucosal, transdermal, ocular, parenteral and drug carriers including and their impact on therapeutic efficacy.",
        "Apply principles of Quality by Design (QbD), preclinical evaluation, and regulatory science to assess NDDS development and clinical translation.",
        "Explore the emerging field of precision medicine, including its genetic, molecular, and technological underpinnings relevant to pharmacy.",
    ],
    [
        "Aulton, M. E. and Taylor, K. Aulton’s Pharmaceutics: The Design and Manufacture of Medicines. Elsevier.",
        "Banga, A. K. Transdermal and Intradermal Delivery of Therapeutic Agents. CRC Press.",
        "Dash, A. K. and Cudworth, G. C. Therapeutic Proteins and Peptides: Formulation, Processing and Delivery Systems. CRC Press.",
        "Jain, N. K. Drug Delivery Systems. CBS Publishers & Distributors.",
        "Kreuter, J. Colloidal Drug Delivery Systems. CRC Press.",
        "Martin, A., Sinko, P. J. and Singh, Y. Martin’s Physical Pharmacy and Pharmaceutical Sciences. Lippincott Williams & Wilkins.",
        "Torchilin, V. P. Nanoparticulates as Drug Carriers. Imperial College Press.",
        "Remington. The Science and Practice of Pharmacy. Pharmaceutical Press.",
    ]),
    s("BP806T AEC", "AEC Elective — Pharmaceutical Packaging / Supply Chain / Industrial Safety / Traditional Healing / AR-VR Pharma 4.0 / Herbal Cosmetics", 2, "T", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP806T AEC1 — Pharmaceutical Packaging (30 Hours)", topics: [
                "General Information on Packaging",
                "Introduction: Purpose of packaging, selection of the ideal package (primary, secondary and tertiary), hazards encountered by the package, various types of inner and outer packages, selection of a suitable package.",
                "Packaging materials: Detailed study with regard to composition packaging characteristics, advantages, economics and limitations of various packaging materials with special emphasis on glass, plastics, metals and rubber.",
                "Child resistant package, Tamper Evident Packaging, Anti- Counterfeit Packaging, Environmental considerations of packaging (Recycling). Pharmaceutical Packaging – Design and Development",
                "Selection and Design of Packaging during Product Development Process (Parameters).",
                "Packaging Process: Significance of Strip, Blister, Pouch Packaging, advantages, economics and limitation, Packing machinery and recent advances, films employed in Packing (Video based learning). Formulation Packaging Interaction",
                "Polymer Chemistry Science and Stability Aspects",
                "Extractable and Leachables",
                "Methods to study formulation packaging interaction",
                "Suitability considerations for pharmaceutical packaging Quality Assurance, Control and Regulatory Aspects",
                "Total Quality management, Good Manufacturing Practice, Quality Risk Management related to Packaging Department, Specification Testing and Shelf-life testing as per Pharmacopoeial Guidelines for Packaging Material in-process and finished Package Products.",
                "Standard Operating Procedures (SOPs)/Documentation for Solid/Semi- Solid/Liquid/Parenteral Formulation Packaging. Packaging waste and Waste policies for packaging materials, Advances in Pharmaceutical Packaging",
                "Labelling- Types of label (including Bar code, Hologram, RF, structured program, in- mould and decorative labelling) – Use of Software, Legal requirements of Labelling, packaging inserts and outserts. Adhesives and Machinery Employed for Labelling - Pharmacy Accessory Label Printers (PALP), Concept of paperless labelling",
                "Logistics Packaging - Block Chain Technology in Supply Traceability, Transparency and Credibility. Review on Automated Packaging System for Oral Solids (Auto-Print), Oral Liquid (Fluidose), and overwrapping (PABS).",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP806T AEC2 — Supply Chain Management (30 Hours)", topics: [
                "Introduction to Supply Chain Management",
                "Introduction to SCM: Definition, scope, Importance of SCM, in global business, Key components and stakeholders, Supply Chain Strategies, Process and barriers of supply chain management.",
                "Supply Chain Models: SCOR Model (Plan, Source, Make, Deliver, Return) CSCMP Supply Chain Process Standards.",
                "Supply Chain Network Design, Facility location and layout, Transportation planning.",
                "Supply Chain Performance Metrics, Key Performance Indicators (KPIs)",
                "Performance measurement tools",
                "Case Study: SCM in Practice with Real-world examples Procurement and Supplier Management",
                "Procurement Fundamentals, Role of procurement in SCM, sourcing strategies",
                "Supplier selection criteria, supplier performance evaluation, Collaboration and communication.",
                "Global Sourcing, Challenges and opportunities, Cultural considerations, Legal and ethical issues",
                "E-Procurement, Electronic procurement systems, Benefits and challenges",
                "Case Study: Procurement Excellence, Best practices. Logistics and Distribution Management",
                "Logistics Fundamentals, Definition and scope, Importance in SCM",
                "Transportation Management, Modes of transportation, Routing and scheduling, Freight cost analysis",
                "Inventory Management of pharmaceuticals, Inventory types and functions, Inventory control techniques, Economic Order Quantity (EOQ)",
                "Introduction to warehouse functions, Management and Distribution channels and distribution strategies for vaccines and biologicals.",
                "Case Study: Logistics and transportation Optimization process, Knowledge and skill sets needed for optimization. Technology and Innovation in SCM",
                "Information Technology in SCM, Role of IT in SCM planning and operations management for pharmaceuticals.",
                "Enterprise Resource Planning (ERP) systems, operations 6system, Supply Chain Management Softwares.",
                "Big Data and Analytics, Importance of data in SCM.",
                "Artificial Intelligence and Machine Learning, AI/ML applications in SCM, smart logistics.",
                "Demand forecasting, Autonomous vehicles",
                "Security and transparency with special emphasis to cybersecurity. Sustainability and Risk Management in SCM",
                "Sustainable Supply Chain Management, Green logistics, Circular economy Environmental impact assessment.",
                "Ethical Sourcing, Fair trade practices, Labor standards, Supplier audits.",
                "Risk Management in SCM, Risk identification and assessment, Risk mitigation strategies, Crisis management with special emphasis to Pharmaceutical products.",
                "Regulatory Compliance, International trade regulations, Customs and import/export laws, Compliance standards.",
                "Cold chain management, its need, challenges and opportunities in Pharmaceutical products.",
                "Case Study: Risk and Sustainability Challenges",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Option 3: BP806T AEC3 — Industrial Safety and Waste Management (30 Hours)", topics: [
                "Introduction to Industrial Safety",
                "Importance of industrial safety in pharmaceutical and chemical industries",
                "Types of industrial hazards: physical, chemical, biological, mechanical, electrical",
                "Accident prevention techniques",
                "Safety signs, symbols, and personal protective equipment (PPE)",
                "OSHA guidelines and ISO safety standards Risk Assessment and Hazard Management",
                "Hazard identification methods (HAZOP, FMEA)",
                "Risk analysis and evaluation",
                "Safety audit and checklist",
                "Fire hazards and fire-fighting systems",
                "Role of safety officer and disaster management planning Waste Management – Fundamentals",
                "Classification of industrial waste: hazardous, non-hazardous, solid, liquid",
                "Sources of pharmaceutical and chemical waste",
                "Waste minimization strategies",
                "Recycling, reuse, and resource recovery Environmental impact assessment (EIA) basics Waste Treatment Technologies",
                "Physical, chemical, and biological methods of waste treatment",
                "Treatment of effluents, emissions, and solid waste",
                "Common Effluent Treatment Plants (CETP)",
                "Biomedical waste disposal and rules (BMW Rules – India)",
                "Guidelines from CPCB, WHO, and MOEFCC Regulatory and Sustainable Practices",
                "Environmental Protection Act, Factories Act, Hazardous Waste Rules",
                "Good Manufacturing Practices (GMP) related to waste and safety",
                "International guidelines: US EPA, EU regulations, WHO",
                "Sustainable development goals (SDGs) related to waste and health",
                "Case studies of safe and green pharma manufacturing",
            ]
        },
        {
            num: "IV", hours: "30 Hours", title: "Option 4: BP806T AEC4 — Traditional Healing Practices of India (30 Hours)", topics: [
                "Introduction to Traditional Medicine, Definition and scope of traditional healing Historical evolution of traditional medicine in India Indigenous knowledge systems and oral traditions Health and disease in Indian philosophical thought Integrating Traditional Healing with Modern Medicine What is a traditional healing practice. Traditional healing practice in India. Socio-Scientific Validation and Knowledge Integration Preservation of Socio-Cultural Health Knowledge Ethnoveterinary Empowerment and Rural Health Equity Basic principles: Ayurveda, Panchamahabhuta, Tridosha, Dhatu, Mala Diagnosis and treatment: Pulse diagnosis, Panchakarma, Rasayana, Nadi Parikshan, Marma therapy, Chiropathic treatment, Materia medica (Dravyaguna) and formulation (Rasa Shastra) Current relevance and institutionalization (AYUSH) The study seeks to integrate traditional healing practices into contemporary healthcare systems. Contemporary usage and debates Fostering Transdisciplinary Collaboration Economic Viability and Grassroots Entrepreneurship Siddha and Unani Systems: Siddha: Origin, principles, and therapeutic techniques Unani: Greek-Arabic foundations, four humors, pharmacopoeia Role in South Indian and Indo-Islamic medical heritage Role of traditional healing practice in homeopathy and naturopathy Role of traditional healing practice in homeopathy and naturopathy Development and acceptance in India Role of traditional healing practice in homeopathy and naturopathy Development and acceptance in India Folk and Tribal Healing Practices: Holistic approach to the traditional system, natural methods of healing practices, and cultural significance of the traditional system of medicine. Difference between Indian traditional system of medicine and traditional Chinese medicinal system. Regional practices: Snake stones, ritual healing, herbal knowledge Role of healers: Vaidya, Ojha, Bhopa, Bonesetters, Dai (traditional midwives) Ethnomedicine and ethnobotany: Case studies from North East of India, Chhattisgarh, Himalaya etc. Multidisciplinary longitudinal study to comprehensively document, scientifically validate, and integrate traditional healing systems Spiritual and Religious Healing: Role of Yoga, Pranayama, and meditation Healing through Mantras, rituals, and astrology Use of temples and sacred groves in mental health and well-being Computational studies will complement laboratory investigations by revealing molecular interactions and mechanisms of action, thereby providing scientific rigor to traditional claims. Legal and policy frameworks (AYUSH, WHO recognition) Role of NGOs and community health programs Challenges in validation, standardization, and commercialization Case studies of integration in rural/urban healthcare Protection of Intellectual Property and Cultural Sovereignty Documentation of Indigenous Knowledge System (IKS). Prevention of the Traditional system of medicine.",
            ]
        },
        {
            num: "V", hours: "30 Hours", title: "Option 5: BP806T AEC5 — Futuristic Pharma through AR/VR: Pharma 4.0 (30 Hours)", topics: [
                "Hours Introduction to AR/VR and Tools",
                "Understanding AR and VR: Concepts, Tools, and Devices",
                "Hands-on demo of Google Cardboard, Oculus, or similar headsets",
                "Difference between AR, VR, and Mixed Reality (MR)",
                "Exploring AR/VR Platforms for Life Sciences",
                "Overview of software: Unity 3D, Vuforia, WebAR, JigSpace, ARKit",
                "Demo of existing pharma-related AR/VR apps (e.g., Human Anatomy VR) AR/VR in Pharmaceutical Education and Training",
                "Use of apps for visualizing drug-receptor interaction",
                "Virtual dissection and interactive physiology",
                "Simulated tablet compression and coating machines",
                "Training modules on aseptic techniques using VR",
                "Counseling Patients in a Virtual Pharmacy Setup",
                "Use of avatars and scenarios for OTC counseling, prescription explanation",
                "Emphasis on communication and empathy in virtual settings AR/VR in Manufacturing and Pharma 4.0 Digital Twin Concept & Virtual Plant Walkthrough",
                "Create mock layouts of pharma production plants in AR",
                "Navigate a cleanroom and observe equipment placement virtually Smart Maintenance and SOP Training via AR Integrating AR with Sensors and QR-based Inventory",
                "Real-world temperature/humidity sensors",
                "Live monitoring of warehousing systems Pharma 4.0 Compliance and Regulatory Perspectives",
                "Virtual audit readiness",
                "Documentation and equipment validation trails using AR mock- ups AR/VR for Patient-Centric Applications Patient Leaflets and Drug Delivery Tutorials",
                "Creating content showing how to use inhalers, injectables, or devices",
                "Overlay content on medicine boxes or instruction cards AR/VR for Mental Health, Pain, and Rehabilitation Therapy",
                "Case studies: VR for phobia therapy, chronic pain, relaxation therapy Digital Adherence Tools with AR Guidance",
                "Real-time AR reminders linked to prescription schedules",
                "AI avatars for personalized patient nudges Project-Based Integration and Evaluation Mini Project: Create an AR/VR-Based Solution",
                "Example: VR tour of GMP plant, AR-based patient education module",
                "Demo Unity or online tools like CoSpaces / ZapWorks",
            ]
        },
        {
            num: "VI", hours: "30 Hours", title: "Option 6: BP806T AEC6 — Herbal Cosmetics for Industry Perspective (30 Hours)", topics: [
                "Introduction to the requirements for an herbal cosmetics industry Market trends, worldwide trade and consumer demand for herbal cosmetics. Advantages and challenges of the herbal cosmetics industry. Requirements for factory location, premises, plant layout and infrastructure and materials. Fundamentals of Entrepreneurship Characteristics and skills of successful entrepreneurs. Types of entrepreneurship: product, process, and quality testing entrepreneurship. Developing Entrepreneurial mind-set. Case studies Success Stories of some successful herbal cosmetic brands (e.g., Forest Essentials, Biotique, Khadi Naturals) Steps involved in setting up a start-up:",
                "Identifying gaps in the herbal cosmetics market",
                "Business plan development for a herbal cosmetic product",
                "SWOT analysis for herbal cosmetics start-ups",
                "Technical, financial, and market feasibility study",
                "Planning for scalability and sustainability Financial Management and Marketing Strategies Budgeting and cost estimation. Sources of finance: loans, grants, angel investors, venture capital. Government schemes (STARTUP INDIA) and support for MSMEs and herbal industries. Overview on branding essentials – positioning and brand identity. Distribution channels: retail, e-commerce, exports. Digital marketing: social media, Search Engine Optimization (SEO) influencer marketing Legal and Regulatory Framework Licensing and registration for herbal cosmetics as per the Drugs and Cosmetics Act (1940) and rules (1945) of India. The role of CDSCO, AYUSH ministry, FSSAI, ISO, GMP in the herbal cosmetics industry Labelling and packaging norms (Schedule S and role of Bureau of Indian Standards –BIS) Advertising regulation for herbal cosmetics IP rights: patents, trademarks, and protection of herbal knowledge Quality and safety evaluation of herbal cosmetics Importance of quality assurance in herbal cosmetics. Key safety concerns (contamination, allergens, microbial growth). Quality evaluation of herbal raw material. Product-Specific Quality Parameters - Quality standards for creams, lotions, shampoos, oils, face packs, etc. Specific marker compounds and their quantification in herbal products. Toxicological and Safety Evaluation: In vitro and in vivo safety testing (skin irritation, sensitization, eye irritation). Patch testing, Draize test, and OECD guidelines. Use of alternative non-animal testing methods (3D skin models, in silico models)",
            ]
        },
    ], false,
    [
        "Provide students with a comprehensive understanding of pharmaceutical packaging, its principles, materials, processes, and regulatory aspects.",
        "Equip students with knowledge of the selection, design, and development of packaging materials for various dosage forms.",
        "Educate students on the interaction between packaging and formulation, quality control, and advances in pharmaceutical packaging.",
        "Train students in assessing packaging materials for pharmaceutical products in compliance with regulatory guidelines.",
        "Prepare students for future roles in pharmaceutical manufacturing, quality assurance, and packaging development.",
        "Understand and apply key SCM concepts and frameworks.",
    ],
    [
        "1. Brody, A. L., Marsh, K. S. The Wiley Encyclopedia of Packaging Technology. John Wiley & Sons, New York, USA.",
        "Lachman, L., Lieberman, H. A., Kanig, J. L. The Theory and Practice of Industrial Pharmacy. Lea & Febiger, Philadelphia, USA.",
        "KacChesney, T. C. Packaging of Cosmetics and Toiletries. Newness-Butterworth, London, UK.",
        "Allen, L. V. Jr. Remington: The Science and Practice of Pharmacy. Mack Publishing Company, Easton, USA.",
        "Bauer, E. J. Pharmaceutical Packaging Handbook. CRC Press / Informa Healthcare Ltd, USA.",
        "Dean, D. A., Evans, E. R., Hall, I. H. (Eds.) Pharmaceutical Packaging Technology. CRC Press, USA.",
        "Lockhart, H., Paine, F. A. Packaging of Pharmaceuticals & Healthcare Products. Chapman & Hall, UK.",
        "Harburn, K. Quality Control of Packaging Materials in the Pharmaceutical Industry. CRC Press, USA.",
    ]),
    s("BP807P", "Pharmaceutical Marketing Skills (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Laboratory Practicals & Experiments (30 Hours)", topics: [
                "1. Conduct a comparative study of Indian and global pharmaceutical marketing approaches.",
                "2. Study and classify different marketing communication styles in the pharmaceutical industry.",
                "3. Design and conduct primary market research on prescription pharmaceutical products and analyze the data.",
                "4. Design and conduct primary market research on OTC products and analyze the data.",
                "5. Create and deliver a product detailing presentation for healthcare professionals.",
                "6. Design a patient education program or presentation for pharmaceutical products targeting consumers.",
                "7. Develop and present communication strategies for OTC products for both healthcare professionals and consumers.",
                "8. Design a product promotion scheme and create a brand strategy for a pharmaceutical product.",
                "9. Develop a sales strategy for a pharmaceutical product focusing on distribution channels and promotional tactics for retailers/distributors.",
                "10. Design a mock-up or prototype of an e-commerce website for pharmacy.",
                "11. Design a digital marketing campaign for a pharmaceutical or cosmetic product using social media, email marketing, and SEO techniques.",
                "12. Create a product positioning statement including the Unique Selling Proposition (USP) for a new pharmaceutical product.",
            ]
        },
    ], false,
    [
        "Introduce students to the fundamentals of pharmaceutical marketing, focusing on the industry-specific strategies and tactics.",
        "Gain insight into the stages of a pharmaceutical product’s lifecycle, from development to commercialization.",
        "Discuss the critical role of regulations, ethical considerations, and compliance issues in marketing pharmaceutical products.",
        "Equip students with skills to design marketing strategies for pharmaceutical products, considering various market segments and stakeholder needs.",
        "Introduce various sales techniques and communication skills needed to build relationships with healthcare professionals and other stakeholders.",
    ],
    [
        "1. Crompton, J. L. and Lamb, C. W. Marketing Government and Social Services. Wiley.",
        "Herger, M. Pharma Marketing Excellence: Strategy, Tactics and Implementation. CRC Press.",
        "Jain, S. K. Pharmaceutical Marketing Management. CBS Publishers & Distributors.",
        "Kotler, P. and Keller, K. L. Marketing Management. Pearson.",
        "Kotler, P., Shalowitz, J. and Stevens, R. J. Strategic Marketing for Health Care Organizations. Jossey-Bass.",
        "Malhotra, N. K. Marketing Research: An Applied Orientation. Pearson.",
        "Panda, T. K. Sales and Distribution Management. Oxford University Press.",
        "Porter, M. E. Competitive Strategy: Techniques for Analyzing Industries and Competitors. Free Press.",
        "Smith, M. C. Pharmaceutical Marketing: Strategy and Cases. Pharmaceutical Products Press.",
    ]),
    s("BP808P", "Sterile Dosage Forms and Novel Drug Delivery System (Practical)", 2, "P", [
        {
            num: "I", hours: "60 Hours", title: "Laboratory Practicals & Experiments (60 Hours)", topics: [
                "1. Preparation and evaluation of orodispersible tablets",
                "2. Preparation and evaluation of fast dissolving tablets.",
                "3. Preparation and evaluation of bilayer tablets",
                "4. Preparation and evaluation of osmotic tablets",
                "5. Preparation and evaluation of microspheres by coacervation phase separation technique",
                "6. Preparation and evaluation of microcapsules",
                "7. Preparation and evaluation of bioadhesive buccal patches",
                "8. Preparation and evaluation of sublingual tablets",
                "9. Preparation and evaluation of buccal tablets",
                "10. Preparation and evaluation of transdermal patches",
                "11. Preparation and evaluation of floating tablets",
                "12. Preparation and evaluation of gastro retentive drug delivery systems",
                "13. Preparation and evaluation of liposomes",
                "14. Preparation and evaluation of niosomes",
                "15. Preparation and evaluation of nasal spray",
                "16. Preparation and evaluation of a parenteral preparation.",
                "17. Evaluation of pharmaceutical waters: Purified & Distilled Water as per IP; review of WFI specifications (conductivity/ TOC limits-demo / simulation).",
            ]
        },
    ], false,
    [
        "Provide a comprehensive understanding of the concepts, design principles, and technological advancements in novel drug delivery systems (NDDS) and their application in precision medicine.",
        "Develop proficiency in the formulation, preparation, and evaluation of various advanced dosage forms for site-specific and controlled drug delivery.",
        "Impart knowledge on biopharmaceutical and pharmacokinetic considerations influencing NDDS for improved therapeutic outcomes.",
        "Introduce students to the role of NDDS in personalized/precision medicine, focusing on patient-specific drug delivery strategies.",
        "Equip students with skills to critically evaluate formulation performance using appropriate experimental, analytical, and regulatory approaches.",
    ],
    [
        "Allen, L. V., Popovich, N. G. and Ansel, H. C. Pharmaceutical Dosage Forms and Drug Delivery Systems. Lippincott Williams & Wilkins.",
        "Ansel, H. C., Allen, L. V. and Popovich, N. G. Pharmaceutical Calculations. Wolters Kluwer.",
        "Banker, G. S. and Rhodes, C. T. Modern Pharmaceutics. CRC Press.",
        "Chien, Y. W. Novel Drug Delivery Systems. CRC Press.",
        "Jain, N. K. Controlled and Novel Drug Delivery Systems. CBS Publishers & Distributors.",
        "Lachman, L., Lieberman, H. A. and Kanig, J. L. The Theory and Practice of Industrial Pharmacy. CBS Publishers & Distributors.",
        "Sinko, P. J. Martin’s Physical Pharmacy and Pharmaceutical Sciences. Lippincott Williams & Wilkins.",
        "Swarbrick, J. and Boylan, J. C. Encyclopedia of Pharmaceutical Technology. CRC Press.",
        "Indian Pharmacopoeia. Indian Pharmacopoeia Commission.",
    ]),
    s("BP809P VAC", "VAC Elective — Cleaning Validation / Basic Training in Aseptic Handling Techniques / Impurity Profiling (Practical)", 1, "P", [
        {
            num: "I", hours: "30 Hours", title: "Option 1: BP809P VAC1 — Cleaning Validation (30 Hours)", topics: [
                "1. Preparation of a cleaning validation protocol for a tablet machine",
                "2. Calculation of MACO (Maximum Allowable Carry Over)",
                "3. Swab sampling technique demonstration using stainless steel surface",
                "4. Rinse sampling technique for equipment residue detection",
                "5. Visual inspection for equipment cleanliness (case photos/videos)",
                "6. Preparation of recovery study protocol using a known contaminant",
                "7. Demonstration of Total Organic Carbon (TOC) analysis (video/simulation)",
                "8. HPLC method development for residue analysis (demo dataset)",
                "9. Interpretation of swab analysis results and comparison with acceptance limits",
                "10. Preparation of cleaning log sheet and checklists",
                "11. Validation of cleaning agents: detergent effectiveness and rinsibility",
                "12. Determining dirty hold time and clean hold time experimentally (conceptual)",
                "13. Designing a matrix approach for multi-product equipment",
                "14. Simulated deviation report and CAPA for cleaning failure",
                "15. Preparation of a final cleaning validation summary report",
            ]
        },
        {
            num: "II", hours: "30 Hours", title: "Option 2: BP809P VAC2 — Basic Training in Aseptic Handling Techniques (30 Hours)", topics: [
                "1. Gown-up / Gown-down Drill – correct sequencing of coverall, hood, mask, goggles, gloves, and sterile boots.",
                "2. Hand-washing Verification – surgical scrub with UV lotion; inspect under UV lamp for missed spots.",
                "3. Clean-room Entry & Flow Simulation – air-shower pass, unidirectional walking, and material air-lock transfer.",
                "4. LAF Hood Preparation – wipe-down with sporicidal, set airflow, place sterile tools in first-air zone.",
                "5. Smoke-pattern Test – visualize HEPA downflow with smoke to confirm laminar, turbulence-free air.",
                "6. Aseptic Liquid Transfer – pipette or syringe transfer of TSB between vials without touching non-sterile surfaces.",
                "7. Sterile Filtration & Filter Integrity Check – filter a buffer through 0.22 µm unit and perform bubble-point test.",
                "8. Mini Media-Fill – fill 20 sterile vials with TSB under LAF, incubate, and record turbidity for 14 days.",
                "9. Environmental & Personnel Monitoring – deploy settle/contact plates, take glove-fingertip prints, run an air sampler.",
                "10. Cleaning & ATP Validation – full hood wipe-down, then ATP swab pre- and post-clean to verify < 200 RLU residue.",
            ]
        },
        {
            num: "III", hours: "30 Hours", title: "Option 3: BP809P VAC3 — Impurity Profiling (30 Hours)", topics: [
                "1. Identification of organic impurities in bulk drugs using TLC",
                "2. Quantification of impurities using HPLC",
                "3. Determination of residual solvents by GC (as per ICH Q3C)",
                "4. UV-spectrophotometric analysis of degradation products",
                "5. Preparation of forced degradation samples (acid/base/hydrolytic)",
                "6. Identification of degradation products via IR spectroscopy",
                "7. Extraction and analysis of impurities from finished dosage forms",
                "8. Impurity profiling of marketed paracetamol tablet using HPLC",
                "9. Qualification of impurities as per ICH Q3A/Q3B guidelines",
                "10. Limit test for heavy metals (as per IP)",
                "11. Estimation of elemental impurities by ICP-MS or simulated method",
                "12. Determination of related substances in antibiotics (e.g., cephalosporins)",
                "13. Use of LC-MS data interpretation for impurity identification (demo/simulated)",
                "14. Impurity profiling of herbal products using HPTLC",
                "15. Report preparation on impurity profiling as per regulatory requirements",
            ]
        },
    ], false,
    [
        "To understand the importance of cleaning validation in pharmaceutical manufacturing.",
        "To familiarize students with the regulatory requirements for cleaning validation.",
        "To teach methods for residue detection and the development of cleaning protocols.",
        "To explore different analytical techniques used in cleaning validation.",
        "To develop skills in writing cleaning validation reports and ensuring compliance.",
        "Understand aseptic principles that prevent microbial contamination in clean-room work.",
    ],
    [
        "1. Cleaning Validation: A Practical Approach – David M. Blenkinsopp & Roy T. Harvey, CRC Press",
        "Cleaning Validation in Pharmaceutical Manufacturing – Trevor Deeks, CRC Press",
        "Pharmaceutical Cleaning Validation: The Basics – Andrew Walsh, Interpharm Press",
        "Cleaning and Cleaning Validation: Volume 1 – Syed Imtiaz Haider, Informa Healthcare",
        "Validation of Cleaning Processes in Pharmaceuticals and Biopharmaceuticals – Jeanne Moldenhauer, DHI Publishing",
        "Pharmaceutical Equipment Cleaning: Fundamentals, Applications and Validations – Gail Sofer, CRC Press",
        "1. Akers J, Moldenhauer J, editors. Aseptic Processing: A Review of Current Industry Practice. 2nd ed. Boca Raton: CRC Press; 2022.",
        "Smith C. Sterile Drug Products: Formulation, Packaging, Manufacturing, and Quality. 2nd ed. New York: Springer; 2020.",
    ]),
    s("BP810RP", "Research Project (Final Submission)", 6, "RP", [
        {
            num: "I", hours: "25 Hours", title: "Experimental Completion & Data Validation", topics: [
                "Completion of all experimental batches, biological assays, in vitro drug release, or analytical assays",
                "Replicate runs to ensure reproducibility and statistical validity of results",
                "Resolution of experimental anomalies, outliers, and negative controls verification",
                "Raw data backup, instrument run logs, and spectral database archiving",
            ]
        },
        {
            num: "II", hours: "20 Hours", title: "Statistical Data Analysis & Result Interpretation", topics: [
                "Statistical significance testing using GraphPad Prism, SPSS, R, or Python biostatistics packages",
                "Generation of publication-quality graphs, kinetic models, FTIR/NMR spectral interpretations, and SEM images",
                "In-depth discussion comparing experimental findings with published scientific literature",
                "Delineation of major breakthroughs, commercial feasibility, and technological advancements",
            ]
        },
        {
            num: "III", hours: "25 Hours", title: "Dissertation Compilation & Plagiarism Verification", topics: [
                "Drafting formal thesis: Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Summary, References",
                "Verification of originality using university-approved plagiarism detection software (similarity index < 10%)",
                "Certification and endorsement by Faculty Guide, External Mentor, and Head of Department",
                "Submission of final hard-bound project report in triplicate (minimum 25 pages as per Section 21)",
            ]
        },
        {
            num: "IV", hours: "20 Hours", title: "Final Dissertation Evaluation & Viva-Voce Defense", topics: [
                "Formal evaluation of Dissertation Book (60 Marks per Table XVIII: Objectives 10, Methodology 20, Results 20, Conclusion 10)",
                "Final Defense Presentation (90 Marks per Table XIX: Presentation 40, Communication 20, Q&A defense 30)",
                "Total 150 Marks evaluation by University-appointed External and Internal Board of Examiners",
                "Preparation of research manuscript for submission to peer-reviewed Scopus/Web of Science indexed journals",
            ]
        },
    ], true,
    [
        "Complete all experimental runs, computational screenings, or clinical observational evaluations.",
        "Apply statistical methods (ANOVA, regression analysis, t-test, post-hoc tests) to analyze data.",
        "Formulate evidence-based conclusions, identify project limitations, and propose future research avenues.",
        "Write and submit a formal, hardbound dissertation thesis (minimum 25 pages) in triplicate.",
        "Successfully defend research findings in a public viva-voce before external and internal university examiners.",
    ],
    [
        "PCI NEP 2020 Regulation Section 21: Guidelines for Project Work and Dissertation.",
        "Table XVIII & XIX: Official Evaluation Criteria for Dissertation Book & Presentation.",
        "Day, R. A., Gastel, B. How to Write and Publish a Scientific Paper. Cambridge University Press.",
        "Montgomery, D. C. Design and Analysis of Experiments. John Wiley & Sons.",
    ]),
];

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
    const match = slug.match(/^semester-(\d)$/);
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
