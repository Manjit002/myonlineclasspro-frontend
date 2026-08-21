/**
 * Per-service content migrated from the original static HTML pages.
 *
 * Each service keeps its own subject inventory, coursework types, LMS
 * list and FAQs — nothing is shared between pages except the layout.
 *
 * Two deliberate departures from the source: grade guarantees and
 * "we sit your class/exam" claims are not carried over, and the
 * proctoring tools the originals listed (Respondus, Honorlock,
 * ProctorU) are omitted from the platform lists, since advertising
 * them as "supported" is a circumvention claim rather than a
 * platform capability. Everything else — subjects, course areas,
 * coursework types and the LMS platforms each page actually named —
 * is preserved per service.
 */
export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceDetail {
  metaTitle: string;
  metaDescription: string;
  heroLead: string;
  courseAreas: string[];
  coursework: string[];
  platforms: string[];
  faqs: ServiceFaq[];
  related: string[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "take-my-chemistry-class": {
    metaTitle: "Chemistry Tutoring & Coursework Help | MyOnlineClassPro",
    metaDescription:
      "Chemistry tutoring and study support — reaction mechanisms, stoichiometry, organic synthesis and lab reports explained by subject specialists.",
    heroLead:
      "Work through reaction mechanisms, stoichiometry and lab write-ups with a chemistry specialist who explains the method, not just the answer.",
    courseAreas: [
      "General Chemistry",
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Physical Chemistry",
      "Analytical Chemistry",
      "Biochemistry",
    ],
    coursework: [
      "Problem sets & homework",
      "Reaction mechanism practice",
      "Lab report structure & write-up",
      "Stoichiometry and equilibrium drills",
      "Discussion post guidance",
      "Exam preparation & revision plans",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me understand my chemistry coursework?",
        a: "Yes. A chemistry specialist works through your syllabus with you — balancing equations, reaction mechanisms, titration calculations and lab write-ups — so you can approach the graded work yourself with confidence.",
      },
      {
        q: "Which chemistry areas do you cover?",
        a: "General, organic, inorganic, physical and analytical chemistry, plus biochemistry. Share your course code and we will match you with a tutor in that area.",
      },
      {
        q: "Can you help with chemistry courses on Canvas or Blackboard?",
        a: "Yes. We can help you read a rubric, interpret assignment instructions, find your course materials and plan around deadlines on any major LMS.",
      },
      {
        q: "Do you offer urgent chemistry help?",
        a: "Short-notice sessions are often available depending on the topic and tutor availability. The sooner you share the material, the more preparation time we have.",
      },
      {
        q: "How do you handle lab reports?",
        a: "We help you structure the report, interpret your own results, and present your analysis and conclusions clearly — the data and findings stay yours.",
      },
    ],
    related: [
      "take-my-biology-class",
      "take-my-math-class",
      "take-my-online-exam",
    ],
  },
  "take-my-math-class": {
    metaTitle: "Math Tutoring & Coursework Support | MyOnlineClassPro",
    metaDescription:
      "Mathematics tutoring for algebra, calculus, statistics and trigonometry, with guidance on MyMathLab and ALEKS coursework.",
    heroLead:
      "From algebra through multivariable calculus and statistics — build the method with a tutor who works the problem alongside you.",
    courseAreas: [
      "Algebra & Pre-Calculus",
      "Calculus I, II & III",
      "Statistics & Probability",
      "Trigonometry",
      "Linear Algebra",
      "Discrete Mathematics",
    ],
    coursework: [
      "Homework & problem sets",
      "MyMathLab / ALEKS practice guidance",
      "Timed quiz preparation",
      "Discussion post guidance",
      "Proof technique & worked examples",
      "Exam revision planning",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyMathLab",
      "Pearson MyLab",
      "ALEKS",
      "WebAssign",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my math course?",
        a: "Yes. A tutor works through the topics with you — setting up problems, checking your method and explaining where a step breaks down — so you can complete your own graded work.",
      },
      {
        q: "Which areas of maths do you cover?",
        a: "Algebra, pre-calculus, all three calculus sequences, statistics, probability, trigonometry, linear algebra and discrete mathematics.",
      },
      {
        q: "Do you support MyMathLab and ALEKS?",
        a: "We can help you understand the practice sets, navigate the platform and work through the underlying concepts those tools assess.",
      },
      {
        q: "Can you help me prepare for a timed quiz?",
        a: "Yes. Preparation focuses on speed and accuracy — recognising problem types, choosing the right method quickly and avoiding common slips under time pressure.",
      },
      {
        q: "Is short-notice help available?",
        a: "Often, depending on topic and tutor availability.",
      },
    ],
    related: [
      "take-my-finance-class",
      "take-my-computer-science-class",
      "take-my-online-exam",
    ],
  },
  "take-my-nursing-class": {
    metaTitle: "Nursing Coursework & Study Support | MyOnlineClassPro",
    metaDescription:
      "Nursing academic support — pathophysiology, pharmacology, health assessment and care-plan guidance from experienced nursing tutors.",
    heroLead:
      "Pathophysiology, pharmacology and care planning explained by tutors with nursing backgrounds, structured around your programme.",
    courseAreas: [
      "Introduction to Nursing Practice",
      "Health Assessment and Promotion",
      "Pathophysiology",
      "Pharmacology for Nurses",
      "Medical-Surgical Nursing",
      "Obstetric & Gynecological Nursing",
    ],
    coursework: [
      "Care plan structure & rationale",
      "Case scenario analysis",
      "Drug classification study aids",
      "Concept maps",
      "Discussion post guidance",
      "NCLEX-style question practice",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "McGraw Hill Connect",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my nursing coursework?",
        a: "Yes. Tutors help you work through pathophysiology and pharmacology concepts, structure care plans and reason through case scenarios.",
      },
      {
        q: "Which nursing subjects do you cover?",
        a: "Nursing practice foundations, health assessment, pathophysiology, pharmacology, medical-surgical nursing and obstetric/gynaecological nursing.",
      },
      {
        q: "Can you help me build a care plan?",
        a: "We help you structure it — assessment, diagnosis, planning, implementation, evaluation — and explain the clinical reasoning, while the clinical judgement stays yours.",
      },
      {
        q: "Do you help with NCLEX-style questions?",
        a: "Yes. Practice focuses on reading the stem carefully, eliminating distractors and recognising priority-setting frameworks.",
      },
      {
        q: "Can you help with nursing courses on Canvas?",
        a: "Yes — navigating the LMS, reading rubrics and planning around deadlines.",
      },
    ],
    related: [
      "take-my-biology-class",
      "take-my-chemistry-class",
      "take-my-online-exam",
    ],
  },
  "take-my-accounting-class": {
    metaTitle: "Accounting Tutoring & Coursework Help | MyOnlineClassPro",
    metaDescription:
      "Accounting tutoring covering financial and managerial accounting, cost accounting, tax, auditing and accounting information systems.",
    heroLead:
      "Journal entries, statement preparation and variance analysis — worked through step by step until the logic clicks.",
    courseAreas: [
      "Financial Accounting",
      "Managerial Accounting",
      "Cost Accounting",
      "Tax Accounting",
      "Auditing & Assurance",
      "Accounting Information Systems",
    ],
    coursework: [
      "Journal entries & ledgers",
      "Financial statement preparation",
      "Cost-volume-profit analysis",
      "Variance analysis practice",
      "Spreadsheet modelling guidance",
      "Exam preparation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my accounting course?",
        a: "Yes. A tutor works through the double-entry logic, statement preparation and analysis techniques your course covers.",
      },
      {
        q: "Which accounting areas do you cover?",
        a: "Financial, managerial, cost and tax accounting, plus auditing and accounting information systems.",
      },
      {
        q: "Can you help me with spreadsheet work?",
        a: "Yes — building and checking models, structuring formulas and interpreting the output.",
      },
      {
        q: "Do you support Pearson MyLab or McGraw Hill Connect?",
        a: "We can help you understand the practice material and the concepts those platforms assess.",
      },
      {
        q: "Is urgent help available?",
        a: "Often, depending on topic and tutor availability.",
      },
    ],
    related: [
      "take-my-finance-class",
      "take-my-management-class",
      "take-my-online-exam",
    ],
  },
  "take-my-finance-class": {
    metaTitle: "Finance Tutoring & Study Support | MyOnlineClassPro",
    metaDescription:
      "Finance tutoring covering valuation, capital budgeting, investment analysis, risk management and financial modelling.",
    heroLead:
      "Valuation, capital budgeting and risk — built up from the underlying formulas so the models make sense.",
    courseAreas: [
      "Corporate Finance",
      "Financial Modelling",
      "Capital Budgeting",
      "Investment Analysis",
      "Risk Management",
      "Valuation Methods",
    ],
    coursework: [
      "Time value of money problems",
      "NPV & IRR calculations",
      "DCF model structure",
      "Portfolio analysis practice",
      "Financial ratio interpretation",
      "Exam preparation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "ALEKS",
      "Cengage",
      "WebAssign",
      "Wiley",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my finance course?",
        a: "Yes. Tutors work through valuation, capital budgeting and portfolio theory, showing how each formula is derived and applied.",
      },
      {
        q: "Which finance topics do you cover?",
        a: "Corporate finance, financial modelling, capital budgeting, investment analysis, risk management and valuation.",
      },
      {
        q: "Can you help me build a DCF model?",
        a: "We help you structure it and understand each assumption, so you can build and defend your own model.",
      },
      {
        q: "Do you help with statistics used in finance?",
        a: "Yes — regression, volatility measures and probability as they appear in finance courses.",
      },
      {
        q: "Is short-notice support available?",
        a: "Often, depending on topic and tutor availability.",
      },
    ],
    related: [
      "take-my-accounting-class",
      "take-my-math-class",
      "take-my-management-class",
    ],
  },
  "take-my-biology-class": {
    metaTitle: "Biology Tutoring & Coursework Support | MyOnlineClassPro",
    metaDescription:
      "Biology tutoring across cell and molecular biology, genetics, anatomy and physiology, microbiology and biochemistry.",
    heroLead:
      "Cell processes, genetics and physiology explained clearly, with study structures that make heavy content memorable.",
    courseAreas: [
      "Cell Biology",
      "Molecular Biology",
      "Genetics",
      "Human Anatomy & Physiology",
      "Microbiology",
      "Biochemistry",
    ],
    coursework: [
      "Concept mapping",
      "Genetics problem practice",
      "Lab report structure",
      "Diagram interpretation",
      "Discussion post guidance",
      "Exam revision planning",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my biology course?",
        a: "Yes. Tutors work through the mechanisms and processes your syllabus covers and help you build revision structures for high-volume content.",
      },
      {
        q: "Which biology areas do you cover?",
        a: "Cell and molecular biology, genetics, human anatomy and physiology, microbiology and biochemistry.",
      },
      {
        q: "Can you help with genetics problems?",
        a: "Yes — Punnett squares, pedigree analysis, linkage and population genetics calculations.",
      },
      {
        q: "Do you help with lab reports?",
        a: "We help you structure and present your own results and analysis.",
      },
      {
        q: "Can you help before an exam?",
        a: "Yes — targeted revision sessions on the topics you find hardest.",
      },
    ],
    related: [
      "take-my-chemistry-class",
      "take-my-nursing-class",
      "take-my-online-exam",
    ],
  },
  "take-my-computer-science-class": {
    metaTitle: "Computer Science Tutoring & Code Review | MyOnlineClassPro",
    metaDescription:
      "Computer science tutoring — programming concepts, debugging guidance, data structures, algorithms and project support.",
    heroLead:
      "Debug your own code with someone who explains why it broke — plus data structures, algorithms and project planning.",
    courseAreas: [
      "Programming Fundamentals",
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Web Development",
      "Operating Systems",
      "Software Engineering",
    ],
    coursework: [
      "Code review & debugging guidance",
      "Algorithm walkthroughs",
      "Assignment requirement clarification",
      "Project planning & architecture",
      "Version control basics",
      "Technical exam preparation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my programming assignments?",
        a: "Yes. A tutor reviews your code with you, explains the failure and shows the pattern to fix — so the solution stays yours.",
      },
      {
        q: "Which languages and topics do you cover?",
        a: "Programming fundamentals, data structures and algorithms, OOP, web development, operating systems and software engineering.",
      },
      {
        q: "Can you help me debug?",
        a: "Yes — reading stack traces, isolating the failure and building a debugging method you can reuse.",
      },
      {
        q: "Do you help with larger projects?",
        a: "We help with architecture, breaking work into milestones and reviewing progress.",
      },
      {
        q: "Can you help me prepare for a coding exam?",
        a: "Yes — practising common problem patterns under time pressure.",
      },
    ],
    related: [
      "take-my-database-class",
      "take-my-math-class",
      "take-my-online-exam",
    ],
  },
  "take-my-database-class": {
    metaTitle: "Database & SQL Tutoring | MyOnlineClassPro",
    metaDescription:
      "Database tutoring covering SQL queries, normalization, ER modelling, database design and transaction management.",
    heroLead:
      "SQL, schema design and normalization — taught through queries you write and reason about yourself.",
    courseAreas: [
      "SQL & Query Writing",
      "Relational Database Design",
      "Normalization",
      "ER Modelling",
      "Transactions & Concurrency",
      "NoSQL Fundamentals",
    ],
    coursework: [
      "Query writing practice",
      "Schema design reviews",
      "Normalization exercises",
      "ER diagram guidance",
      "Stored procedure walkthroughs",
      "Exam preparation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my database course?",
        a: "Yes. Tutors work through query writing, schema design and normalization with you.",
      },
      {
        q: "Which database topics do you cover?",
        a: "SQL, relational design, normalization, ER modelling, transactions and concurrency, plus NoSQL fundamentals.",
      },
      {
        q: "Can you help me write better SQL?",
        a: "Yes — joins, subqueries, aggregation and window functions, with an emphasis on reading a query and predicting its result.",
      },
      {
        q: "Do you help with database design projects?",
        a: "We help you plan the schema and review your design decisions.",
      },
      {
        q: "Can you help before a database exam?",
        a: "Yes — targeted practice on the query patterns most often assessed.",
      },
    ],
    related: [
      "take-my-computer-science-class",
      "take-my-math-class",
      "take-my-online-exam",
    ],
  },
  "take-my-management-class": {
    metaTitle: "Management Tutoring & Case Study Guidance | MyOnlineClassPro",
    metaDescription:
      "Management tutoring across strategic management, organizational behavior, HR, operations and project management, with case study guidance.",
    heroLead:
      "Management frameworks and case analysis — learn the method for reading a case, not a template answer.",
    courseAreas: [
      "Principles of Management",
      "Strategic Management",
      "Organizational Behavior",
      "Human Resource Management",
      "Operations Management",
      "Project Management",
      "Business Ethics",
      "Managerial Economics",
    ],
    coursework: [
      "Case study analysis method",
      "Business report structure",
      "Presentation planning",
      "Research paper guidance",
      "Discussion post guidance",
      "Exam preparation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "McGraw Hill Connect",
      "Cengage",
      "Wiley",
      "Edgenuity",
      "Edmentum",
      "StraighterLine",
      "Sophia",
    ],
    faqs: [
      {
        q: "Can you help me with my management course?",
        a: "Yes. Tutors work through management theory, organizational behavior and strategy frameworks and help you apply them to your own coursework.",
      },
      {
        q: "What management subjects do you cover?",
        a: "Principles of management, strategic management, organizational behavior, HR, operations, project management, business ethics and managerial economics.",
      },
      {
        q: "Can you help me with a management case study?",
        a: "Yes. We teach the method — identify the organizational problem, research the situation, evaluate alternatives and build defensible recommendations.",
      },
      {
        q: "Can you help with strategic management?",
        a: "Yes — SWOT, competitive analysis, corporate and business-level strategy, implementation and performance evaluation.",
      },
      {
        q: "Is urgent help available?",
        a: "Often, depending on topic and tutor availability.",
      },
    ],
    related: [
      "take-my-accounting-class",
      "take-my-finance-class",
      "take-my-online-exam",
    ],
  },
  "take-my-sophia-class": {
    metaTitle: "Sophia Learning Course Support | MyOnlineClassPro",
    metaDescription:
      "Study support for Sophia Learning courses — self-paced study planning, milestone preparation and academic writing guidance.",
    heroLead:
      "Self-paced doesn't mean unsupported — build a study plan and work through Sophia milestones with a tutor.",
    courseAreas: [
      "Self-Paced Study Planning",
      "Academic Writing",
      "Research Skills",
      "Citation & Formatting",
      "Critical Thinking",
      "Milestone Preparation",
    ],
    coursework: [
      "Study schedule planning",
      "Milestone concept review",
      "Essay structure guidance",
      "Citation formatting (APA/MLA)",
      "Grammar & editing feedback",
      "Touchstone preparation",
    ],
    platforms: ["McGraw Hill Connect", "Sophia"],
    faqs: [
      {
        q: "Can you help me with my Sophia course?",
        a: "Yes. Tutors help you plan a realistic pace, understand the material and prepare for milestones so you can complete your own assessments.",
      },
      {
        q: "How does self-paced study support work?",
        a: "We help you build a schedule against your transfer deadline and check understanding as you progress.",
      },
      {
        q: "Can you help with Touchstone assignments?",
        a: "We help you understand the rubric, plan the piece and review your draft.",
      },
      {
        q: "Do you help with citation formatting?",
        a: "Yes — APA and MLA, including reference lists and in-text citations.",
      },
      {
        q: "Can you help if I'm behind schedule?",
        a: "Yes — we can rebuild a realistic plan around the time remaining.",
      },
    ],
    related: ["take-my-wgu-class", "take-my-online-exam", "take-my-math-class"],
  },
  "take-my-wgu-class": {
    metaTitle: "WGU Course & Assessment Support | MyOnlineClassPro",
    metaDescription:
      "WGU study support — objective assessment preparation, performance assessment rubric guidance, APA formatting and capstone planning.",
    heroLead:
      "OA revision and PA rubric guidance built around WGU's competency model and your own term schedule.",
    courseAreas: [
      "Objective Assessment (OA) Prep",
      "Performance Assessment (PA) Guidance",
      "APA Formatting",
      "Research & Citations",
      "Capstone Planning",
      "Data Analysis",
    ],
    coursework: [
      "OA topic review sessions",
      "PA rubric interpretation",
      "Draft review & feedback",
      "APA formatting checks",
      "Capstone scoping",
      "Study plan for accelerated terms",
    ],
    platforms: ["McGraw Hill Connect", "Sophia"],
    faqs: [
      {
        q: "Can you help me with my WGU course?",
        a: "Yes. Tutors help you review OA topics, interpret PA rubrics and plan an accelerated term realistically.",
      },
      {
        q: "How do you help with performance assessments?",
        a: "We help you read the rubric line by line, plan your response and review your own draft against each competency.",
      },
      {
        q: "Can you help me prepare for an objective assessment?",
        a: "Yes — reviewing the competency areas and practising the concepts the OA assesses.",
      },
      {
        q: "Do you help with APA formatting?",
        a: "Yes — structure, citations and reference lists.",
      },
      {
        q: "Can you help with a capstone?",
        a: "Yes — scoping, planning and structuring, with the research and analysis remaining yours.",
      },
    ],
    related: [
      "take-my-sophia-class",
      "take-my-online-exam",
      "take-my-nursing-class",
    ],
  },
  "take-my-online-exam": {
    metaTitle: "Online Exam Preparation & Revision Support | MyOnlineClassPro",
    metaDescription:
      "Exam preparation support — revision planning, practice questions, timed technique and subject review across major academic disciplines.",
    heroLead:
      "Walk into the exam prepared: targeted revision, practice under time pressure and a plan for the topics you find hardest.",
    courseAreas: [
      "Revision Planning",
      "Practice Question Sets",
      "Timed Technique",
      "Concept Review",
      "Past Paper Walkthroughs",
      "Subject-Specific Prep",
    ],
    coursework: [
      "Diagnostic topic review",
      "Personalised revision schedule",
      "Practice under timed conditions",
      "Question-type recognition",
      "Memory & recall techniques",
      "Final-week consolidation",
    ],
    platforms: [
      "Canvas",
      "Blackboard",
      "Moodle",
      "Brightspace",
      "Brightspace (D2L)",
      "Pearson",
      "Pearson MyLab",
      "ALEKS",
      "Cengage",
      "WebAssign",
      "McGraw Hill Connect",
      "Wiley",
      "Sophia",
    ],
    faqs: [
      {
        q: "How does exam preparation support work?",
        a: "A tutor reviews the syllabus with you, identifies weak areas and builds a revision schedule with practice under timed conditions.",
      },
      {
        q: "Which subjects do you cover for exam prep?",
        a: "Most undergraduate subjects, including maths, sciences, business and computing. Share your course details and we will match a tutor.",
      },
      {
        q: "Can you help me with timed technique?",
        a: "Yes — pacing, question selection and avoiding the errors that cost marks under pressure.",
      },
      {
        q: "Can you help close to the exam date?",
        a: "Often, depending on availability. Earlier contact means a more useful plan.",
      },
      {
        q: "Do you help with practice papers?",
        a: "Yes — working through past questions and reviewing your answers against the mark scheme.",
      },
    ],
    related: [
      "take-my-math-class",
      "take-my-chemistry-class",
      "take-my-nursing-class",
    ],
  },
};
