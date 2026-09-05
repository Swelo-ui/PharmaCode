import 'pharma_knowledge_service.dart';
import 'pharma_prompt_templates.dart';
import 'web_search_service.dart';

/// Intelligent academic concept synthesizer for PCI B.Pharm NEP 2020 curriculum.
/// Ensures students receive comprehensive, deeply accurate explanations of pharmacy
/// concepts in clear Hinglish/English, with syllabus links cleanly placed under suggestions.
class PharmaConceptSynthesizer {
  /// Check if query asks about the AI assistant's identity or capabilities
  static bool isIdentityQuery(String query) {
    final lower = query.trim().toLowerCase();
    final pattern = RegExp(
      r'\b(who are you|who r u|what is your name|who made you|who created you|what can you do|what are your features|tum kaun ho|aap kaun ho|kya kar sakte ho|introduce yourself|tell me about yourself|your identity|bot identity)\b',
      caseSensitive: false,
    );
    return pattern.hasMatch(lower);
  }

  /// Official PharmaLearn AI Persona Introduction
  static String getPersonaIntroduction() {
    return '''### PharmaLearn AI (PharmaCode)

Main **PharmaLearn AI** hoon — PharmaCode ka official pharmacy academic mentor aur tutor!

Mera mission B.Pharm aur allied pharmacy students ko PCI NEP 2020 syllabus ke according padhana, doubts clear karna aur university exams va GPAT/NIPER ke liye prepare karana hai.

**Main aapki in areas me help kar sakta hoon:**
- **Core Concepts & Mechanisms**: Pharmacology (Receptors, GPCR, MOA), Pharmaceutics (Formulation, Tablet defects, NDDS), Medicinal Chemistry (SAR), Pharmacognosy aur Biopharmaceutics.
- **Formulas & Calculations**: Bioavailability (\$F\$), Pharmacokinetics (\$C_{max}, t_{1/2}, V_d, Cl\$), Henderson-Hasselbalch equation aur Noyes-Whitney dissolution rate.
- **University Exam Preparation**: 2-Mark, 5-Mark aur 10-Mark questions ka structured format (Definition, Classification, MOA, Clinical Pointers).
- **Pharma Industry Careers**: Pharmacovigilance (ICSR, MedDRA), Regulatory Affairs (eCTD dossiers), aur QA/QC.
- **Bilingual Hinglish & English**: Kisi bhi complex concept ko easy Hinglish ya formal English me samajhna.

Aap abhi koi bhi question pooch sakte hain, jaise: *"Tell me about bioavailability"*, *"Blood ki definition kya hai?"*, ya *"New drugs names batao"*!''';
  }

  /// Comprehensive concept answer synthesizer
  static String synthesizeAnswer({
    required String query,
    required PharmaChatMode mode,
    required PharmaKnowledgeContext ctx,
    List<SearchResultItem> citations = const [],
  }) {
    final lower = query.toLowerCase();

    // 1. Check Identity Queries
    if (isIdentityQuery(lower)) {
      return getPersonaIntroduction();
    }

    // 2. Specialized Master Academic Concept Handlers
    String? conceptBody;

    if (_matchesBlood(lower)) {
      conceptBody = _getBloodExplanation();
    } else if (_matchesNewDrugs(lower)) {
      conceptBody = _getNewDrugsExplanation();
    } else if (_matchesBioavailability(lower)) {
      conceptBody = _getBioavailabilityExplanation();
    } else if (_matchesTabletDefects(lower)) {
      conceptBody = _getTabletDefectsExplanation();
    } else if (_matchesPharmacokinetics(lower)) {
      conceptBody = _getPharmacokineticsExplanation();
    } else if (_matchesGpcrOrReceptors(lower)) {
      conceptBody = _getGpcrExplanation();
    } else if (_matchesAutonomicNervousSystem(lower)) {
      conceptBody = _getAnsExplanation();
    } else if (_matchesAntibiotics(lower)) {
      conceptBody = _getAntibioticsExplanation();
    } else if (_matchesPharmacovigilance(lower)) {
      conceptBody = _getPvExplanation();
    } else if (_matchesIchOrStability(lower)) {
      conceptBody = _getIchStabilityExplanation();
    } else if (_matchesChromatography(lower)) {
      conceptBody = _getChromatographyExplanation();
    } else if (_matchesSterilization(lower)) {
      conceptBody = _getSterilizationExplanation();
    } else if (_matchesBcsClassification(lower)) {
      conceptBody = _getBcsExplanation();
    } else if (_matchesNdds(lower)) {
      conceptBody = _getNddsExplanation();
    } else if (_matchesDosageForms(lower)) {
      conceptBody = _getDosageFormsExplanation();
    } else if (_matchesDrugsAct(lower)) {
      conceptBody = _getDrugsActExplanation();
    }

    final buffer = StringBuffer();

    if (conceptBody != null) {
      buffer.writeln(conceptBody);
    } else {
      // General Pharmacy Concept synthesis using in-app knowledge base and web citations
      buffer.writeln(_synthesizeGeneralPharmacyAnswer(query, ctx, mode, citations));
    }

    // Always append In-App Syllabus & Study Links cleanly at the bottom as suggestions
    final suggestions = _buildSuggestedStudyLinks(ctx);
    if (suggestions.isNotEmpty) {
      buffer.writeln('\n---\n$suggestions');
    }

    return buffer.toString().trim();
  }

  // --- Concept Matchers ---

  static bool _matchesBlood(String q) =>
      q.contains('blood') ||
      q.contains('khoon') ||
      q.contains('erythrocyte') ||
      q.contains('leukocyte') ||
      q.contains('rbc') ||
      q.contains('wbc') ||
      q.contains('platelet') ||
      q.contains('hemoglobin') ||
      q.contains('haemoglobin') ||
      q.contains('hematolog') ||
      q.contains('plasma');

  static bool _matchesNewDrugs(String q) =>
      q.contains('new drug') ||
      q.contains('recent drug') ||
      q.contains('latest drug') ||
      q.contains('nayi dawa') ||
      q.contains('drugs name') ||
      q.contains('drug name') ||
      q.contains('fda approval') ||
      q.contains('cdsco approval');

  static bool _matchesBioavailability(String q) =>
      q.contains('bioavailab') || q.contains('bioequivalence') || q.contains('bio-availability');

  static bool _matchesTabletDefects(String q) =>
      q.contains('capping') ||
      q.contains('lamination') ||
      q.contains('tablet defect') ||
      q.contains('mottling') ||
      q.contains('picking') ||
      q.contains('sticking');

  static bool _matchesPharmacokinetics(String q) =>
      q.contains('adme') ||
      q.contains('pharmacokinetic') ||
      q.contains('half life') ||
      q.contains('volume of distribution') ||
      q.contains('clearance') ||
      q.contains('first pass');

  static bool _matchesGpcrOrReceptors(String q) =>
      q.contains('gpcr') ||
      q.contains('g-protein') ||
      q.contains('second messenger') ||
      q.contains('adenylyl cyclase') ||
      q.contains('phospholipase c');

  static bool _matchesAutonomicNervousSystem(String q) =>
      q.contains('sympathetic') ||
      q.contains('parasympathetic') ||
      q.contains('autonomic') ||
      q.contains('adrenergic') ||
      q.contains('cholinergic') ||
      q.contains('muscarinic') ||
      q.contains('nicotinic');

  static bool _matchesAntibiotics(String q) =>
      q.contains('antibiotic') ||
      q.contains('antimicrobial') ||
      q.contains('penicillin') ||
      q.contains('beta lactam') ||
      q.contains('cephalosporin') ||
      q.contains('aminoglycoside');

  static bool _matchesPharmacovigilance(String q) =>
      q.contains('pharmacovigilance') ||
      q.contains('icsr') ||
      q.contains('meddra') ||
      q.contains('adverse drug reaction') ||
      q.contains('pvpi') ||
      q.contains('yellow card');

  static bool _matchesIchOrStability(String q) =>
      q.contains('ich') ||
      q.contains('stability testing') ||
      q.contains('q1a') ||
      q.contains('climatic zone') ||
      q.contains('accelerated stability');

  static bool _matchesChromatography(String q) =>
      q.contains('hplc') ||
      q.contains('chromatograph') ||
      q.contains('tlc') ||
      q.contains('retention time') ||
      q.contains('rf value') ||
      q.contains('spectroscopy');

  static bool _matchesSterilization(String q) =>
      q.contains('steriliz') ||
      q.contains('autoclave') ||
      q.contains('pyrogen') ||
      q.contains('endotoxin') ||
      q.contains('lal test') ||
      q.contains('hot air oven');

  static bool _matchesBcsClassification(String q) =>
      q.contains('bcs') ||
      q.contains('biopharmaceutics classification');

  static bool _matchesNdds(String q) =>
      q.contains('ndds') ||
      q.contains('liposome') ||
      q.contains('nanoparticle') ||
      q.contains('transdermal') ||
      q.contains('novel drug delivery') ||
      q.contains('sustained release');

  static bool _matchesDosageForms(String q) =>
      q.contains('dosage form') ||
      q.contains('suspension') ||
      q.contains('emulsion') ||
      q.contains('ointment') ||
      q.contains('suppository') ||
      q.contains('parenteral');

  static bool _matchesDrugsAct(String q) =>
      q.contains('drugs and cosmetics act') ||
      q.contains('schedule m') ||
      q.contains('schedule y') ||
      q.contains('schedule h') ||
      q.contains('schedule x') ||
      q.contains('pharmacy act');

  // --- Master Concept Explanations ---

  static String _getBloodExplanation() {
    return '''### Blood: Definition, Composition & Physiological Functions (PCI B.Pharm HAP BP101T)

**Blood** is a specialized **fluid connective tissue** that circulates through the cardiovascular system (heart, arteries, veins, and capillaries). In an average healthy adult, blood volume is approximately **5 to 6 liters** (accounting for ~7% to 8% of total body weight), with a normal physiological pH range of **7.35 to 7.45** (slightly alkaline) and a specific gravity of 1.050 to 1.060.

---

### 1. Composition of Blood
Blood consists of two main fractions: **Fluid Plasma (~55%)** and **Formed Cellular Elements (~45%)**:

#### A. Blood Plasma (55% by Volume)
Plasma is a straw-colored liquid consisting of:
- **Water (90-92%)**: Serves as the primary biological solvent.
- **Plasma Proteins (7-8%)**:
  - **Albumin (4.5 g/dL)**: Synthesized by the liver; provides 75-80% of plasma colloid osmotic (oncotic) pressure (~25 mmHg) to prevent tissue edema. Also acts as the main transport carrier for acidic drugs (e.g., Warfarin, NSAIDs).
  - **Globulins (alpha, beta, gamma - 2.5 g/dL)**: Alpha and beta transport lipids and minerals; **Gamma globulins (Immunoglobulins IgG, IgM, IgA, IgE, IgD)** provide humoral immunity.
  - **Fibrinogen & Prothrombin (0.3 g/dL)**: Essential clotting factors synthesized in the liver (dependent on Vitamin K).
- **Other Solutes (1-2%)**: Electrolytes (\$Na^+, K^+, Ca^{2+}, Cl^-, HCO_3^-\$), nutrients (glucose, amino acids), and metabolic waste products (urea, creatinine).

#### B. Formed Cellular Elements (45% by Volume)
1. **Erythrocytes (Red Blood Cells - RBCs)**:
   - **Count**: 4.5 to 5.5 million/mm³ (higher in males than females).
   - **Structure**: Circular, biconcave, non-nucleated discs (diameter ~7.2 µm). The biconcave shape maximizes surface-area-to-volume ratio for rapid gas exchange.
   - **Hemoglobin Content**: 12 to 16 g/dL. Each hemoglobin tetramer contains 4 heme groups with ferrous iron (\$Fe^{2+}\$), binding up to 4 oxygen molecules (\$Hb + 4O_2 \\leftrightarrow Hb(O_2)_4\$).
   - **Lifespan**: ~120 days. Produced via **erythropoiesis** in red bone marrow stimulated by renal erythropoietin (EPO).
2. **Leukocytes (White Blood Cells - WBCs)**:
   - **Total Count**: 4,000 to 11,000/mm³. Body's active defense against pathogens.
   - **Granulocytes**:
     - *Neutrophils (60-70%)*: Primary phagocytes against acute bacterial infections.
     - *Eosinophils (1-4%)*: Defense against parasitic infections and allergic reactions; contain histaminase.
     - *Basophils (0.5-1%)*: Release histamine, heparin, and serotonin in hypersensitivity responses.
   - **Agranulocytes**:
     - *Lymphocytes (20-30%)*: B-cells (humoral antibody production) and T-cells (cell-mediated immunity, CD4 helper / CD8 cytotoxic).
     - *Monocytes (2-8%)*: Transform into tissue macrophages (e.g., Kupffer cells in liver, microglia in CNS) for phagocytosis and antigen presentation.
3. **Thrombocytes (Platelets)**:
   - **Count**: 1.5 to 4.5 lakh/mm³ (150,000 - 450,000/µL).
   - **Function**: Cell fragments derived from megakaryocytes in bone marrow; crucial for primary hemostasis, platelet plug formation, and clotting activation. Lifespan: 7-10 days.

---

### 2. Core Physiological Functions of Blood
1. **Transport**: Transports \$O_2\$ from lungs to tissues and \$CO_2\$ from tissues to lungs. Delivers absorbed nutrients (glucose, amino acids, lipids) and carries metabolic waste to kidneys and liver.
2. **Homeostasis & Regulation**: Regulates body temperature via vasodilation/vasoconstriction and maintains acid-base balance via the carbonic acid-bicarbonate buffer system (\$\\text{H}_2\\text{CO}_3 / \\text{HCO}_3^-\$).
3. **Immune Protection**: Leukocytes, antibodies, and complement system destroy invasive microorganisms and neutralize toxins.
4. **Hemostasis**: Clotting cascade (13 factors: Extrinsic Tissue Factor pathway and Intrinsic contact pathway converging on Factor X to convert Prothrombin to Thrombin, polymerizing Fibrinogen into a stable Fibrin mesh).

---

### 3. Blood Grouping (ABO & Rh System)
- **ABO System**: Determined by the presence or absence of Antigen A and Antigen B on the erythrocyte surface.
  - Type A (Antigen A, Anti-B antibodies).
  - Type B (Antigen B, Anti-A antibodies).
  - Type AB (Both A & B antigens, No antibodies) -> **Universal Recipient**.
  - Type O (Neither A nor B antigen, Both Anti-A & Anti-B antibodies) -> **Universal Donor**.
- **Rh System**: Presence of D-antigen makes blood Rh-positive (\$Rh^+\$); absence makes it Rh-negative (\$Rh^-\$). Clinically crucial in erythroblastosis fetalis (hemolytic disease of the newborn).

---

### 4. Saral Hinglish Summary (Quick Revision)
*Aasan bhasha mein:*
Blood hamare sharir ka ek fluid connective tissue hai jo pure body mein oxygen, nutrients, aur hormones circulate karta hai. Isme do main hisse hote hain:
1. **Plasma (55%)**: Pani aur proteins (Albumin, Globulin, Fibrinogen).
2. **Blood Cells (45%)**: **RBC** (jo hemoglobin ke zariye oxygen transport karte hain), **WBC** (jo infection aur bimariyon se ladte hain), aur **Platelets** (jo chot lagne par blood clotting karke bleeding rokte hain).''';
  }

  static String _getNewDrugsExplanation() {
    return '''### Recent High-Impact New Drugs & FDA/CDSCO Approvals (PCI B.Pharm Pharmacology & Regulatory Affairs)

In modern pharmaceutical sciences, new drugs are discovered, evaluated through preclinical and Phase I-IV clinical trials under IND (Investigational New Drug), and approved via NDA (New Drug Application) or BLA (Biologics License Application) by global regulatory bodies like the USFDA, EMA, and CDSCO (India).

---

### 1. Major Recently Approved Breakthrough Drugs
Here are the most significant new molecules and biological therapeutics approved in recent years:

1. **Tirzepatide (Brand names: Mounjaro / Zepbound)**:
   - **Drug Class**: Dual GIP (Glucose-dependent insulinotropic polypeptide) and GLP-1 (Glucagon-like peptide-1) receptor agonist.
   - **Clinical Indication**: Type 2 Diabetes Mellitus and Chronic Weight Management (Obesity).
   - **Significance**: First-in-class dual incretin mimetic showing superior glycemic control and up to 20-25% body weight reduction.
2. **Donanemab (Brand name: Kisunla) & Lecanemab (Brand name: Leqembi)**:
   - **Drug Class**: Recombinant humanized IgG1 monoclonal antibodies targeting brain Amyloid-beta (\$A\\beta\$) fibrils and plaques.
   - **Clinical Indication**: Early Alzheimer's Disease (Mild Cognitive Impairment).
   - **Significance**: True disease-modifying therapies that slow down cognitive decline by clearing accumulated amyloid plaque burden from brain tissue.
3. **Capivasertib (Brand name: Truqap)**:
   - **Drug Class**: Potent, selective pan-AKT kinase inhibitor (targeting AKT1, AKT2, AKT3 isoforms).
   - **Clinical Indication**: Locally advanced or metastatic HR-positive, HER2-negative breast cancer with PIK3CA, AKT1, or PTEN biomarker alterations.
   - **Significance**: Targets the hyperactivated PI3K/AKT signaling pathway responsible for endocrine resistance in oncology.
4. **Omaveloxolone (Brand name: Skyclarys)**:
   - **Drug Class**: Synthetic triterpenoid; Nrf2 (Nuclear factor erythroid 2-related factor 2) activator.
   - **Clinical Indication**: Friedreich's Ataxia (for adults and adolescents aged 16+).
   - **Significance**: First FDA-approved therapy for this hereditary neurodegenerative disease; restores mitochondrial redox balance.
5. **Efgartigimod alfa (Brand name: Vyvgart)**:
   - **Drug Class**: Neonatal Fc Receptor (FcRn) blocker (engineered human IgG1 Fc fragment).
   - **Clinical Indication**: Generalized Myasthenia Gravis (gMG) in AChR antibody-positive patients.
   - **Significance**: Accelerates the catabolism and clearance of pathogenic IgG autoantibodies from circulation.
6. **Resmetirom (Brand name: Rezdiffra)**:
   - **Drug Class**: Selective Thyroid Hormone Receptor-beta (THR-\$\\beta\$) agonist.
   - **Clinical Indication**: Non-Alcoholic Steatohepatitis (NASH / MASH) with moderate to advanced liver fibrosis.
   - **Significance**: First medication ever approved by the USFDA for liver fibrosis in NASH.
7. **Aprocitentan (Brand name: Tryvio)**:
   - **Drug Class**: Dual Endothelin Receptor Antagonist (\$ET_A / ET_B\$).
   - **Clinical Indication**: Resistant Hypertension in combination with standard triple therapy (ACEi/ARB + CCB + Diuretic).

---

### 2. Nomenclature & Classification Rules for New Drugs
Notice the standardized USAN (United States Adopted Names) stems used in modern drug naming:
- **-mab**: Monoclonal Antibody (e.g., Donane**mab**, Lecane**mab**, Pembrorolizu**mab**).
- **-nib**: Kinase Inhibitor (e.g., Capivaser**tib**, Ibruti**nib**, Erloti**nib**).
- **-tide**: Peptide agonist (e.g., Tirzepa**tide**, Semaglu**tide**).
- **-cept**: Receptor fusion protein (e.g., Etaner**cept**, Afliber**cept**).

---

### 3. The New Drug Approval Pipeline (USFDA & CDSCO)
- **Preclinical**: Target validation, in vitro screening, animal toxicity (GLP compliance).
- **IND (Investigational New Drug)**: Filed to get permission for human clinical trials.
- **Phase I**: Safety, tolerability, PK/PD in 20-100 healthy volunteers.
- **Phase II**: Dose-ranging and efficacy in 100-300 patient volunteers.
- **Phase III**: Pivotal, multi-center, double-blind RCTs in 1,000-3,000+ patients.
- **NDA / BLA**: Final dossier submitted to FDA/CDSCO for market approval.
- **Phase IV**: Post-marketing safety surveillance (Pharmacovigilance / PvPI).''';
  }

  static String _getBioavailabilityExplanation() {
    return '''### Bioavailability & Bioequivalence (PCI B.Pharm NEP 2020)

**Bioavailability (F)** is defined as the **rate and extent** to which the active drug moiety is absorbed from a pharmaceutical dosage form and reaches systemic blood circulation in an unchanged, active state.

---

### 1. Mathematical Formulas
- **Absolute Bioavailability (F):**
  Compares oral (or extravascular) absorption against direct intravenous (IV) administration where bioavailability is 100% (F = 1.0):
  \\[
  F = \\frac{AUC_{oral} \\times Dose_{IV}}{AUC_{IV} \\times Dose_{oral}} \\times 100
  \\]
- **Relative Bioavailability (F_rel):**
  Compares a generic test formulation with an innovator reference brand:
  \\[
  F_{rel} = \\frac{AUC_{test} \\times Dose_{ref}}{AUC_{ref} \\times Dose_{test}} \\times 100
  \\]
*(Note: AUC = Area Under the Plasma Drug Concentration-Time Curve).*

---

### 2. Key Factors Influencing Bioavailability
1. **Physicochemical Properties:**
   - **Solubility and Dissolution Rate**: As per the Noyes-Whitney equation, poorly soluble drugs (BCS Class II and IV) have dissolution as the rate-limiting step.
   - **Particle Size & Polymorphism**: Micronization increases effective surface area, improving dissolution. Amorphous forms possess higher solubility than crystalline forms.
   - **pKa and Lipophilicity (pH Partition Theory)**: Non-ionized lipophilic drugs cross gastrointestinal lipid membranes via passive diffusion much faster.
2. **Biological & Physiological Factors:**
   - **First-Pass Hepatic Metabolism**: Drugs absorbed from the GI tract travel via the portal vein to the liver where enzymes (e.g., CYP3A4) may metabolize a significant fraction before reaching general circulation (e.g., Propranolol, Nitroglycerin).
   - **Gastric Emptying & Intestinal Motility**: Rapid gastric emptying speeds up absorption for drugs absorbed in the small intestine.
   - **Efflux Transporters (P-Glycoprotein)**: P-gp pumps certain drugs back into the intestinal lumen, reducing systemic bioavailability.
3. **Pharmaceutical Formulation Factors:**
   - Dosage form hierarchy: **Solutions > Suspensions > Capsules > Tablets > Coated Tablets**.
   - Disintegrants and binders directly modulate granule breakdown and dissolution time.

---

### 3. Bioequivalence (BE) & Clinical Importance
- Two drug formulations are considered **bioequivalent** if their rates and extents of absorption show no significant difference under identical conditions (90% Confidence Interval of geometric mean ratio between **80.00% and 125.00%**).
- Critical for narrow therapeutic index drugs (Digoxin, Lithium, Theophylline, Warfarin) where minor bioavailability differences cause toxicity or therapeutic failure.

---

### 4. Saral Hinglish Summary (For Rapid Understanding)
*Aasan bhasha mein samjhein:*
Agar aapne 100 mg paracetamol tablet orally khayi aur liver/gut metabolism ke baad sirf 80 mg drug blood circulation me pahunchi, toh us tablet ki bioavailability **80%** hui. IV injection sidha vein me diya jata hai, isliye IV route ki bioavailability hamesha **100% (F = 1.0)** hoti hai.''';
  }

  static String _getTabletDefectsExplanation() {
    return '''### Tablet Compression Defects & Remedies (PCI B.Pharm NEP 2020)

Tablet manufacturing defects occur during compression due to improper formulation parameters, excessive moisture, granulation issues, or tooling wear.

---

### 1. Capping and Lamination
- **Capping**: The partial or complete separation of the top or bottom crown of a tablet from the main body.
- **Lamination**: Separation of a tablet into two or more distinct horizontal layers.
- **Causes**:
  - Air entrapment in granule voids during rapid compression.
  - Excess fine powder ('fines' > 15-20%) in granules.
  - Very dry granules (lack of optimum moisture, < 1%).
  - Deep concave punches or worn die bores.
- **Remedies**:
  - Use pre-compression stage on rotary tablet presses.
  - Reduce compression speed to allow air release.
  - Add optimum binder or adjust granule moisture (2-4%).
  - Use tapered dies and replace worn tooling.

---

### 2. Sticking and Picking
- **Sticking**: Granule formulation adhering to the die wall.
- **Picking**: Material adhering specifically to punch face engravings or letters, creating pitted tablets.
- **Causes**: High moisture content, inadequate lubrication, scratch marks on punch tips.
- **Remedies**: Increase lubricant (e.g., Magnesium Stearate 0.5-1%), dry granules thoroughly, polish punch faces with chromium plating.

---

### 3. Mottling
- **Definition**: Unequal, non-uniform distribution of color on tablet surfaces (patches of light and dark spots).
- **Causes**: Migration of soluble dye to granule surfaces during drying, improper dye mixing.
- **Remedies**: Dry granules at lower temperatures, change solvent system, or use microcrystalline color lakes.

---

### 4. Chipping, Binding, and Weight Variation
- **Chipping**: Breaking of tablet edges due to worn punches or very dry granules.
- **Binding**: High friction in die cavities causing tablets to stick and eject with high force.
- **Weight Variation**: Unequal die fill caused by poor granule flowability (Carr's index > 25%, Hausner ratio > 1.25) or segregation of fines.''';
  }

  static String _getPharmacokineticsExplanation() {
    return '''### Pharmacokinetics (ADME) Overview (PCI B.Pharm NEP 2020)

**Pharmacokinetics** is what the body does to the drug (**ADME**: Absorption, Distribution, Metabolism, and Excretion).

---

### 1. ADME Stages
1. **Absorption**: Transfer of drug from administration site to systemic circulation.
   - Governing mechanisms: Passive diffusion (Fick's Law), active transport, facilitated transport, and endocytosis.
   - Governed by pH-partition hypothesis and pKa of drug molecules.
2. **Distribution**: Reversible transfer between blood and extravascular tissues.
   - **Apparent Volume of Distribution (Vd)**:
     \\[
     V_d = \\frac{Total\\ Amount\\ of\\ Drug\\ in\\ Body}{Plasma\\ Drug\\ Concentration\\ (C_p)}
     \\]
   - High Vd indicates extensive tissue storage (e.g., Chloroquine); low Vd indicates confinement to vascular compartment (e.g., Warfarin).
   - Plasma protein binding: Albumin binds acidic drugs; Alpha-1-acid glycoprotein binds basic drugs.
3. **Metabolism (Biotransformation)**: Enzymatic conversion into polar, excretable metabolites.
   - **Phase I (Functionalization)**: Oxidation, Reduction, Hydrolysis (primarily mediated by Cytochrome P450 isoenzymes CYP3A4, CYP2D6).
   - **Phase II (Conjugation)**: Glucuronidation (UGT), Sulfation, Glutathione conjugation, Acetylation.
4. **Excretion**: Irreversible removal of drug from the body.
   - Primary route: Renal excretion (Glomerular filtration + Active tubular secretion - Tubular reabsorption).
   - Secondary routes: Biliary/fecal excretion (enterohepatic cycling), pulmonary, and sweat/breast milk.

---

### 2. Fundamental Kinetic Parameters
- **Elimination Half-life (t_1/2)**: Time required for plasma concentration to decrease by 50%:
  \\[
  t_{1/2} = \\frac{0.693}{k_e} = \\frac{0.693 \\times V_d}{Cl}
  \\]
- **Steady State Concentration (Css)**: Reached after **4 to 5 half-lives** during continuous infusion or fixed dosing intervals.
- **Clearance (Cl)**: Volume of plasma cleared of drug per unit time (\$Cl = V_d \\times k_e\$).''';
  }

  static String _getGpcrExplanation() {
    return '''### G-Protein Coupled Receptors (GPCR) Signaling (PCI B.Pharm NEP 2020)

**GPCRs (Metabotropic Receptors)** constitute the largest superfamily of cell-surface receptors, characterized by **7 transmembrane (7TM) alpha-helical domains** (Serpentine receptors).

---

### 1. Structural Architecture
- Extracellular N-terminus with ligand-binding pocket.
- 7 transmembrane spanning hydrophobic helices connected by 3 extracellular and 3 intracellular loops.
- Intracellular C-terminus interacting with heterotrimeric G-protein complex (composed of **alpha**, **beta**, and **gamma** subunits).

---

### 2. Three Major Signaling Pathways
1. **Gs Pathway (Stimulatory)**:
   - Ligand binds -> GDP swapped for GTP on alpha_s -> alpha_s activates **Adenylyl Cyclase (AC)**.
   - AC converts ATP into **cyclic AMP (cAMP)** -> cAMP activates **Protein Kinase A (PKA)**.
   - PKA phosphorylates target cellular enzymes/transcription factors (CREB).
   - *Examples*: Beta-1 adrenergic (heart rate increases), Beta-2 adrenergic (bronchodilation), Glucagon receptors.
2. **Gi Pathway (Inhibitory)**:
   - Alpha_i inhibits Adenylyl Cyclase -> **Decreases intracellular cAMP levels**.
   - Opens inward rectifier K+ channels and closes Ca2+ channels -> membrane hyperpolarization.
   - *Examples*: Alpha-2 adrenergic receptors, Muscarinic M2 receptors (decreases heart rate), Opioid mu receptors.
3. **Gq Pathway (Phospholipase C Activation)**:
   - Alpha_q activates **Phospholipase C-beta (PLC)**.
   - PLC cleaves membrane PIP2 into two second messengers:
     - **IP3 (Inositol 1,4,5-trisphosphate)**: Diffuses to sarcoplasmic/endoplasmic reticulum, binds IP3 receptors, triggering **Ca2+ release**.
     - **DAG (Diacylglycerol)**: Remains in membrane, activates **Protein Kinase C (PKC)**.
   - *Examples*: Alpha-1 adrenergic (vasoconstriction), Muscarinic M1 and M3 (smooth muscle contraction, glandular secretion).''';
  }

  static String _getAnsExplanation() {
    return '''### Autonomic Nervous System (ANS) Pharmacology (PCI B.Pharm NEP 2020)

The ANS regulates involuntary physiological functions via two anatomically and functionally distinct divisions: the **Sympathetic** (Thoracolumbar, Fight or Flight) and **Parasympathetic** (Craniosacral, Rest and Digest) systems.

---

### 1. Receptor Summary & Actions
| Division | Neurotransmitter | Major Receptors | Primary Locations & Effects |
|---|---|---|---|
| **Sympathetic** | Noradrenaline (NA) & Adrenaline | **Alpha-1 (a1)** | Vascular smooth muscle -> **Vasoconstriction**, mydriasis, sphincter contraction |
| | | **Alpha-2 (a2)** | Presynaptic terminals -> **Auto-inhibition** of NA release, decreases BP |
| | | **Beta-1 (b1)** | Heart -> **Increases HR & contractility** (+ inotrope, + chronotrope), renin release |
| | | **Beta-2 (b2)** | Bronchial & uterine smooth muscle -> **Bronchodilation**, vasodilation, tocolysis |
| | | **Beta-3 (b3)** | Adipose tissue, bladder detrusor -> **Lipolysis**, bladder relaxation (Mirabegron) |
| **Parasympathetic** | Acetylcholine (ACh) | **Muscarinic M1** | Gastric parietal cells -> Increases acid secretion, CNS learning |
| | | **Muscarinic M2** | Sinoatrial & AV nodes -> **Decreases HR & conduction velocity** |
| | | **Muscarinic M3** | Exocrine glands & smooth muscles -> **Bronchoconstriction**, miosis, salivation, urination |
| | | **Nicotinic Nm** | Neuromuscular junction -> Skeletal muscle contraction |
| | | **Nicotinic Nn** | Autonomic ganglia & adrenal medulla -> Depolarization & catecholamine release |

---

### 2. Clinical Prototypical Drugs
- **Sympathomimetics**: Adrenaline (anaphylaxis, cardiac arrest), Salbutamol (asthma, selective beta-2 agonist).
- **Sympatholytics**: Atenolol/Metoprolol (cardioselective beta-1 blockers for hypertension), Prazosin (alpha-1 blocker for BPH/hypertension).
- **Parasympathomimetics**: Pilocarpine (glaucoma), Neostigmine (Myasthenia gravis).
- **Anticholinergics**: Atropine (organophosphate poisoning, bradycardia, pre-anesthetic medication).''';
  }

  static String _getAntibioticsExplanation() {
    return '''### Classification & Mechanism of Action of Antibiotics (PCI B.Pharm NEP 2020)

Antibiotics are classified based on their antimicrobial spectrum, chemical structure, and molecular mechanism of action.

---

### 1. Cell Wall Synthesis Inhibitors (Bactericidal)
- **Beta-Lactams (Penicillins, Cephalosporins, Carbapenems, Monobactams)**:
  - **Mechanism**: Bind to and inhibit **Penicillin-Binding Proteins (PBPs / Transpeptidases)**, blocking the cross-linking of peptidoglycan strands, causing cell lysis.
  - *Examples*: Amoxicillin, Ceftriaxone, Meropenem.
- **Glycopeptides**:
  - **Mechanism**: Bind to D-Ala-D-Ala terminus of cell wall precursor units, preventing polymer elongation.
  - *Example*: Vancomycin (drug of choice for MRSA).

---

### 2. Bacterial Protein Synthesis Inhibitors
- **30S Ribosomal Subunit Inhibitors**:
  - **Aminoglycosides** (*Bactericidal*): Bind irreversibly to 30S subunit, freeze initiation, cause misreading of genetic code (Gentamicin, Amikacin, Streptomycin).
  - **Tetracyclines** (*Bacteriostatic*): Bind reversibly to 30S subunit, block entry of aminoacyl-tRNA to the A-site (Doxycycline, Minocycline).
- **50S Ribosomal Subunit Inhibitors**:
  - **Macrolides**: Bind 50S subunit, inhibit translocation step (Azithromycin, Clarithromycin).
  - **Chloramphenicol**: Inhibits Peptidyl transferase enzyme.
  - **Lincosamides**: Clindamycin (covers anaerobes).
  - **Oxazolidinones**: Linezolid (inhibits formation of 70S initiation complex).

---

### 3. Nucleic Acid Synthesis Inhibitors
- **DNA Gyrase (Topoisomerase II & IV) Inhibitors**: Fluoroquinolones (Ciprofloxacin, Levofloxacin). Inhibit DNA supercoiling, bactericidal.
- **RNA Polymerase Inhibitors**: Rifampicin (inhibits bacterial DNA-dependent RNA polymerase; first-line anti-TB).
- **Antimetabolites (Folate Antagonists)**:
  - **Sulfonamides**: Compete with PABA to inhibit **Dihydropteroate synthase**.
  - **Trimethoprim**: Inhibits **Dihydrofolate reductase (DHFR)**.
  - Combination (Cotrimoxazole) provides sequential blockade with bactericidal synergy.''';
  }

  static String _getPvExplanation() {
    return '''### Pharmacovigilance (PV) & Drug Safety (PCI B.Pharm NEP 2020)

**Pharmacovigilance** is defined by the WHO as the science and activities relating to the detection, assessment, understanding, and prevention of adverse effects or any other drug-related problems.

---

### 1. The 4 Minimum Criteria for a Valid ICSR
An **Individual Case Safety Report (ICSR)** must have 4 minimum elements to be entered into safety databases (e.g., Argus Safety, ArisG):
1. **Identifiable Patient**: Initials, age, date of birth, gender, or patient ID.
2. **Identifiable Reporter**: Name, contact details, healthcare professional status, or consumer qualification.
3. **Suspect Medicinal Product**: Drug brand or generic name, dosage, or batch.
4. **Adverse Drug Reaction (ADR)**: Distinct sign, symptom, clinical outcome, or laboratory abnormality.

---

### 2. Rawlins-Thompson ADR Classification
- **Type A (Augmented)**: Dose-dependent, predictable from known pharmacology, high incidence, low mortality (e.g., Hypoglycemia from Insulin, Bradycardia from Beta-blockers).
- **Type B (Bizarre / Idiosyncratic)**: Dose-independent, unpredictable, host-dependent immunological allergy, low incidence, high mortality (e.g., Anaphylaxis from Penicillin, Stevens-Johnson syndrome).
- **Type C (Chronic)**: Associated with long-term therapy (e.g., Adrenal suppression from chronic Corticosteroids).
- **Type D (Delayed)**: Manifests years after exposure (e.g., Teratogenicity like Phocomelia from Thalidomide, secondary malignancies).
- **Type E (End-of-use)**: Rebound symptoms upon abrupt withdrawal (e.g., Rebound hypertension from Clonidine).
- **Type F (Failure of therapy)**: Inadequate drug response, often linked to antimicrobial resistance or substandard batches.

---

### 3. Key Regulatory Programs
- **PvPI (Pharmacovigilance Programme of India)**: Coordinated by the Indian Pharmacopoeia Commission (IPC) Ghaziabad as the national coordination centre.
- **MedDRA (Medical Dictionary for Regulatory Activities)**: 5-level terminology hierarchy (SOC -> HLGT -> HLT -> PT -> LLT).
- **WHO-UMC Causality Scale**: Categories: Certain, Probable, Possible, Unlikely, Conditional/Unclassified, Unassessable.''';
  }

  static String _getIchStabilityExplanation() {
    return '''### ICH Q1A(R2) Stability Testing Guidelines (PCI B.Pharm NEP 2020)

The **International Council for Harmonisation (ICH)** establishes unified global standards for drug product quality, safety, and efficacy.

---

### 1. ICH Q1A Stability Study Storage Conditions
For products intended for global marketing in Climatic Zone I and II (or Zone IVb for India and tropical regions):

| Study Type | Storage Condition (General Drug Products) | Testing Frequency |
|---|---|---|
| **Long-Term (Real-Time)** | **25°C ± 2°C / 60% RH ± 5% RH** (or 30°C ± 2°C / 65% RH) | 0, 3, 6, 9, 12, 18, 24, 36 months |
| **Intermediate** | **30°C ± 2°C / 65% RH ± 5% RH** | 0, 6, 9, 12 months (triggered if significant change occurs in accelerated) |
| **Accelerated** | **40°C ± 2°C / 75% RH ± 5% RH** | 0, 3, 6 months |

*Note for India (Zone IVb: Hot and Humid)*: Long-term testing condition is **30°C ± 2°C / 75% RH ± 5% RH**.

---

### 2. Definition of "Significant Change" at Accelerated Conditions
A significant change during a 6-month accelerated study includes:
1. A **5% change in assay** from initial test value.
2. Any degradation product exceeding its acceptable specification limit.
3. Failure to meet dissolution criteria for 12 dosage units.
4. Failure to meet specifications for pH, hardness, or physical appearance (e.g., phase separation in emulsions, color change).

---

### 3. Other Core ICH Quality Guidelines
- **Q1**: Stability testing.
- **Q2**: Analytical method validation (Accuracy, Precision, Specificity, LOD, LOQ, Linearity, Range, Robustness).
- **Q3**: Impurities in new drug substances and drug products.
- **Q6**: Specifications and acceptance criteria.
- **Q8**: Pharmaceutical Development (Quality by Design - QbD).
- **Q9**: Quality Risk Management (QRM).
- **Q10**: Pharmaceutical Quality System (PQS).''';
  }

  static String _getChromatographyExplanation() {
    return '''### Chromatography & Analytical Methods (PCI B.Pharm NEP 2020)

**Chromatography** is a physical separation technique in which components distribute between a stationary phase and a mobile phase.

---

### 1. High-Performance Liquid Chromatography (HPLC)
- **Principle**: Separation based on differential partitioning, adsorption, or ion exchange under high pressure (up to 6,000 psi).
- **Reversed-Phase HPLC (RP-HPLC)** (*Most Common*):
  - **Stationary Phase**: Non-polar (e.g., C18 Octadecylsilane, C8).
  - **Mobile Phase**: Polar (Water, Methanol, Acetonitrile mixtures).
  - *Rule*: Polar compounds elute first; hydrophobic non-polar compounds retain longer.
- **System Suitability Parameters (USP / IP Standards)**:
  - **Theoretical Plates (N)** (Efficiency): \$N = 16 (t_r / W)^2\$. (USP requirement: usually > 2000).
  - **Tailing Factor (T)**: Measured at 5% peak height (\$T = (A + B) / 2A\$). Ideal: 0.9 to 1.2; unacceptable if > 2.0.
  - **Resolution (Rs)**: Measure of separation between two adjacent peaks (\$Rs > 1.5\$ indicates baseline separation).
  - **Capacity Factor (k')**: Retention factor (\$k' > 2.0\$).

---

### 2. Thin Layer Chromatography (TLC)
- **Principle**: Liquid-solid adsorption on glass/aluminum plates coated with silica gel G (containing 13% gypsum binder).
- **Retention Factor (Rf)**:
  \\[
  R_f = \\frac{\\text{Distance traveled by solute}}{\\text{Distance traveled by solvent front}}
  \\]
  *(Rf value is always between 0 and 1.0).*

---

### 3. Spectroscopic Quantification: Beer-Lambert Law
For UV-Visible spectrophotometry (BP102T / BP701T):
\\[
A = \\epsilon \\cdot b \\cdot c = -\\log_{10}(I / I_0)
\\]
- \$A\$: Absorbance (unitless optical density).
- \$\\epsilon\$: Molar absorptivity (\$L \\cdot mol^{-1} \\cdot cm^{-1}\$).
- \$b\$: Path length of cuvette (typically 1.0 cm).
- \$c\$: Concentration of absorbing analyte in solution (\$mol \\cdot L^{-1}\$).''';
  }

  static String _getSterilizationExplanation() {
    return '''### Sterilization & Pyrogen Testing (PCI B.Pharm NEP 2020)

**Sterilization** is the complete destruction or elimination of all viable microorganisms, including bacterial endospores.

---

### 1. Moist Heat Sterilization (Autoclaving)
- **Mechanism**: Denaturation and coagulation of essential microbial proteins and structural enzymes.
- **Standard Operating Cycle**: **121°C at 15 psi (1.05 kg/cm²) steam pressure for 15 to 20 minutes**.
- **Biological Indicator**: Endospores of ***Geobacillus stearothermophilus*** (formerly *Bacillus stearothermophilus*).
- **Application**: Aqueous injections, surgical dressings, heat-stable glassware, culture media.

---

### 2. Dry Heat Sterilization (Hot Air Oven)
- **Mechanism**: Oxidation of cellular constituents and protein denaturation.
- **Standard Cycle**: **160°C for 2 hours** or **170°C for 1 hour** (for depyrogenation: 250°C for 30 minutes).
- **Biological Indicator**: Endospores of ***Bacillus atrophaeus*** (formerly *Bacillus subtilis* var. *niger*).
- **Application**: Oily injections, anhydrous powders, heat-resistant glassware, surgical instruments.

---

### 3. Membrane Filtration (Sterilization by Filtration)
- Used for heat-labile parenterals (enzymes, proteins, blood products).
- Standard nominal pore size: **0.22 micron (µm)** membrane filter.
- **Biological Indicator**: ***Brevundimonas diminuta***.

---

### 4. Pyrogen & Endotoxin Testing
- **Bacterial Endotoxins**: Lipopolysaccharides (LPS) from the outer cell wall of Gram-negative bacteria (thermostable, cause fever).
- **LAL Test (Limulus Amebocyte Lysate)**:
  - Lysate from horseshoe crab (*Limulus polyphemus*) amebocytes forms a firm gel clot in the presence of endotoxins.
  - Highly sensitive (picogram level), rapid, replaces animal rabbit pyrogen tests for official IP/USP release.''';
  }

  static String _getBcsExplanation() {
    return '''### Biopharmaceutics Classification System (BCS) (PCI B.Pharm NEP 2020)

Developed by Dr. Gordon Amidon, the BCS classifies drug substances into 4 categories based on their **aqueous solubility** and **intestinal permeability**.

---

### The BCS Matrix
| Class | Aqueous Solubility | Intestinal Permeability | Rate-Limiting Step for Absorption | Representative Drug Examples |
|---|---|---|---|---|
| **Class I** | **High** | **High** | Gastric emptying rate | Paracetamol, Metoprolol, Propranolol |
| **Class II** | **Low** | **High** | **Dissolution rate** | Ibuprofen, Ketoconazole, Carbamazepine, Nifedipine |
| **Class III** | **High** | **Low** | **Permeability across gut membrane** | Atenolol, Cimetidine, Acyclovir, Ranitidine |
| **Class IV** | **Low** | **Low** | Both dissolution and permeability | Hydrochlorothiazide, Furosemide, Taxol |

---

### Regulatory Biowaiver Criteria
- **BCS Class I** products qualify for a **Biowaiver** (exemption from in vivo bioequivalence testing) if:
  1. The drug is rapidly dissolving (> 85% dissolves in 30 minutes in pH 1.2, 4.5, and 6.8 media).
  2. The drug has a wide therapeutic margin.
  3. Excipients do not significantly impact gastrointestinal motility or absorption.''';
  }

  static String _getNddsExplanation() {
    return '''### Novel Drug Delivery Systems (NDDS) (PCI B.Pharm NEP 2020)

NDDS aims to deliver therapeutics at a controlled, targeted rate to specific anatomical sites while minimizing systemic adverse effects.

---

### Major Carrier Systems & Technologies
1. **Liposomes**:
   - Microscopic spherical vesicles composed of concentric phospholipid bilayers enclosing an aqueous core.
   - Deliver both hydrophilic drugs (inside aqueous core) and lipophilic drugs (within lipid bilayer).
   - *Example*: Doxorubicin liposomal injection (reduces cardiotoxicity).
2. **Niosomes**:
   - Non-ionic surfactant-based vesicular systems (more chemically stable and cost-effective than phospholipids).
3. **Nanoparticles & Polymeric Micelles**:
   - Submicron colloidal particles (10 to 200 nm) utilizing biodegradable polymers (PLGA, Chitosan).
   - Exploit the Enhanced Permeability and Retention (EPR) effect in solid tumor vasculature.
4. **Transdermal Drug Delivery Systems (TDDS)**:
   - Delivers drugs across the stratum corneum directly into systemic capillaries, completely bypassing first-pass hepatic metabolism.
   - *Examples*: Nitroglycerin patch, Fentanyl patch, Nicotine patch.
5. **Osmotic Pumps (OROS)**:
   - Drug core surrounded by semipermeable membrane with laser-drilled delivery orifice.
   - Delivers drug at a zero-order release rate independent of gastrointestinal pH and motility.''';
  }

  static String _getDosageFormsExplanation() {
    return '''### Pharmaceutical Dosage Forms: Classification & Overview (PCI B.Pharm Pharmaceutics)

A **dosage form** is the physical formulation in which a drug (API) is combined with non-medicinal excipients to deliver safe, effective, and reproducible therapy to patients.

---

### 1. Classification by Physical State
1. **Solid Dosage Forms**:
   - *Unit Dose*: Tablets (compressed, coated, effervescent, chewable, sublingual), Capsules (Hard gelatin vs Soft gelatin), Lozenges, Pastilles.
   - *Bulk Dose*: Insufflations, dusting powders, effervescent granules.
2. **Liquid Dosage Forms**:
   - *Monophasic (True Solutions)*: Syrups (66.7% w/w sucrose in water as per IP), Elixirs (sweetened hydroalcoholic solutions), Linctuses (viscous cough preparations), Drops, Gargles, Mouthwashes.
   - *Biphasic (Dispersed Systems)*:
     - **Suspensions**: Coarse dispersion of insoluble solid particles in liquid vehicle. Key requirement: optimum sedimentation volume (\$F = V_u / V_0\$) and easy re-dispersibility.
     - **Emulsions**: Thermodynamically unstable two-phase system (O/W or W/O) stabilized by an emulsifying agent. Tests for type: Dilution test, Dye solubility test (Amaranth/Sudan III), Conductivity test.
3. **Semisolid Dosage Forms**:
   - Ointments (hydrocarbon, absorption, water-removable, water-soluble bases), Creams (O/W vanishing or W/O cold creams), Pastes (high concentration of insoluble powder > 20-50%), Gels (cross-linked carbomer/methylcellulose network), Suppositories (cocoa butter/PEG bases for rectal/vaginal delivery).
4. **Gaseous & Inhalation Dosage Forms**:
   - Metered Dose Inhalers (MDIs with HFA propellants), Dry Powder Inhalers (DPIs), Nebulizer solutions for direct pulmonary delivery.
5. **Sterile Parenterals**:
   - Intravenous (IV), Intramuscular (IM), Subcutaneous (SC), Intradermal (ID). Must be sterile, isotonic, and strictly pyrogen-free (tested via LAL test).''';
  }

  static String _getDrugsActExplanation() {
    return '''### Drugs & Cosmetics Act 1940 and Rules 1945 (PCI B.Pharm Jurisprudence BP505T)

Enacted to regulate the import, manufacture, distribution, and sale of drugs and cosmetics in India, ensuring safety, efficacy, and standard quality.

---

### Crucial Schedules to Know
- **Schedule M**: Good Manufacturing Practices (GMP) and plant/equipment requirements for pharmaceutical manufacturing.
- **Schedule Y**: Requirements and guidelines for clinical trials, import, and manufacture of new drugs.
- **Schedule H**: Prescription drugs that can only be sold on the prescription of a Registered Medical Practitioner (RMP).
- **Schedule H1**: Specific antibiotics, anti-TB, and psychotropic drugs requiring separate 3-year record registers to prevent antimicrobial resistance.
- **Schedule X**: Habit-forming psychotropic and narcotic drugs requiring triplicate prescriptions.
- **Schedule C & C1**: Biological and special products (sera, vaccines, antibiotics, parenterals).
- **Schedule G**: Drugs that must carry a cautionary label: *"Warning: To be taken under medical supervision only"*.
- **Schedule P & P1**: Life period (shelf life) and storage conditions of drugs, along with retail package sizes.''';
  }

  // --- Dynamic Synthesis Helper (NO GENERIC 3-BULLET BOILERPLATE) ---

  static String _synthesizeGeneralPharmacyAnswer(
    String query,
    PharmaKnowledgeContext ctx,
    PharmaChatMode mode,
    List<SearchResultItem> citations,
  ) {
    final buffer = StringBuffer();
    final cleanQuery = query.trim();

    // 1. If live search results are available, synthesize directly from research snippets
    if (citations.isNotEmpty) {
      buffer.writeln('### $cleanQuery (Scientific Overview & Research)\n');
      for (final c in citations.take(3)) {
        if (c.snippet.isNotEmpty) {
          buffer.writeln('${c.snippet}\n');
        }
      }
      return buffer.toString().trim();
    }

    // 2. If in-app RAG syllabus or blog matches are available, explain from actual syllabus content
    if (!ctx.isEmpty) {
      buffer.writeln('### $cleanQuery (PCI B.Pharm Curriculum Context)\n');

      if (ctx.syllabusMatches.isNotEmpty) {
        buffer.writeln('Yeh topic aapke B.Pharm curriculum ke in specific units aur subjects me padhaya jata hai:\n');
        for (final s in ctx.syllabusMatches.take(2)) {
          buffer.writeln(s);
        }
        buffer.writeln('\n**Core Study Pointer**: University exams aur GPAT ke liye is concept ki fundamental scientific definition, mechanism of action, formulation parameters, aur clinical significance ko systematically prepare karein.');
      } else if (ctx.blogMatches.isNotEmpty) {
        buffer.writeln('PharmaCode Industry & Study Kit Analysis:\n');
        for (final b in ctx.blogMatches.take(2)) {
          buffer.writeln(b);
        }
      }
      return buffer.toString().trim();
    }

    // 3. Fallback direct question answering
    buffer.writeln('### $cleanQuery\n');
    buffer.writeln('Yeh pharmaceutical sciences aur pharmacy curriculum ka ek mahatvapurna concept hai.');
    buffer.writeln('\nIs concept par real-time research aur full LLM intelligence ke liye bottom bar me globe icon tap karke web search enable karein ya AI Settings se apna free Groq/Gemini key connect karein!');

    return buffer.toString().trim();
  }

  // --- Suggested Study Links Formatter ---

  static String _buildSuggestedStudyLinks(PharmaKnowledgeContext ctx) {
    if (ctx.isEmpty) return '';

    final buffer = StringBuffer();
    buffer.writeln('**Suggested In-App Syllabus & Study Links:**');

    if (ctx.syllabusMatches.isNotEmpty) {
      for (final s in ctx.syllabusMatches.take(3)) {
        buffer.writeln(s);
      }
    }

    if (ctx.blogMatches.isNotEmpty) {
      for (final b in ctx.blogMatches.take(2)) {
        buffer.writeln('• $b');
      }
    }

    return buffer.toString().trim();
  }
}
