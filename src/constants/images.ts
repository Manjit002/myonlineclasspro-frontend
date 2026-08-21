/**
 * Image assets, carried over from the original homepage.
 *
 * NOTE ON HOSTING: only the myonlineclasspro.com URLs are first-party.
 * The rest are hotlinked from third parties (university sites,
 * Wikipedia, Cloudinary tenants, studycrumb.com) and the
 * encrypted-tbn0.gstatic.com entries are Google image-search thumbnails,
 * which are cache URLs that expire without warning. These will break at
 * some point regardless of anything in this codebase. They should be
 * downloaded and re-hosted under myonlineclasspro.com/photos before
 * launch -- see the note in the README section of this file's PR.
 */

export interface ImageAsset {
  src: string;
  alt: string;
}

export const LOGO_SRC =
  "https://myonlineclasspro.com/photos/my%20online%20class%20pro%20png%204.png";

/** Universities whose students the site serves. */
export const UNIVERSITY_LOGOS: ImageAsset[] = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFkZD2cXQOXthNg-IHq3mUxDjIqiqxYPVNw&s",
    alt: "Nova Southeastern University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBtJQYOXapnAy7LiNuYL6VF3j9XuANrHIvfA&s",
    alt: "Widener University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb5jzdI6YaOXMAEQE76FvZ3p_wGOd72Rzslw&s",
    alt: "Southern New Hampshire University",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/University_of_Cincinnati_logo.svg/960px-University_of_Cincinnati_logo.svg.png",
    alt: "University of Cincinnati",
  },
  {
    src: "https://quincycollege.edu/wp-content/uploads/QC-Logo.png",
    alt: "Quincy College",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYItivtQp1lPYdLc4ZVBunQbJzRxOvLvNpdw&s",
    alt: "Capella University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR41ifwQodLuIUMU_waz_fIr2O0CM8-YGOXLw&s",
    alt: "Penn Foster",
  },
  {
    src: "https://res.cloudinary.com/micronetonline/image/upload/c_crop,h_803,w_1459,x_0,y_0/f_auto/q_auto/v1750725789/tenants/1f8ef830-afa6-4817-8817-3b1d6e69d0f9/932f636ef99b467fa12490751643c592/AcademicGCU-Lope-267.png",
    alt: "Grand Canyon University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMsS7Bmim26FjIaRtnHnx4t7dnMbPJuRc2zw&s",
    alt: "University of Phoenix",
  },
  {
    src: "https://www.collegeworks.org/assets/TAMUC-Resized-B-1.png",
    alt: "East Texas A&M University",
  },
  {
    src: "https://marcom.purdue.edu/app/uploads/2023/08/PG-Logo01.jpg",
    alt: "Purdue Global",
  },
  {
    src: "https://myonlineclasspro.com/photos/DeVry_University_Logo.png",
    alt: "DeVry University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrtRbPIRHuqEPzx3NnX1YA4Sm7GeUWU5Xq_g&s",
    alt: "Lamar University",
  },
  {
    src: "https://njbmagazine.com/wp-content/uploads/2024/03/TESU.png",
    alt: "Thomas Edison State University",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHxuKlm6e0cXDTugUSsFJqNMmY2q4g21YW2A&s",
    alt: "University of California Berkeley",
  },
  {
    src: "https://www.asurams.edu/images/news/Albany-State-University-Logo.jpg",
    alt: "Albany State University",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Mercer_University_logo.png",
    alt: "Mercer University",
  },
  {
    src: "https://youredc.com/images/uploads/Keiser_University_Seahawk_with_Line_Logo_to_Left_(SH).jpg",
    alt: "Keiser University",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/45/New_TCC_LOGO_2.jpg",
    alt: "Tulsa Community College",
  },
  {
    src: "https://ctstate.edu/images/Logos-and-graphics/Logos-CT-State/CT-STATE-logo-color-RGB.png",
    alt: "CT State Community College",
  },
  {
    src: "https://res.cloudinary.com/micronetonline/image/upload/q_auto/f_auto/c_crop,h_1075,w_3000,x_0,y_0/v1632181917/tenants/11f41d76-5feb-4fac-bfa5-27e54348076a/cb1e6e5a3ce143168919830a4ce41482/HDMC-Logo-2021-01.png",
    alt: "High Desert Medical College",
  },
  {
    src: "https://mma.prnewswire.com/media/1772528/Copy_of_LSS_Logo_RGB_Logo.jpg?p=facebook",
    alt: "Lone Star College",
  },
];

/** Real graded-result screenshots used as social proof. */
const GRADE_ALTS = [
  "90.39%",
  "94.99%",
  "100%",
  "98.59%",
  "98.59%",
  "97.18%",
  "86.64%",
  "97.70%",
  "83.05%",
  "100%",
  "94.00%",
  "92.50%",
  "97.26%",
  "95.34%",
  "93.67%",
  "74.24%",
  "94.27%",
  "96.78%",
  "100%",
  "92.58%",
];

export const GRADE_SCREENSHOTS: ImageAsset[] = GRADE_ALTS.map((pct, i) => ({
  src: `https://myonlineclasspro.com/photos/Grade${i + 1}.png`,
  alt: `Canvas gradebook screenshot showing ${pct}`,
}));

export const PAYMENT_ICONS: ImageAsset[] = [
  { src: "https://studycrumb.com/img/misc/payments/visa.svg", alt: "Visa" },
  {
    src: "https://studycrumb.com/img/misc/payments/mastercard.svg",
    alt: "Mastercard",
  },
  {
    src: "https://studycrumb.com/img/misc/payments/amex.svg",
    alt: "American Express",
  },
  {
    src: "https://studycrumb.com/img/misc/payments/discover.svg",
    alt: "Discover",
  },
  {
    src: "https://studycrumb.com/img/misc/payments/apple-pay.svg",
    alt: "Apple Pay",
  },
  {
    src: "https://studycrumb.com/img/misc/payments/diners-club.svg",
    alt: "Diners Club",
  },
  { src: "https://studycrumb.com/img/misc/payments/jcb.svg", alt: "JCB" },
  {
    src: "https://studycrumb.com/img/misc/payments/union-pay.svg",
    alt: "UnionPay",
  },
];
