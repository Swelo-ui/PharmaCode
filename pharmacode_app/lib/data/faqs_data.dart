class FaqItem {
  final String question;
  final String answer;

  const FaqItem({required this.question, required this.answer});
}

const List<FaqItem> faqsData = [
  FaqItem(
    question: "What is B.Pharm PCI NEP 2020 syllabus?",
    answer: "The B.Pharm NEP 2020 (National Education Policy) is the new curriculum implemented by the Pharmacy Council of India (PCI). It introduces credit-based learning, mandatory industry/hospital internships in Semesters 4 and 6, and modern technical subjects like Python programming, Machine Learning, and AI in pharmaceutical sciences.",
  ),
  FaqItem(
    question: "Are the notes on PharmaCode free to download?",
    answer: "Yes! All study material, unit-wise notes, and syllabus guides on PharmaCode are 100% free to download in PDF format. We do not require any registration, login, or payments.",
  ),
  FaqItem(
    question: "Does PharmaCode cover Python Programming for pharmacy?",
    answer: "Yes! BP101T (Basics of Python Programming for Pharmaceutical Sciences) is covered unit-wise with specific notes, code explanations, and library guides (NumPy, Pandas, Matplotlib) tailored for pharmacy students.",
  ),
  FaqItem(
    question: "How does the PCI NEP 2020 syllabus structure internships?",
    answer: "Under the new NEP 2020 guidelines, B.Pharm students must complete mandatory internships at the end of Semester 4 (hospital/clinical pharmacy) and Semester 6 (industrial/regulatory pharmacy). PharmaCode provides guides and report templates for these internships.",
  ),
  FaqItem(
    question: "Is the study material on PharmaCode helpful for GPAT preparation?",
    answer: "Absolutely! The unit-wise syllabus content is highly aligned with GPAT 2027 and other national competitive exams. Key topics and high-weightage areas are highlighted across subject pages.",
  ),
  FaqItem(
    question: "Can I use this app offline?",
    answer: "Yes! The entire syllabus for all 8 semesters is stored directly on your device, so you can look up subjects, units, and exam topics even without an active internet connection.",
  ),
];
