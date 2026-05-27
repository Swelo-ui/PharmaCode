// lib/syllabus.ts
// ─────────────────────────────────────────────────────────────
// PCI B.Pharm NEP 2020 — Complete Syllabus Data
// Source: Official PCI Syllabus PDF (Detailed Syllabus, Page 53+)
// Each unit contains the ACTUAL PDF content — title + sub-topics
// ─────────────────────────────────────────────────────────────
import { makeSubjectSlug } from "./slug";

export interface SubjectUnit {
    num: "I" | "II" | "III" | "IV" | "V";
    title: string;
    topics: string[];   // bullet-point sub-topics from PDF
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
// HELPER — auto-generate slug from name
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
// SEMESTER I
// ─────────────────────────────────────────────────────────────
const SEM1: Subject[] = [
    s("BP101T", "Basics of Python Programming for Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Python Programming", topics: [
                "Installing Python and an IDE (Jupyter Notebook, PyCharm, VS Code); advantages of IDEs over text editors",
                "Python variables and data types (integers, floats, strings, booleans); type casting; basic operators (arithmetic, comparison, logical); input/output operations",
                "Basic string operations and manipulation techniques",
                "Introduction to standard libraries and third-party libraries; installing and uninstalling libraries",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Control Structures & Functions", topics: [
                "Conditional statements: if, if-else, if-elif-else, nested conditions",
                "Loops: for loop, while loop; break and continue statements",
                "Defining and calling functions; passing arguments and returning values",
                "Writing modular programs for pharmaceutical applications — dosage calculation and BMI calculation",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Data Structures & File Handling", topics: [
                "Lists, tuples, and dictionaries; indexing and slicing; basic operations on lists and dictionaries; string manipulation techniques",
                "Introduction to NumPy arrays; basic operations using NumPy (array creation, arithmetic operations)",
                "Reading and writing CSV files; understanding structured healthcare datasets",
                "Importing small pharmaceutical datasets and performing basic data access and manipulation tasks",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Data Handling with Pandas", topics: [
                "Introduction to Pandas library; Pandas Series and DataFrame structures",
                "Reading CSV and Excel files — PK study datasets and ADR reports",
                "Inspecting datasets using head(), tail(), info(), describe(); data cleaning and handling missing values",
                "Filtering and selecting data based on conditions; grouping data and performing aggregation functions",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Data Visualization with Matplotlib", topics: [
                "Introduction to Matplotlib; creating line plots, histograms, scatter plots, and box plots",
                "Labeling axes, titles, and legends",
                "Visualizing pharmaceutical datasets — concentration-time curves for oral and IV administration, ADR reporting rates, dissolution profiles",
                "Scientific interpretation of plots",
            ]
        },
    ], true),

    s("BP102T", "General Pharmacy", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Introduction to the Profession of Pharmacy", topics: [
                "History of pharmacy profession in India — education, pharmaceutical industries, organizations, evolution and milestones",
                "Scope of pharmacy: retail/community pharmacy, hospital and clinical pharmacy, industrial pharmacy including R&D",
                "Pharmacopoeias: IP, BP, USP, BPC, International Pharmacopoeia, National Formulary of India; structure of IP; one model IP monograph",
                "Introduction to prescription: structure, format, parts, handling, Latin terminology",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Pharmaceutical Calculations", topics: [
                "Metric system; calculations based on alligation, proof spirit, isotonic solutions, dilute solutions (percentage and ratio), geometric dilution; scientific notation",
                "Posology: definition; dose calculation based on age, body weight, and body surface area",
                "Routes of administration and classification of dosage forms",
                "Active pharmaceutical ingredients and excipients — definition, ideal characteristics, and importance",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Solid Dosage Forms", topics: [
                "Powders: classification, advantages, disadvantages; dusting powders, effervescent, efflorescent, hygroscopic powders and eutectic mixtures; excipients and methods of preparation",
                "Tablets: definition, types (moulded tablets, pills); advantages, disadvantages; excipients and methods of preparation",
                "Capsules: definition, types, advantages, disadvantages, capsule sizes; excipients and methods of preparation",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Monophasic and Biphasic Liquid Dosage Forms", topics: [
                "For internal use: aromatic waters, syrups, elixirs, linctus — definition and preparation",
                "For external use and body cavities: liniments, lotions, throat paints, gargles, mouthwashes, enemas, eye drops, ear drops, nasal drops, tinctures",
                "Suspensions: definition, types (flocculated and deflocculated), advantages, disadvantages, formulation excipients, methods of preparation",
                "Emulsions: definition, types, emulsifying agents, identification tests, formulation excipients, methods of preparation",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Semisolid Dosage Forms", topics: [
                "Definitions, classification, advantages, disadvantages, ointment bases and excipients; methods of preparation of ointments, pastes, creams, and gels",
                "Suppositories/Pessaries: definition, types, advantages, disadvantages, excipients, ideal suppository base properties, types of bases, displacement value, methods of preparation",
            ]
        },
    ]),
    s("BP103T", "Healthcare Psychology and Communication Skills", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Introduction to Psychology in Healthcare", topics: [
                "Definition, scope, and relevance of psychology in health sciences; branches of psychology: clinical, health, behavioural, developmental",
                "Sensation, perception, and attention in clinical assessment; learning and memory in health behaviour change",
                "Emotion and motivation: theories and implications in health contexts",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Developmental and Behavioural Psychology", topics: [
                "Human developmental stages and healthcare needs; personality theories and patient interaction styles",
                "Psychological factors affecting illness perception and recovery",
                "Common psychological disorders in healthcare: anxiety, depression, somatization; coping strategies, resilience, stress management",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Foundations of Health Communication", topics: [
                "Elements and models of communication in healthcare; types: interpersonal, group, mass, telehealth communication",
                "Barriers to effective communication in clinical settings; active listening, questioning techniques, empathy",
                "Culturally appropriate and inclusive communication",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Professional Communication in Healthcare Settings", topics: [
                "Communication with patients, caregivers, and interdisciplinary teams; delivering difficult news; handling emotionally charged situations",
                "Legal and ethical issues in health communication — confidentiality, consent",
                "Writing patient records, reports, and discharge summaries; use of technology and digital communication tools",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Health Psychology and Behavioural Interventions", topics: [
                "Health belief models and illness behaviour; psychosomatic illnesses and the mind-body connection",
                "Behaviour change theories (CBT, TTM) in treatment adherence",
                "Psychological first aid and crisis communication; mental health promotion and stigma reduction",
            ]
        },
    ]),

    s("BP104T", "Human Anatomy, Physiology and Pathophysiology I", 4, "T", [
        {
            num: "I", hours: "12 Hours", title: "Introduction to Human Body & Cell Biology", topics: [
                "Levels of structural organization, body systems, basic life processes, homeostasis, basic anatomical terminologies",
                "Structure and functions of cell; transport across cell membrane; cell division; cell junctions; general principles of cell communication (contact-dependent, paracrine, synaptic, endocrine)",
                "Classification of tissues — epithelial, muscular, nervous, and connective tissues; structure, location, and functions",
                "Causes of cellular injury; pathogenesis (cell membrane, mitochondrial, ribosome, nuclear damage); adaptive changes (atrophy, hypertrophy, hyperplasia, metaplasia, dysplasia); cell death",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Integumentary System, Skeletal System and Blood", topics: [
                "Integumentary system: structure and functions of skin; skin disorders: psoriasis, dermatitis, leprosy pathophysiology; basic principles of wound healing",
                "Skeletal system: divisions, types of bones, salient features of axial and appendicular skeleton; organisation of skeletal muscle; physiology of muscle contraction; neuromuscular junction; classification of joints",
                "Body fluids, composition and functions of blood; hemopoiesis; haemoglobin formation; coagulation mechanisms; blood grouping; Rh factors and transfusion",
                "Pathophysiology of rheumatoid arthritis, osteoporosis, and gout",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Lymphatic System, Inflammation and Haematological Diseases", topics: [
                "Lymphatic organs and tissues; lymphatic vessels; lymph formation; circulation and functions of lymphatic system",
                "Basic mechanisms of inflammation and repair; classification and pathophysiology of inflammation; mediators of inflammation",
                "Haematological diseases: pathophysiology of iron deficiency anaemia, megaloblastic anaemia (Vit B12 and folic acid), sickle cell anaemia, thalassemia, hereditary acquired anaemia, haemophilia",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Peripheral Nervous System and Special Senses", topics: [
                "Classification of peripheral nervous system; structure and functions of sympathetic and parasympathetic nervous system; origin and functions of spinal and cranial nerves",
                "Special senses: structure and functions of eye, ear, nose, and tongue",
                "Pathophysiology of selected sensory and neurological disorders",
            ]
        },
        {
            num: "V", hours: "12 Hours", title: "Cardiovascular and Respiratory Systems", topics: [
                "Cardiovascular system: anatomy of heart; cardiac cycle; cardiac output; regulation of blood pressure",
                "Respiratory system: anatomy of lungs; mechanics of breathing; gas exchange; transport of oxygen and carbon dioxide",
                "Pathophysiology of hypertension, cardiac failure, and respiratory disorders such as asthma",
            ]
        },
    ]),

    s("BP105T", "Introduction to Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Fundamentals of Pharmacognosy", topics: [
                "Definition, history, present status, scope and development of pharmacognosy; sources of drugs: plants, animals, microbial, marine, mineral, plant tissue culture",
                "Historical milestones in drug discovery: morphine, quinine, aspirin, warfarin, penicillin, cephalosporin, taxol, artemisinin",
                "Introduction to herbal/traditional pharmacopoeias: IP, British Herbal Pharmacopoeia, USP Herbal, Ayurvedic Pharmacopoeia of India, Unani Pharmacopoeia, American Herbal Pharmacopoeia",
                "Official and non-official; codified and non-codified drugs; classification of crude drugs: alphabetical, morphological, taxonomical, chemical, pharmacological, chemotaxonomic — merits and limitations",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Cultivation, Collection, Processing and Storage of Medicinal Plants", topics: [
                "Methods of plant cultivation; WHO/GAP/GCP guidelines for medicinal plants; factors influencing cultivation, collection and storage",
                "Plant hormones and applications in cultivation; polyploidy, mutation, and hybridization in secondary metabolite production",
                "Ex-situ and in-situ conservation; value addition strategies; role of eco-pharmacognosy in sustainable conservation of endangered plants (kutki, chirata)",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Quality Control of Drugs of Natural Origin (WHO Guidelines)", topics: [
                "Adulteration of drugs of natural origin; evaluation using organoleptic, microscopic (qualitative and quantitative), physical, chemical, and biological methods",
                "Physicochemical parameters: extractive values, moisture content, foreign organic matter, ash values, bitterness value, foaming index, haemolytic potential, swelling index, viscosity, optical rotation, refractive index, acid value, saponification value",
                "DNA barcoding for authentication",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Metabolites of Plant Origin and Traditional Systems of Medicine", topics: [
                "Definition and general properties of plant metabolites; primary and secondary metabolites: carbohydrates, proteins, lipids, alkaloids, glycosides, flavonoids, tannins, terpenoids, volatile oils, resins",
                "Traditional systems of medicine: basic principles of AYUSH and TCM; types of dosage forms in AYUSH medicines",
                "Role of pharmacognosy in allopathy and traditional systems of medicine",
            ]
        },
        {
            num: "V", hours: "7 Hours", title: "Phyto-therapeutic Agents", topics: [
                "Biological source, major constituents and uses: Adaptogens/Immunomodulators (Ashwagandha, Tulsi, Amla); Hepatoprotectives (Milk thistle, Kutki); Cardiovascular (Garlic, Arjuna)",
                "Antidiabetics (Gymnema, Fenugreek); Anti-inflammatory/analgesics (Turmeric, Boswellia); CNS (Brahmi)",
                "Antimicrobial/antiviral (Giloy, Neem, Andrographis); Gastrointestinal (Psyllium); Dermatological (Aloe)",
            ]
        },
    ]),
    s("BP106T", "Pharmaceutical Inorganic and Analytical Chemistry", 3, "T", [
        {
            num: "I", hours: "7 Hours", title: "Introduction to Pharmaceutical Analysis and Impurities", topics: [
                "Different techniques of analysis; methods of expressing strength of solutions; primary and secondary standards with examples",
                "Sources of errors; types of errors; methods of minimizing errors; accuracy, precision, and significant figures",
                "Definition, types, contents, and regulatory importance of impurities; limit tests for chloride, sulphate, iron, arsenic, lead, heavy metals; modified limit tests",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Acid-Base Chemistry, Buffer Systems and Major Electrolytes", topics: [
                "Definition of acids, bases, buffers; pH scale and significance; buffer equation; calculation of pH for buffer solutions; isotonicity and application in IV fluids and ophthalmic solutions",
                "Major extra- and intracellular electrolytes; functions of major physiological ions",
                "Electrolytes used in replacement therapy: sodium chloride, potassium chloride, calcium chloride, ORS; physiological acid-base balance",
            ]
        },
        {
            num: "III", hours: "14 Hours", title: "Titrimetric Methods of Analysis", topics: [
                "Acid-base titrations: theories of indicators, classification; preparation and standardization of HCl and NaOH; neutralization curves; assay of ammonium hydroxide",
                "Non-aqueous titrations: types of solvents; acidimetric and alkalimetric titrations; estimation of sodium benzoate",
                "Precipitation titrations and gravimetry: Mohr's, Volhard's, Modified Volhard's, Fajans methods; estimation of barium sulphate",
                "Complexometric titrations: metal ion indicators, masking/demasking reagents; preparation of disodium EDTA; estimation of magnesium sulphate and calcium gluconate",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Redox Titrations and Gastrointestinal Agents", topics: [
                "Redox titrations: oxidation-reduction concepts; permanganometry, cerimetry, iodimetry, iodometry, titrations with potassium iodate",
                "Antacids: ideal properties, combinations; sodium bicarbonate, aluminium hydroxide gel",
                "Gastrointestinal agents: acidifiers (sodium acid phosphate, dilute HCl); agents promoting bowel movement (magnesium hydroxide, sodium orthophosphate)",
                "Antimicrobials: potassium permanganate, boric acid, hydrogen peroxide, chlorinated lime, iodine and preparations",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Radiopharmaceuticals and Miscellaneous Inorganic Compounds", topics: [
                "Basics of radioactivity; applications of radioisotopes: Sodium Iodide I-131, Technetium-99m, Cobalt-60, Phosphorus-32; safe handling of radiopharmaceuticals",
                "Major inorganic pharmaceutical compounds: acids, bases, salts — pharmaceutical applications and quality specifications",
                "Pharmaceutical water: types, purification methods, quality specifications",
            ]
        },
    ]),
    s("BP107P–BP111P", "Practicals — General Pharmacy, Healthcare Psychology, Anatomy, Pharmacognosy, Inorganic Chemistry", 5, "P", []),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER II
// ─────────────────────────────────────────────────────────────
const SEM2: Subject[] = [
    s("BP201T", "Applied Biostatistics and Data Analytics for Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Descriptive Statistics", topics: [
                "Types of data in pharmaceutical sciences (nominal, ordinal, interval, ratio); sources of data: clinical trials, pharmacovigilance, quality control, PK studies",
                "Measures of central tendency: mean, median, mode; measures of dispersion: range, variance, standard deviation",
                "Skewness and distribution shape in biological measurements",
                "Descriptive statistical analysis using Python (NumPy and Pandas) with interpretation of results",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Probability & Statistical Distributions in Healthcare", topics: [
                "Basic probability concepts and laws; conditional probability; Bayes' theorem and clinical decision-making",
                "Concept of random variables (discrete and continuous); Normal distribution in biological and pharmaceutical measurements",
                "Binomial distribution in clinical trial outcomes; Poisson distribution for rare events (ADRs)",
                "Graphical visualization of probability distributions using Python",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Sampling & Statistical Inference", topics: [
                "Population versus sample; sampling techniques in clinical research; sampling error and bias",
                "Central Limit Theorem (conceptual); confidence intervals and interpretation",
                "Hypothesis testing framework: null and alternative hypotheses; Type I and Type II errors; p-value and statistical significance",
                "Demonstration and interpretation using Python with pharmaceutical data",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Basics of Correlation & Regression", topics: [
                "Pearson correlation coefficient; interpretation of positive and negative correlations; scatter plots and trend visualization using pharmaceutical data (dose-response relationships)",
                "Simple linear regression: concept, interpretation of regression coefficients",
                "Introduction to odds ratio and its application in clinical risk analysis",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Statistical Analysis Using Python — Case-Based Learning", topics: [
                "Demonstration of descriptive statistics, correlation analysis, and linear regression using Python libraries (SciPy, Statsmodels, Scikit-learn) on pharmaceutical datasets",
                "Interpretation of output summaries and p-values; preparation of statistical reports",
            ]
        },
    ], true),
    s("BP202T", "Biochemistry", 3, "T", [
        {
            num: "I", hours: "10 Hours", title: "Enzymology and Clinical Chemistry", topics: [
                "Introduction, properties, nomenclature, IUB classification of enzymes and coenzymes; enzyme kinetics (Michaelis plot, Lineweaver-Burk plot); enzyme inhibitors; regulation: induction, repression, allosteric regulation",
                "Therapeutic and diagnostic applications of enzymes and isoenzymes; factors affecting enzyme activity",
                "Digestion and absorption of dietary macro- and micronutrients including vitamins and minerals; biochemical functions of vitamins and associated diseases",
                "Clinical chemistry: liver function tests; renal function tests; ELISA test",
            ]
        },
        {
            num: "II", hours: "10 Hours", title: "Carbohydrate Metabolism and Bioenergetics", topics: [
                "Introduction to biomolecules: carbohydrates, lipids, nucleic acids, amino acids, and proteins",
                "Bioenergetics: free energy, enthalpy, entropy; redox potential; energy-rich compounds (ATP, GTP) and biological significance",
                "Carbohydrate metabolism: glycolysis, TCA cycle, gluconeogenesis, HMP shunt, glycogen metabolism; regulation of blood glucose; metabolic adaptations in fed state, fasting, starvation",
                "Metabolic derangements in diabetes mellitus; Electron Transport Chain (ETC), oxidative phosphorylation, ATP synthesis",
            ]
        },
        {
            num: "III", hours: "7 Hours", title: "Lipid Metabolism", topics: [
                "Classification, functions, and properties of lipids and lipoproteins (HDL, LDL, VLDL, chylomicrons)",
                "β-oxidation and de-novo synthesis of fatty acids; ketone bodies: synthesis, utilization, and clinical significance",
                "Biological significance of cholesterol and lipid profile; disorders: hyperlipidaemias, hypercholesterolaemia, lipid storage diseases, atherosclerosis, fatty liver disease, obesity",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Amino Acid and Protein Metabolism", topics: [
                "Classification and biological functions of amino acids; structure and functions of proteins and plasma proteins",
                "General metabolism: transamination, oxidative and non-oxidative deamination, decarboxylation; urea cycle — nitrogen disposal and detoxification",
                "Catabolism of specific amino acids; disorders: phenylketonuria, albinism, alkaptonuria, tyrosinemia, inborn errors of metabolism",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Nucleic Acid Metabolism and Genetic Information Transfer", topics: [
                "Nucleotide metabolism and related disorders: biosynthesis and catabolism of purine and pyrimidine nucleotides; hyperuricaemia, gout, Lesch-Nyhan syndrome",
                "DNA replication: enzymes and mechanism; transcription; translation: genetic code, ribosomes, post-translational modifications",
                "Recombinant DNA technology in pharmacy: restriction enzymes, cloning vectors, PCR, applications in drug production",
            ]
        },
    ]),

    s("BP203T", "Human Anatomy, Physiology and Pathophysiology II", 4, "T", [
        {
            num: "I", hours: "12 Hours", title: "Digestive System", topics: [
                "GI tract anatomy: organs of alimentary canal and accessory digestive organs; histology of GI wall",
                "Physiology of digestion: mechanical and chemical digestion in mouth, stomach, and small intestine",
                "Absorption mechanisms: carbohydrate, protein, fat, water, vitamins, and mineral absorption",
                "Pathophysiology of GI disorders: peptic ulcer, GERD, inflammatory bowel disease, malabsorption syndromes",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Endocrine System", topics: [
                "Overview of endocrine glands: pituitary, thyroid, parathyroid, adrenal, pancreas, gonads",
                "Hormone classification, mechanism of action, and feedback regulation",
                "Pathophysiology of diabetes mellitus (Type I and II), hypothyroidism, hyperthyroidism, Cushing's syndrome",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Nervous System", topics: [
                "Organisation of nervous system; neuron structure and functions; resting and action potentials; synaptic transmission",
                "Central nervous system: brain regions (cerebrum, cerebellum, brainstem), spinal cord, meninges, CSF",
                "Neurotransmitters and their roles; pathophysiology of Alzheimer's disease, Parkinson's disease, epilepsy",
            ]
        },
        {
            num: "IV", hours: "12 Hours", title: "Renal System", topics: [
                "Anatomy of kidney: macroscopic and microscopic structure; nephron — structure and types",
                "Urine formation: glomerular filtration (GFR), tubular reabsorption, tubular secretion; concentration and dilution of urine",
                "Renal regulation of blood pressure (RAAS), acid-base balance, and electrolyte homeostasis",
                "Pathophysiology of acute and chronic renal failure, nephrotic syndrome, urinary tract infections",
            ]
        },
        {
            num: "V", hours: "12 Hours", title: "Reproductive System and Selected Pathophysiology", topics: [
                "Male and female reproductive anatomy; hormonal regulation of reproduction; spermatogenesis and oogenesis",
                "Menstrual cycle: follicular phase, ovulation, luteal phase; role of FSH, LH, oestrogen, progesterone",
                "Pathophysiology of PCOS, endometriosis, benign prostatic hyperplasia, and reproductive infections",
            ]
        },
    ]),
    s("BP204T", "Pharmaceutical Organic Chemistry", 4, "T", [
        {
            num: "I", hours: "10 Hours", title: "Fundamentals of Organic Chemistry", topics: [
                "Bonding in organic molecules: sp3, sp2, sp hybridisation; orbital overlap and resonance",
                "Electronic effects: inductive effect, resonance/mesomeric effect, hyperconjugation, and their influence on acidity/basicity and reactivity",
                "Stereochemistry: chirality, enantiomers, diastereomers, R/S configuration; optical activity; racemic mixtures; separation methods",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Aliphatic Hydrocarbons", topics: [
                "Alkanes: nomenclature, physical properties, conformational analysis (ethane, butane), free radical halogenation",
                "Alkenes: nomenclature, geometric isomerism (E/Z), electrophilic addition reactions (HX, H2O, halogenation), Markovnikov's rule, ozonolysis",
                "Alkynes: nomenclature, acidity of terminal alkynes, reactions — hydration, reduction",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Aromatic Compounds", topics: [
                "Benzene: structure, Hückel's aromaticity rule; resonance energy; electrophilic aromatic substitution (EAS) — nitration, sulfonation, halogenation, Friedel-Crafts",
                "Directing effects of substituents (ortho/para vs. meta directors); mechanism of EAS",
                "Phenols, aryl halides, aromatic amines — properties and reactions; pharmaceutical applications",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Functional Group Chemistry", topics: [
                "Alcohols and ethers: nomenclature, physical properties, reactions (oxidation, dehydration, esterification, Lucas test, ether formation)",
                "Aldehydes and ketones: nomenclature; nucleophilic addition reactions; oxidation/reduction; aldol condensation; pharmaceutical applications",
                "Carboxylic acids and derivatives: acidity; ester, amide, anhydride formation; nucleophilic acyl substitution reactions",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Amines, Amides and Stereoisomerism", topics: [
                "Amines: classification, nomenclature, basicity; reactions — acylation, alkylation, diazotization; pharmaceutical amines",
                "Amides: formation, hydrolysis; lactams (β-lactam antibiotics); significance in drug structures",
                "Optical isomerism: chiral centres, Fischer projections, Cahn-Ingold-Prelog rules; geometric and conformational isomerism in drug molecules",
            ]
        },
    ]),

    s("BP205T", "Pharmacognosy and Phytochemistry", 4, "T", [
        {
            num: "I", hours: "10 Hours", title: "Alkaloids", topics: [
                "Definition, general properties, classification of alkaloids; biosynthesis — general pathways",
                "Extraction, isolation, and characterization methods; identification tests (Mayer's, Dragendorff's, Wagner's)",
                "Medicinally important alkaloids: morphine, codeine, quinine, ephedrine, caffeine, atropine, hyoscine, reserpine, vinblastine, vincristine",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Glycosides", topics: [
                "Definition, general properties, classification of glycosides (O-, N-, S-, C-glycosides); hydrolysis products",
                "Cardiac glycosides: digitalis glycosides (digoxin, digitoxin) — chemistry, extraction, pharmacological significance",
                "Anthraquinone glycosides (senna, cascara), saponin glycosides (liquorice, ginseng), cyanogenic and thiocyanogenic glycosides",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Volatile Oils, Resins and Oleoresins", topics: [
                "Volatile oils: definition, general properties, chemical composition (terpenes, terpenoids, phenylpropanoids); extraction methods (steam distillation, cold pressing, solvent extraction)",
                "Important volatile oils: peppermint, clove, eucalyptus, cinnamon, fennel, cardamom, turpentine — biological source, constituents, uses",
                "Resins and oleoresins: definition, classification, chemistry; colophony, podophyllum, jalap — source, constituents, uses",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Tannins, Flavonoids and Terpenoids", topics: [
                "Tannins: definition, classification (hydrolysable and condensed), chemistry, identification tests; pharmaceutical applications; tannic acid, catechu, black catechu",
                "Flavonoids: definition, classification (flavones, flavonols, flavanones, isoflavones, chalcones), biosynthesis; rutin, quercetin, hesperidin — source and uses",
                "Terpenoids: classification (mono, sesqui, di, tri, tetraterpenes); biosynthesis (MVA pathway); important terpenoids: artemisinin, taxol, stevioside",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Phytochemical Screening Methods and Drug Standardization", topics: [
                "Phytochemical screening: qualitative tests for alkaloids, glycosides, flavonoids, tannins, saponins, terpenoids, sterols, fixed oils",
                "Standardization of plant drugs: WHO guidelines; pharmacopoeial standards; chemical fingerprinting by TLC, HPLC, HPTLC",
                "Chromatographic methods of isolation: column chromatography, preparative TLC, HPLC — applications in natural product isolation",
            ]
        },
    ]),
    s("BP206T", "Physical Pharmaceutics", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Matter and Thermodynamics", topics: [
                "States of matter: gases, liquids, solids — properties and transitions; intermolecular forces in pharmaceutical systems",
                "Thermodynamics: laws of thermodynamics; Gibbs free energy and its significance; enthalpy and entropy in pharmaceutical processes",
                "Phase equilibria: phase rule, phase diagrams, eutectic mixtures — pharmaceutical applications",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Solutions and Solubility", topics: [
                "Solubility: definitions, types, factors affecting solubility; solubility expressions; ideal and non-ideal solutions",
                "Dissolution kinetics: Noyes-Whitney equation; intrinsic dissolution rate; factors affecting dissolution; dissolution testing in drug release",
                "Diffusion: Fick's laws; diffusion across membranes; dialysis; ultrafiltration; pharmaceutical applications",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Surface and Interfacial Phenomena", topics: [
                "Surface tension and surface energy; measurement methods; temperature dependence",
                "Surfactants: classification, HLB system, mechanism of action; pharmaceutical applications (wetting, solubilization, emulsification)",
                "Adsorption: types (physical and chemical); Freundlich and Langmuir adsorption isotherms; pharmaceutical applications",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Colloidal Dispersions, Emulsions and Suspensions", topics: [
                "Colloidal systems: classification, properties (Tyndall effect, Brownian motion, zeta potential); stability and flocculation",
                "Emulsions: definition, types (O/W, W/O), emulsifying agents, preparation methods; stability testing; HLB and its applications",
                "Suspensions: definition, types, sedimentation theory (Stokes' law), flocculation and deflocculation; formulation principles",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Rheology", topics: [
                "Viscosity: definition, types (Newtonian, non-Newtonian flow); measurement methods (Ostwald viscometer, Brookfield viscometer)",
                "Non-Newtonian systems: plastic, pseudoplastic, dilatant, thixotropic flow; thixotropy in pharmaceutical formulations",
                "Viscoelastic properties; applications in formulation of semi-solids, suspensions, and polymer solutions",
            ]
        },
    ]),
    s("BP207P–BP212P + SEC", "Practicals + SEC Elective (Communication Skills / Mental Well-Being / Computer Operations)", 7, "P", []),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER III
// ─────────────────────────────────────────────────────────────
const SEM3: Subject[] = [
    s("BP301T", "Introduction to Machine Learning in Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Foundations of Machine Learning", topics: [
                "Definition and scope of Artificial Intelligence, Machine Learning, and Data Science; overview of ML workflow",
                "Types of ML: supervised, unsupervised, and reinforcement learning; key terminologies (features, labels, training, testing, validation)",
                "Data preprocessing for pharmaceutical data: handling missing values, encoding categorical variables, feature scaling, train-test split",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Supervised Learning Algorithms", topics: [
                "Linear and logistic regression: concepts, applications in dose-response modelling and classification of drug activity",
                "Decision trees and Random forests: construction, overfitting, hyperparameter tuning",
                "k-Nearest Neighbours (kNN): algorithm, distance metrics, application in drug classification; model evaluation: accuracy, precision, recall, F1-score, ROC-AUC",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Unsupervised Learning and Dimensionality Reduction", topics: [
                "Clustering: k-means algorithm, hierarchical clustering; applications in patient stratification and drug grouping",
                "Dimensionality reduction: Principal Component Analysis (PCA) — concept and pharmaceutical data applications",
                "Association rule mining: basics and applications in drug interaction detection",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "ML Applications in Pharmaceutical Sciences", topics: [
                "QSAR modelling: molecular descriptors, fingerprints; building QSAR models using regression and classification algorithms",
                "Virtual screening and drug discovery: activity prediction, ADMET property prediction",
                "Pharmacokinetics prediction using ML: Cmax, AUC, half-life prediction from molecular structure",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Practical Implementation and Ethical Considerations", topics: [
                "Implementing ML models in Python using scikit-learn on pharmaceutical datasets (QSAR, ADR, clinical data)",
                "Model validation: cross-validation, confusion matrix, hyperparameter optimisation",
                "Ethical considerations in ML: bias in healthcare data, interpretability, responsible AI in pharmaceutical research",
            ]
        },
    ], true),
    s("BP302T", "Environmental Sciences", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Ecosystems and Biodiversity", topics: [
                "Definition, scope, and importance of environmental studies; types of ecosystems; food chains and food webs; energy flow",
                "Biodiversity: levels, hotspots, threats; value of biodiversity; endangered species; conservation strategies",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Environmental Pollution", topics: [
                "Types of pollution: air, water, soil, noise, and nuclear pollution; causes, effects, and control measures",
                "Greenhouse effect, acid rain, ozone depletion; environmental legislation in India",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Pharmaceutical Waste Management and Sustainable Development", topics: [
                "Pharmaceutical waste: classification, treatment, and disposal; green pharmacy principles; solvent selection and atom economy",
                "Sustainable Development Goals (SDGs) in healthcare; circular economy in pharmaceutical industry; environmental impact assessment",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Environmental Regulations and Impact Assessment", topics: [
                "Environmental Protection Act; Hazardous Waste Management Rules; EIA process for pharmaceutical facilities",
                "Environmental auditing; ISO 14001; corporate environmental responsibility",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Natural Resources and Their Conservation", topics: [
                "Water, energy, forest, and mineral resources; renewable and non-renewable resources",
                "Resource management strategies; role of individuals and organizations in conservation",
            ]
        },
    ]),
    s("BP303T", "Ethics and Universal Human Values", 1, "T", [
        {
            num: "I", hours: "3 Hours", title: "Introduction to Value Education", topics: [
                "Concept, definition, and need for value education in pharmacy; content and process of value education",
                "Right understanding, relationship, and physical facility as goals of a happy life",
            ]
        },
        {
            num: "II", hours: "3 Hours", title: "Self-Exploration and Human Aspirations", topics: [
                "Self-exploration as a means of value education; development of positive attitude and self-confidence",
                "Right understanding of happiness and prosperity; natural acceptance as basis of harmony",
            ]
        },
        {
            num: "III", hours: "3 Hours", title: "Human Relationships and Values", topics: [
                "Family as the basic unit of interaction; values in relationships: affection, kindness, guidance, reverence, gratitude",
                "Trust and respect as foundations of professional relationships in pharmacy practice",
            ]
        },
        {
            num: "IV", hours: "3 Hours", title: "Social and Environmental Harmony", topics: [
                "Harmony in society: vision of undivided society; comprehensive human goal",
                "Harmony in nature: four orders (material, plant, animal, human); holistic perception of existence",
            ]
        },
        {
            num: "V", hours: "3 Hours", title: "Professional Ethics in Pharmacy", topics: [
                "Ethics in pharmaceutical research and practice; professional responsibility to patients and society",
                "Bioethics: informed consent, confidentiality, justice, beneficence, non-maleficence; ethical decision-making in pharmacy",
            ]
        },
    ]),

    s("BP304T", "General Pharmacology", 3, "T", [
        {
            num: "I", hours: "8 Hours", title: "Introduction to Pharmacology and Drug Development", topics: [
                "Definition, scope, and importance of pharmacology; concept of generic medicines, essential drugs, and rational drug use (RDU); Indian Government's initiatives",
                "Pharmacopoeias and drug standards; sources of drug information: textbooks, journals, electronic databases",
                "Drug discovery and development: target identification, lead discovery, structure-activity relationships; brief overview of preclinical evaluation",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Pharmacokinetics", topics: [
                "Drug absorption: mechanisms (passive diffusion, active transport, facilitated diffusion, pinocytosis); membrane transporters; factors affecting absorption; bioavailability and bioequivalence",
                "Drug distribution: volume of distribution; plasma protein binding; blood-brain barrier; placental transfer; redistribution",
                "Drug metabolism: Phase I (oxidation, reduction, hydrolysis) and Phase II (conjugation) reactions; hepatic first-pass effect; CYP450 enzymes; enzyme induction and inhibition",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Pharmacodynamics", topics: [
                "Drug-receptor interactions: receptor theories (occupancy, rate, induced-fit, two-state); types of receptors (GPCRs, ion channels, nuclear receptors, enzyme-linked)",
                "Dose-response relationships: graded and quantal responses; ED50, LD50, therapeutic index; agonists, antagonists, partial agonists, inverse agonists",
                "Signal transduction pathways and second messengers; selectivity and specificity; structure-activity relationships",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Adverse Drug Reactions and Drug Interactions", topics: [
                "ADRs: definition, classification (Type A, B, C, D, E); mechanisms; WHO causality assessment (Naranjo scale); pharmacovigilance and reporting",
                "Drug interactions: pharmacokinetic (absorption, distribution, metabolism, excretion) and pharmacodynamic interactions; clinically significant interactions",
                "Drug toxicity: predictable and unpredictable toxicity; acute, subacute, and chronic toxicity testing (OECD norms); genotoxicity and teratogenicity",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Preclinical and Clinical Evaluation of Drugs", topics: [
                "Preclinical evaluation: in vitro and in vivo screening methods; reconstructed human tissues; animal models for disease",
                "Clinical trials: phases I-IV; study designs; ICH E6 GCP guidelines; CTRI registration; regulatory requirements in India (Schedule Y)",
                "Definition and basic knowledge of preclinical toxicity testing: acute, sub-acute, combined chronic/carcinogenicity testing per OECD norms; genotoxicity and teratogenicity principles",
            ]
        },
    ]),
    s("BP305T", "Heterocyclic Compounds and Stereochemistry", 3, "T", [
        {
            num: "I", hours: "8 Hours", title: "Stereochemistry", topics: [
                "Definition and types of stereoisomerism with examples; optical activity: chirality, origin of chirality, plane of symmetry, axis of symmetry",
                "R/S configuration: Cahn-Ingold-Prelog rules; enantiomers, diastereomers, meso compounds; racemic mixtures and resolution methods",
                "Geometric isomerism: cis/trans (E/Z) in alkenes and cyclic compounds; conformational isomerism in cyclohexane; atropisomerism in biphenyl compounds",
            ]
        },
        {
            num: "II", hours: "8 Hours", title: "Five-Membered Heterocyclic Compounds", topics: [
                "IUPAC nomenclature and classification of heterocyclic compounds; aromaticity in heterocycles",
                "Furan: preparation, reactions (electrophilic substitution, Diels-Alder), pharmaceutical derivatives",
                "Thiophene: preparation, reactions, pharmaceutical significance; Pyrrole: preparation, acidity, reactions; porphyrins and bile pigments; Imidazole and pyrazole: properties and pharmaceutical applications",
            ]
        },
        {
            num: "III", hours: "8 Hours", title: "Six-Membered Heterocyclic Compounds", topics: [
                "Pyridine: aromaticity, basicity, electrophilic and nucleophilic substitutions; pharmaceutical preparations (isoniazid, niacin)",
                "Pyrimidine: tautomerism, preparation, reactions; uracil, thymine, cytosine as components of nucleic acids; pharmaceutical drugs",
                "Pyrazine, piperazine, and their pharmaceutical applications (anthelmintics, antifungals)",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Fused Ring Heterocycles", topics: [
                "Quinoline: preparation (Skraup synthesis, Combes synthesis), reactions, pharmaceutical applications (chloroquine, quinine)",
                "Isoquinoline: preparation, properties, alkaloids of isoquinoline origin (papaverine, morphine skeleton)",
                "Indole: preparation (Fischer indole synthesis), reactions; pharmaceutical alkaloids (tryptamine, serotonin, ergot alkaloids); Benzimidazole: preparation and pharmaceutical applications (antiparasitic, proton pump inhibitors)",
            ]
        },
        {
            num: "V", hours: "8 Hours", title: "Pharmaceutical Significance of Heterocyclic Drugs", topics: [
                "Barbiturates: structure-activity relationship; mechanism of CNS depression; classification and examples",
                "Benzodiazepines: structure, mechanism, clinical applications; NSAIDs with heterocyclic cores (indomethacin, piroxicam, celecoxib)",
                "Antibacterial heterocycles: β-lactam antibiotics (penicillins, cephalosporins — ring system and SAR); sulfonamides, fluoroquinolones; antifungal azoles (fluconazole, ketoconazole)",
            ]
        },
    ]),

    s("BP306T", "Pharmaceutical Dosage Forms I", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Fundamentals of Dosage Form Development", topics: [
                "Pre-formulation studies: concept, need, and parameters — solubility, pKa, physical nature (amorphous/crystalline), polymorphism, hygroscopicity, particle size, flow properties, compatibility",
                "Tablets: formulation design; types (uncoated, film-coated, enteric-coated, controlled-release, sublingual, buccal, dispersible, effervescent); excipients (diluents, binders, disintegrants, lubricants, glidants)",
                "Manufacturing methods: direct compression, wet granulation, dry granulation; IPQC and finished-product tests (weight variation, hardness, friability, disintegration, dissolution)",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Coated Tablets and Capsules", topics: [
                "Film coating: polymers (HPMC, Eudragit), plasticizers, solvents, equipment (Accela-Cota, fluidized bed); pan coating; enteric coating — polymers and test criteria",
                "Hard gelatin capsules: formulation design; filling methods (manual, semi-automatic, automatic); IPQC and finished-product tests; packaging",
                "Soft gelatin capsules: shell composition and plasticizers; fill materials; manufacturing methods (rotary die process); defects; quality control and stability",
            ]
        },
        {
            num: "III", hours: "12 Hours", title: "Liquid Dosage Forms", topics: [
                "Solutions: types (syrups, elixirs, linctus, aromatic waters, spirits); formulation; solubility enhancement techniques; preservation; packaging",
                "Suspensions: theory of sedimentation; formulation (wetting agents, suspending agents, flocculating agents); preparation; evaluation (sedimentation volume, redispersibility, particle size)",
                "Emulsions: formulation, emulsifying agents, HLB system; preparation methods; stability testing; injectables",
            ]
        },
        {
            num: "IV", hours: "8 Hours", title: "Semi-solid Dosage Forms", topics: [
                "Ointments: types of bases (oleaginous, emulsifying, water-soluble, absorption bases); formulation; preparation methods (fusion, levigation, trituration); evaluation",
                "Creams, gels, pastes: formulation principles; excipients; preparation and quality evaluation",
                "Suppositories and pessaries: bases (fatty, water-soluble); displacement value calculation; preparation; quality control",
            ]
        },
        {
            num: "V", hours: "7 Hours", title: "Microencapsulation and Miscellaneous Dosage Forms", topics: [
                "Microencapsulation: concept, need, advantages, disadvantages; methods (coacervation, interfacial polymerisation, spray drying, fluidized bed coating); applications in controlled release",
                "Powders and granules for reconstitution; dry powder inhalers; metered-dose inhalers: formulation and quality control",
                "Packaging of pharmaceutical dosage forms: types, requirements, materials; primary and secondary packaging; regulatory requirements",
            ]
        },
    ]),
    s("BP307T", "Pharmaceutical Engineering", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Size Reduction, Mixing, and Material Handling", topics: [
                "Size reduction: Kick's, Rittinger's, and Bond's laws; equipment — ball mill, hammer mill, fluid energy mill, edge runner mill, disintegrator; size separation — sieves, classifiers",
                "Mixing: theory of mixing; index of mixing; types of mixers — ribbon blender, sigma blade, planetary mixer, fluidized bed mixer; mixing of liquids",
                "Material handling: bins, silos, conveyers; safety in material handling; pharmaceutical waste management",
            ]
        },
        {
            num: "II", hours: "12 Hours", title: "Unit Operations Associated with Liquids", topics: [
                "Filtration: theory, filter media, filter aids (kieselguhr, celite); types — pressure, vacuum, gravity; equipment — filter press, leaf filter, rotary drum filter; clarification",
                "Crystallization: theory of crystallisation, solubility curves; methods — cooling, evaporation, salting out, drowning out; pharmaceutical applications; crystal habits",
                "Flow of fluids: Bernoulli's theorem; Reynold's number; laminar vs. turbulent flow; pressure drop measurement; pipe sizing",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Heat Transfer and Evaporation", topics: [
                "Heat transfer: conduction (Fourier's law), convection, radiation; overall heat transfer coefficient; heat exchangers — types and pharmaceutical applications",
                "Evaporation: theory; factors affecting evaporation; equipment — open pan, climbing film, falling film, forced circulation evaporators; multiple-effect evaporation",
                "Distillation: simple, flash, steam, fractional, vacuum distillation; pharmaceutical applications; azeotropic mixtures",
            ]
        },
        {
            num: "IV", hours: "5 Hours", title: "Drying", topics: [
                "Theory of drying: moisture content, drying rate curves (constant and falling rate periods); psychrometry",
                "Types of dryers: tray dryer, spray dryer, fluidized bed dryer, freeze dryer, rotary dryer, drum dryer — working principles, construction, merits, demerits",
                "Selection of drying equipment for pharmaceutical products; energy efficiency; GMP considerations",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Refrigeration, Air Conditioning and Corrosion", topics: [
                "Refrigeration: principles; coefficient of performance; refrigerants; pharmaceutical cold chain applications; cold storage requirements",
                "Air conditioning: definition; components; HVAC systems in pharmaceutical manufacturing; clean room classification (ISO 5-8); HEPA filters",
                "Corrosion: types (galvanic, crevice, pitting, stress corrosion); prevention methods; choice of materials for pharmaceutical equipment; GMP implications",
            ]
        },
    ]),
    s("BP308T", "Pharmaceutical Microbiology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Fundamentals of Microbiology", topics: [
                "Classification and taxonomy of microorganisms: bacteria, fungi, viruses, protozoa; morphology; growth and reproduction; culture media and methods",
                "Identification of microorganisms: Gram staining, biochemical tests, antibiotic sensitivity testing, molecular methods (16S rRNA sequencing)",
                "Disinfectants, antiseptics, and preservatives: classification, mechanism of action, evaluation methods; factors affecting antimicrobial activity",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Sterilization", topics: [
                "Physical sterilization: moist heat (autoclave — principles, validation, BIs/CIs), dry heat, filtration (membrane filters, integrity testing), UV and ionizing radiation",
                "Chemical/gaseous sterilization: ethylene oxide — mechanism, parameters, safety, residual testing; formaldehyde, hydrogen peroxide vapour",
                "Sterility assurance level (SAL); bioburden determination; modelling microbial growth and death (D-value, Z-value, F-value); overkill approach",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Sterility Testing and Microbial Limit Tests", topics: [
                "Sterility testing as per IP/BP/USP: membrane filtration and direct inoculation methods; growth promotion tests; bacteriostasis and fungistasis testing",
                "Microbial limit tests (MLT): Total Aerobic Microbial Count (TAMC), Total Combined Yeast/Mould Count (TYMC); tests for specific organisms (E. coli, Salmonella, P. aeruginosa, S. aureus)",
                "Pyrogen and endotoxin testing: rabbit pyrogen test; Limulus Amoebocyte Lysate (LAL) test — gel-clot, turbidimetric, chromogenic methods",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Antibiotics and Immunology", topics: [
                "Antibiotics: classification, mechanism of action (cell wall synthesis inhibitors, protein synthesis inhibitors, DNA/RNA inhibitors, membrane disruptors); resistance mechanisms (enzymatic inactivation, target modification, efflux pumps)",
                "Antibiotic sensitivity testing: disc diffusion (Kirby-Bauer), MIC determination, broth microdilution",
                "Immunology basics: innate and adaptive immunity; antigens, antibodies; B and T lymphocytes; antigen-antibody reactions; ELISA, agglutination, complement fixation",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Vaccines and Microbiological Quality Control", topics: [
                "Vaccines: types (live attenuated, killed, toxoid, subunit, conjugate, mRNA); manufacturing principles; adjuvants; quality control; cold chain requirements",
                "Microbial limit tests: microbial assay of antibiotics, vitamins, and amino acids — cylinder plate method, turbidimetric method; statistical evaluation",
                "Microbiological quality control in pharmaceutical manufacturing: environmental monitoring; water systems (purified water, WFI) — microbiological testing; aseptic processing validation",
            ]
        },
    ]),
    s("Practicals + AEC", "Practicals + AEC Elective (Nutraceuticals / Food Analysis / Yoga & Life Sciences)", 6, "P", []),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER IV
// ─────────────────────────────────────────────────────────────
const SEM4: Subject[] = [
    s("BP401T", "Herbal Drug Technology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "WHO Guidelines and Good Agricultural Practices", topics: [
                "WHO guidelines for herbal medicines; global regulatory framework for herbal drugs; quality aspects",
                "Good Agricultural and Collection Practices (GACP): cultivation guidelines, harvesting, drying, storage, and transportation of medicinal plants",
                "Factors influencing quality: climate, soil, genetic factors, microbial contamination, post-harvest handling",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Extraction Methods and Industrial Production", topics: [
                "Extraction methods: maceration, percolation, Soxhlet extraction, supercritical fluid extraction (CO2); selection criteria",
                "Industrial production of important plant drugs: opium, belladonna, digitalis, cinchona — cultivation, processing, extraction",
                "Downstream processing: concentration (evaporation), purification (liquid-liquid extraction, chromatography), drying of extracts",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Herbal Formulations and Manufacturing", topics: [
                "Types of herbal formulations: standardised extracts, phytopharmaceuticals, nutraceuticals, cosmeceuticals",
                "Formulation of herbal tablets, capsules, liquids, topical preparations — excipients and considerations",
                "cGMP for herbal products; manufacturing process controls; documentation; WHO manufacturing practices for herbal medicinal products",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Quality Control and Standardization", topics: [
                "Standardization approaches: marker-based, fingerprint-based; WHO guidelines on quality control methods",
                "Analytical methods: TLC, HPTLC, HPLC, GC, UV-Vis spectroscopy — fingerprinting of herbal extracts",
                "Physicochemical parameters: heavy metal testing, pesticide residue analysis, aflatoxin testing, microbiological testing",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Regulatory Requirements for Herbal Drugs", topics: [
                "Indian regulations: AYUSH guidelines, Drugs and Cosmetics Act provisions for herbal drugs, Schedule E, FSSAI for nutraceuticals",
                "International regulations: European Medicines Agency (EMA) guidelines for herbal medicinal products; USFDA requirements for botanical drug products; ICH guidelines applicable to herbals",
                "Intellectual property in herbal drugs: traditional knowledge digital library (TKDL); biopiracy; patents on herbal formulations",
            ]
        },
    ]),
    s("BP402T", "Medicinal Chemistry", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Drug-Receptor Interactions and SAR Fundamentals", topics: [
                "Drug-receptor interactions: forces involved (covalent, ionic, hydrogen bonds, van der Waals, hydrophobic interactions); pharmacophore concept",
                "Structure-Activity Relationship (SAR): electronic effects, steric effects, lipophilicity; bioisosterism; prodrug design; soft drugs",
                "Drug metabolism and bioavailability: metabolic soft spots; prodrug strategies to improve bioavailability; ADMET properties in drug design",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Analgesics, NSAIDs, and Cardiovascular Drugs", topics: [
                "Analgesics: opioid analgesics — morphine, codeine, pethidine, methadone — structural features, SAR, mechanism",
                "NSAIDs: salicylates (aspirin, diflunisal), para-aminophenol derivatives (paracetamol), pyrazolone derivatives, propionic acid derivatives (ibuprofen, naproxen), oxicam derivatives (piroxicam), COX-2 inhibitors (celecoxib) — SAR",
                "Cardiovascular drugs: antihypertensives (ACE inhibitors, ARBs, calcium channel blockers, beta-blockers), antiarrhythmics, antithrombotics — structural features and SAR",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Antibacterial and Antifungal Agents", topics: [
                "Sulfonamides: structure, SAR, mechanism; trimethoprim; cotrimoxazole",
                "Fluoroquinolones: nalidixic acid, norfloxacin, ciprofloxacin, levofloxacin — SAR, mechanism of action",
                "Beta-lactam antibiotics: penicillins — structure, SAR, mechanism, resistance; cephalosporins — generations and SAR; aminoglycosides, tetracyclines, macrolides",
                "Antifungal agents: azoles (fluconazole, itraconazole) — mechanism and SAR; amphotericin B structure; echinocandins",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "CNS Drugs — Sedatives, Hypnotics and Antipsychotics", topics: [
                "Sedative-hypnotics: benzodiazepines — diazepam, lorazepam, alprazolam; SAR; mechanism at GABA-A receptor; non-benzodiazepines (zolpidem)",
                "Barbiturates: structure, SAR, mechanism; classification by duration; clinical applications and limitations",
                "Antipsychotics: phenothiazines (chlorpromazine, trifluoperazine) — SAR, dopamine receptor blockade; butyrophenones (haloperidol); atypical antipsychotics (clozapine, risperidone)",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Antidepressants, Antiepileptics and Antivirals", topics: [
                "Antidepressants: TCAs (imipramine, amitriptyline) — SAR; SSRIs (fluoxetine, sertraline) — SAR; MAOIs — mechanism and examples",
                "Antiepileptics: hydantoins (phenytoin), barbiturates (phenobarbitone), succinimides (ethosuximide), valproic acid, carbamazepine, benzodiazepines — SAR and mechanism",
                "Antivirals: nucleoside analogues (acyclovir, zidovudine, lamivudine) — mechanism and SAR; protease inhibitors; neuraminidase inhibitors (oseltamivir); HIV drug classes and combination therapy",
            ]
        },
    ]),

    s("BP403T", "Pharmaceutical Biotechnology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Recombinant DNA Technology", topics: [
                "Tools of rDNA technology: restriction endonucleases, DNA ligases, vectors (plasmids, bacteriophages, cosmids, YACs, BACs), transformation, selection",
                "Gene cloning: isolation of genomic/cDNA, PCR — principle, components, types (RT-PCR, real-time PCR, qPCR); Southern blotting, Northern blotting",
                "Expression systems: prokaryotic (E. coli) and eukaryotic (yeast, CHO cells, baculovirus) expression systems; inclusion bodies; protein refolding",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Fermentation Technology and Downstream Processing", topics: [
                "Fermentation: types (batch, fed-batch, continuous); bioreactor types (stirred tank, airlift, hollow fibre); operating parameters (pH, temperature, dissolved oxygen, agitation)",
                "Biosynthesis of antibiotics: penicillin, streptomycin, tetracycline — biosynthetic pathways and production steps",
                "Downstream processing: cell disruption, centrifugation, filtration, extraction, chromatography (ion exchange, affinity, gel filtration), ultrafiltration; protein characterization",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Monoclonal Antibodies and Therapeutic Proteins", topics: [
                "Monoclonal antibody technology: hybridoma technology; ELISA; RIA; applications in diagnostics and therapy (Herceptin, Rituximab, adalimumab)",
                "Therapeutic proteins: insulin (rDNA-produced human insulin), EPO, growth hormone, G-CSF, interferons, tissue plasminogen activator (tPA) — production and clinical applications",
                "Antibody engineering: chimeric, humanized, and fully human antibodies; antibody-drug conjugates (ADCs); bispecific antibodies",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Vaccines — Production and Quality Control", topics: [
                "Types of vaccines: live attenuated, killed/inactivated, toxoid, subunit/recombinant, conjugate, viral vector, mRNA vaccines; principles and examples",
                "Vaccine production: fermentation, purification, adjuvant addition, formulation; cold chain management; lot release testing",
                "Quality control of vaccines: potency, safety, sterility testing; WHO requirements; Good Manufacturing Practice for vaccines",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Biosimilars, Genomics, and Pharmacogenomics", topics: [
                "Biosimilars: definition, regulatory pathway (EMA, USFDA, CDSCO), comparability studies, immunogenicity concerns; marketed biosimilars",
                "Genomics and proteomics: Human Genome Project; genomic databases; proteomics approaches — 2D-PAGE, mass spectrometry; applications in drug discovery",
                "Pharmacogenomics: concept; genetic polymorphisms in drug metabolism (CYP2D6, CYP2C19, NAT2); personalized medicine; companion diagnostics; pharmacogenomic-guided therapy",
            ]
        },
    ]),
    s("BP404T", "Social Pharmacy and Public Health", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Social Determinants of Health and Epidemiology", topics: [
                "Social determinants of health: income, education, environment, social support; health inequities in India",
                "Epidemiology: definitions, measures of disease frequency (incidence, prevalence); study designs (cohort, case-control, cross-sectional, RCT)",
                "Disease burden in India: communicable vs. non-communicable diseases; mortality and morbidity statistics; DALY concept",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "National Health Programmes", topics: [
                "National Health Mission (NHM): NRHM, NUHM — objectives, strategies, key programmes",
                "Immunization: Universal Immunization Programme (UIP); National Immunization Schedule; vaccine-preventable diseases; cold chain management",
                "Disease control programmes: Revised National Tuberculosis Control Programme (RNTCP/NTEP), National AIDS Control Programme (NACP), National Vector Borne Disease Control Programme (NVBDCP)",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Essential Medicines and Rational Drug Use", topics: [
                "Essential medicines concept: WHO essential medicines list; National Essential Medicines List (NEML) of India; criteria for selection",
                "Janaushadhi scheme: objectives, implementation, Pradhan Mantri Bhartiya Janaushadhi Pariyojana; generic prescribing and substitution",
                "Rational drug use (RDU): definition, indicators; irrational prescribing; drug promotion practices; role of pharmacist in promoting RDU",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Pharmacoeconomics", topics: [
                "Pharmacoeconomics: definition, types of analyses — cost-benefit analysis (CBA), cost-effectiveness analysis (CEA), cost-utility analysis (CUA), cost-minimization analysis (CMA)",
                "QALY (Quality-Adjusted Life Year): concept and calculation; cost-per-QALY thresholds; incremental cost-effectiveness ratio (ICER)",
                "Drug pricing in India: Drug Price Control Order (DPCO); National Pharmaceutical Pricing Authority (NPPA); price regulation mechanisms",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Community Pharmacy and Polypharmacy", topics: [
                "Community pharmacist's role in public health: patient counselling, medication therapy management, health screening, chronic disease management",
                "Polypharmacy: definition, prevalence, causes, risks; medication reconciliation; deprescribing strategies; pharmacist's role in managing polypharmacy",
                "Pharmacovigilance in community setting: ADR reporting; National Pharmacovigilance Programme (PvPI); patient safety initiatives",
            ]
        },
    ]),

    s("BP405T", "Systemic Pharmacology I", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Autonomic Nervous System Pharmacology", topics: [
                "ANS overview: sympathetic and parasympathetic divisions; neurotransmission (ACh, noradrenaline); receptors (nicotinic, muscarinic, α, β)",
                "Cholinergic drugs: muscarinic agonists (pilocarpine, bethanechol), anticholinesterases (neostigmine, physostigmine, organophosphates), nicotinic agonists; clinical applications and toxicology",
                "Adrenergic drugs: catecholamines (adrenaline, noradrenaline, dopamine), sympathomimetics (salbutamol, phenylephrine); alpha and beta blockers — pharmacology and clinical uses",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "CNS Pharmacology", topics: [
                "Sedatives and anxiolytics: benzodiazepines, buspirone, barbiturates — mechanisms and clinical uses",
                "Antiepileptic drugs: phenytoin, carbamazepine, valproic acid, levetiracetam, lamotrigine — mechanisms, uses, side effects",
                "Anti-Parkinson drugs: levodopa, carbidopa, dopamine agonists (pramipexole, ropinirole), MAO-B inhibitors (selegiline), COMT inhibitors; anticholinergics",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Cardiovascular Pharmacology", topics: [
                "Antihypertensives: diuretics, ACE inhibitors, ARBs, calcium channel blockers, beta-blockers, vasodilators — mechanisms, therapeutic uses, adverse effects, drug interactions",
                "Diuretics: thiazides, loop diuretics (furosemide), potassium-sparing diuretics — mechanisms, pharmacokinetics, clinical uses",
                "Cardiac glycosides (digoxin): mechanism, pharmacokinetics, therapeutic uses, toxicity, drug interactions; antiarrhythmics: classes I-IV",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Gastrointestinal Pharmacology", topics: [
                "Antacids and antiulcer drugs: antacids, H2 receptor antagonists (cimetidine, ranitidine), proton pump inhibitors (omeprazole, pantoprazole), H. pylori eradication regimens",
                "Prokinetics and antiemetics: metoclopramide, domperidone, ondansetron, aprepitant — mechanisms and uses; antiemetics in chemotherapy",
                "Laxatives and antidiarrhoeal drugs: osmotic (lactulose), stimulant (senna, bisacodyl), bulk-forming (ispaghula); loperamide, oral rehydration therapy",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Respiratory Pharmacology", topics: [
                "Bronchodilators: β2-agonists (salbutamol, salmeterol — short and long-acting), methylxanthines (theophylline, aminophylline), anticholinergics (ipratropium, tiotropium) — mechanisms and clinical uses",
                "Anti-inflammatory drugs in asthma and COPD: corticosteroids (inhaled and systemic), leukotriene antagonists (montelukast), cromoglycates; stepwise management of asthma",
                "Antitussives, expectorants, mucolytics: codeine, dextromethorphan; guaifenesin; acetylcysteine, ambroxol — mechanisms and uses",
            ]
        },
    ]),
    s("BP411I", "Internship I (Mandatory)", 4, "I", [
        {
            num: "I", hours: "40 Hours", title: "Industrial / Hospital / Community Pharmacy Internship", topics: [
                "Mandatory industrial, hospital, or community pharmacy internship — minimum 120 hours of structured experiential learning",
            ]
        },
        {
            num: "II", hours: "40 Hours", title: "Internship Activities and Logbook", topics: [
                "Structured diary and daily activities log; workplace activities covering manufacturing, QC, dispensing, or regulatory functions",
            ]
        },
        {
            num: "III", hours: "20 Hours", title: "Internship Report and Viva", topics: [
                "Preparation of internship report; presentation to faculty; oral viva examination for credit award",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Placement Options", topics: [
                "Manufacturing plants (QA/QC/production), hospital pharmacy, community drug stores, regulatory/CRO firms, pharmacovigilance units",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Learning Outcomes", topics: [
                "Application of classroom knowledge to real-world pharmacy practice; development of professional communication and workplace skills",
            ]
        },
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER V
// ─────────────────────────────────────────────────────────────
const SEM5: Subject[] = [
    s("BP501T", "Biomedicinal Chemistry", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Drug Design Strategies", topics: [
                "Rational drug design: target identification and validation; lead discovery (HTS, natural products, virtual screening); lead optimisation",
                "Combinatorial chemistry: solid-phase synthesis, split-pool synthesis; virtual combinatorial libraries; ADMET prediction in silico",
                "Fragment-based drug discovery: fragment libraries, SPR, NMR screening; growing and linking strategies",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "QSAR — Quantitative Structure-Activity Relationships", topics: [
                "Hansch analysis: physicochemical parameters (π, σ, Es), correlation equations; applications in drug design",
                "Free-Wilson method: structural parameters; comparison with Hansch; limitations",
                "3D-QSAR: CoMFA (Comparative Molecular Field Analysis), CoMSIA; pharmacophore modelling; database screening",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Antiviral and Anticancer Agents", topics: [
                "Antiviral drugs: nucleoside/nucleotide analogues (acyclovir, tenofovir, lamivudine) — mechanism, SAR; HIV protease inhibitors, NNRTI; neuraminidase inhibitors (oseltamivir, zanamivir)",
                "Anticancer drugs: alkylating agents (cyclophosphamide, cisplatin), antimetabolites (methotrexate, 5-FU, cytarabine), natural products (vinca alkaloids, taxanes, anthracyclines), targeted therapy (imatinib, erlotinib, trastuzumab)",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Antidiabetic and Antilipidemic Agents", topics: [
                "Antidiabetic drugs: insulin analogues (structural modifications); biguanides (metformin — mechanism); sulfonylureas (glibenclamide — SAR); TZDs (pioglitazone — PPARγ agonism); DPP-4 inhibitors (sitagliptin — SAR); SGLT2 inhibitors (dapagliflozin)",
                "Antilipidemic drugs: statins (atorvastatin, rosuvastatin — HMG-CoA reductase inhibition, SAR); fibrates (fenofibrate — PPARα); ezetimibe; PCSK9 inhibitors",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Prodrug Concept and Bioisosterism", topics: [
                "Prodrug concept: definition, types (carrier-linked, bipartite, tripartite; bioprecursor prodrugs); examples: enalapril, levodopa, valacyclovir, codeine",
                "Soft drugs: definition, concept; examples in ophthalmic and dermatological agents",
                "Bioisosterism: classical and non-classical bioisosteres; application in improving ADMET properties; examples: NH→O, COOH→tetrazole, F substitution",
            ]
        },
    ]),
    s("BP502T", "Industrial Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Commercial Production of Important Plant Drugs", topics: [
                "Commercial cultivation, harvesting, and post-harvest processing of opium, belladonna, ergot, cinchona, digitalis, rauwolfia",
                "World production statistics and trade of major plant drugs; India's role in global herbal drug market",
                "Industrial extraction, isolation, and purification of active constituents at commercial scale",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Phytopharmaceuticals and Global Markets", topics: [
                "Definition and scope of phytopharmaceuticals; regulatory pathway for phytopharmaceuticals in India (CDSCO guidelines 2015)",
                "Global herbal medicine market trends; traditional medicine integration into healthcare systems; WHO traditional medicine strategy",
                "Major phytopharmaceutical products: silymarin, curcumin, boswellic acids, withaferin-A, berberine — standardisation and market products",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Industrial Extraction and Isolation Techniques", topics: [
                "Supercritical fluid extraction (SFE): CO2 as solvent, parameters, applications for volatile oils and fixed oils",
                "Countercurrent extraction; centrifugal partition chromatography; preparative HPLC; medium-pressure liquid chromatography",
                "Characterization techniques for botanical extracts: HPTLC fingerprinting, LC-MS, GC-MS, NMR",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Standardization and Validation of Herbal Products", topics: [
                "Standardization approaches: chemical marker-based, biological activity-based, genomic fingerprinting",
                "Validation of analytical methods for herbal products: ICH Q2(R1) guidelines applied to herbal matrices",
                "Stability testing of herbal products: challenges (complex matrices); ICH Q1A guidelines; packaging impact",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Regulatory Requirements for Herbal Products", topics: [
                "Indian regulations: AYUSH manufacturing guidelines; NDPC; labelling and advertising regulations for herbal products",
                "European Medicines Agency (EMA) guidelines for herbal medicinal products; European Pharmacopoeia herbal monographs",
                "WHO guidelines on safety monitoring of herbal medicines; pharmacovigilance for traditional medicines; adverse event reporting",
            ]
        },
    ]),

    s("BP503T", "Innovation and Startup Ecosystem", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Innovation Models and Design Thinking in Pharmacy", topics: [
                "Innovation: definition, types (product, process, business model innovation); innovation funnel; disruptive vs. incremental innovation",
                "Design thinking methodology: empathise, define, ideate, prototype, test; application in pharmaceutical product and service design",
                "Open innovation in pharma: academic-industry partnerships; licensing, technology transfer; crowdsourcing; reverse engineering as innovation",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Startup Ecosystem in India", topics: [
                "Startup ecosystem components: incubators, accelerators, angel investors, venture capital, corporate innovation labs",
                "Government schemes: Startup India initiative; BIRAC funding for biopharma; Atal Incubation Mission; SIDBI; MSME schemes; DBT biotechnology programs",
                "Case studies of successful Indian pharma and health-tech startups: Divi's Laboratories, Mankind Pharma, PharmEasy, Pristyn Care, SastaSundar",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "IPR for Pharmaceutical Innovations", topics: [
                "Types of intellectual property: patents, trademarks, trade secrets, copyrights; relevance in pharmaceutical business",
                "Patent filing process in India: CGPDTM; PCT application; patentability criteria for pharmaceutical inventions; Section 3(d) of the Indian Patents Act",
                "Freedom-to-operate analysis; patent landscaping; pharmaceutical patent strategies; generic drug patent challenges",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Business Model Canvas and MVP Development", topics: [
                "Business Model Canvas: nine components; application to pharmaceutical SaaS, diagnostics, manufacturing, and distribution businesses",
                "Minimum Viable Product (MVP): concept, types (concierge, wizard of Oz, landing page MVP); lean startup methodology; pivot vs. persevere decisions",
                "Market sizing for pharma products: TAM, SAM, SOM calculation; competitive analysis; value proposition design",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Healthcare Technology Case Studies", topics: [
                "AI-based healthcare startups: diagnostics, drug discovery, clinical decision support — business models and challenges",
                "Digital health platforms: telemedicine, e-pharmacy, health apps — regulatory landscape (Telemedicine Practice Guidelines 2020, DPDPA)",
                "Pharmaceutical entrepreneurship: challenges in Indian pharma market; regulatory hurdles; funding landscape; exit strategies (IPO, acquisition)",
            ]
        },
    ], true),
    s("BP504T", "Pharmaceutical Dosage Form II", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Controlled Release Drug Delivery Systems", topics: [
                "Rationale for controlled release; advantages and limitations; classification: sustained release, extended release, pulsatile release, delayed release",
                "Diffusion-controlled systems: reservoir and matrix types; Higuchi equation; erosion-controlled and osmotic systems (OROS)",
                "Biopharmaceutical Classification System (BCS): Class I-IV; biopharmaceutics and its impact on CDDS design; IVIVC",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Transdermal Drug Delivery Systems", topics: [
                "Skin as a barrier: anatomy, permeation routes; factors affecting skin penetration (physicochemical properties, skin condition)",
                "Transdermal patches: types (membrane-controlled, matrix, drug-in-adhesive, microreservoir); excipients; permeation enhancers; manufacturing",
                "Marketed transdermal products: nitroglycerin, scopolamine, nicotine, fentanyl, oestradiol patches — design and clinical use",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Ocular, Nasal and Pulmonary Drug Delivery", topics: [
                "Ocular drug delivery: anatomy and barriers; conventional (eye drops, ointments) and novel (ocular inserts, nanoparticles, contact lenses) systems; factors affecting ocular bioavailability",
                "Nasal drug delivery: anatomy; drug absorption via nasal route; formulation considerations; nasal sprays, nasal gels; systemic delivery via nasal route",
                "Pulmonary drug delivery: anatomy; MDI, DPI, nebulisers — formulation, devices, particle size considerations; regulatory requirements",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Targeted Drug Delivery — Nanoparticulate Systems", topics: [
                "Targeted drug delivery: concept; passive (EPR effect) and active targeting (receptor-mediated); targeted cancer therapy",
                "Liposomes: structure, preparation (thin film hydration, extrusion), characterization (size, zeta potential, entrapment efficiency); Doxil, AmBisome — marketed products",
                "Polymeric nanoparticles, solid lipid nanoparticles (SLN), nanostructured lipid carriers (NLC) — preparation, characterization, applications",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Novel Drug Delivery Concepts", topics: [
                "Dendrimers: structure, types (PAMAM, poly-L-lysine), surface functionalisation, drug loading, pharmaceutical applications",
                "Microspheres and microcapsules: preparation by emulsification-solvent evaporation, spray drying, ionotropic gelation; applications in CDDS",
                "Hydrogels: classification, cross-linking mechanisms; smart hydrogels (pH-responsive, thermosensitive); applications in drug delivery and tissue engineering",
            ]
        },
    ]),

    s("BP505T", "Pharmaceutical Quality Assurance", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Quality Concepts and Quality by Design (QbD)", topics: [
                "Quality concepts: definition, total quality management (TQM); quality circles; cost of quality; quality planning, control, and improvement",
                "ICH Q8 Pharmaceutical Development: design space; Quality by Design (QbD) approach; Quality Target Product Profile (QTPP); Critical Quality Attributes (CQAs); Critical Process Parameters (CPPs)",
                "Risk management: ICH Q9 guidelines; Failure Mode and Effects Analysis (FMEA); fault tree analysis; risk assessment tools in pharmaceutical development",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Good Manufacturing Practice (GMP)", topics: [
                "Schedule M (India): premises, equipment, materials, documentation, QC requirements; Revised Schedule M 2023 updates",
                "WHO GMP guidelines: basic principles; GMP for sterile pharmaceutical products; GMP for biological products",
                "ICH Q7 GMP for Active Pharmaceutical Ingredients: key requirements; impurity control; qualification of starting materials",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Validation", topics: [
                "Process validation: stages (design, qualification, continued process verification); validation master plan; validation protocols and reports",
                "Analytical method validation: ICH Q2(R1) parameters — specificity, linearity, range, accuracy, precision (repeatability, intermediate precision, reproducibility), detection limit, quantitation limit, robustness",
                "Cleaning validation: acceptance criteria (MACO calculation, visual inspection, swab sampling, rinse sampling); cleaning validation protocols",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Audits and Documentation", topics: [
                "Internal audits: planning, checklists, audit reports, CAPAs; vendor qualification: supplier audits, approved vendor list",
                "Documentation in pharmaceutical QA: good documentation practices (GDocP); master batch record (MBR); batch production record (BPR); standard operating procedures (SOPs); change control",
                "Deviation and out-of-specification (OOS) management: deviation classification, root cause analysis, CAPA system",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "ICH Guidelines and Stability Studies", topics: [
                "ICH guidelines overview: Q1A-Q1F (stability), Q2 (analytical method validation), Q3 (impurities), Q8 (pharmaceutical development), Q10 (pharmaceutical quality system)",
                "Stability studies: ICH Q1A (accelerated, long-term, intermediate conditions); climatic zones; stress testing; shelf life determination; ongoing stability programs",
                "Pharmaceutical quality system: ICH Q10; continual improvement; product lifecycle management; knowledge management",
            ]
        },
    ]),
    s("BP506T", "Systemic Pharmacology II", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Endocrine Pharmacology", topics: [
                "Insulin and antidiabetics: types of insulin (rapid, short, intermediate, long-acting); mechanism; oral hypoglycaemics — sulfonylureas, biguanides, TZDs, DPP-4 inhibitors, SGLT2 inhibitors, GLP-1 agonists",
                "Thyroid pharmacology: levothyroxine, liothyronine; antithyroid drugs (carbimazole, propylthiouracil); radioactive iodine therapy",
                "Corticosteroids: glucocorticoids (dexamethasone, prednisolone) and mineralocorticoids; mechanisms; clinical uses; adverse effects; HPA axis suppression",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Chemotherapy", topics: [
                "Antibiotics: β-lactams (penicillins, cephalosporins, carbapenems, monobactams), aminoglycosides, tetracyclines, macrolides, fluoroquinolones, glycopeptides (vancomycin) — mechanisms, spectrum, adverse effects",
                "Antifungals: amphotericin B, azoles (fluconazole, itraconazole, voriconazole), echinocandins (caspofungin) — mechanisms and uses",
                "Antivirals: antiretrovirals (NRTIs, NNRTIs, PIs, INSTIs) — HIV treatment principles; antiherpes (acyclovir, ganciclovir); influenza antivirals (oseltamivir); hepatitis antivirals (sofosbuvir, tenofovir); antiprotozoals (chloroquine, artemisinin, metronidazole)",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Immunopharmacology", topics: [
                "Immunosuppressants: mechanism of calcineurin inhibitors (cyclosporine, tacrolimus), mTOR inhibitors (sirolimus), azathioprine, mycophenolate mofetil; clinical uses in organ transplantation and autoimmune diseases",
                "Immunostimulants: interferons, interleukins; thalidomide and lenalidomide; BCG immunotherapy; granulocyte colony-stimulating factors (G-CSF, GM-CSF)",
                "Biologics in immunotherapy: monoclonal antibodies (adalimumab, infliximab, rituximab, trastuzumab); checkpoint inhibitors (pembrolizumab, nivolumab); CAR-T cell therapy",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Dermatological and Ophthalmological Pharmacology", topics: [
                "Dermatological drugs: topical corticosteroids — potency classification and uses; retinoids (tretinoin, isotretinoin) in acne and psoriasis; antifungal topicals (clotrimazole, terbinafine); keratolytics; emollients and moisturisers",
                "Drugs for psoriasis: topical (dithranol, coal tar, calcipotriol); systemic (methotrexate, cyclosporine, biologics — secukinumab, adalimumab)",
                "Ophthalmological drugs: antiglaucoma drugs (β-blockers, prostaglandin analogues, carbonic anhydrase inhibitors, α2-agonists); anti-VEGF therapy; ophthalmic antibiotics; mydriatics and cycloplegics",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Reproductive Pharmacology", topics: [
                "Contraceptives: combined oral contraceptive pills (COCPs) — mechanism, types, pharmacology; progestogen-only pills; injectable contraceptives; IUDs; emergency contraception",
                "Fertility drugs: clomiphene citrate, gonadotrophins (FSH, LH, hMG), GnRH analogues — uses in assisted reproductive technology (ART)",
                "Uterine stimulants and relaxants: oxytocin, ergometrine, dinoprostone (PGE2) — mechanism and clinical uses; tocolytics (nifedipine, atosiban, salbutamol); drugs in preeclampsia (magnesium sulphate, hydralazine)",
            ]
        },
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER VI
// ─────────────────────────────────────────────────────────────
const SEM6: Subject[] = [
    s("BP601T", "Advanced Pharmacognosy", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Marine Natural Products", topics: [
                "Overview of marine organisms as drug sources: sponges, corals, tunicates, molluscs, seaweeds, marine microorganisms",
                "Marine natural products in medicine: cytarabine, ziconotide, trabectedin, eribulin, brentuximab vedotin — source, chemistry, clinical use",
                "Strategies for marine natural product discovery: deep-sea exploration, metagenomics, synthetic biology",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Biotransformation of Crude Drugs and Plant Cell Culture", topics: [
                "Biotransformation: definition, types (phase I and II reactions); microbial biotransformation of steroids, alkaloids, terpenoids",
                "Plant cell and tissue culture: callus culture, suspension culture, organ culture; production of secondary metabolites (shikonin, taxol via Taxus callus)",
                "Elicitation and metabolic engineering to enhance secondary metabolite production in plant cell cultures",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Novel Herbal Drug Delivery Systems", topics: [
                "Phytosomes: definition, preparation (solvent evaporation, anti-solvent precipitation), characterization, advantages over conventional herbal extracts; marketed phytosomes (Siliphos, Meriva)",
                "Nanoemulsions, self-emulsifying drug delivery systems (SEDDS) for poorly water-soluble phytoconstituents; nanoparticle-based herbal delivery",
                "Herbal hydrogels, transdermal patches, liposomal formulations for plant-based actives",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Pharmacogenomics and Personalized Herbal Medicine", topics: [
                "Pharmacogenomics of herbal medicines: genetic polymorphisms affecting response to plant-based drugs; herb-gene interaction studies",
                "Ayurgenomics: integration of Ayurvedic prakriti with genomics; personalized herbal therapy based on genetic profiling",
                "Ethnopharmacology: research methodology; validation of traditional claims; reverse pharmacology approach",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Global Herbal Medicine Regulations", topics: [
                "European Medicines Agency (EMA): Community Herbal Monographs; HMPC; traditional use registration vs. well-established use; EMA assessment reports",
                "USFDA botanical drug products: guidance for industry; IND process for botanicals; approved botanical drugs (Veregen, Mytesi)",
                "AYUSH regulations in India: Good Manufacturing Practices for Ayurvedic, Unani, and Siddha medicines; Schedule T; PCIM&H; pharmacovigilance for AYUSH",
            ]
        },
    ]),
    s("BP602T", "Biopharmaceutics and Pharmacokinetics", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Biopharmaceutics", topics: [
                "Biopharmaceutics: definition, scope; GI absorption factors — physicochemical (pKa, solubility, lipophilicity, particle size) and physiological (GI motility, pH, blood flow, food effect)",
                "Biopharmaceutical Classification System (BCS): Class I-IV; BDDCS; regulatory applications of BCS — biowaivers",
                "Absorption models: first-order, zero-order; lag time; flip-flop kinetics; absorption from various routes (oral, IM, SC, transdermal, pulmonary)",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Pharmacokinetic Models", topics: [
                "One-compartment model: IV bolus, IV infusion, oral administration; equations for Cp, AUC, Cmax, tmax, t1/2; calculation examples",
                "Two-compartment model: IV bolus; α and β phases; distribution phase; elimination phase; equations for each phase; parameter estimation",
                "Non-compartmental analysis: statistical moment theory; AUC, AUMC, MRT, MAT; advantages over compartmental analysis",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Pharmacokinetic Parameters and Calculations", topics: [
                "Clearance: hepatic clearance (extraction ratio), renal clearance, total body clearance; organ clearance models (well-stirred, parallel tube, dispersion model)",
                "Volume of distribution (Vd): apparent Vd; factors affecting Vd; Vdss vs. Vdβ; clinical implications of Vd changes",
                "AUC calculation: linear trapezoidal, log-trapezoidal methods; bioavailability calculation; plasma protein binding and its effects on PK parameters",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Bioavailability and Bioequivalence", topics: [
                "Bioavailability: absolute and relative bioavailability; factors affecting oral bioavailability; first-pass effect; food-drug interactions affecting bioavailability",
                "Bioequivalence: definition, types; BE study design (crossover design); acceptance criteria (90% CI within 80-125%); regulatory requirements (USFDA, EMA, CDSCO)",
                "In vitro-in vivo correlation (IVIVC): levels A, B, C; development and validation; regulatory applications; predictive models for dissolution",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Population PK, TDM and Special Populations", topics: [
                "Population pharmacokinetics: NONMEM approach; mixed-effects models; covariate analysis; applications in drug development and clinical practice",
                "Therapeutic drug monitoring (TDM): drugs with narrow therapeutic index (aminoglycosides, vancomycin, digoxin, lithium, phenytoin, cyclosporine); sampling time optimization; Bayesian forecasting",
                "Dosage adjustment in special populations: renal impairment (GFR-based dose adjustment), hepatic impairment, paediatrics (allometric scaling), geriatrics, obesity",
            ]
        },
    ]),

    s("BP603T", "Intellectual Property Rights", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Types of Intellectual Property", topics: [
                "Patents: definition, types (utility, design, plant), criteria for patentability; patents in pharmaceutical industry",
                "Trademarks, copyrights, geographical indications, trade secrets, plant variety protection — relevance in pharmacy and healthcare",
                "Traditional knowledge and biodiversity: Convention on Biological Diversity (CBD); Nagoya Protocol; TKDL (Traditional Knowledge Digital Library) India",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Patent Filing and Prosecution", topics: [
                "Patent filing in India: process at CGPDTM (Patent Office, India); types of applications (provisional, complete); fees, timelines",
                "PCT (Patent Cooperation Treaty): national and international phases; receiving office, international searching authority; designated offices",
                "Patent prosecution: examination, first examination report (FER), response, grant; post-grant opposition; revocation; maintenance fees",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Pharmaceutical Patent Strategies", topics: [
                "Patent analysis tools: Espacenet, Google Patents, Derwent Innovation; freedom-to-operate (FTO) analysis; patent landscaping",
                "Pharmaceutical patent strategies: compound patents, formulation patents, process patents, method-of-use patents; secondary patents and evergreening; Section 3(d) of Indian Patents Act",
                "Compulsory licensing: TRIPS Article 31; Bayer vs. Natco case study; government use; parallel imports",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Technology Transfer and Licensing", topics: [
                "Technology transfer: types (vertical, horizontal); know-how; technology transfer agreements; licensing (exclusive, non-exclusive, cross-licensing)",
                "Royalties: calculation, milestone payments; confidentiality agreements (NDA/CDA); material transfer agreements (MTA)",
                "Technology Transfer Offices (TTOs): role in academic-industry partnership; commercialisation of research; case studies from Indian pharma",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "IP Litigation and Case Studies", topics: [
                "IP litigation in pharma: patent infringement suits, patent invalidity; design and trademark infringement; regulatory data exclusivity (data protection)",
                "Case studies: Novartis vs. Union of India (imatinib/Gleevec, Section 3d); Roche vs. Cipla (erlotinib/Tarceva); Bayer vs. Natco (sorafenib/Nexavar — compulsory licensing)",
                "International treaties: TRIPS, WIPO, Paris Convention, Patent Cooperation Treaty; Doha Declaration on TRIPS and Public Health",
            ]
        },
    ]),
    s("BP604T", "AI Applications in Pharmaceutical Sciences", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI and ML in Drug Discovery and Natural Products", topics: [
                "Overview of AI/ML pipeline in drug discovery: target identification, hit generation, lead optimisation, ADMET prediction",
                "ML applications in natural products: representation of crude drug data (morphological, microscopic, phytochemical, chromatographic features); classification models for botanical authentication",
                "Deep learning for molecular property prediction: Graph Neural Networks (GNNs), transformer-based molecular models (BERT for chemistry); de novo drug design",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "QSAR and Molecular Descriptors", topics: [
                "Molecular descriptors: constitutional, topological, geometric, electronic descriptors; Morgan fingerprints, MACCS keys, ECFP",
                "QSAR modelling: conversion of molecular structures to numerical descriptors; building predictive models for activity, toxicity, solubility, permeability",
                "Structured chemical datasets; QSAR model validation; domain of applicability; QSAR software (RDKit, MOE, Discovery Studio)",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in Pharmaceutical Formulation and Manufacturing", topics: [
                "Overview of dosage form development variables; ML in formulation optimisation: Design of Experiments (DoE) combined with ML, excipient compatibility prediction",
                "Machine learning in manufacturing: real-time monitoring, predictive maintenance, process analytical technology (PAT) and ML integration; Industry 4.0 in pharma",
                "AI in quality control: image analysis for tablet defects, NIR spectroscopy + ML for content uniformity, automated visual inspection systems",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "AI in Clinical and Analytical Pharmaceutical Sciences", topics: [
                "Multivariate analysis in pharmaceutical analytical techniques: PCA, PLS, cluster analysis applied to spectroscopic (UV, IR, NMR) and chromatographic data",
                "AI in clinical trials: patient stratification, adaptive trial design, electronic patient-reported outcomes; natural language processing (NLP) in pharmacovigilance and literature mining",
                "Computer-aided drug design (CADD): molecular docking (AutoDock, Glide, Vina); virtual screening; molecular dynamics simulations; AI-enhanced docking scoring functions",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Chemometrics and Practical AI Implementation", topics: [
                "Introduction to chemometrics and multivariate analytical data: spectroscopic data modelling (UV/IR); regression analysis in quantitative pharmaceutical analysis",
                "Practical AI tools: Python (scikit-learn, RDKit, DeepChem), KNIME, Jupyter notebooks; case studies — COVID-19 drug repurposing using ML, AI-based antibiotic discovery (Halicin)",
                "Ethical, regulatory, and societal aspects of AI in pharmacy: bias in healthcare AI; FDA guidance on AI/ML-based software as a medical device (SaMD); responsible AI principles",
            ]
        },
    ], true),

    s("BP605T", "Pharmaceutical Analysis", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Electroanalytical Methods", topics: [
                "Potentiometry: reference and indicator electrodes (glass electrode, calomel electrode, ion-selective electrodes); measurement of EMF; pH determination; potentiometric titrations",
                "Voltammetry: polarography; direct current, AC polarography; differential pulse polarography; pharmaceutical applications",
                "Conductometry: principle, conductometric titrations; applications in pharmaceutical analysis",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Spectroscopic Methods", topics: [
                "UV-Vis spectrophotometry: Beer-Lambert law; chromophores and auxochromes; single and double beam spectrophotometers; applications — assay of vitamins, antibiotics, drug purity testing",
                "IR spectroscopy: molecular vibrations (stretching, bending); functional group identification; KBr pellet method, ATR; interpretation of spectra; pharmaceutical applications",
                "Fluorimetry: principle; fluorescence spectrometers; pharmaceutical applications; advantages and limitations",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Atomic Spectroscopy and Flame Methods", topics: [
                "Atomic absorption spectroscopy (AAS): principle, instrumentation (hollow cathode lamp, flame/graphite furnace atomization), interferences; pharmaceutical applications (heavy metal testing)",
                "Atomic emission spectroscopy (AES/ICP-OES): principle, plasma sources; applications in elemental analysis of pharmaceuticals",
                "Flame photometry: principle, instrumentation; alkali metal determination (Na, K, Li); pharmaceutical applications",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Chromatographic Methods", topics: [
                "HPLC: principles, column types (RP-HPLC, HILIC, ion exchange, size exclusion); detectors (UV, fluorescence, ELSD, RI); method development; pharmaceutical applications (assay, impurity profiling)",
                "GC: principles; stationary phases; injection techniques (split, splitless, on-column); detectors (FID, ECD, NPD, MS); applications in residual solvents, volatile impurities, essential oil analysis",
                "Ion chromatography, affinity chromatography, gel filtration: principles and pharmaceutical applications",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Mass Spectrometry and Hyphenated Techniques", topics: [
                "Mass spectrometry: ionisation techniques (ESI, APCI, MALDI, EI); mass analysers (quadrupole, TOF, ion trap, Orbitrap); fragmentation patterns; molecular weight determination and structural elucidation",
                "LC-MS and LC-MS/MS: principle; SRM/MRM quantitation; pharmaceutical applications — impurity profiling, bioavailability studies, metabolite identification",
                "GC-MS: EI fragmentation; spectral libraries (NIST); quantitative analysis; applications in residual solvent analysis, forensic pharmacy, pesticide residue analysis",
            ]
        },
    ]),
    s("BP606T", "Pharmaceutical Jurisprudence", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Drugs and Cosmetics Act 1940", topics: [
                "Historical background and objectives; definitions: drug, cosmetic, patent/proprietary medicine, new drug; schedules to the Act (A through Y and E1, E2, H, H1, X, G)",
                "Licensing provisions: manufacture, sale, import; designated authorities (Central and State Licensing Authorities); conditions for licence grant; form of licences (21, 20B, 27B)",
                "Prohibition of manufacture, sale, and import of certain drugs; misbranded, adulterated, spurious drugs; offences and penalties under the Act",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Pharmacy Act 1948 and State Regulations", topics: [
                "Pharmacy Act 1948: objectives; constitution and functions of Pharmacy Council of India (PCI); State Pharmacy Councils; Central Register of Pharmacists",
                "Registration of pharmacists: eligibility, process, renewal; code of professional ethics for registered pharmacists",
                "Pharmacy education regulations: ER 1991, ER 2014 amendments; Pharm.D regulations; B.Pharm and D.Pharm standards",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "NDPS Act 1985 and Other Drug Laws", topics: [
                "Narcotic Drugs and Psychotropic Substances (NDPS) Act 1985: definitions; Schedules I and II; licensing for manufacture, possession, sale of narcotic drugs; import/export",
                "Precursor chemical control; international conventions (Single Convention on Narcotic Drugs 1961, Convention on Psychotropic Substances 1971)",
                "Medicinal and Toilet Preparations (Excise Duties) Act 1955; Poisons Act 1919; Prevention of Food Adulteration Act and Food Safety and Standards Act (FSSAI)",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Drug Price Control and Consumer Protection", topics: [
                "Drug Price Control Order (DPCO) 2013: objectives; scheduled formulations; ceiling price calculation; NPPA's role; impact on pharma industry",
                "Jan Aushadhi scheme and Pradhan Mantri Bhartiya Janaushadhi Pariyojana; generic medicines and affordability",
                "Consumer Protection Act and consumer rights in healthcare; product liability; Medical Device Rules 2017; e-pharmacy regulations; Clinical Establishment (Registration and Regulation) Act 2010",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Recent Developments in Pharmaceutical Law", topics: [
                "New Drugs and Clinical Trials Rules 2019: new drug definition; CT approval process; ethics committee requirements; accelerated approval pathway; academic clinical trials provisions",
                "Schedule Y: clinical trial requirements in India; waiver of Phase I and II data for global drugs; CTRI registration mandatory requirement",
                "Pharmacovigilance regulations: regulatory requirements for post-marketing surveillance; periodic safety update reports (PSURs); risk management plans under Indian law",
            ]
        },
    ]),
    s("BP607T AEC", "AEC Elective (Green Chemistry / Materiovigilance / Scientific Writing / Drug Store Management / Medicinal Plant Cultivation / API Sciences)", 1, "P", []),
    s("BP612I", "Internship II (Mandatory)", 4, "I", [
        {
            num: "I", hours: "40 Hours", title: "Advanced Experiential Learning", topics: [
                "Mandatory advanced internship after completing Semester V-VI coursework; focus on specialised areas: QA, regulatory affairs, R&D, clinical pharmacy, or pharmacovigilance",
            ]
        },
        {
            num: "II", hours: "40 Hours", title: "Structured Logbook", topics: [
                "Minimum 120 hours; structured daily logbook and evaluation; workplace activities with documentation",
            ]
        },
        {
            num: "III", hours: "20 Hours", title: "Internship Assessment", topics: [
                "Industry mentor report; final viva for credit award; reflection report on learning outcomes",
            ]
        },
        {
            num: "IV", hours: "10 Hours", title: "Industry Exposure", topics: [
                "Pharmaceutical manufacturing (QA, validation, production), regulatory affairs, CRO/pharmacovigilance units, hospital clinical pharmacy",
            ]
        },
        {
            num: "V", hours: "10 Hours", title: "Professional Development", topics: [
                "Professional networking; interview preparation; LinkedIn and portfolio development; career planning post-internship",
            ]
        },
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER VII
// ─────────────────────────────────────────────────────────────
const SEM7: Subject[] = [
    s("BP701T", "Biostatistics Research Methodology", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Research Design", topics: [
                "Research design types: observational (cross-sectional, cohort, case-control) vs. experimental (RCT, quasi-experimental); hierarchy of evidence; systematic reviews and meta-analysis",
                "Study protocol development: research question (PICO format), hypothesis formulation, primary and secondary endpoints, sample size rationale",
                "Bias in research: selection bias, information bias, confounding; strategies to minimise bias; randomisation and blinding methods",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Sampling Methods and Sample Size", topics: [
                "Sampling techniques: probability sampling (simple random, stratified, systematic, cluster) and non-probability sampling (convenience, purposive, snowball)",
                "Sample size calculation: for means (t-test), proportions (chi-square), survival analysis; alpha, beta, power; software tools (G*Power, PASS)",
                "Randomisation methods: simple, block, stratified, adaptive randomisation; allocation concealment; CONSORT guidelines for reporting RCTs",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Advanced Statistical Tests", topics: [
                "Non-parametric tests: Mann-Whitney U test, Wilcoxon signed-rank test, Kruskal-Wallis test, Friedman test; when to use non-parametric vs. parametric tests",
                "Survival analysis: Kaplan-Meier curves; log-rank test; Cox proportional hazards model; hazard ratio; applications in clinical research",
                "Multivariate analysis: multiple regression, logistic regression, discriminant analysis; confounding adjustment; interaction effects",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Clinical Research and GCP", topics: [
                "Clinical research phases: I-IV; study design for each phase; endpoints (primary, secondary, surrogate, patient-reported outcomes)",
                "ICH E6 Good Clinical Practice (GCP) guidelines: principles; responsibilities of sponsor, investigator, IRB/IEC; informed consent process; monitoring, auditing, inspection",
                "Regulatory requirements for clinical trials in India: New Drugs and Clinical Trials Rules 2019; CTRI registration; data integrity; safety reporting timelines",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Scientific Writing and Research Dissemination", topics: [
                "Scientific writing: IMRAD format (Introduction, Methods, Results, Discussion); abstract writing; research article structure; avoiding plagiarism",
                "Systematic review and meta-analysis: PRISMA guidelines; search strategy; inclusion/exclusion criteria; data extraction; heterogeneity assessment (I2 statistic); forest plots",
                "Research dissemination: journal selection (impact factor, quartile ranking, predatory journals); peer review process; oral and poster presentations; grant writing basics",
            ]
        },
    ]),
    s("BP702T", "Cosmetics and Cosmeceuticals", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Skin Biology and Assessment", topics: [
                "Skin structure: epidermis layers (stratum corneum, granulosum, spinosum, basale), dermis, hypodermis; Fitzpatrick skin types; TEWL measurement",
                "Skin ageing: intrinsic (chronological) and extrinsic (photoageing) ageing; mechanisms (ROS, UV damage, collagen degradation, glycation)",
                "Skin assessment methods: corneometry (hydration), tewameter (TEWL), cutometer (elasticity), mexameter (melanin and erythema); in vivo and in vitro testing",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Cosmetic Formulations", topics: [
                "Creams and lotions: O/W and W/O emulsions; emulsifiers; humectants (glycerin, hyaluronic acid); occlusives; emollients; preservatives; antioxidants",
                "Sunscreens: UV radiation; UVA/UVB filters (organic and inorganic); SPF measurement; broad-spectrum protection; photostability",
                "Shampoos, conditioners, hair colours, and styling products: formulation principles; surfactants in hair care; permanent and temporary hair colouring",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Active Ingredients in Cosmeceuticals", topics: [
                "Anti-ageing actives: retinoids (retinol, retinal, retinyl esters) — mechanism, formulation challenges; peptides (matrixyl, argireline); niacinamide; vitamin C (ascorbic acid stability)",
                "Skin-lightening agents: kojic acid, arbutin, azelaic acid, tranexamic acid — mechanism and safety; regulatory status",
                "AHAs and BHAs: glycolic acid, lactic acid, salicylic acid — mechanism, skin benefits, irritation potential; hyaluronic acid and ceramides",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Regulatory Requirements for Cosmetics", topics: [
                "India: Drugs and Cosmetics Act 1940 provisions for cosmetics; Schedule S (standards); BIS standards; import regulations; labelling requirements",
                "EU Cosmetics Regulation 1223/2009: prohibited and restricted substances; notification portal (CPNP); safety assessment requirements; labelling",
                "USA: FD&C Act provisions for cosmetics; FDA oversight; voluntary cosmetic registration programme; labelling requirements; cosmeceutical concept and regulatory grey area",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Cosmetic Testing and Quality Control", topics: [
                "Safety testing: patch test (Draize), sensitisation test, phototoxicity, photosensitisation, comedogenicity testing; human repeat insult patch test (HRIPT)",
                "Stability testing of cosmetic products: accelerated and real-time stability; compatibility with packaging; challenge testing (microbial); pH stability",
                "Efficacy testing: clinical studies for anti-wrinkle, whitening, moisturising claims; instrumental methods vs. clinical assessment; cosmetic claims substantiation",
            ]
        },
    ]),

    s("BP703T", "AI in Clinical Applications", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI-Driven Clinical Decision Support Systems", topics: [
                "Clinical decision support systems (CDSS): definition, types (diagnostic, therapeutic, monitoring); rule-based vs. ML-based CDSS; implementation challenges",
                "AI in drug dosing: pharmacokinetic modelling with ML; Bayesian adaptive dosing; AI-assisted TDM; examples — vancomycin, aminoglycoside dosing",
                "AI system lifecycle: data collection, preprocessing, modelling, validation, deployment, and monitoring; regulatory considerations for clinical AI",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "EHR Analytics and Regulatory AI", topics: [
                "Electronic health records (EHR) analytics: patient data mining, readmission prediction, sepsis early warning systems, disease progression modelling",
                "Natural language processing (NLP) in clinical settings: information extraction from clinical notes, ICD coding, clinical named entity recognition",
                "Overview of AI in regulatory submissions; explainable AI (XAI): concept, LIME, SHAP; transparency and interpretability requirements for clinical AI tools",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in Medical Imaging and Diagnostics", topics: [
                "Medical imaging AI: deep learning (CNN-based) for radiology — chest X-ray analysis, CT scan interpretation (pneumonia, COVID-19, cancer detection); pathology slides (digital pathology)",
                "AI in ophthalmology (diabetic retinopathy screening — Google DeepMind); dermatology (skin cancer detection); cardiology (ECG interpretation, echocardiography)",
                "AI in pharmacy automation and supply chain: automated dispensing systems; inventory prediction models; medication error detection systems",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Predictive Analytics and Public Health", topics: [
                "Predictive analytics: ADR risk scoring, hospital-acquired infection prediction, antimicrobial resistance prediction, patient risk stratification",
                "AI in public health and real-world data analytics: EHR, claims data, surveillance systems; pharmacoepidemiology with ML; post-market drug surveillance",
                "AI in drug repurposing: network pharmacology, knowledge graph approaches; COVID-19 drug repurposing case study using AI",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Ethics, Regulation and Future Perspectives", topics: [
                "Ethics of clinical AI: algorithmic bias (racial, gender disparities in AI models); fairness metrics; explainability requirements; patient autonomy and AI recommendations",
                "Regulatory frameworks for AI medical devices: FDA guidance on AI/ML-based SaMD; predetermined change control plan; EMA reflection paper; CDSCO guidance",
                "Future of AI in clinical pharmacy practice: AI-assisted clinical pharmacist decision support; opportunities and challenges; required competencies for pharmacists",
            ]
        },
    ], true),
    s("BP704T", "Modern Analytical Techniques", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Thermal Analysis", topics: [
                "Differential Scanning Calorimetry (DSC): principle; endothermic and exothermic transitions; polymorphism, melting point, purity analysis, excipient compatibility studies",
                "Thermogravimetric Analysis (TGA): principle, instrumentation; moisture/volatile content determination, decomposition studies; TGA-DSC hyphenated technique",
                "Differential Thermal Analysis (DTA) and Hot Stage Microscopy: applications in pharmaceutical solid-state characterisation; glass transition temperature determination",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "X-ray and Electron Microscopy", topics: [
                "X-ray powder diffractometry (XRPD): principle; Bragg's law; diffractometer design; identification of polymorphs, crystallinity determination; amorphous vs. crystalline fraction quantification",
                "Scanning Electron Microscopy (SEM): principle, instrumentation; sample preparation; morphology and particle size characterisation; SEM-EDX for elemental mapping of tablets",
                "Transmission Electron Microscopy (TEM): principle; sample preparation; application in characterisation of nanoparticles, liposomes, polymeric micelles",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Advanced Spectroscopic Techniques", topics: [
                "Nuclear Magnetic Resonance (NMR) spectroscopy: 1H and 13C NMR; 2D NMR techniques (COSY, HSQC, HMBC); structure elucidation of unknown compounds; pharmaceutical purity testing by quantitative NMR (qNMR)",
                "Raman spectroscopy: principle; differences from IR; pharmaceutical applications — polymorphism, counterfeit drug detection, in-line monitoring; confocal Raman microscopy",
                "NIR spectroscopy: principle; chemometric analysis; applications in non-destructive blend uniformity testing, moisture determination, active content prediction",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Separation Techniques", topics: [
                "Capillary electrophoresis (CE): principle; capillary zone electrophoresis (CZE); micellar electrokinetic chromatography (MEKC); pharmaceutical applications — chiral separation, peptide analysis",
                "Flow Injection Analysis (FIA): principle, manifold design; stopped-flow technique; pharmaceutical applications; sequential injection analysis (SIA)",
                "Gel filtration, ion exchange, affinity chromatography: principles and pharmaceutical applications — protein purification, molecular weight determination",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Hyphenated Techniques and Method Validation", topics: [
                "LC-MS and LC-MS/MS: principle; electrospray ionisation; triple quadrupole MS for quantitation (MRM mode); applications in impurity profiling, metabolite identification, bioequivalence studies",
                "GC-MS: EI fragmentation; NIST spectral library; pharmaceutical applications — residual solvents (ICH Q3C), essential oil analysis, volatile impurity profiling",
                "Analytical method validation as per ICH Q2(R1): parameters (specificity, linearity, range, accuracy, precision, LOD, LOQ, robustness); validation report preparation; transfer of analytical methods",
            ]
        },
    ]),

    s("BP705T", "Pharmacovigilance", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Introduction to Pharmacovigilance and Drug Safety", topics: [
                "Definition, objectives, and scope of pharmacovigilance; historical background: thalidomide disaster, chloramphenicol aplastic anaemia, fen-phen withdrawal — lessons learnt",
                "Drug-related problems and medication safety: medication errors, subtherapeutic dosing, drug-drug interactions; distinction between ADRs and medication errors",
                "Drug safety considerations in special populations: paediatrics (Reye's syndrome), geriatrics (Beers criteria), pregnancy (teratogenicity categories), renal/hepatic impairment",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Pharmacovigilance Systems and Regulatory Framework", topics: [
                "Objectives and functions of pharmacovigilance; WHO Uppsala Monitoring Centre (UMC) and VigiBase; international collaboration in drug safety monitoring",
                "Methods of pharmacovigilance data collection: spontaneous reporting, cohort event monitoring, prescription event monitoring, case-control surveillance, healthcare database analysis",
                "Regulatory framework: ICH E2A (expedited reporting), ICH E2C (PSURs), ICH E2D (post-approval safety reporting), ICH E2E (pharmacovigilance planning); EMA guidelines; FDA FAERS database",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Adverse Drug Reaction Classification and Signal Detection", topics: [
                "ADR classification: WHO classification (Type A-F); DoTS (Dose, Time course, Susceptibility) classification; causality assessment methods — WHO-UMC scale, Naranjo algorithm, Karch and Lasagna criteria",
                "Severity assessment: mild, moderate, severe, life-threatening (SAE definition); preventability assessment: Schumock and Thornton scale",
                "Signal detection methods: disproportionality analysis — PRR (Proportional Reporting Ratio), ROR (Reporting Odds Ratio), BCPNN; data mining in pharmacovigilance databases; online reporting mechanisms",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Risk Management and Vaccine Pharmacovigilance", topics: [
                "Risk management plans (RMP): structure and content; risk minimisation measures (routine and additional); REMS (Risk Evaluation and Mitigation Strategy) in USA; EU risk management system",
                "Drug labelling updates due to pharmacovigilance signals; Dear Healthcare Provider letters; market withdrawal decisions; communication of drug safety information",
                "Vaccine pharmacovigilance (vaccinovigilance): adverse events following immunization (AEFI) — classification (programmatic, vaccine-induced, coincidental); AEFI surveillance; Brighton Collaboration case definitions; COVID-19 vaccine safety monitoring",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Indian Pharmacovigilance Programme and Good Pharmacovigilance Practices", topics: [
                "Pharmacovigilance Programme of India (PvPI): structure, national coordination centre (IPC Ghaziabad), ADR monitoring centres (AMCs); Vigiflow reporting; PvPI achievements and publications",
                "ICH E2F Development Safety Update Reports (DSURs); Periodic Safety Update Reports (PSURs): structure, cumulative analysis, benefit-risk evaluation; signal management process",
                "Good Pharmacovigilance Practices (GVP) modules (EU): Module I (pharmacovigilance systems), Module VI (management and reporting of ADRs), Module IX (signal management); pharmacovigilance audit; role of pharmacist in PV",
            ]
        },
    ], true),
    s("BP706T", "Pharmacy Practice", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Clinical Pharmacy Services", topics: [
                "Clinical pharmacy practice: scope, functions; medication therapy management (MTM); medication reconciliation — admission, transfer, discharge; clinical pharmacy services in ICU, oncology, nephrology",
                "Medication adherence: definition, measurement methods (pill count, MEMS, Morisky scale, refill records); barriers to adherence; pharmacist-led adherence interventions",
                "Pharmaceutical care: concept (Hepler and Strand); drug therapy problems classification; care plan development; documentation",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Prescription Analysis and Medication Errors", topics: [
                "Prescription writing: components of a valid prescription; e-prescription standards; abbreviations and Latin terms; Schedule H, H1, X drugs prescription requirements",
                "Medication errors: definition, classification (prescribing, transcribing, dispensing, administration, monitoring errors); reporting systems (MedWatch, ISMP); root cause analysis",
                "Prevention strategies: LASA drug awareness, tall man lettering, barcode medication administration (BCMA), computerised physician order entry (CPOE)",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Patient Counselling and Communication", topics: [
                "Patient counselling: definition, types (initial counselling, re-counselling, self-care counselling); counselling checklist for new prescriptions; verbal and written communication techniques",
                "Medication guides and MedGuides; pictogram-based medication instruction; counselling for specific dosage forms (inhalers, eye drops, patches, insulin)",
                "Health literacy assessment; motivational interviewing in medication counselling; culturally competent pharmacy practice",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Hospital Pharmacy Management", topics: [
                "Hospital pharmacy organisation: structure, functions, DTC (Drug and Therapeutics Committee); formulary system — development, maintenance, therapeutic substitution",
                "Drug procurement and inventory management: ABC, VED, HML analysis; EOQ calculation; drug storage and distribution systems; ward pharmacy, satellite pharmacy, unit dose dispensing (UDD)",
                "Compounding in hospital pharmacy: extemporaneous preparation of oral liquids, topical formulations, parenteral nutrition; TPN preparation; cytotoxic drug reconstitution in isolator",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Drug Information Services", topics: [
                "Drug information centres (DIC): structure, staffing, objectives; evaluation of drug information requests; drug information retrieval (primary, secondary, tertiary sources)",
                "Evidence-based pharmacy practice: levels of evidence (GRADE system); systematic reviews; clinical practice guidelines; critical appraisal of pharmaceutical literature",
                "Pharmacist in collaborative practice: collaborative drug therapy management (CDTM); pharmacist prescribing models; immunisation services by pharmacists; medication use evaluation (MUE)",
            ]
        },
    ]),

    s("BP707T", "Regulatory Affairs", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Introduction to Drug Regulatory Agencies", topics: [
                "Drug regulatory agencies: CDSCO (India), USFDA (USA), EMA (Europe), TGA (Australia), Health Canada, PMDA (Japan), WHO prequalification programme",
                "Basic regulatory terminologies: guidance documents, guidelines, regulations, laws, acts; drug development regulatory milestones",
                "Regulatory reference resources: Orange Book (USFDA), Purple Book (biosimilars), EMA product databases; ICH guideline categories (Q, S, E, M guidelines)",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Indian Regulatory Framework and Approval Process", topics: [
                "CDSCO structure: Central Drug Standard Control Organization; Drug Controller General of India (DCGI); State Drug Authorities; zonal offices",
                "New drug approval in India: New Drugs and Clinical Trials Rules 2019; IND application (CTA in India); Phase I-III waiver conditions; fast-track designation; accelerated approval",
                "Generic drug approval: ANDA equivalent in India; bioequivalence requirements; biowaiver criteria (BCS-based); post-marketing surveillance obligations",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "CDSCO and International Regulatory Submissions", topics: [
                "Central Drugs Standard Control Organization (CDSCO): licensing authority roles; schedule of drugs requiring central licence (Schedule C, C1, X drugs); import registration",
                "USFDA NDA/ANDA process: 505(b)(1) full NDA, 505(b)(2) NDA (literature-based), 505(j) ANDA; user fees (PDUFA); priority review, breakthrough therapy, fast track, orphan drug designations",
                "EMA centralised, decentralised, mutual recognition, and national procedures; Marketing Authorisation Application (MAA) structure; CHMP review process",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Common Technical Document (CTD) Format", topics: [
                "CTD structure: Module 1 (regional administrative); Module 2 (summaries — QOS, NCA, NES, CNS); Module 3 (quality); Module 4 (non-clinical study reports); Module 5 (clinical study reports)",
                "eCTD (electronic CTD): specification, backbone, submission sequence; eCTD viewer tools; regional variations in CTD requirements",
                "Module 3 quality documentation: drug substance (S sections), drug product (P sections), appendices; QbD elements in Module 3; CTD formatting requirements",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Clinical Trials Regulation and Good Regulatory Practice", topics: [
                "Clinical trial regulations in India: Schedule Y; CTRI (Clinical Trial Registry India) mandatory registration; Ethics Committee accreditation; subject protection; safety reporting timelines (SUSAR, SAE)",
                "Post-marketing surveillance: Phase IV studies; post-authorisation safety and efficacy studies (PASS, PAES); risk management plans; variation management (major, minor, type I, type II); label updates",
                "Good Regulatory Practice (GRP): WHO-CDSCO-THSTI certification; GRP principles; regulatory filing quality; regulatory intelligence; interaction with regulatory agencies; regulatory strategy",
            ]
        },
    ], true),
    s("BP708T AEC", "AEC Elective (cGMP / Pharmaceutical Automation / Cellular Biology / Medical Devices / Food Waste Products / Biosimilars)", 1, "P", []),
    s("BP710RP", "Research Project (Major)", 6, "RP", [
        {
            num: "I", hours: "—", title: "Topic Selection and Literature Review", topics: [
                "Independent research under faculty supervisor; topic finalization aligned with current research gaps; comprehensive literature review using PubMed, Scopus, Web of Science, Google Scholar",
            ]
        },
        {
            num: "II", hours: "—", title: "Research Proposal and Methodology", topics: [
                "Research proposal preparation: background, objectives, hypothesis, methodology, statistical plan; IRB/IAEC submission if applicable; institutional approval",
            ]
        },
        {
            num: "III", hours: "—", title: "Data Collection and Experimentation", topics: [
                "Experimental work or data collection as per protocol; adherence to GLP; laboratory notebook maintenance; primary data recording and management",
            ]
        },
        {
            num: "IV", hours: "—", title: "Data Analysis and Interpretation", topics: [
                "Statistical analysis using appropriate software (SPSS, GraphPad Prism, R, Python); interpretation of results; comparison with published literature",
            ]
        },
        {
            num: "V", hours: "—", title: "Thesis Writing and Viva", topics: [
                "Thesis writing as per prescribed format; anti-plagiarism check (Turnitin); submission; final presentation and external viva examination; publication or conference presentation recommended",
            ]
        },
    ]),
];

// ─────────────────────────────────────────────────────────────
// SEMESTER VIII
// ─────────────────────────────────────────────────────────────
const SEM8: Subject[] = [
    s("BP801T", "Ethical Considerations and Translational Applications of AI in Pharmacy", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "AI Ethics and System Lifecycle in Healthcare", topics: [
                "Overview of AI system lifecycle in pharmacy: data collection, preprocessing, modelling, validation, deployment, monitoring, and decommissioning",
                "AI ethics fundamentals: algorithmic bias (sources, types, consequences); fairness metrics (demographic parity, equalized odds); transparency and accountability in healthcare AI",
                "Data privacy in AI: DPDPA (India), GDPR (EU), HIPAA (USA) — implications for health data used in AI; federated learning as a privacy-preserving approach",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Regulatory Frameworks for AI Medical Devices", topics: [
                "FDA guidance on AI/ML-based Software as a Medical Device (SaMD): risk classification; predetermined change control plan (PCCP); total product lifecycle (TPLC) approach",
                "EMA reflection paper on AI in medicine; CDSCO emerging guidance on AI-based medical devices; ISO 13485 and IEC 62304 for AI software in medical devices",
                "Explainable AI (XAI): concept, need for explainability in clinical decisions; LIME, SHAP explainability methods; interpretability vs. accuracy trade-off",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "AI in Pharmacy Automation and Supply Chain", topics: [
                "Overview of AI in automated dispensing systems: robotic dispensing, automated storage and retrieval; medication error reduction through AI",
                "AI in pharmaceutical supply chain: inventory prediction models, demand forecasting (ML-based), cold chain monitoring, counterfeit detection using computer vision",
                "Pharmacovigilance AI: AI-enhanced ADR detection from EHR data, social media, and spontaneous reports; NLP for case narrative processing; signal detection automation",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "AI in Public Health and Precision Medicine", topics: [
                "AI in public health: real-world data sources (EHR, insurance claims, surveillance systems); pharmacoepidemiology with ML; epidemic forecasting (COVID-19 AI applications)",
                "AI in pharmacogenomics and precision medicine: genotype-guided dosing; polygenic risk scores; AI integration with omics data (genomics, proteomics, metabolomics); digital biomarkers",
                "Students implement a supervised ML model (regression, logistic regression, or classification) using real-world pharmacy data from domains: formulation, PK, ADR detection, or drug repurposing",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Translational AI and Future Perspectives", topics: [
                "Translational AI: bench to bedside; challenges in translating AI research to clinical practice; real-world evidence validation; post-deployment monitoring of AI models",
                "Future of AI in pharmacy: autonomous AI for drug discovery (AlphaFold protein structure prediction); generative AI in molecule design; challenges of AI adoption in Indian pharma",
                "Professional competencies for AI-aware pharmacists: data literacy, critical appraisal of AI tools, ethical reasoning; continuing education requirements for clinical AI",
            ]
        },
    ], true),
    s("BP802T", "Clinical Pharmacotherapeutics", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Drug Therapy in Special Populations", topics: [
                "Paediatric pharmacotherapy: pharmacokinetic differences (absorption, distribution, metabolism, excretion); dosing methods (mg/kg, BSA, age-based rules — Young's, Clark's); off-label drug use; paediatric formulation challenges",
                "Geriatric pharmacotherapy: age-related PK/PD changes; polypharmacy assessment; Beers criteria; START/STOPP criteria; fall risk medications; dose adjustment in elderly",
                "Drug therapy in pregnancy and lactation: teratogen classification; risk-benefit assessment; drugs safe in pregnancy; breastfeeding safety (LactMed, Hale's Lactation Risk Categories)",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Pharmacotherapy of Cardiovascular Diseases", topics: [
                "Heart failure: pathophysiology; ACE inhibitors/ARBs, beta-blockers, aldosterone antagonists, diuretics, sacubitril/valsartan (ARNI) — evidence-based pharmacotherapy; pharmacist monitoring parameters",
                "Acute Coronary Syndrome (ACS): antiplatelet therapy (aspirin, clopidogrel, ticagrelor), anticoagulants, fibrinolytics, GP IIb/IIIa inhibitors; STEMI vs. NSTEMI management",
                "Dyslipidaemia: statin therapy (intensity-based dosing), ezetimibe, PCSK9 inhibitors, fibrates; cardiovascular risk calculators; monitoring and target LDL levels",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Pharmacotherapy of Endocrine and Metabolic Disorders", topics: [
                "Diabetes mellitus management: insulin regimens (basal-bolus, premixed); ADA/IDF glycaemic targets; algorithm-based selection of oral/injectable antidiabetics; hypoglycaemia management; sick-day rules",
                "Thyroid disorders: levothyroxine dosing and monitoring in hypothyroidism; antithyroid drug management of hyperthyroidism; thyroid crisis/myxoedema coma — emergency management",
                "Obesity pharmacotherapy: orlistat, GLP-1 agonists (semaglutide, liraglutide) in obesity; bariatric surgery and pharmacokinetic changes; metabolic syndrome management",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Pharmacotherapy of Infectious Diseases", topics: [
                "Sepsis and septic shock: Surviving Sepsis Campaign guidelines; antibiotic choice and de-escalation; pharmacokinetic/pharmacodynamic (PK/PD) optimisation of antibiotics in ICU (AUC/MIC, T>MIC, Cmax/MIC targets)",
                "Tuberculosis: RNTCP/NTEP treatment regimens (DOTS-Plus); anti-TB drug monitoring; management of MDR-TB and XDR-TB; pharmacovigilance of anti-TB drugs",
                "HIV pharmacotherapy: WHO preferred first-line ART regimens; adherence strategies; opportunistic infection prophylaxis; drug-drug interactions with ART",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Dosing in Renal and Hepatic Impairment", topics: [
                "Renal impairment: creatinine clearance calculation (Cockcroft-Gault); drug dose adjustment using GFR (Aronoff guidelines); drugs to avoid in renal failure; haemodialysis supplemental dosing",
                "Hepatic impairment: Child-Pugh and MELD scoring; impact on drug metabolism (CYP3A4 reduction, glucuronidation) and protein binding; dose reduction strategies; drugs contraindicated in liver disease",
                "Drug interactions in clinical practice: clinically significant PK and PD interactions; interaction severity classification; pharmacist interventions; use of drug interaction databases (Lexicomp, Micromedex, Medscape)",
            ]
        },
    ]),

    s("BP803T", "Industrial Pharmacy and Facility Design", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Industrial Pharmaceutical Manufacturing", topics: [
                "Industrial pharmaceutical manufacturing: batch vs. continuous manufacturing; manufacturing process design; scale-up considerations (mixing, heat transfer, granulation)",
                "Technology transfer: scale-up from lab to pilot to commercial batch; tech transfer protocol; process characterisation; comparability studies; manufacturing site changes under regulatory submissions",
                "Lean manufacturing: value stream mapping, waste elimination (7 wastes); Six Sigma in pharma manufacturing; OEE (Overall Equipment Effectiveness) calculation",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Facility Layout and Design", topics: [
                "Pharmaceutical facility design principles: zone classification (AHU zones), traffic flow (personnel, material, waste), cross-contamination prevention, unidirectional flow",
                "Clean room design: ISO classification (5-8); materials for construction (cGMP-compliant surfaces, coving); cleanroom monitoring plan (particle counts, microbial monitoring)",
                "Facility master plan: site selection criteria; segregation requirements for penicillin/cephalosporin/hormones/cytotoxics; biological safety levels",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "HVAC Systems and Clean Room Technology", topics: [
                "HVAC system components: Air Handling Units (AHU), HEPA filters (H13, H14), pre-filters, chilled water coils, supply and return air ducts, fan motor systems",
                "Pressure differentials and air change rates for different ISO classes; temperature and humidity control; smoke studies for airflow visualisation",
                "HVAC qualification: DQ, IQ, OQ, PQ of HVAC; re-qualification frequency; HVAC monitoring systems; WHO TRS 957 Annex 2 HVAC guidelines",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Equipment Qualification", topics: [
                "Qualification stages: User Requirement Specification (URS), Design Qualification (DQ), Installation Qualification (IQ), Operational Qualification (OQ), Performance Qualification (PQ)",
                "Calibration: traceability to national standards; calibration frequency; calibration certificates; out-of-calibration actions; 21 CFR Part 11 for computerised systems",
                "Critical equipment qualification examples: autoclave (steam sterilizer), depyrogenation tunnel, tablet press, capsule filler, freeze dryer — key qualification parameters and acceptance criteria",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Environmental and Safety Management", topics: [
                "Environmental monitoring programme: viable and non-viable particle monitoring; sampling locations, frequency, alert and action limits per EU GMP Annex 1 (2022 revision)",
                "Industrial safety in pharma: OSHA standards; hazard identification (HAZID, HAZOP); personal protective equipment (PPE); handling of cytotoxic, hormonal, highly potent API (HPAPI)",
                "Effluent treatment and waste management: pharmaceutical effluent treatment plant (ETP); biomedical waste rules; green pharmacy principles; sustainability in pharmaceutical manufacturing",
            ]
        },
    ]),
    s("BP804T", "Pharmaceutical Management", 2, "T", [
        {
            num: "I", hours: "6 Hours", title: "Principles of Management in Pharmaceutical Organisations", topics: [
                "Principles of management: POSDCORB (planning, organising, staffing, directing, coordinating, reporting, budgeting); Fayol's 14 principles applied to pharma organisations",
                "Organisational structures in pharma: functional, divisional, matrix, project-based; advantages and disadvantages; typical pharma company org chart",
                "Strategic management: SWOT analysis; Porter's five forces applied to pharmaceutical industry; business environment analysis; strategic planning for pharmaceutical companies",
            ]
        },
        {
            num: "II", hours: "6 Hours", title: "Human Resource Management in Pharma", topics: [
                "Recruitment and selection in pharmaceutical industry: job description preparation, sourcing channels, selection process (technical interviews, psychometric tests)",
                "Training and development: GMP training; skill gap analysis; training matrix; on-the-job vs. classroom training; e-learning in pharma; training record documentation",
                "Performance appraisal systems: KPI-based evaluation; 360-degree feedback; performance improvement plans; employee motivation theories (Maslow, Herzberg) applied to pharma workforce",
            ]
        },
        {
            num: "III", hours: "6 Hours", title: "Supply Chain and Inventory Management", topics: [
                "Pharmaceutical supply chain: procurement, warehousing, distribution, retail — structure and challenges; Good Distribution Practice (GDP)",
                "Inventory management techniques: ABC analysis (based on value), VED analysis (vital-essential-desirable), HML analysis (high-medium-low cost), SDE analysis (scarce-difficult-easy availability)",
                "EOQ (Economic Order Quantity) calculation; safety stock determination; just-in-time (JIT) inventory; FIFO and FEFO in pharmaceutical warehousing; serialisation and track-and-trace",
            ]
        },
        {
            num: "IV", hours: "6 Hours", title: "Pharmaceutical Marketing", topics: [
                "Pharmaceutical marketing: product life cycle management; pricing strategies in pharma (cost-based, value-based, penetration, skimming); pharma market segmentation",
                "Drug promotion: ethical vs. unethical promotion practices; WHO ethical criteria for medicinal drug promotion; MCI guidelines on pharma promotion to healthcare professionals",
                "Product launch strategies: pre-launch, launch, post-launch activities; key opinion leader (KOL) development; medical representative training; digital marketing in pharma",
            ]
        },
        {
            num: "V", hours: "6 Hours", title: "Pharmaceutical Entrepreneurship", topics: [
                "Entrepreneurship in pharmaceutical sector: opportunities in API manufacturing, CDMO, generic formulation, nutraceuticals, biotech start-ups, pharma SaaS",
                "Business plan preparation: executive summary, market analysis, product/service description, operational plan, financial projections; pharma business plan case studies",
                "Startup funding: bootstrapping, angel investment, venture capital, government grants (BIRAC, DST-NIDHI); IPO process; M&A (mergers and acquisitions) in pharmaceutical sector",
            ]
        },
    ]),

    s("BP805T", "Sterile Dosage Forms and Novel Drug Delivery System", 3, "T", [
        {
            num: "I", hours: "9 Hours", title: "Parenteral Products", topics: [
                "Parenteral formulations: large volume parenterals (LVP) — IV fluids, TPN; small volume parenterals (SVP) — injections, lyophilised products; routes (IV, IM, SC, intradermal)",
                "Water for injection (WFI): standards, production (distillation, membrane technology), storage, quality testing (TOC, conductivity, bacterial endotoxins, microbial limit tests)",
                "Parenteral formulation: vehicles (water, non-aqueous: oils, propylene glycol); tonicity adjustment; pH adjustment and buffer systems; antioxidants; antimicrobial preservatives; chelating agents",
            ]
        },
        {
            num: "II", hours: "9 Hours", title: "Sterile Manufacturing and Quality Control", topics: [
                "Aseptic manufacturing: EU GMP Annex 1 (2022) requirements; cleanroom classification; aseptic processing simulation (media fills); laminar airflow workstations (LAFW) and isolators; RABS (Restricted Access Barrier System)",
                "Terminal sterilisation: moist heat (F0 calculation); dry heat depyrogenation (FH value); radiation; filtration sterilisation — 0.22 μm membrane; SAL (10-6) requirements",
                "Quality control of sterile products: sterility testing (USP <71>); particulate matter testing (visual inspection, HIAC); container closure integrity testing (CCIT); endotoxin testing (LAL)",
            ]
        },
        {
            num: "III", hours: "9 Hours", title: "Nanoparticulate Drug Delivery Systems", topics: [
                "Polymeric nanoparticles: PLGA, PLA, PCL nanoparticles — preparation (nanoprecipitation, emulsion-solvent evaporation), characterisation (DLS, TEM, DSC), drug loading and release",
                "Dendrimers: structure (core, branching units, surface groups); PAMAM dendrimers; drug loading (encapsulation, surface conjugation); pharmaceutical applications in anticancer drug delivery",
                "Carbon nanotubes and graphene-based drug delivery: functionalisation, biocompatibility issues, drug loading mechanisms; regulatory challenges for nanomedicine",
            ]
        },
        {
            num: "IV", hours: "9 Hours", title: "Biopolymers and Smart Drug Delivery", topics: [
                "Hydrogels: classification (physical/chemical crosslinking, natural/synthetic); stimuli-responsive hydrogels — pH-responsive, thermosensitive (PNIPAM), redox-responsive; applications in sustained release",
                "Microspheres and microcapsules: PLGA microspheres by double emulsion-solvent evaporation; poly-lactic acid (PLA) microspheres; microencapsulation of hormones, proteins, vaccines",
                "Albumin nanoparticles, chitosan nanoparticles: preparation, surface modification; mucoadhesive systems; gene delivery vectors (lipoplexes, polyplexes)",
            ]
        },
        {
            num: "V", hours: "9 Hours", title: "Regulatory Requirements for Sterile and NDDS Products", topics: [
                "Regulatory requirements for sterile products: ICH Q2 (analytical), ICH Q3 (impurities), ICH Q6A (specifications), ICH Q8 (pharmaceutical development) as applied to parenteral products",
                "Regulatory pathway for nanomedicines: FDA guidance for industry on drug products containing nanomaterials; EMA reflection paper on nanomedicines; characterisation requirements; non-clinical safety studies",
                "CTD sections for sterile and NDDS products: Module 3 structure for sterile injectables; ICH Q8 design space for aseptic process; Module 4 non-clinical safety data requirements for novel delivery systems",
            ]
        },
    ]),
    s("BP806T AEC", "AEC Elective (Pharma Packaging / Supply Chain / Industrial Safety / Traditional Healing / AR-VR Pharma 4.0 / Herbal Cosmetics)", 2, "P", []),
    s("BP807P + BP808P", "Practicals — Pharmaceutical Marketing Skills + Sterile Dosage Forms + VAC Elective", 3, "P", []),
    s("BP810RP", "Research Project (Final Submission)", 6, "RP", [
        {
            num: "I", hours: "—", title: "Continuation and Completion of Research", topics: [
                "Continuation and completion of Semester VII research project; final data collection, analysis, and validation of results",
            ]
        },
        {
            num: "II", hours: "—", title: "Thesis Submission", topics: [
                "Final data analysis; statistical validation; comprehensive discussion and conclusions; thesis hard-binding and submission as per university norms",
            ]
        },
        {
            num: "III", hours: "—", title: "External Examination", topics: [
                "External examination board viva — research defence; evaluation by external and internal examiners",
            ]
        },
        {
            num: "IV", hours: "—", title: "Publication and Dissemination", topics: [
                "Publication in indexed journal (Scopus/Web of Science) or conference presentation strongly recommended; poster and oral presentation skills",
            ]
        },
        {
            num: "V", hours: "—", title: "Project Outcomes", topics: [
                "Final grading based on thesis quality, viva performance, and publication/presentation; award of degree upon successful completion",
            ]
        },
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
