export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: "Full-time" | "Contract" | "Part-time";
  salaryRange: string;
  tags: string[];
};

export type MessageItem = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  unread: boolean;
};

export type Application = {
  id: string;
  position: string;
  company: string;
  stage: "Applied" | "Interview" | "Offer" | "Rejected";
  updatedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  stack: string;
  location: string;
  yearsExp: number;
  status: "New" | "Reviewed" | "Shortlisted";
  matchScore?: number;
  source?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  severity: "info" | "success" | "warning";
};

export type Interview = {
  id: string;
  candidateName: string;
  position: string;
  company: string;
  scheduledAt: string;
  mode: "Video" | "Phone" | "On-site";
  status: "Planned" | "Completed" | "Cancelled";
  interviewer: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Recruiter" | "Hiring Manager" | "Interviewer";
  status: "Active" | "Invited";
  lastActive: string;
};

export type Invoice = {
  id: string;
  period: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  active: boolean;
};

export type WebhookEndpoint = {
  id: string;
  url: string;
  event: string;
  active: boolean;
  failures: number;
  lastDelivery: string;
  secretMasked: string;
};

export type ActivityEvent = {
  id: string;
  area: string;
  message: string;
  createdAt: string;
  severity: "info" | "success" | "warning";
};

export type AnalyticsPoint = {
  label: string;
  applications: number;
  interviews: number;
  offers: number;
  hireRate: number;
};

export const sampleJobs: Job[] = [
  {
    id: "job-1",
    title: "Frontend Engineer (React/Next.js)",
    company: "NovaLabs",
    location: "Remote, EU",
    employmentType: "Full-time",
    salaryRange: "$3,500 - $5,000",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "job-2",
    title: "Backend Engineer (Node.js)",
    company: "CloudNest",
    location: "Warsaw / Hybrid",
    employmentType: "Full-time",
    salaryRange: "$4,200 - $6,200",
    tags: ["Node.js", "PostgreSQL", "API"],
  },
  {
    id: "job-3",
    title: "QA Automation Engineer",
    company: "SprintCore",
    location: "Remote, Worldwide",
    employmentType: "Contract",
    salaryRange: "$2,800 - $4,300",
    tags: ["Playwright", "Cypress", "CI/CD"],
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "DeployNow",
    location: "Berlin / Hybrid",
    employmentType: "Full-time",
    salaryRange: "$5,000 - $7,000",
    tags: ["AWS", "Kubernetes", "Terraform"],
  },
  {
    id: "job-5",
    title: "Product Designer (B2B SaaS)",
    company: "PulseGrid",
    location: "Remote, Worldwide",
    employmentType: "Part-time",
    salaryRange: "$2,200 - $3,400",
    tags: ["Figma", "UX", "Design System"],
  },
  {
    id: "job-6",
    title: "Data Engineer",
    company: "SkyMetrics",
    location: "Prague / Hybrid",
    employmentType: "Full-time",
    salaryRange: "$4,800 - $6,800",
    tags: ["Python", "Airflow", "BigQuery"],
  },
];

export const sampleMessages: MessageItem[] = [
  {
    id: "msg-1",
    sender: "Recruiter, NovaLabs",
    subject: "Interview invite",
    snippet: "We liked your profile. Are you available this Friday?",
    unread: true,
  },
  {
    id: "msg-2",
    sender: "Talent Team, CloudNest",
    subject: "Application update",
    snippet: "Your profile moved to the technical review stage.",
    unread: false,
  },
  {
    id: "msg-3",
    sender: "HR, SprintCore",
    subject: "New role match",
    snippet: "A new QA role matches your skills and preferences.",
    unread: false,
  },
  {
    id: "msg-4",
    sender: "Hiring Ops, SkyMetrics",
    subject: "Availability check",
    snippet: "Can you share your start date and notice period?",
    unread: true,
  },
];

export const sampleApplications: Application[] = [
  {
    id: "app-1",
    position: "Frontend Engineer",
    company: "NovaLabs",
    stage: "Interview",
    updatedAt: "2026-02-15",
  },
  {
    id: "app-2",
    position: "Backend Engineer",
    company: "CloudNest",
    stage: "Applied",
    updatedAt: "2026-02-13",
  },
  {
    id: "app-3",
    position: "QA Automation Engineer",
    company: "SprintCore",
    stage: "Offer",
    updatedAt: "2026-02-10",
  },
  {
    id: "app-4",
    position: "Data Engineer",
    company: "SkyMetrics",
    stage: "Rejected",
    updatedAt: "2026-02-08",
  },
];

export const sampleCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Olena Savchuk",
    stack: "React, TypeScript",
    location: "Lviv",
    yearsExp: 4,
    status: "New",
    matchScore: 87,
    source: "LinkedIn",
  },
  {
    id: "cand-2",
    name: "Dmytro Koval",
    stack: "Node.js, NestJS",
    location: "Kyiv",
    yearsExp: 5,
    status: "Reviewed",
    matchScore: 91,
    source: "Referral",
  },
  {
    id: "cand-3",
    name: "Nazar Hnatiuk",
    stack: "DevOps, AWS",
    location: "Remote",
    yearsExp: 6,
    status: "Shortlisted",
    matchScore: 95,
    source: "Direct",
  },
  {
    id: "cand-4",
    name: "Kateryna Bondar",
    stack: "QA Automation, Playwright",
    location: "Dnipro",
    yearsExp: 3,
    status: "New",
    matchScore: 82,
    source: "GitHub",
  },
];

export const sampleNotifications: NotificationItem[] = [
  {
    id: "not-1",
    title: "New high-fit candidate",
    description: "A new candidate with 91% fit was added to Frontend Engineer.",
    createdAt: "2026-02-16T09:30:00.000Z",
    read: false,
    severity: "success",
  },
  {
    id: "not-2",
    title: "Interview reminder",
    description: "Technical interview with Olena Savchuk starts in 2 hours.",
    createdAt: "2026-02-16T07:40:00.000Z",
    read: false,
    severity: "info",
  },
  {
    id: "not-3",
    title: "Billing warning",
    description: "Your Pro plan invoice is due in 3 days.",
    createdAt: "2026-02-15T15:15:00.000Z",
    read: true,
    severity: "warning",
  },
  {
    id: "not-4",
    title: "Webhook delivery recovered",
    description: "Webhook endpoint has resumed successful deliveries.",
    createdAt: "2026-02-14T11:20:00.000Z",
    read: true,
    severity: "success",
  },
];

export const sampleInterviews: Interview[] = [
  {
    id: "int-1",
    candidateName: "Olena Savchuk",
    position: "Frontend Engineer",
    company: "NovaLabs",
    scheduledAt: "2026-02-18T10:00:00.000Z",
    mode: "Video",
    status: "Planned",
    interviewer: "Andriy Melnyk",
  },
  {
    id: "int-2",
    candidateName: "Dmytro Koval",
    position: "Backend Engineer",
    company: "CloudNest",
    scheduledAt: "2026-02-17T14:30:00.000Z",
    mode: "On-site",
    status: "Planned",
    interviewer: "Yulia Hnatenko",
  },
  {
    id: "int-3",
    candidateName: "Nazar Hnatiuk",
    position: "DevOps Engineer",
    company: "DeployNow",
    scheduledAt: "2026-02-12T09:00:00.000Z",
    mode: "Video",
    status: "Completed",
    interviewer: "Maksym Pidopryhora",
  },
];

export const sampleTeamMembers: TeamMember[] = [
  {
    id: "team-1",
    name: "Ariana Tse",
    email: "ariana@hirenow.io",
    role: "Owner",
    status: "Active",
    lastActive: "2026-02-16T08:00:00.000Z",
  },
  {
    id: "team-2",
    name: "Ihor Lysenko",
    email: "ihor@hirenow.io",
    role: "Recruiter",
    status: "Active",
    lastActive: "2026-02-16T10:12:00.000Z",
  },
  {
    id: "team-3",
    name: "Nina Klym",
    email: "nina@hirenow.io",
    role: "Hiring Manager",
    status: "Invited",
    lastActive: "2026-02-11T13:20:00.000Z",
  },
];

export const sampleInvoices: Invoice[] = [
  {
    id: "inv-2026-02",
    period: "February 2026",
    amount: 249,
    status: "Pending",
    dueDate: "2026-02-20",
  },
  {
    id: "inv-2026-01",
    period: "January 2026",
    amount: 249,
    status: "Paid",
    dueDate: "2026-01-20",
  },
  {
    id: "inv-2025-12",
    period: "December 2025",
    amount: 199,
    status: "Paid",
    dueDate: "2025-12-20",
  },
];

export const sampleApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production ingest",
    prefix: "hn_live_7f8a",
    createdAt: "2026-01-12T09:00:00.000Z",
    lastUsed: "2026-02-16T10:45:00.000Z",
    active: true,
  },
  {
    id: "key-2",
    name: "Staging sync",
    prefix: "hn_test_4a1c",
    createdAt: "2025-11-01T12:00:00.000Z",
    lastUsed: "2026-02-14T15:10:00.000Z",
    active: true,
  },
];

export const sampleWebhooks: WebhookEndpoint[] = [
  {
    id: "wh-1",
    url: "https://api.partnercrm.com/hiring-events",
    event: "application.created",
    active: true,
    failures: 0,
    lastDelivery: "2026-02-16T09:51:00.000Z",
    secretMasked: "whsec_****83f2",
  },
  {
    id: "wh-2",
    url: "https://ops.hirenow.io/webhooks/interviews",
    event: "interview.updated",
    active: true,
    failures: 1,
    lastDelivery: "2026-02-15T17:23:00.000Z",
    secretMasked: "whsec_****19aa",
  },
];

export const sampleActivity: ActivityEvent[] = [
  {
    id: "act-1",
    area: "Matching",
    message: "3 new candidates matched Frontend Engineer over 80%.",
    createdAt: "2026-02-16T09:55:00.000Z",
    severity: "success",
  },
  {
    id: "act-2",
    area: "Automation",
    message: "Weekly digest for hiring managers has been sent.",
    createdAt: "2026-02-16T08:10:00.000Z",
    severity: "info",
  },
  {
    id: "act-3",
    area: "Billing",
    message: "February invoice created and awaiting payment.",
    createdAt: "2026-02-15T12:00:00.000Z",
    severity: "warning",
  },
];

export const sampleAnalytics: AnalyticsPoint[] = [
  { label: "W1", applications: 42, interviews: 14, offers: 4, hireRate: 9 },
  { label: "W2", applications: 55, interviews: 19, offers: 6, hireRate: 11 },
  { label: "W3", applications: 61, interviews: 22, offers: 7, hireRate: 11 },
  { label: "W4", applications: 58, interviews: 24, offers: 9, hireRate: 15 },
  { label: "W5", applications: 66, interviews: 27, offers: 10, hireRate: 15 },
  { label: "W6", applications: 71, interviews: 29, offers: 12, hireRate: 17 },
];

export type Company = {
  id: string;
  name: string;
  industry: string;
  location: string;
  openPositions: number;
  rating: number;
  description: string;
  techStack: string[];
  size: string;
};

export const sampleCompanies: Company[] = [
  {
    id: "comp-1",
    name: "NovaLabs",
    industry: "SaaS",
    location: "Remote, EU",
    openPositions: 5,
    rating: 4.7,
    description: "Product-led B2B platform for developer tooling with focus on CI/CD automation.",
    techStack: ["React", "Node.js", "AWS", "PostgreSQL"],
    size: "50-200",
  },
  {
    id: "comp-2",
    name: "CloudNest",
    industry: "Fintech",
    location: "Warsaw, Poland",
    openPositions: 3,
    rating: 4.5,
    description: "Digital banking infrastructure for European neobanks and fintechs.",
    techStack: ["Go", "Kubernetes", "Kafka", "React"],
    size: "200-500",
  },
  {
    id: "comp-3",
    name: "SprintCore",
    industry: "Consulting",
    location: "Remote, Worldwide",
    openPositions: 8,
    rating: 4.3,
    description: "Engineering consultancy specializing in QA automation and testing strategy.",
    techStack: ["Playwright", "Cypress", "TypeScript", "Python"],
    size: "20-50",
  },
  {
    id: "comp-4",
    name: "DeployNow",
    industry: "Startup",
    location: "Berlin, Germany",
    openPositions: 4,
    rating: 4.8,
    description: "One-click deployment platform for modern microservice architectures.",
    techStack: ["Terraform", "AWS", "Docker", "Next.js"],
    size: "10-20",
  },
  {
    id: "comp-5",
    name: "PulseGrid",
    industry: "E-commerce",
    location: "Kyiv, Ukraine",
    openPositions: 6,
    rating: 4.4,
    description: "Headless commerce engine for high-traffic marketplaces across Eastern Europe.",
    techStack: ["Next.js", "GraphQL", "Redis", "Elasticsearch"],
    size: "100-200",
  },
  {
    id: "comp-6",
    name: "SkyMetrics",
    industry: "SaaS",
    location: "Prague, Czech Republic",
    openPositions: 2,
    rating: 4.6,
    description: "Real-time analytics platform for product and growth teams in SaaS companies.",
    techStack: ["Python", "BigQuery", "React", "Airflow"],
    size: "50-100",
  },
];

export type SalaryEntry = {
  role: string;
  location: string;
  min: number;
  median: number;
  max: number;
};

export const salaryData: SalaryEntry[] = [
  { role: "Frontend", location: "Remote EU", min: 2800, median: 4200, max: 6000 },
  { role: "Frontend", location: "Ukraine", min: 1800, median: 3000, max: 4500 },
  { role: "Frontend", location: "Poland", min: 2500, median: 3800, max: 5500 },
  { role: "Frontend", location: "Germany", min: 4000, median: 5500, max: 7500 },
  { role: "Frontend", location: "USA", min: 6000, median: 8500, max: 12000 },
  { role: "Backend", location: "Remote EU", min: 3200, median: 4800, max: 7000 },
  { role: "Backend", location: "Ukraine", min: 2200, median: 3500, max: 5200 },
  { role: "Backend", location: "Poland", min: 3000, median: 4200, max: 6200 },
  { role: "Backend", location: "Germany", min: 4500, median: 6000, max: 8500 },
  { role: "Backend", location: "USA", min: 7000, median: 9500, max: 14000 },
  { role: "QA", location: "Remote EU", min: 2200, median: 3400, max: 5000 },
  { role: "QA", location: "Ukraine", min: 1500, median: 2500, max: 3800 },
  { role: "QA", location: "Poland", min: 2000, median: 3200, max: 4600 },
  { role: "QA", location: "Germany", min: 3500, median: 4800, max: 6500 },
  { role: "QA", location: "USA", min: 5000, median: 7000, max: 10000 },
  { role: "DevOps", location: "Remote EU", min: 3500, median: 5200, max: 7500 },
  { role: "DevOps", location: "Ukraine", min: 2500, median: 3800, max: 5500 },
  { role: "DevOps", location: "Poland", min: 3200, median: 4500, max: 6500 },
  { role: "DevOps", location: "Germany", min: 5000, median: 6500, max: 9000 },
  { role: "DevOps", location: "USA", min: 7500, median: 10000, max: 15000 },
  { role: "Designer", location: "Remote EU", min: 2000, median: 3200, max: 4800 },
  { role: "Designer", location: "Ukraine", min: 1200, median: 2200, max: 3400 },
  { role: "Designer", location: "Poland", min: 1800, median: 2800, max: 4200 },
  { role: "Designer", location: "Germany", min: 3000, median: 4500, max: 6500 },
  { role: "Designer", location: "USA", min: 5000, median: 7000, max: 10000 },
  { role: "Data Engineer", location: "Remote EU", min: 3200, median: 4800, max: 7000 },
  { role: "Data Engineer", location: "Ukraine", min: 2200, median: 3500, max: 5000 },
  { role: "Data Engineer", location: "Poland", min: 3000, median: 4200, max: 6000 },
  { role: "Data Engineer", location: "Germany", min: 4500, median: 6200, max: 8800 },
  { role: "Data Engineer", location: "USA", min: 7000, median: 9500, max: 14000 },
];

export type BlogArticle = {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  author: string;
  date: string;
};

export const sampleArticles: BlogArticle[] = [
  {
    id: "blog-1",
    title: "How to Ace Your Frontend Interview in 2026",
    category: "Career",
    readingTime: "8 min",
    excerpt: "Key strategies and practical tips for preparing for modern frontend interviews including system design rounds.",
    author: "Olena Marchenko",
    date: "2026-02-14",
  },
  {
    id: "blog-2",
    title: "TypeScript 6.0: What Changed and Why It Matters",
    category: "Tech",
    readingTime: "6 min",
    excerpt: "A deep dive into the latest TypeScript features and how they affect your daily development workflow.",
    author: "Artem Bondarenko",
    date: "2026-02-10",
  },
  {
    id: "blog-3",
    title: "Building an Inclusive Hiring Pipeline",
    category: "Hiring",
    readingTime: "10 min",
    excerpt: "Practical approaches to reducing bias in screening, interviews, and offer decisions for engineering teams.",
    author: "Nina Klym",
    date: "2026-02-06",
  },
  {
    id: "blog-4",
    title: "Remote-First Engineering Culture: A Playbook",
    category: "Remote",
    readingTime: "12 min",
    excerpt: "Lessons learned from scaling a fully distributed team across 8 time zones without losing velocity.",
    author: "Dmytro Koval",
    date: "2026-01-28",
  },
  {
    id: "blog-5",
    title: "From Junior to Senior in 3 Years: My Path",
    category: "Career",
    readingTime: "7 min",
    excerpt: "An honest reflection on what accelerated my growth and what I wish I had done differently early on.",
    author: "Kateryna Bondar",
    date: "2026-01-20",
  },
  {
    id: "blog-6",
    title: "Why We Switched from REST to GraphQL",
    category: "Tech",
    readingTime: "9 min",
    excerpt: "The tradeoffs, migration strategy, and measurable outcomes after migrating our API layer at PulseGrid.",
    author: "Nazar Hnatiuk",
    date: "2026-01-15",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
};

export const sampleTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Olena Savchuk",
    role: "Frontend Engineer",
    company: "NovaLabs",
    quote: "HireNow helped me land my dream role in just 2 weeks. The job matching was spot-on and the pipeline tracking kept me organized throughout the process.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Andriy Melnyk",
    role: "Engineering Manager",
    company: "CloudNest",
    quote: "We reduced our time-to-hire by 40% after switching to HireNow. The candidate pipeline and team collaboration features are exactly what we needed.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Yulia Hnatenko",
    role: "QA Lead",
    company: "SprintCore",
    quote: "Finally a hiring platform that understands tech roles. The smart matching actually works — every candidate we received was relevant and well-qualified.",
    rating: 4,
  },
];
