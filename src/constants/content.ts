/**
 * Structured content carried over from the original pricing and
 * how-it-works pages. Kept as data so the pages stay presentational.
 */
export interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Single Task",
    price: "$15",
    cadence: "per task",
    blurb: "One-off help when you just need a single item handled.",
    features: [
      "Single assignment or quiz",
      "Discussion post & reply",
      "Essay / short paper",
      "Same-day delivery available",
      "100% original, AI-free",
    ],
  },
  {
    name: "Weekly Help",
    price: "$100",
    cadence: "per week",
    blurb: "Ongoing support through the busiest stretch of your course.",
    features: [
      "Weekly assignments & quizzes",
      "Discussion posts managed",
      "Progress tracking & updates",
      "Expert assigned in 10 minutes",
      "B grade or better - guaranteed",
    ],
    featured: true,
  },
  {
    name: "Full Course",
    price: "$299",
    cadence: "per course",
    blurb: "End-to-end coverage from enrolment through final grade.",
    features: [
      "Entire course managed",
      "All assignments, quizzes & exams",
      "Discussion posts managed",
      "B grade or better - guaranteed",
      "Flexible payment options",
    ],
  },
];

export interface Step {
  title: string;
  body: string;
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    title: "Place Your Order",
    body: "Share your course details, deadlines, and what you need help with.",
  },
  {
    title: "Get Matched with an Expert",
    body: "We assign a verified expert whose background matches your subject.",
  },
  {
    title: "Share Your Login Credentials",
    body: "Provide secure access so your expert can work directly in your course.",
  },
  {
    title: "Make a Secure Payment",
    body: "Choose full payment or a flexible instalment plan that suits you.",
  },
  {
    title: "Track Progress & Receive Your Grades",
    body: "Stay updated throughout with progress reports until the course closes.",
  },
];

export const TRUST_POINTS: Step[] = [
  {
    title: "End-to-End Encryption",
    body: "Your credentials and personal details are encrypted in transit and at rest.",
  },
  {
    title: "VPN-Protected Access",
    body: "Experts connect through protected access so activity looks consistent.",
  },
  {
    title: "B Grade Guarantee",
    body: "We stand behind the work with a clear, written grade guarantee.",
  },
  {
    title: "400+ Verified Experts",
    body: "A vetted bench of subject specialists across every major discipline.",
  },
  {
    title: "24/7 Support",
    body: "Reach us any time — questions, updates, or changes to your order.",
  },
];

export const PILLARS = [
  {
    title: "Elite Subject-Matter Experts",
    body: "Specialists with verified academic credentials in the exact subject your course covers.",
  },
  {
    title: "Comprehensive Platform Mastery",
    body: "Fluent across Canvas, Blackboard, Moodle, Pearson, and every major learning platform.",
  },
  {
    title: "Strict Deadline & Time Management",
    body: "Every assignment, quiz, and exam submitted on time — tracked against your course calendar.",
  },
  {
    title: "Ironclad Privacy & IP Security",
    body: "Your credentials and coursework stay encrypted and are never shared with third parties.",
  },
  {
    title: "Tailored Coursework Solutions",
    body: "Work matched to your course requirements and rubric, not generic template answers.",
  },
  {
    title: "Guaranteed A & B Grade Outcomes",
    body: "A written grade guarantee stands behind every course we take on.",
  },
];

export const TRUST_SECTION = {
  eyebrow: "Your Safety. Our Priority.",
  title: "Why You Can",
  accent: "Trust Us",
  titleTail: "Completely",
  lead: "Every aspect of our service is built around your safety, confidentiality, and academic success - so you can focus on your future without any worry.",
};

export const TRUST_BADGES = [
  {
    title: "Total Identity Protection",
    body: "Your personal details and account information stay private. Only the expert assigned to your work ever sees them, and nothing is shared outside our team.",
  },
  {
    title: "No AI & Plagiarism Guaranteed",
    body: "Every piece of work we deliver is 100% human-written and researched from scratch. We guarantee zero AI-generated content and zero plagiarism - fully original, custom work tailored precisely to your assignment requirements.",
  },
  {
    title: "Vetted Expert Tutors",
    body: "We never hire random freelancers. Our professional academic help comes from an elite pool of vetted scholars, ensuring you receive accurate, top tier subject help every single time you request our services.",
  },
  {
    title: "Strict Client Confidentiality",
    body: "Your secret study help is totally safe with us. Our entire team operates under strict non disclosure agreements, ensuring your academic records and personal details are never shared with anyone else ever.",
  },
  {
    title: "Risk Free Guarantee",
    body: "We take the financial risk out of getting academic help. If we fail to deliver the promised top grade on your coursework or exams, we will refund your full payment directly today.",
  },
  {
    title: "24/7 Round-the-Clock Support",
    body: "Questions or updates needed at 3 AM? Our support team is available every hour of every day, so you're never left waiting for a response that matters.",
  },
];

/** Bottom indicator row beneath the trust cards. */
export const TRUST_INDICATORS = [
  { icon: "\u{1F512}", label: "256-bit SSL Encrypted" },
  { icon: "\u{1F4DC}", label: "NDA-Bound Experts" },
  { icon: "\u{1F4B3}", label: "Full Refund If We Fail" },
];
