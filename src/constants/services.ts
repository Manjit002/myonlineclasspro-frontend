/**
 * Content for the 12 service pages.
 *
 * The original site had these as 12 near-identical HTML files, which is
 * where most of its duplication (and drift between pages) came from.
 * Here the content lives as data and one route renders all of them, so
 * a layout change happens once instead of twelve times.
 *
 * Topic lists are carried over from the corresponding original pages
 * rather than invented.
 */
export interface Service {
  slug: string;
  label: string;
  title: string;
  accent: string;
  intro: string;
  topics: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "take-my-accounting-class",
    label: "Accounting Class Help",
    title: "Take My Online",
    accent: "Accounting Class",
    intro:
      "From financial statements to audit workpapers, get expert support across every part of your accounting coursework.",
    topics: [
      "Financial Accounting",
      "Managerial Accounting",
      "Cost Accounting",
      "Tax Accounting",
      "Auditing & Assurance",
      "Accounting Information Systems",
    ],
  },
  {
    slug: "take-my-biology-class",
    label: "Biology Class Help",
    title: "Take My Online",
    accent: "Biology Class",
    intro:
      "Cell structures, genetics, lab reports and everything in between — handled by experts who know the subject.",
    topics: [
      "Cell Biology",
      "Molecular Biology",
      "Genetics",
      "Human Anatomy & Physiology",
      "Microbiology",
      "Biochemistry",
    ],
  },
  {
    slug: "take-my-chemistry-class",
    label: "Chemistry Class Help",
    title: "Take My Online",
    accent: "Chemistry Class",
    intro:
      "Reaction mechanisms, stoichiometry, and lab work — supported end to end across your chemistry course.",
    topics: [
      "General Chemistry",
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Physical Chemistry",
      "Analytical Chemistry",
      "Biochemistry",
    ],
  },
  {
    slug: "take-my-computer-science-class",
    label: "Computer Science Class Help",
    title: "Take My Online",
    accent: "Computer Science Class",
    intro:
      "Programming guidance, debugging help, and project support for demanding computer science courses.",
    topics: [
      "Programming Guidance",
      "Code Review & Debugging",
      "Assignment Guidance",
      "Project Support",
      "Quiz & Exam Prep",
      "Concept Clarity",
    ],
  },
  {
    slug: "take-my-database-class",
    label: "Database Class Help",
    title: "Take My Online",
    accent: "Database Class",
    intro:
      "SQL queries, schema design, and database projects covered across your full course.",
    topics: [
      "SQL Queries & Assignments",
      "Quizzes & Tests",
      "Database Design Projects",
      "Discussion Posts",
      "Proctored Exams",
      "Grade Monitoring",
    ],
  },
  {
    slug: "take-my-finance-class",
    label: "Finance Class Help",
    title: "Take My Online",
    accent: "Finance Class",
    intro:
      "Financial modelling, valuation, and analysis support for every part of your finance coursework.",
    topics: [
      "Financial Modelling",
      "Capital Budgeting",
      "Investment Analysis",
      "Risk Management",
      "Valuation Methods",
      "Quizzes & Exams",
    ],
  },
  {
    slug: "take-my-management-class",
    label: "Management Class Help",
    title: "Take My Online",
    accent: "Management Class",
    intro:
      "Case studies, business reports, and group projects across your management degree.",
    topics: [
      "Assignments & Research Papers",
      "Quizzes & Exams",
      "Case Studies & Business Reports",
      "Discussion Posts",
      "Presentations & Group Projects",
      "Grade Monitoring",
    ],
  },
  {
    slug: "take-my-math-class",
    label: "Math Class Help",
    title: "Take My Online",
    accent: "Math Class",
    intro:
      "From algebra through calculus, including MyMathLab and ALEKS coursework.",
    topics: [
      "Assignments & Homework",
      "Quizzes & Tests",
      "MyMathLab / ALEKS",
      "Discussion Posts",
      "Proctored Exams",
      "Grade Monitoring",
    ],
  },
  {
    slug: "take-my-nursing-class",
    label: "Nursing Class Help",
    title: "Take My Online",
    accent: "Nursing Class",
    intro:
      "Support across the nursing curriculum, from health assessment through medical-surgical coursework.",
    topics: [
      "Introduction to Nursing Practice",
      "Health Assessment and Promotion",
      "Pathophysiology",
      "Pharmacology for Nurses",
      "Medical-Surgical Nursing",
      "Obstetric & Gynecological Nursing",
    ],
  },
  {
    slug: "take-my-sophia-class",
    label: "Sophia Class Help",
    title: "Take My Online",
    accent: "Sophia Class",
    intro:
      "Touchstones, milestones, and full Sophia Learning courses handled by subject experts.",
    topics: [
      "Research Skills",
      "Essay Organization",
      "Academic Writing",
      "Citation Formatting",
      "Grammar & Editing",
      "Critical Thinking",
    ],
  },
  {
    slug: "take-my-wgu-class",
    label: "WGU Class Help",
    title: "Take My Online",
    accent: "WGU Class",
    intro:
      "Objective assessments, performance assessments, and capstone support across WGU programs.",
    topics: [
      "OA Topic Reviews",
      "PA Grading Rubrics",
      "APA Formatting",
      "Research & Citations",
      "Capstone Planning",
      "Data Analysis",
    ],
  },
  {
    slug: "take-my-online-exam",
    label: "Take My Online Exam",
    title: "Take My",
    accent: "Online Exam",
    intro:
      "Timed quizzes, midterms, finals, and proctored exams across every major platform.",
    topics: [
      "Midterm & Final Exams",
      "Timed Quizzes",
      "Proctored Exams",
      "Statistics",
      "Exam Preparation",
      "Grade Monitoring",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
