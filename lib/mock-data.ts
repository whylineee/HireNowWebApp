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
