/**
 * "Get Expert Academic Help" cards — copy and images taken verbatim
 * from the original index.html. These are the p1–p6 photos the original
 * used here; the same assets were previously shown as a plain grid,
 * which lost the carousel and image treatment they were designed for.
 */
export interface ExpertCard {
  title: string;
  text: string;
  img: string;
  alt: string;
}

export const EXPERT_CARDS: ExpertCard[] = [
  {
    title: "Protect Your GPA",
    text: "You cannot afford a low grade when scholarships or grad school applications are on the line. Rely on our professional academic help to deliver the A-grade quality that secures your academic future.",
    img: "https://myonlineclasspro.com/photos/p1.png",
    alt: "Protect Your GPA",
  },
  {
    title: "Drowning In Deadlines?",
    text: "When three papers and a final project are due on the exact same day, panic sets in. We provide expert assignment help to clear your backlog, writing and submitting flawless work right on time.",
    img: "https://myonlineclasspro.com/photos/p2.png",
    alt: "Drowning In Deadlines",
  },
  {
    title: "Stuck On Hard Concepts?",
    text: "From complex calculus to dense legal case studies, advanced topics can completely stall your progress. Our specialized subject help connects you with degree-holding experts who solve your toughest academic challenges instantly.",
    img: "https://myonlineclasspro.com/photos/p3.png",
    alt: "Stuck On Hard Concepts",
  },
  {
    title: "Need 1-on-1 Guidance?",
    text: "Sometimes reading the textbook isn't enough to grasp the material. Our dedicated tutors provide personalized one-on-one academic support, walking you through every concept until you fully understand and can perform confidently.",
    img: "https://myonlineclasspro.com/photos/p4.png",
    alt: "Need 1-on-1 Guidance",
  },
  {
    title: "Exhausted From Cramming?",
    text: "Spending all night in the library doesn't guarantee a good test score. We offer targeted study help and exam preparation to maximize your results while saving you hours of lost sleep and frustration.",
    img: "https://myonlineclasspro.com/photos/p5.png",
    alt: "Exhausted From Cramming",
  },
  {
    title: "Tedious Daily Coursework",
    text: "Endless discussion boards, peer replies, and weekly quizzes drain your energy. Hand over the busy work. Our homework help team manages your daily portal tasks so you can focus on your actual life.",
    img: "https://myonlineclasspro.com/photos/p6.png",
    alt: "Tedious Daily Coursework",
  },
];
