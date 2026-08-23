export const meta = {
  name: "Ashar Ashfaq",
  /**
   * Leads with the title recruiters and ATS keyword filters actually search
   * for, and the one your employment history backs up. `focus` carries the
   * positioning that "AI Product Engineer" used to do on its own.
   */
  role: "Senior Software Engineer",
  focus: "Fintech & AI systems engineering",
  /** The footer sign-off. Kept here so it cannot drift from `role`. */
  availability: "Open to senior engineering & tech lead roles",
  discipline: "Backend-anchored, full-stack range",
  location: "Karachi, PK",
  since: 2018,
  email: "ashar.ashfaq2@gmail.com",
  phone: "+92 344 248 4597",
  linkedin: "https://www.linkedin.com/in/ashar-siddiqui-795183113/",
  /**
   * The display type carries the craft, not the specialty — "AI engineer" is a
   * narrower identity than the CV supports. The specialty is stated in the
   * intro paragraph directly below it instead.
   */
  tagline: ["Leads systems", "that scale", "under pressure."],
  summary:
    "Senior Software Engineer and Tech Lead with 7+ years building scalable, enterprise-grade systems across fintech, ERP, and AI. Modernizes legacy platforms into microservices, leads cross-functional engineering teams, and ships AI-native tooling on OpenAI and Anthropic APIs across the full stack.",
};

export type Project = {
  id: string;
  index: string;
  title: string;
  role: string;
  year: string;
  stack: string[];
  blurb: string;
  href?: string;
  /** Drop a screenshot at /public/work/<id>.jpg and set this to "/work/<id>.jpg". */
  image?: string;
  /** Base hue for the generated plate when no image is supplied. */
  hue: number;
};

export const projects: Project[] = [
  {
    id: "souq",
    index: "01",
    title: "Souq Al Tijara",
    role: "Tech lead & co-product lead",
    year: "2026 —",
    stack: ["NestJS", "React", "Node.js", "RabbitMQ", "Kafka", "Claude AI-assisted"],
    blurb:
      "Earned-wage access and fintech platform for a Pakistan-based corporation, letting employees draw earned wages on demand. Built on a NestJS microservices backend with RabbitMQ and Kafka handling real-time processing at scale.",
    href: "https://souqaltijara.com",
    hue: 18,
  },
  {
    id: "testbase360",
    index: "02",
    title: "Testbase360",
    role: "Backend lead & co-product lead",
    year: "2025 —",
    stack: ["NestJS", "React", "Node.js"],
    blurb:
      "Recruiter management portal with candidate assessments and AI-powered scoring, streamlining hiring workflows for recruitment teams.",
    href: "https://testbase360.com",
    hue: 190,
  },
  {
    id: "maybank",
    index: "03",
    title: "Maybank Lead Management",
    role: "Development lead — team of 4",
    year: "2024 — 2025",
    stack: ["NestJS", "Kafka", "Hazelcast", "MSSQL"],
    blurb:
      "NestJS microservices backend replacing Malaysia's largest bank's legacy Salesforce system. Kafka streaming and Hazelcast caching power real-time product recommendations.",
    hue: 280,
  },
  {
    id: "caary",
    index: "04",
    title: "Caary Capital",
    role: "Lead developer",
    year: "2022 — 2024",
    stack: ["Node.js", ".NET", "React", "Codat"],
    blurb:
      "Accounting and expense management module for a Canadian business credit and spend platform. QuickBooks/Xero sync via Codat, multi-currency FX, feature parity with Brex.",
    href: "https://caary.com",
    hue: 140,
  },
  {
    id: "creditbook",
    index: "05",
    title: "CreditBook",
    role: "Senior full stack developer",
    year: "2022",
    stack: ["React Native", "Node.js", "AWS Lambda"],
    blurb:
      "Fintech mobile app with 700,000+ installs and 60,000+ daily active users. React Native features backed by AWS Lambda services.",
    hue: 45,
  },
];

export const numbers = [
  { value: "7+", label: "Years shipping production systems" },
  { value: "3x", label: "Promoted into technical leadership" },
  { value: "700K+", label: "Installs on shipped fintech products" },
  { value: "60K+", label: "Daily active users served" },
];

/**
 * Grouped rather than flat: a keyword scanner reads "Frontend: React, Next.js"
 * as a competency, and a human gets the shape of the skill set instead of an
 * undifferentiated list. Each group is one column, and one spur of the fork.
 */
export const capabilities = [
  {
    group: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "Microservices", "Kafka", "REST APIs"],
  },
  {
    group: "AI",
    items: ["OpenAI Assistants", "Anthropic API", "RAG", "AI Agents", "Prompt Engineering"],
  },
  {
    group: "Frontend",
    items: ["React", "React Native", "JavaScript", "HTML/CSS"],
  },
  {
    group: "Infrastructure",
    items: ["AWS", "Docker", "PostgreSQL", "MSSQL", "Redis", "CI/CD"],
  },
];

/**
 * Rendered by the About section. An empty array hides the block entirely, and
 * ATS screens commonly reject on a missing degree field — so it stays filled.
 */
export const education: {
  school: string;
  credential: string;
  period: string;
  note?: string;
}[] = [
  {
    school: "University of Karachi (UBIT)",
    credential: "BS, Computer Science",
    period: "2015 — 2019",
  },
];

export const experience = [
  {
    company: "Xavia Solutions",
    role: "Senior Software Engineer & Tech Lead",
    period: "Aug 2024 — Present",
    note: "Leads cross-functional teams across fintech, ERP, and AI verticals.",
  },
  {
    company: "Maybank (via AMK Group)",
    role: "Senior Software Engineer — Development Lead",
    period: "Aug 2024 — Aug 2025",
    note: "NestJS microservices replacing legacy Salesforce for Malaysia's largest bank.",
  },
  {
    company: "Caary Capital",
    role: "Senior Software Engineer",
    period: "Aug 2022 — Jul 2024",
    note: "Led accounting & spend-management module for a Canadian fintech platform.",
  },
  {
    company: "CreditBook",
    role: "Senior Full Stack Developer",
    period: "May 2022 — Jul 2022",
    note: "Backend and AWS Lambda services for a 700K-install fintech app.",
  },
  {
    company: "M3 Technologies",
    role: "Full Stack Developer",
    period: "Mar 2021 — May 2022",
    note: "MERN dashboards, fintech solutions, and telecom-grade VAS integrations.",
  },
  {
    company: "TrulyFuture",
    role: "Android Developer → Tech Lead → CTO",
    period: "Oct 2018 — Mar 2021",
    note: "Led a ride-hailing app from concept to launch as the company's first product.",
  },
];
