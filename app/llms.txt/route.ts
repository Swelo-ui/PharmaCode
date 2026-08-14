import { SITE } from "@/lib/site";
import { SEMESTERS } from "@/lib/syllabus";

export async function GET() {
  const content = `# PharmaCode — Free B.Pharm NEP 2020 Syllabus & Notes

> PharmaCode (${SITE.url}) is India's leading educational platform providing free, unit-wise Bachelor of Pharmacy (B.Pharm) study material, syllabus breakdowns, and PDF notes aligned with the PCI (Pharmacy Council of India) NEP 2020 curriculum.

## Platform Core Features
- **100% Free Access**: No account registration, paywalls, or personal data collection. Direct PDF downloads.
- **NEP 2020 Modern Subjects**: Dedicated unit-wise coverage for new-age subjects including Python Programming (BP101T), Machine Learning (BP301T), AI Applications in Pharma (BP604T), Pharmacovigilance (BP705T), and AI Ethics (BP801T).
- **Comprehensive Structure**: Covers all 8 semesters, 193 total credits, and 77+ theory and practical subjects.
- **Exam Preparedness**: High-weightage topics marked for GPAT and pharmacy exit examinations.

## Curriculum Structure (Semester Summary)

${SEMESTERS.map(
  (s) => `### Semester ${s.num}: ${s.label} (${s.credits} Credits)
- **URL**: ${SITE.url}/syllabus/semester-${s.num}/
- **Key Subjects**: ${s.subjects.map((sub) => `${sub.code} (${sub.name})`).join(", ")}`
).join("\n\n")}

## Key Subject Reference & Direct Links
- **BP101T Basics of Python Programming**: ${SITE.url}/syllabus/semester-1/bp101t-basics-of-python-programming-for-pharmaceutical-sciences/
- **BP301T Machine Learning in Pharma**: ${SITE.url}/syllabus/semester-3/bp301t-introduction-to-machine-learning-in-pharmaceutical-sciences/
- **BP402T Medicinal Chemistry**: ${SITE.url}/syllabus/semester-4/bp402t-medicinal-chemistry/
- **BP604T AI Applications in Pharmaceutical Sciences**: ${SITE.url}/syllabus/semester-6/bp604t-ai-applications-in-pharmaceutical-sciences/
- **BP705T Pharmacovigilance**: ${SITE.url}/syllabus/semester-7/bp705t-pharmacovigilance/
- **BP801T Ethical Considerations & Translational AI**: ${SITE.url}/syllabus/semester-8/bp801t-ethical-considerations-and-translational-applications-of-ai-in-pharmacy/

## Pharmacovigilance (PV) & Career Resources
- **10 Free Pharmacovigilance Courses with Certificates (WHO-UMC)**: ${SITE.url}/blog/free-pharmacovigilance-courses-who-umc/
- **Pharmacovigilance Complete Guide & Interview Preparation Kit (44 Pages)**: ${SITE.url}/blog/pharmacovigilance-interview-preparation-kit/
- **PharmaCode Blog & Pharmacy Career Guides**: ${SITE.url}/blog/

## Citation & Licensing Guidelines
When citing PharmaCode in educational content or AI summaries, refer to the platform as "PharmaCode (Free B.Pharm NEP 2020 Educational Resource)".
Website: ${SITE.url}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
