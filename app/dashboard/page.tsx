"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import { createClient } from "@/utils/supabase/client";
import {
  changePassword,
  getSession,
  signOut,
  type LocalSession,
  type UserRole,
} from "@/lib/local-auth";
import {
  sampleApplications,
  sampleApiKeys,
  sampleAnalytics,
  sampleActivity,
  sampleCandidates,
  sampleInterviews,
  sampleInvoices,
  sampleJobs,
  sampleMessages,
  sampleNotifications,
  sampleTeamMembers,
  sampleWebhooks,
  type Application,
  type ApiKey,
  type AnalyticsPoint,
  type ActivityEvent,
  type Candidate,
  type Interview,
  type Invoice,
  type Job,
  type MessageItem,
  type NotificationItem,
  type TeamMember,
  type WebhookEndpoint,
} from "@/lib/mock-data";
import type { AppLanguage } from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";

type DashboardTab =
  | "overview"
  | "jobs"
  | "applications"
  | "messages"
  | "notifications"
  | "interviews"
  | "analytics"
  | "team"
  | "billing"
  | "developer"
  | "my_account"
  | "job_posts"
  | "candidates";

type JobTypeFilter = Job["employmentType"] | "all";

type ResumeExperience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

type ResumeState = {
  fullName: string;
  email: string;
  headline: string;
  location: string;
  summary: string;
  skills: string[];
  experiences: ResumeExperience[];
};

type IntegrationProvider = "github" | "linkedin";

type IntegrationConnection = {
  connected: boolean;
  username: string;
  profileUrl: string;
  connectedAt: string | null;
};

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isEmployer: boolean;
};

type WorkspaceState = {
  jobs: Job[];
  savedJobs: string[];
  appliedJobIds: string[];
  messages: MessageItem[];
  notifications: NotificationItem[];
  interviews: Interview[];
  applications: Application[];
  candidates: Candidate[];
  teamMembers: TeamMember[];
  invoices: Invoice[];
  apiKeys: ApiKey[];
  webhooks: WebhookEndpoint[];
  activity: ActivityEvent[];
  analytics: AnalyticsPoint[];
  resume: ResumeState;
  integrations: Record<IntegrationProvider, IntegrationConnection>;
  chats: Record<string, ChatMessage[]>;
};

type Notice = {
  severity: "success" | "error" | "info";
  message: string;
};

type ConnectionDialogState = {
  open: boolean;
  provider: IntegrationProvider;
  username: string;
  profileUrl: string;
  error: string;
};

type TabConfig = {
  value: DashboardTab;
  labelKey: string;
  icon: React.ReactNode;
};

const seekerTabs: TabConfig[] = [
  {
    value: "overview",
    labelKey: "tab.overview",
    icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
  },
  {
    value: "jobs",
    labelKey: "tab.jobs",
    icon: <WorkOutlineIcon fontSize="small" />,
  },
  {
    value: "applications",
    labelKey: "tab.applications",
    icon: <PostAddOutlinedIcon fontSize="small" />,
  },
  {
    value: "messages",
    labelKey: "tab.messages",
    icon: <EmailOutlinedIcon fontSize="small" />,
  },
  {
    value: "notifications",
    labelKey: "tab.notifications",
    icon: <NotificationsOutlinedIcon fontSize="small" />,
  },
  {
    value: "interviews",
    labelKey: "tab.interviews",
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
  {
    value: "my_account",
    labelKey: "tab.myAccount",
    icon: <PersonOutlineIcon fontSize="small" />,
  },
];

const employerTabs: TabConfig[] = [
  {
    value: "overview",
    labelKey: "tab.overview",
    icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
  },
  {
    value: "job_posts",
    labelKey: "tab.jobPosts",
    icon: <PostAddOutlinedIcon fontSize="small" />,
  },
  {
    value: "candidates",
    labelKey: "tab.candidates",
    icon: <GroupsOutlinedIcon fontSize="small" />,
  },
  {
    value: "messages",
    labelKey: "tab.messages",
    icon: <EmailOutlinedIcon fontSize="small" />,
  },
  {
    value: "notifications",
    labelKey: "tab.notifications",
    icon: <NotificationsOutlinedIcon fontSize="small" />,
  },
  {
    value: "interviews",
    labelKey: "tab.interviews",
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
  {
    value: "analytics",
    labelKey: "tab.analytics",
    icon: <InsightsOutlinedIcon fontSize="small" />,
  },
  {
    value: "team",
    labelKey: "tab.team",
    icon: <GroupsOutlinedIcon fontSize="small" />,
  },
  {
    value: "billing",
    labelKey: "tab.billing",
    icon: <CreditCardOutlinedIcon fontSize="small" />,
  },
  {
    value: "developer",
    labelKey: "tab.developer",
    icon: <CodeRoundedIcon fontSize="small" />,
  },
];

const WORKSPACE_STORAGE_KEY = "hire_now_workspace_v2";

function stageColor(stage: string): "default" | "success" | "warning" | "error" {
  if (stage === "Offer" || stage === "Accepted") {
    return "success";
  }
  if (stage === "Interview") {
    return "warning";
  }
  if (stage === "Rejected") {
    return "error";
  }
  return "default";
}

function candidateColor(status: Candidate["status"]): "default" | "success" | "warning" {
  if (status === "Shortlisted" || status === "Accepted") {
    return "success";
  }
  if (status === "Reviewed") {
    return "warning";
  }
  return "default";
}

function notificationColor(
  severity: NotificationItem["severity"],
): "default" | "success" | "warning" {
  if (severity === "success") {
    return "success";
  }
  if (severity === "warning") {
    return "warning";
  }
  return "default";
}

function interviewColor(status: Interview["status"]): "default" | "success" | "warning" {
  if (status === "Completed") {
    return "success";
  }
  if (status === "Cancelled") {
    return "warning";
  }
  return "default";
}

function invoiceColor(status: Invoice["status"]): "default" | "success" | "warning" | "error" {
  if (status === "Paid") {
    return "success";
  }
  if (status === "Overdue") {
    return "error";
  }
  if (status === "Pending") {
    return "warning";
  }
  return "default";
}

function activityColor(
  severity: ActivityEvent["severity"],
): "default" | "success" | "warning" {
  if (severity === "success") {
    return "success";
  }
  if (severity === "warning") {
    return "warning";
  }
  return "default";
}

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale);
}

function formatDateTime(value: string, locale: string) {
  return new Date(value).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildResumeText(
  resume: ResumeState,
  labels: { summary: string; skills: string; experience: string },
) {
  const header = [
    `${resume.fullName}`,
    `${resume.headline}`,
    `${resume.location}`,
    `${resume.email}`,
    "",
    labels.summary,
    resume.summary,
    "",
    labels.skills,
    resume.skills.join(", "),
    "",
    labels.experience,
  ];

  const lines = [...header];

  resume.experiences.forEach((item) => {
    lines.push(`${item.role} | ${item.company} | ${item.period}`);
    lines.push(item.description);
    lines.push("");
  });

  return lines.join("\n");
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getEmptyConnection(): IntegrationConnection {
  return {
    connected: false,
    username: "",
    profileUrl: "",
    connectedAt: null,
  };
}

function createDefaultResume(session: LocalSession | null): ResumeState {
  return {
    fullName: session?.fullName ?? "",
    email: session?.email ?? "",
    headline: "Frontend Developer",
    location: "Kyiv, Ukraine",
    summary:
      "I build modern web applications and focus on user-friendly interfaces.",
    skills: ["React", "TypeScript", "Next.js"],
    experiences: [
      {
        id: "exp-1",
        role: "Frontend Developer",
        company: "Freelance",
        period: "2023 - Present",
        description: "Built dashboards and landing pages for product teams.",
      },
    ],
  };
}

function createDefaultWorkspace(session: LocalSession | null): WorkspaceState {
  return {
    jobs: [],
    savedJobs: [],
    appliedJobIds: [],
    messages: [], // Fake messages removed
    notifications: [], // Fake notifications removed
    interviews: [], // Fake interviews removed
    applications: [], // Fake applications removed
    candidates: [], // Fake candidates removed
    teamMembers: [], // Fake team members removed
    invoices: [],
    apiKeys: [],
    webhooks: [],
    activity: [],
    analytics: [],
    resume: createDefaultResume(session),
    integrations: {
      github: getEmptyConnection(),
      linkedin: getEmptyConnection(),
    },
    chats: {},
  };
}

function sanitizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function sanitizeResumeExperience(value: unknown, fallback: ResumeExperience[]): ResumeExperience[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      return {
        id: `exp-import-${index}`,
        role: "",
        company: "",
        period: "",
        description: "",
      };
    }

    const entry = item as Partial<ResumeExperience>;

    return {
      id: typeof entry.id === "string" && entry.id.length > 0 ? entry.id : `exp-import-${index}`,
      role: typeof entry.role === "string" ? entry.role : "",
      company: typeof entry.company === "string" ? entry.company : "",
      period: typeof entry.period === "string" ? entry.period : "",
      description: typeof entry.description === "string" ? entry.description : "",
    };
  });
}

function sanitizeResume(rawResume: unknown, session: LocalSession | null): ResumeState {
  const fallback = createDefaultResume(session);

  if (!rawResume || typeof rawResume !== "object") {
    return fallback;
  }

  const resume = rawResume as Partial<ResumeState>;

  return {
    fullName:
      typeof resume.fullName === "string" && resume.fullName.trim().length > 0
        ? resume.fullName
        : (session?.fullName ?? fallback.fullName),
    email: session?.email ?? fallback.email,
    headline: typeof resume.headline === "string" ? resume.headline : fallback.headline,
    location: typeof resume.location === "string" ? resume.location : fallback.location,
    summary: typeof resume.summary === "string" ? resume.summary : fallback.summary,
    skills: (() => {
      const rawSkills = sanitizeStringArray(resume.skills);
      return rawSkills.length > 0 ? rawSkills : fallback.skills;
    })(),
    experiences: sanitizeResumeExperience(resume.experiences, fallback.experiences),
  };
}

function sanitizeConnection(rawConnection: unknown): IntegrationConnection {
  if (!rawConnection || typeof rawConnection !== "object") {
    return getEmptyConnection();
  }

  const connection = rawConnection as Partial<IntegrationConnection>;

  return {
    connected: Boolean(connection.connected),
    username: typeof connection.username === "string" ? connection.username : "",
    profileUrl: typeof connection.profileUrl === "string" ? connection.profileUrl : "",
    connectedAt: typeof connection.connectedAt === "string" ? connection.connectedAt : null,
  };
}

function sanitizeWorkspace(rawWorkspace: unknown, session: LocalSession | null): WorkspaceState {
  const fallback = createDefaultWorkspace(session);

  if (!rawWorkspace || typeof rawWorkspace !== "object") {
    return fallback;
  }

  const workspace = rawWorkspace as Partial<WorkspaceState>;

  return {
    jobs: [], // Force empty, will be fetched
    savedJobs: sanitizeStringArray(workspace.savedJobs),
    appliedJobIds: sanitizeStringArray(workspace.appliedJobIds),
    messages: [], // Force empty to drop local storage fakes
    notifications: [], // Force empty to drop local storage fakes
    interviews: [], // Force empty
    applications: [], // Force empty, will be fetched
    candidates: [], // Force empty, will be fetched
    teamMembers: [], // Force empty
    invoices: [],
    apiKeys: [],
    webhooks: [],
    activity: [],
    analytics: [],
    resume: sanitizeResume(workspace.resume, session),
    integrations: {
      github: sanitizeConnection(workspace.integrations?.github),
      linkedin: sanitizeConnection(workspace.integrations?.linkedin),
    },
    chats: workspace.chats && typeof workspace.chats === "object" ? workspace.chats as Record<string, ChatMessage[]> : {},
  };
}

function loadWorkspaceFromStorage(session: LocalSession | null): WorkspaceState {
  if (typeof window === "undefined" || !session) {
    return createDefaultWorkspace(session);
  }

  const storage = safeJsonParse<Record<string, unknown>>(
    (() => {
      try {
        return window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      } catch {
        return null;
      }
    })(),
    {},
  );

  const existing = storage[session.email];
  if (!existing) {
    return createDefaultWorkspace(session);
  }

  return sanitizeWorkspace(existing, session);
}

function persistWorkspace(session: LocalSession, workspace: WorkspaceState) {
  if (typeof window === "undefined") {
    return;
  }

  const storage = safeJsonParse<Record<string, WorkspaceState>>(
    (() => {
      try {
        return window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      } catch {
        return null;
      }
    })(),
    {},
  );

  storage[session.email] = workspace;

  try {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(storage));
  } catch {
    // Ignore storage write errors.
  }
}

function providerMeta(provider: IntegrationProvider) {
  if (provider === "github") {
    return {
      labelKey: "integration.github",
      icon: <GitHubIcon fontSize="small" />,
      host: "github.com",
      profilePrefix: "https://github.com/",
      oauthUrl: "https://github.com/login/oauth/authorize",
    };
  }

  return {
    labelKey: "integration.linkedin",
    icon: <LinkedInIcon fontSize="small" />,
    host: "linkedin.com",
    profilePrefix: "https://www.linkedin.com/in/",
    oauthUrl: "https://www.linkedin.com/oauth/v2/authorization",
  };
}

function normalizeUrl(input: string) {
  const value = input.trim();
  if (!value) {
    return "";
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

function createActivityEntry(
  area: string,
  message: string,
  severity: ActivityEvent["severity"] = "info",
): ActivityEvent {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    area,
    message,
    createdAt: new Date().toISOString(),
    severity,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { language, setLanguage, themeMode } = useAppSettings();
  const t = (key: string) => translate(language, key);
  const tr = (enText: string, ukText: string) =>
    language === "uk" ? ukText : enText;
  const locale = language === "uk" ? "uk-UA" : "en-US";

  const localizeStage = (stage: Application["stage"]) => {
    if (stage === "Applied") {
      return t("status.applied");
    }
    if (stage === "Interview") {
      return t("status.interview");
    }
    if (stage === "Offer") {
      return t("status.offer");
    }
    if (stage === "Accepted") {
      return tr("Accepted", "Прийнято");
    }
    return t("status.rejected");
  };

  const localizeCandidateStatus = (status: Candidate["status"]) => {
    if (status === "New") {
      return t("status.new");
    }
    if (status === "Reviewed") {
      return t("status.reviewed");
    }
    if (status === "Accepted") {
      return tr("Accepted", "Прийнято");
    }
    return t("status.shortlisted");
  };

  const localizeInterviewStatus = (status: Interview["status"]) => {
    if (status === "Planned") {
      return tr("Planned", "Заплановано");
    }
    if (status === "Completed") {
      return tr("Completed", "Завершено");
    }
    return tr("Cancelled", "Скасовано");
  };

  const localizeNotificationSeverity = (
    severity: NotificationItem["severity"],
  ) => {
    if (severity === "success") {
      return tr("Success", "Успіх");
    }
    if (severity === "warning") {
      return tr("Warning", "Попередження");
    }
    return tr("Info", "Інфо");
  };

  const localizeInvoiceStatus = (status: Invoice["status"]) => {
    if (status === "Paid") {
      return tr("Paid", "Оплачено");
    }
    if (status === "Overdue") {
      return tr("Overdue", "Прострочено");
    }
    return tr("Pending", "Очікує оплату");
  };

  const localizeTeamStatus = (status: TeamMember["status"]) => {
    if (status === "Active") {
      return tr("Active", "Активний");
    }
    return tr("Invited", "Запрошений");
  };

  const [session, setSession] = useState<LocalSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => createDefaultWorkspace(null));

  const [notice, setNotice] = useState<Notice | null>(null);
  const [jobSearch, setJobSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobTypeFilter>("all");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [chatParticipant, setChatParticipant] = useState<{ id: string; name: string; position: string; isEmployer: boolean } | null>(null);
  const [chatMessageText, setChatMessageText] = useState("");
  const [notificationFilter, setNotificationFilter] = useState<
    NotificationItem["severity"] | "all"
  >("all");
  const [interviewFilter, setInterviewFilter] = useState<Interview["status"] | "all">("all");
  const [interviewCandidate, setInterviewCandidate] = useState("");
  const [interviewRole, setInterviewRole] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState<Interview["mode"]>("Video");
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Recruiter");
  const [apiKeyName, setApiKeyName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvent, setWebhookEvent] = useState("application.created");

  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [connectionDialog, setConnectionDialog] = useState<ConnectionDialogState>({
    open: false,
    provider: "github",
    username: "",
    profileUrl: "",
    error: "",
  });

  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function initSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      // Fetch user profile from Supabase
      let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      // Fix for older accounts: Auto-create profile if it's missing (resolves foreign key errors)
      if (!profile) {
        const fallbackRole = user.user_metadata?.role || 'job_seeker';
        const fallbackName = user.user_metadata?.full_name || 'User';

        const { data: newProfile } = await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: fallbackName,
            role: fallbackRole,
            location: "Remote",
            skills: ["React"]
          }
        ]).select().single();

        profile = newProfile;
      }

      const newSession: LocalSession = {
        email: user.email || '',
        fullName: profile?.full_name || user.user_metadata?.full_name || 'User',
        role: profile?.role || user.user_metadata?.role || 'job_seeker',
        signedInAt: new Date().toISOString()
      };

      setSession(newSession);
      setWorkspace(loadWorkspaceFromStorage(newSession));
      setLoadingSession(false);
    }

    initSession();
  }, [router]);

  useEffect(() => {
    if (!session) {
      return;
    }
    persistWorkspace(session, workspace);
  }, [workspace, session]);

  // Supabase sync for Jobs and Applications
  useEffect(() => {
    if (!session) return;
    const fetchWorkspaceData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let jobsData: any[] = [];
      let appsData: any[] = [];
      let employerJobs: any[] = [];

      if (session.role === 'employer') {
        const { data } = await supabase.from('jobs').select('*').eq('employer_id', user.id).order('created_at', { ascending: false });
        jobsData = data || [];
        employerJobs = jobsData;

        const jobIds = employerJobs.map(j => j.id);
        if (jobIds.length > 0) {
          const { data } = await supabase.from('applications')
            .select('*, profile:profiles!applicant_id(full_name, location, skills), job:jobs!job_id(title)')
            .in('job_id', jobIds);
          appsData = data || [];
        }
      } else {
        const { data: fetchJobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        jobsData = fetchJobs || [];
        const { data: fetchApps } = await supabase.from('applications')
          .select('*, job:jobs!job_id(title)')
          .eq('applicant_id', user.id);
        appsData = fetchApps || [];
      }

      setWorkspace(prev => {
        // Map jobs
        const mappedJobs = (jobsData || []).map(j => ({
          id: j.id,
          title: j.title || 'Untitled',
          company: 'TechCompany',
          location: j.location || 'Remote',
          employmentType: 'Full-time' as const,
          salaryRange: j.salary || 'Negotiable',
          tags: ['React', 'Next.js'],
          description: j.description || ''
        }));

        // Map Candidates (for Employer)
        const mappedCandidates = session.role === 'employer' ? appsData.map(app => ({
          id: app.id, // using application id as candidate id in the dashboard
          name: app.profile?.full_name || 'Anonymous',
          stack: (app.profile?.skills || ['React', 'TypeScript']).join(', '),
          location: app.profile?.location || 'Remote',
          yearsExp: 3,
          status: (app.status === 'Shortlisted' ? 'Shortlisted' : (app.status === 'Reviewed' ? 'Reviewed' : 'New')) as "New" | "Reviewed" | "Shortlisted",
          matchScore: 90 + Math.floor(Math.random() * 10),
          source: app.job?.title || 'Job Board'
        })) : prev.candidates;

        // Map Applications (for Job Seeker)
        const mappedApps = session.role === 'job_seeker' ? appsData.map(app => ({
          id: app.id,
          position: app.job?.title || 'Unknown Position',
          company: app.job?.company || 'Unknown Company',
          stage: (app.status || 'Applied') as "Applied" | "Interview" | "Offer" | "Rejected",
          updatedAt: new Date(app.created_at).toISOString().split('T')[0]
        })) : prev.applications;

        // Calculate simple stats
        const realAnalytics = [{
          label: 'Total',
          applications: appsData.length,
          interviews: appsData.filter(a => a.status === 'Interview').length,
          offers: appsData.filter(a => a.status === 'Offer').length,
          hireRate: 10
        }];

        // Generate Messages based on Applications
        const mappedMessages = session.role === 'employer' ? appsData.map(app => ({
          id: `msg-${app.id}`,
          sender: app.profile?.full_name || 'System',
          subject: `New application: ${app.job?.title || 'Job'}`,
          snippet: `Candidate ${app.profile?.full_name || 'Anonymous'} has applied for ${app.job?.title || 'your job'}. Cover letter: ${app.cover_letter?.substring(0, 50) || 'None'}...`,
          unread: app.status === 'New' || !app.status,
        })) : appsData.map(app => ({
          id: `msg-${app.id}`,
          sender: app.job?.company || 'System',
          subject: `Application sent: ${app.job?.title || 'Job'}`,
          snippet: `You successfully applied for ${app.job?.title || 'a job'} at ${app.job?.company || 'the company'}. Status: ${app.status || 'Applied'}`,
          unread: false,
        }));

        return {
          ...prev,
          jobs: mappedJobs,
          candidates: mappedCandidates,
          applications: mappedApps,
          messages: mappedMessages.length > 0 ? mappedMessages : [],
          analytics: realAnalytics
        };
      });
    };
    fetchWorkspaceData();
  }, [session]);

  const tabs = useMemo<TabConfig[]>(() => {
    if (!session) {
      return [];
    }
    return session.role === "job_seeker" ? seekerTabs : employerTabs;
  }, [session]);

  const currentTab: DashboardTab =
    tabs.some((tab) => tab.value === activeTab) && tabs.length > 0
      ? activeTab
      : (tabs[0]?.value ?? "overview");

  const profileCompletion = useMemo(() => {
    const checks = [
      workspace.resume.fullName.trim().length > 0,
      workspace.resume.headline.trim().length > 0,
      workspace.resume.location.trim().length > 0,
      workspace.resume.summary.trim().length > 20,
      workspace.resume.skills.length >= 3,
      workspace.resume.experiences.length > 0,
      workspace.integrations.github.connected,
      workspace.integrations.linkedin.connected,
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [workspace]);

  const filteredJobs = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return workspace.jobs.filter((job) => {
      const matchesType =
        jobTypeFilter === "all" || job.employmentType === jobTypeFilter;
      if (!matchesType) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text =
        `${job.title} ${job.company} ${job.location} ${job.tags.join(" ")}`.toLowerCase();
      return text.includes(query);
    });
  }, [workspace.jobs, jobSearch, jobTypeFilter]);

  const filteredCandidates = useMemo(() => {
    const query = candidateSearch.trim().toLowerCase();
    if (!query) {
      return workspace.candidates;
    }

    return workspace.candidates.filter((candidate) => {
      const text = `${candidate.name} ${candidate.stack} ${candidate.location}`.toLowerCase();
      return text.includes(query);
    });
  }, [workspace.candidates, candidateSearch]);

  const filteredMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();
    if (!query) {
      return workspace.messages;
    }

    return workspace.messages.filter((message) => {
      const text = `${message.sender} ${message.subject} ${message.snippet}`.toLowerCase();
      return text.includes(query);
    });
  }, [workspace.messages, messageSearch]);

  const filteredNotifications = useMemo(() => {
    if (notificationFilter === "all") {
      return workspace.notifications;
    }
    return workspace.notifications.filter(
      (notification) => notification.severity === notificationFilter,
    );
  }, [workspace.notifications, notificationFilter]);

  const filteredInterviews = useMemo(() => {
    if (interviewFilter === "all") {
      return workspace.interviews;
    }
    return workspace.interviews.filter((interview) => interview.status === interviewFilter);
  }, [workspace.interviews, interviewFilter]);

  const unreadNotifications = useMemo(
    () => workspace.notifications.filter((item) => !item.read).length,
    [workspace.notifications],
  );

  const analyticsSummary = useMemo(() => {
    const totals = workspace.analytics.reduce(
      (acc, point) => {
        acc.applications += point.applications;
        acc.interviews += point.interviews;
        acc.offers += point.offers;
        acc.hireRate += point.hireRate;
        return acc;
      },
      { applications: 0, interviews: 0, offers: 0, hireRate: 0 },
    );
    const weeks = Math.max(1, workspace.analytics.length);

    return {
      applications: totals.applications,
      interviews: totals.interviews,
      offers: totals.offers,
      avgHireRate: Math.round(totals.hireRate / weeks),
      conversion:
        totals.applications > 0
          ? Math.round((totals.offers / totals.applications) * 100)
          : 0,
    };
  }, [workspace.analytics]);

  function setNoticeMessage(severity: Notice["severity"], message: string) {
    setNotice({ severity, message });
  }

  function mapPasswordError(message: string) {
    if (message.includes("does not exist")) {
      return t("auth.error.accountNotFound");
    }
    if (message.includes("Current password is incorrect")) {
      return t("auth.error.currentPassword");
    }
    if (message.includes("different from current")) {
      return t("auth.error.samePassword");
    }
    if (message.includes("at least 6 characters")) {
      return t("auth.error.password");
    }
    return message;
  }

  function withActivity(
    prev: WorkspaceState,
    area: string,
    message: string,
    severity: ActivityEvent["severity"] = "info",
  ) {
    return [
      createActivityEntry(area, message, severity),
      ...prev.activity,
    ].slice(0, 30);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    signOut();
    router.push("/auth");
  }

  function openConnectionDialog(provider: IntegrationProvider) {
    const existing = workspace.integrations[provider];
    setConnectionDialog({
      open: true,
      provider,
      username: existing.username,
      profileUrl: existing.profileUrl,
      error: "",
    });
  }

  function closeConnectionDialog() {
    setConnectionDialog((prev) => ({
      ...prev,
      open: false,
      error: "",
    }));
  }

  function saveConnection() {
    const provider = connectionDialog.provider;
    const meta = providerMeta(provider);
    const providerLabel = t(meta.labelKey);
    const username = connectionDialog.username.trim();
    const manualUrl = normalizeUrl(connectionDialog.profileUrl);

    if (!username) {
      setConnectionDialog((prev) => ({
        ...prev,
        error: t("dashboard.integrations.dialog.usernameError"),
      }));
      return;
    }

    const profileUrl = manualUrl || `${meta.profilePrefix}${username}`;

    try {
      const parsed = new URL(profileUrl);
      if (!parsed.hostname.includes(meta.host)) {
        throw new Error("invalid host");
      }
    } catch {
      setConnectionDialog((prev) => ({
        ...prev,
        error: `${t("dashboard.integrations.dialog.profileUrlError")} ${providerLabel}.`,
      }));
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [provider]: {
          connected: true,
          username,
          profileUrl,
          connectedAt: new Date().toISOString(),
        },
      },
    }));

    closeConnectionDialog();
    setNoticeMessage(
      "success",
      `${providerLabel} ${t("notice.integration.connected")}`,
    );
  }

  function disconnectProvider(provider: IntegrationProvider) {
    const meta = providerMeta(provider);
    const providerLabel = t(meta.labelKey);

    setWorkspace((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [provider]: getEmptyConnection(),
      },
    }));

    setNoticeMessage(
      "info",
      `${providerLabel} ${t("notice.integration.disconnected")}`,
    );
  }

  function openOAuthPreview(provider: IntegrationProvider) {
    const meta = providerMeta(provider);
    window.open(meta.oauthUrl, "_blank", "noopener,noreferrer");
    setNoticeMessage(
      "info",
      `${t(meta.labelKey)}: ${t("dashboard.integrations.oauth.notice")}`,
    );
  }

  function toggleSaveJob(jobId: string) {
    setWorkspace((prev) => ({
      ...prev,
      savedJobs: prev.savedJobs.includes(jobId)
        ? prev.savedJobs.filter((item) => item !== jobId)
        : [...prev.savedJobs, jobId],
    }));
  }

  function applyJob(job: Job) {
    const alreadyApplied = workspace.appliedJobIds.includes(job.id);
    if (alreadyApplied) {
      setNoticeMessage(
        "info",
        tr("You already applied to this job.", "Ти вже відгукнувся на цю вакансію."),
      );
      return;
    }

    setWorkspace((prev) => {
      if (prev.appliedJobIds.includes(job.id)) {
        return prev;
      }
      return {
        ...prev,
        appliedJobIds: [...prev.appliedJobIds, job.id],
        applications: [
          {
            id: `app-${Date.now()}`,
            company: job.company,
            position: job.title,
            stage: "Applied",
            updatedAt: new Date().toISOString(),
          },
          ...prev.applications,
        ],
        activity: withActivity(
          prev,
          tr("Applications", "Відгуки"),
          tr(`Applied to ${job.title}.`, `Відгук на ${job.title}.`),
          "success",
        ),
      };
    });

    setNoticeMessage("success", `${t("notice.apply")} ${job.title}.`);
  }

  function markMessageAsRead(messageId: string) {
    setWorkspace((prev) => ({
      ...prev,
      messages: prev.messages.map((message) =>
        message.id === messageId ? { ...message, unread: false } : message,
      ),
    }));
  }

  function markAllMessagesAsRead() {
    setWorkspace((prev) => ({
      ...prev,
      messages: prev.messages.map((message) => ({ ...message, unread: false })),
      activity: withActivity(
        prev,
        tr("Messages", "Повідомлення"),
        tr("Inbox zero achieved.", "Всі повідомлення прочитані."),
      ),
    }));
    setNoticeMessage("success", t("dashboard.messages.markAllDone"));
  }

  function markNotificationAsRead(notificationId: string) {
    setWorkspace((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    }));
  }

  function markAllNotificationsAsRead() {
    setWorkspace((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      activity: withActivity(
        prev,
        tr("Notifications", "Сповіщення"),
        tr("All notifications were marked as read.", "Всі сповіщення позначено прочитаними."),
      ),
    }));
    setNoticeMessage(
      "success",
      tr("All notifications marked as read.", "Усі сповіщення позначено прочитаними."),
    );
  }

  function scheduleInterview() {
    const candidate = interviewCandidate.trim();
    const role = interviewRole.trim();

    if (!candidate || !role || !interviewDate) {
      setNoticeMessage(
        "error",
        tr("Fill candidate, role, and date to schedule interview.", "Заповни кандидата, роль і дату, щоб запланувати інтерв'ю."),
      );
      return;
    }

    const scheduledAt = new Date(interviewDate);
    if (Number.isNaN(scheduledAt.getTime())) {
      setNoticeMessage(
        "error",
        tr("Invalid interview date.", "Некоректна дата інтерв'ю."),
      );
      return;
    }

    const company = session?.role === "employer" ? session.fullName : "HireNow Partner";

    setWorkspace((prev) => ({
      ...prev,
      interviews: [
        {
          id: `int-${Date.now()}`,
          candidateName: candidate,
          position: role,
          company,
          scheduledAt: scheduledAt.toISOString(),
          mode: interviewMode,
          status: "Planned",
          interviewer: session?.fullName ?? "Hiring Team",
        },
        ...prev.interviews,
      ],
      activity: withActivity(
        prev,
        tr("Interviews", "Інтерв'ю"),
        tr(`Scheduled interview with ${candidate}.`, `Заплановано інтерв'ю з ${candidate}.`),
        "success",
      ),
    }));

    setInterviewCandidate("");
    setInterviewRole("");
    setInterviewDate("");
    setInterviewMode("Video");
    setNoticeMessage("success", tr("Interview scheduled.", "Інтерв'ю заплановано."));
  }

  function updateInterviewStatus(interviewId: string, status: Interview["status"]) {
    setWorkspace((prev) => ({
      ...prev,
      interviews: prev.interviews.map((interview) =>
        interview.id === interviewId ? { ...interview, status } : interview,
      ),
      activity: withActivity(
        prev,
        tr("Interviews", "Інтерв'ю"),
        tr("Interview status updated.", "Статус інтерв'ю оновлено."),
      ),
    }));
    setNoticeMessage("info", tr("Interview status updated.", "Статус інтерв'ю оновлено."));
  }

  function inviteTeamMember() {
    const name = inviteName.trim();
    const email = inviteEmail.trim().toLowerCase();

    if (name.length < 2 || !email.includes("@")) {
      setNoticeMessage(
        "error",
        tr("Enter valid name and email to send invite.", "Введи коректні ім'я та email для запрошення."),
      );
      return;
    }

    if (workspace.teamMembers.some((member) => member.email.toLowerCase() === email)) {
      setNoticeMessage(
        "info",
        tr("This email is already in the team.", "Цей email вже є в команді."),
      );
      return;
    }

    setWorkspace((prev) => {
      if (prev.teamMembers.some((member) => member.email.toLowerCase() === email)) {
        return prev;
      }
      return {
        ...prev,
        teamMembers: [
          {
            id: `team-${Date.now()}`,
            name,
            email,
            role: inviteRole,
            status: "Invited",
            lastActive: new Date().toISOString(),
          },
          ...prev.teamMembers,
        ],
        activity: withActivity(
          prev,
          tr("Team", "Команда"),
          tr(`Invite sent to ${email}.`, `Запрошення надіслано для ${email}.`),
          "success",
        ),
      };
    });

    setInviteName("");
    setInviteEmail("");
    setInviteRole("Recruiter");
    setNoticeMessage("success", tr("Invitation sent.", "Запрошення надіслано."));
  }

  function toggleTeamMemberStatus(memberId: string) {
    const member = workspace.teamMembers.find((item) => item.id === memberId);
    if (!member) {
      return;
    }
    if (member.role === "Owner") {
      setNoticeMessage(
        "info",
        tr("Owner status cannot be changed.", "Статус власника змінювати не можна."),
      );
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((item) => {
        if (item.id !== memberId) {
          return item;
        }
        return {
          ...item,
          status: item.status === "Invited" ? "Active" : "Invited",
          lastActive: new Date().toISOString(),
        };
      }),
      activity: withActivity(
        prev,
        tr("Team", "Команда"),
        tr("Member access status updated.", "Статус доступу учасника оновлено."),
      ),
    }));
  }

  function removeTeamMember(memberId: string) {
    const member = workspace.teamMembers.find((item) => item.id === memberId);
    if (!member) {
      return;
    }
    if (member.role === "Owner") {
      setNoticeMessage(
        "error",
        tr("Owner cannot be removed.", "Власника не можна видалити."),
      );
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((member) => member.id !== memberId),
      activity: withActivity(
        prev,
        tr("Team", "Команда"),
        tr("Team member removed from workspace.", "Учасника команди видалено з workspace."),
        "warning",
      ),
    }));
    setNoticeMessage("info", tr("Team member removed.", "Учасника команди видалено."));
  }

  function generateApiKey() {
    const keyName = apiKeyName.trim();
    if (!keyName) {
      setNoticeMessage(
        "error",
        tr("Set API key name first.", "Спочатку вкажи назву API ключа."),
      );
      return;
    }

    if (
      workspace.apiKeys.some(
        (key) => key.name.toLowerCase() === keyName.toLowerCase() && key.active,
      )
    ) {
      setNoticeMessage(
        "info",
        tr("Active API key with this name already exists.", "Активний API ключ з такою назвою вже існує."),
      );
      return;
    }

    const suffix = Math.random().toString(36).slice(2, 6);
    const prefix = `hn_live_${suffix}`;

    setWorkspace((prev) => {
      if (
        prev.apiKeys.some(
          (key) => key.name.toLowerCase() === keyName.toLowerCase() && key.active,
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        apiKeys: [
          {
            id: `key-${Date.now()}`,
            name: keyName,
            prefix,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            active: true,
          },
          ...prev.apiKeys,
        ],
        activity: withActivity(
          prev,
          tr("Developer", "Developer"),
          tr(`API key ${prefix} generated.`, `API ключ ${prefix} створено.`),
          "success",
        ),
      };
    });
    setApiKeyName("");
    setNoticeMessage(
      "success",
      tr("API key generated successfully.", "API ключ успішно створено."),
    );
  }

  function revokeApiKey(keyId: string) {
    setWorkspace((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((key) =>
        key.id === keyId ? { ...key, active: false } : key,
      ),
      activity: withActivity(
        prev,
        tr("Developer", "Developer"),
        tr("API key revoked.", "API ключ відкликано."),
        "warning",
      ),
    }));
    setNoticeMessage("info", tr("API key revoked.", "API ключ відкликано."));
  }

  function addWebhook() {
    const normalized = normalizeUrl(webhookUrl);
    const eventKey = webhookEvent.trim();
    if (!normalized || !webhookEvent.trim()) {
      setNoticeMessage(
        "error",
        tr("Provide webhook URL and event.", "Вкажи URL webhook та event."),
      );
      return;
    }

    try {
      new URL(normalized);
    } catch {
      setNoticeMessage("error", tr("Invalid webhook URL.", "Некоректний URL webhook."));
      return;
    }

    if (
      workspace.webhooks.some(
        (webhook) =>
          webhook.url.toLowerCase() === normalized.toLowerCase() &&
          webhook.event.toLowerCase() === eventKey.toLowerCase(),
      )
    ) {
      setNoticeMessage(
        "info",
        tr("This webhook endpoint already exists.", "Такий webhook endpoint вже існує."),
      );
      return;
    }

    setWorkspace((prev) => {
      if (
        prev.webhooks.some(
          (webhook) =>
            webhook.url.toLowerCase() === normalized.toLowerCase() &&
            webhook.event.toLowerCase() === eventKey.toLowerCase(),
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        webhooks: [
          {
            id: `wh-${Date.now()}`,
            url: normalized,
            event: eventKey,
            active: true,
            failures: 0,
            lastDelivery: new Date().toISOString(),
            secretMasked: `whsec_****${Math.random().toString(16).slice(2, 6)}`,
          },
          ...prev.webhooks,
        ],
        activity: withActivity(
          prev,
          tr("Developer", "Developer"),
          tr("Webhook endpoint created.", "Webhook endpoint створено."),
          "success",
        ),
      };
    });
    setWebhookUrl("");
    setWebhookEvent("application.created");
    setNoticeMessage("success", tr("Webhook added.", "Webhook додано."));
  }

  function toggleWebhook(webhookId: string) {
    setWorkspace((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((webhook) =>
        webhook.id === webhookId
          ? { ...webhook, active: !webhook.active }
          : webhook,
      ),
    }));
  }

  function testWebhookDelivery(webhookId: string) {
    setWorkspace((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((webhook) =>
        webhook.id === webhookId
          ? {
            ...webhook,
            lastDelivery: new Date().toISOString(),
            failures: 0,
          }
          : webhook,
      ),
      activity: withActivity(
        prev,
        tr("Developer", "Developer"),
        tr("Webhook test delivery completed.", "Тестова доставка webhook завершена."),
      ),
    }));
    setNoticeMessage(
      "success",
      tr("Webhook test sent.", "Тестовий webhook надіслано."),
    );
  }

  function deleteWebhook(webhookId: string) {
    setWorkspace((prev) => ({
      ...prev,
      webhooks: prev.webhooks.filter((webhook) => webhook.id !== webhookId),
      activity: withActivity(
        prev,
        tr("Developer", "Developer"),
        tr("Webhook deleted.", "Webhook видалено."),
        "warning",
      ),
    }));
    setNoticeMessage("info", tr("Webhook deleted.", "Webhook видалено."));
  }

  function payInvoice(invoiceId: string) {
    const invoice = workspace.invoices.find((item) => item.id === invoiceId);
    if (!invoice) {
      return;
    }
    if (invoice.status === "Paid") {
      setNoticeMessage("info", tr("Invoice is already paid.", "Інвойс вже оплачено."));
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      invoices: prev.invoices.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice,
      ),
      activity: withActivity(
        prev,
        tr("Billing", "Білінг"),
        tr("Invoice marked as paid.", "Інвойс позначено як оплачений."),
        "success",
      ),
    }));
    setNoticeMessage("success", tr("Invoice paid.", "Інвойс оплачено."));
  }

  async function addJobPost() {
    const title = jobTitle.trim();
    const company = jobCompany.trim();
    const location = jobLocation.trim();
    const salary = jobSalary.trim();

    if (!title || !company || !location || !salary) {
      setNoticeMessage("error", t("notice.addJob.error"));
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setNoticeMessage("error", "You must be logged in to create a job.");
      return;
    }

    const { data, error } = await supabase.from('jobs').insert([{
      title,
      description: 'Job requirement created from dashboard.',
      salary,
      location,
      employer_id: user.id
    }]).select().single();

    if (error) {
      setNoticeMessage("error", "Error creating job: " + error.message);
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      jobs: [
        {
          id: data.id,
          title,
          company,
          location,
          employmentType: "Full-time",
          salaryRange: salary,
          tags: ["New"],
        },
        ...prev.jobs,
      ],
      activity: withActivity(
        prev,
        tr("Vacancies", "Вакансії"),
        tr(`Created job post: ${title}.`, `Створено пост вакансії: ${title}.`),
      ),
    }));

    setJobTitle("");
    setJobCompany("");
    setJobLocation("");
    setJobSalary("");
    setNoticeMessage("success", t("notice.addJob.success"));
  }

  async function removeJobPost(jobId: string) {
    const supabase = createClient();
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);

    if (error) {
      setNoticeMessage("error", "Error deleting job: " + error.message);
      return;
    }

    setWorkspace((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((job) => job.id !== jobId),
      savedJobs: prev.savedJobs.filter((id) => id !== jobId),
      appliedJobIds: prev.appliedJobIds.filter((id) => id !== jobId),
      activity: withActivity(
        prev,
        tr("Vacancies", "Вакансії"),
        tr("Removed job post.", "Пост вакансії видалено."),
        "warning",
      ),
    }));

    setNoticeMessage("info", t("notice.job.removed"));
  }

  function changeCandidateStatus(candidateId: string) {
    setWorkspace((prev) => ({
      ...prev,
      candidates: prev.candidates.map((candidate) => {
        if (candidate.id !== candidateId) {
          return candidate;
        }

        if (candidate.status === "New") {
          return { ...candidate, status: "Reviewed" };
        }

        if (candidate.status === "Reviewed") {
          return { ...candidate, status: "Shortlisted" };
        }

        if (candidate.status === "Shortlisted") {
          return { ...candidate, status: "Accepted" };
        }

        return candidate;
      }),
      activity: withActivity(
        prev,
        tr("Candidates", "Кандидати"),
        tr("Candidate status moved forward.", "Статус кандидата переведено далі."),
      ),
    }));
  }

  function handleSendMessage() {
    if (!chatMessageText.trim() || !chatParticipant || !session) return;

    setWorkspace((prev) => {
      const newChats = { ...prev.chats };
      const participantId = chatParticipant.id;
      const history = newChats[participantId] || [];

      newChats[participantId] = [
        ...history,
        {
          id: `chat-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          senderId: session.email,
          senderName: prev.resume?.fullName || session.email.split("@")[0],
          text: chatMessageText.trim(),
          timestamp: new Date().toISOString(),
          isEmployer: session.role !== "job_seeker",
        },
      ];

      return {
        ...prev,
        chats: newChats,
        activity: withActivity(
          prev,
          tr("Chat", "Чат"),
          tr("Message sent.", "Повідомлення надіслано.")
        )
      };
    });

    setChatMessageText("");
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) {
      return;
    }

    const exists = workspace.resume.skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setNoticeMessage("info", t("notice.skill.exists"));
      return;
    }

    setWorkspace((prev) => {
      const inPrev = prev.resume.skills.some(
        (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
      );
      if (inPrev) {
        return prev;
      }
      return {
        ...prev,
        resume: {
          ...prev.resume,
          skills: [...prev.resume.skills, trimmed],
        },
        activity: withActivity(
          prev,
          tr("Resume", "Резюме"),
          tr(`Added skill: ${trimmed}.`, `Додано навичку: ${trimmed}.`),
        ),
      };
    });

    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setWorkspace((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        skills: prev.resume.skills.filter((item) => item !== skill),
      },
    }));
  }

  function addExperience() {
    setWorkspace((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        experiences: [
          ...prev.resume.experiences,
          {
            id: `exp-${Date.now()}`,
            role: "",
            company: "",
            period: "",
            description: "",
          },
        ],
      },
    }));
  }

  function updateResumeField(
    field: keyof Omit<ResumeState, "skills" | "experiences">,
    value: string,
  ) {
    setWorkspace((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        [field]: value,
      },
    }));
  }

  function updateExperience(
    experienceId: string,
    field: keyof Omit<ResumeExperience, "id">,
    value: string,
  ) {
    setWorkspace((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        experiences: prev.resume.experiences.map((item) =>
          item.id === experienceId ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  function removeExperience(experienceId: string) {
    setWorkspace((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        experiences: prev.resume.experiences.filter((item) => item.id !== experienceId),
      },
    }));
  }

  function handleChangePassword() {
    if (!session) {
      return;
    }

    if (!currentPassword.trim()) {
      setNoticeMessage("error", t("dashboard.security.error.currentRequired"));
      return;
    }

    if (newPassword.trim().length < 6) {
      setNoticeMessage("error", t("auth.error.password"));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setNoticeMessage("error", t("auth.error.passwordMismatch"));
      return;
    }

    const result = changePassword({
      email: session.email,
      currentPassword,
      newPassword,
    });

    if (!result.ok) {
      setNoticeMessage("error", mapPasswordError(result.message ?? "Unable to update password."));
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setNoticeMessage("success", t("dashboard.security.success"));
  }

  function exportResumeTxt() {
    const text = buildResumeText(workspace.resume, {
      summary: t("dashboard.resume.summaryBlock"),
      skills: t("dashboard.resume.skillsBlock"),
      experience: t("dashboard.resume.experienceBlock"),
    });
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workspace.resume.fullName || "resume"}.txt`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function renderOverview(role: UserRole) {
    const isDark = themeMode === "dark";
    const statCards = role === "job_seeker"
      ? [
        {
          label: t("dashboard.metric.openJobs"),
          value: workspace.jobs.length,
          icon: <WorkOutlineIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
          bg: isDark ? "rgba(59,130,246,0.12)" : "rgba(219,234,254,0.6)",
        },
        {
          label: t("dashboard.metric.savedJobs"),
          value: workspace.savedJobs.length,
          icon: <BookmarkBorderIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
          bg: isDark ? "rgba(139,92,246,0.12)" : "rgba(237,233,254,0.6)",
        },
        {
          label: t("dashboard.metric.unreadMessages"),
          value: workspace.messages.filter((item) => item.unread).length,
          icon: <EmailOutlinedIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #10B981, #059669)",
          bg: isDark ? "rgba(16,185,129,0.12)" : "rgba(209,250,229,0.6)",
        },
      ]
      : [
        {
          label: t("dashboard.metric.openJobs"),
          value: workspace.jobs.length,
          icon: <WorkOutlineIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
          bg: isDark ? "rgba(59,130,246,0.12)" : "rgba(219,234,254,0.6)",
        },
        {
          label: t("dashboard.metric.candidates"),
          value: workspace.candidates.length,
          icon: <GroupsOutlinedIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
          bg: isDark ? "rgba(139,92,246,0.12)" : "rgba(237,233,254,0.6)",
        },
        {
          label: t("dashboard.metric.unreadMessages"),
          value: workspace.messages.filter((item) => item.unread).length,
          icon: <EmailOutlinedIcon sx={{ fontSize: 22 }} />,
          gradient: "linear-gradient(135deg, #10B981, #059669)",
          bg: isDark ? "rgba(16,185,129,0.12)" : "rgba(209,250,229,0.6)",
        },
      ];

    return (
      <Grid container spacing={3}>
        {statCards.map((card, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                bgcolor: card.bg,
                borderRadius: 3,
                transition: "transform 200ms, box-shadow 200ms",
                "&:hover": { transform: "translateY(-2px)", boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(15,23,42,0.08)" },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: isDark ? "#F1F5F9" : "#0F172A", lineHeight: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      background: card.gradient,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {role === "job_seeker" ? (
          <Grid size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {t("dashboard.profile.title")}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ color: isDark ? "#60A5FA" : "#2563EB" }}>
                    {profileCompletion}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={profileCompletion}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.9)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {t("dashboard.profile.subtitle")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {t("dashboard.hiring.title")}
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  {[
                    { label: `${t("dashboard.hiring.newApps")}: ${workspace.applications.length}`, color: "#3B82F6", bg: isDark ? "rgba(59,130,246,0.12)" : "rgba(219,234,254,0.6)" },
                    { label: `${t("dashboard.hiring.interviews")}: 5`, color: "#F59E0B", bg: isDark ? "rgba(245,158,11,0.12)" : "rgba(254,243,199,0.7)" },
                    { label: `${t("dashboard.hiring.offers")}: 2`, color: "#10B981", bg: isDark ? "rgba(16,185,129,0.12)" : "rgba(209,250,229,0.6)" },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        flex: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: item.bg,
                        border: "1px solid",
                        borderColor: `${item.color}33`,
                        textAlign: "center",
                      }}
                    >
                      <Typography fontWeight={700} sx={{ color: item.color }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {tr("Live workspace activity", "Жива активність workspace")}
                </Typography>
                <Chip
                  size="small"
                  label={tr(`${workspace.activity.length} events`, `${workspace.activity.length} подій`)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: isDark ? "rgba(59,130,246,0.15)" : "rgba(219,234,254,0.7)",
                    color: isDark ? "#60A5FA" : "#2563EB",
                    border: "1px solid",
                    borderColor: isDark ? "rgba(96,165,250,0.2)" : "rgba(37,99,235,0.15)",
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                {workspace.activity.slice(0, 6).map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                      bgcolor: isDark ? "rgba(15,23,42,0.4)" : "rgba(248,250,252,0.8)",
                      transition: "background 200ms",
                      "&:hover": { bgcolor: isDark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.9)" },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        size="small"
                        label={item.area}
                        color={activityColor(item.severity)}
                        sx={{ fontWeight: 600, fontSize: 11 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>{item.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(item.createdAt, locale)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {tr("Platform readiness", "Готовність платформи")}
                </Typography>
                <Stack spacing={2}>
                  {[
                    { label: tr("Automation coverage", "Покриття автоматизацією"), value: 82, color: "#3B82F6" },
                    { label: tr("Hiring conversion quality", "Якість конверсії найму"), value: analyticsSummary.conversion, color: "#8B5CF6" },
                    { label: tr("Interview pipeline freshness", "Актуальність пайплайну інтерв'ю"), value: Math.min(100, Math.max(20, workspace.interviews.length * 14)), color: "#10B981" },
                  ].map((bar) => (
                    <Box key={bar.label}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">{bar.label}</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: bar.color }}>{bar.value}%</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={bar.value}
                        sx={{
                          height: 7,
                          borderRadius: 4,
                          bgcolor: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.9)",
                          "& .MuiLinearProgress-bar": { bgcolor: bar.color, borderRadius: 4 },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {tr("Live counters", "Живі лічильники")}
                </Typography>
                <Stack spacing={1}>
                  {[
                    { label: tr(`${unreadNotifications} unread notifications`, `${unreadNotifications} непрочитаних сповіщень`), color: unreadNotifications > 0 ? "#F59E0B" : undefined },
                    { label: tr(`${workspace.interviews.length} interviews`, `${workspace.interviews.length} інтерв'ю`), color: "#3B82F6" },
                    { label: tr(`${workspace.teamMembers.length} team members`, `${workspace.teamMembers.length} учасників команди`), color: "#8B5CF6" },
                  ].map((item) => (
                    <Stack key={item.label} direction="row" alignItems="center" spacing={1.5}
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: isDark ? "rgba(15,23,42,0.4)" : "rgba(248,250,252,0.8)",
                        border: "1px solid",
                        borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                      }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color ?? "text.disabled", flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    );
  }

  function renderJobs() {
    const jobTypeOptions: JobTypeFilter[] = ["all", "Full-time", "Contract", "Part-time"];

    const getTypeLabel = (value: JobTypeFilter) => {
      if (value === "all") {
        return t("dashboard.jobs.filter.all");
      }
      if (value === "Full-time") {
        return t("dashboard.jobs.filter.fulltime");
      }
      if (value === "Contract") {
        return t("dashboard.jobs.filter.contract");
      }
      return t("dashboard.jobs.filter.parttime");
    };

    return (
      <Stack spacing={2.5}>
        <Card>
          <CardContent>
            <Stack spacing={1.6}>
              <TextField
                fullWidth
                label={t("dashboard.search.jobs")}
                value={jobSearch}
                onChange={(event) => setJobSearch(event.target.value)}
                placeholder={t("dashboard.search.jobs.placeholder")}
              />
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {jobTypeOptions.map((option) => (
                  <Chip
                    key={option}
                    clickable
                    color={jobTypeFilter === option ? "primary" : "default"}
                    variant={jobTypeFilter === option ? "filled" : "outlined"}
                    label={getTypeLabel(option)}
                    onClick={() => setJobTypeFilter(option)}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary">{t("dashboard.jobs.empty")}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid key={job.id} size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h6">{job.title}</Typography>
                        <Typography color="text.secondary">
                          {job.company} • {job.location}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Chip label={job.employmentType} size="small" />
                        <Chip label={job.salaryRange} size="small" color="secondary" />
                        {job.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<WorkOutlineIcon />}
                          onClick={() => applyJob(job)}
                          disabled={workspace.appliedJobIds.includes(job.id)}
                        >
                          {workspace.appliedJobIds.includes(job.id)
                            ? t("dashboard.jobs.applied")
                            : t("dashboard.jobs.apply")}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<BookmarkBorderIcon />}
                          onClick={() => toggleSaveJob(job.id)}
                        >
                          {workspace.savedJobs.includes(job.id)
                            ? t("dashboard.jobs.saved")
                            : t("dashboard.jobs.save")}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    );
  }

  function renderApplications() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("dashboard.applications.title")}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("dashboard.applications.position")}</TableCell>
                <TableCell>{t("dashboard.applications.company")}</TableCell>
                <TableCell>{t("dashboard.applications.status")}</TableCell>
                <TableCell>{t("dashboard.applications.updated")}</TableCell>
                <TableCell align="right">{tr("Action", "Дія")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workspace.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={localizeStage(application.stage)}
                      color={stageColor(application.stage)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(application.updatedAt, locale)}</TableCell>
                  <TableCell align="right">
                    {application.stage === "Accepted" ? (
                      <Button
                        size="small"
                        onClick={() =>
                          setChatParticipant({
                            id: application.id,
                            name: application.company,
                            position: application.position,
                            isEmployer: false,
                          })
                        }
                      >
                        {tr("Chat", "Чат")}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  function renderMessages() {
    return (
      <Stack spacing={2.5}>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              label={t("dashboard.search.messages")}
              value={messageSearch}
              onChange={(event) => setMessageSearch(event.target.value)}
              placeholder={t("dashboard.search.messages.placeholder")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <Typography variant="h6">{t("dashboard.messages.title")}</Typography>
              <Button size="small" onClick={markAllMessagesAsRead}>
                {t("dashboard.messages.markAll")}
              </Button>
            </Stack>
            {filteredMessages.length === 0 ? (
              <Typography color="text.secondary">{t("dashboard.messages.empty")}</Typography>
            ) : (
              <List>
                {filteredMessages.map((message) => (
                  <ListItem
                    key={message.id}
                    divider
                    secondaryAction={
                      message.unread ? (
                        <Button size="small" onClick={() => markMessageAsRead(message.id)}>
                          {t("dashboard.messages.markRead")}
                        </Button>
                      ) : undefined
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <EmailOutlinedIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.subject}
                      secondary={`${message.sender} — ${message.snippet}`}
                      primaryTypographyProps={{ fontWeight: message.unread ? 700 : 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Stack>
    );
  }

  function renderNotifications() {
    return (
      <Stack spacing={2.5}>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Box>
                <Typography variant="h6">
                  {tr("Notification Center", "Центр сповіщень")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tr(
                    "System, communication, and billing events in one stream.",
                    "Системні, комунікаційні та білінгові події в одному потоці.",
                  )}
                </Typography>
              </Box>
              <Button size="small" onClick={markAllNotificationsAsRead}>
                {tr("Mark all read", "Позначити все прочитаним")}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip
                clickable
                label={tr("All", "Усі")}
                variant={notificationFilter === "all" ? "filled" : "outlined"}
                color={notificationFilter === "all" ? "primary" : "default"}
                onClick={() => setNotificationFilter("all")}
              />
              {(["info", "success", "warning"] as const).map((value) => (
                <Chip
                  key={value}
                  clickable
                  label={localizeNotificationSeverity(value)}
                  variant={notificationFilter === value ? "filled" : "outlined"}
                  color={notificationFilter === value ? "primary" : notificationColor(value)}
                  onClick={() => setNotificationFilter(value)}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <Typography color="text.secondary">
                {tr("No notifications for this filter.", "Для цього фільтра сповіщень немає.")}
              </Typography>
            ) : (
              <List>
                {filteredNotifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    divider
                    secondaryAction={
                      !notification.read ? (
                        <Button size="small" onClick={() => markNotificationAsRead(notification.id)}>
                          {tr("Mark read", "Прочитано")}
                        </Button>
                      ) : undefined
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            notification.severity === "success"
                              ? "success.light"
                              : notification.severity === "warning"
                                ? "warning.light"
                                : "primary.light",
                          color: "text.primary",
                        }}
                      >
                        <NotificationsOutlinedIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Stack spacing={0.4}>
                          <Typography variant="body2" color="text.secondary">
                            {notification.description}
                          </Typography>
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <Chip
                              size="small"
                              label={localizeNotificationSeverity(notification.severity)}
                              color={notificationColor(notification.severity)}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(notification.createdAt, locale)}
                            </Typography>
                          </Stack>
                        </Stack>
                      }
                      primaryTypographyProps={{ fontWeight: notification.read ? 500 : 700 }}
                      secondaryTypographyProps={{ component: "div" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Stack>
    );
  }

  function renderInterviews() {
    return (
      <Stack spacing={2.5}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tr("Schedule interview", "Планування інтерв'ю")}
                </Typography>
                <Stack spacing={1.2}>
                  <TextField
                    label={tr("Candidate name", "Ім'я кандидата")}
                    value={interviewCandidate}
                    onChange={(event) => setInterviewCandidate(event.target.value)}
                  />
                  <TextField
                    label={tr("Role / position", "Роль / позиція")}
                    value={interviewRole}
                    onChange={(event) => setInterviewRole(event.target.value)}
                  />
                  <TextField
                    type="datetime-local"
                    label={tr("Date and time", "Дата і час")}
                    InputLabelProps={{ shrink: true }}
                    value={interviewDate}
                    onChange={(event) => setInterviewDate(event.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel>{tr("Mode", "Формат")}</InputLabel>
                    <Select
                      label={tr("Mode", "Формат")}
                      value={interviewMode}
                      onChange={(event) => setInterviewMode(event.target.value as Interview["mode"])}
                    >
                      <MenuItem value="Video">{tr("Video", "Відео")}</MenuItem>
                      <MenuItem value="Phone">{tr("Phone", "Телефон")}</MenuItem>
                      <MenuItem value="On-site">{tr("On-site", "Офіс")}</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={scheduleInterview}>
                    {tr("Add interview", "Додати інтерв'ю")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  sx={{ mb: 1.2 }}
                >
                  <Typography variant="h6">
                    {tr("Interview pipeline", "Пайплайн інтерв'ю")}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                      clickable
                      label={tr("All", "Усі")}
                      variant={interviewFilter === "all" ? "filled" : "outlined"}
                      onClick={() => setInterviewFilter("all")}
                    />
                    {(["Planned", "Completed", "Cancelled"] as const).map((status) => (
                      <Chip
                        key={status}
                        clickable
                        label={localizeInterviewStatus(status)}
                        color={interviewColor(status)}
                        variant={interviewFilter === status ? "filled" : "outlined"}
                        onClick={() => setInterviewFilter(status)}
                      />
                    ))}
                  </Stack>
                </Stack>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{tr("Candidate", "Кандидат")}</TableCell>
                      <TableCell>{tr("Role", "Роль")}</TableCell>
                      <TableCell>{tr("When", "Коли")}</TableCell>
                      <TableCell>{tr("Mode", "Формат")}</TableCell>
                      <TableCell>{tr("Status", "Статус")}</TableCell>
                      <TableCell align="right">{tr("Actions", "Дії")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell>{interview.candidateName}</TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>{formatDateTime(interview.scheduledAt, locale)}</TableCell>
                        <TableCell>{interview.mode}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={localizeInterviewStatus(interview.status)}
                            color={interviewColor(interview.status)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.7}
                            justifyContent="flex-end"
                            useFlexGap
                            flexWrap="wrap"
                          >
                            {interview.status !== "Completed" ? (
                              <Button
                                size="small"
                                onClick={() => updateInterviewStatus(interview.id, "Completed")}
                              >
                                {tr("Complete", "Завершити")}
                              </Button>
                            ) : null}
                            {interview.status !== "Cancelled" ? (
                              <Button
                                size="small"
                                color="warning"
                                onClick={() => updateInterviewStatus(interview.id, "Cancelled")}
                              >
                                {tr("Cancel", "Скасувати")}
                              </Button>
                            ) : null}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  }

  function renderAnalytics() {
    const maxApplications = Math.max(
      1,
      ...workspace.analytics.map((point) => point.applications),
    );

    return (
      <Stack spacing={2.5}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {tr("Total applications", "Загалом відгуків")}
                </Typography>
                <Typography variant="h4">{analyticsSummary.applications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {tr("Interviews", "Інтерв'ю")}
                </Typography>
                <Typography variant="h4">{analyticsSummary.interviews}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {tr("Offers", "Офери")}
                </Typography>
                <Typography variant="h4">{analyticsSummary.offers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {tr("Offer conversion", "Конверсія в офер")}
                </Typography>
                <Typography variant="h4">{analyticsSummary.conversion}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {tr("Hiring analytics timeline", "Таймлайн аналітики найму")}
            </Typography>
            <Stack spacing={1.5}>
              {workspace.analytics.map((point) => (
                <Box key={point.label}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={600}>{point.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tr("Hire rate", "Рівень найму")}: {point.hireRate}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(point.applications / maxApplications) * 100}
                    sx={{ mt: 0.8, height: 8, borderRadius: 8 }}
                  />
                  <Stack direction="row" spacing={1.1} sx={{ mt: 0.6 }} useFlexGap flexWrap="wrap">
                    <Chip size="small" label={`${tr("Apps", "Відгуки")}: ${point.applications}`} />
                    <Chip size="small" label={`${tr("Interviews", "Інтерв'ю")}: ${point.interviews}`} />
                    <Chip size="small" color="success" label={`${tr("Offers", "Офери")}: ${point.offers}`} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  function renderTeam() {
    return (
      <Stack spacing={2.5}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tr("Invite team member", "Запросити учасника команди")}
                </Typography>
                <Stack spacing={1.2}>
                  <TextField
                    label={tr("Full name", "Повне ім'я")}
                    value={inviteName}
                    onChange={(event) => setInviteName(event.target.value)}
                  />
                  <TextField
                    label={tr("Email", "Email")}
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel>{tr("Role", "Роль")}</InputLabel>
                    <Select
                      label={tr("Role", "Роль")}
                      value={inviteRole}
                      onChange={(event) => setInviteRole(event.target.value as TeamMember["role"])}
                    >
                      <MenuItem value="Recruiter">{tr("Recruiter", "Рекрутер")}</MenuItem>
                      <MenuItem value="Hiring Manager">{tr("Hiring Manager", "Hiring Manager")}</MenuItem>
                      <MenuItem value="Interviewer">{tr("Interviewer", "Інтерв'юер")}</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={inviteTeamMember}>
                    {tr("Send invite", "Надіслати запрошення")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tr("Team access matrix", "Матриця доступу команди")}
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{tr("Name", "Ім'я")}</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>{tr("Role", "Роль")}</TableCell>
                      <TableCell>{tr("Status", "Статус")}</TableCell>
                      <TableCell>{tr("Last active", "Остання активність")}</TableCell>
                      <TableCell align="right">{tr("Actions", "Дії")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workspace.teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={member.status === "Active" ? "success" : "warning"}
                            label={localizeTeamStatus(member.status)}
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(member.lastActive, locale)}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.6} justifyContent="flex-end">
                            <Button size="small" onClick={() => toggleTeamMemberStatus(member.id)}>
                              {member.status === "Invited"
                                ? tr("Activate", "Активувати")
                                : tr("Mark invited", "Позначити запрошеним")}
                            </Button>
                            {member.role !== "Owner" ? (
                              <Button
                                color="error"
                                size="small"
                                onClick={() => removeTeamMember(member.id)}
                              >
                                {tr("Remove", "Видалити")}
                              </Button>
                            ) : null}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  }

  function renderBilling() {
    const activeSeats = workspace.teamMembers.filter((member) => member.status === "Active").length;
    const monthlySpend = workspace.invoices
      .filter((invoice) => invoice.status !== "Paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return (
      <Stack spacing={2.5}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{tr("Current plan", "Поточний план")}</Typography>
                <Typography variant="h5">Scale Pro</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tr("Global hiring operations enabled", "Увімкнено global hiring operations")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{tr("Active seats", "Активні місця")}</Typography>
                <Typography variant="h4">{activeSeats}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {tr("Outstanding balance", "Баланс до оплати")}
                </Typography>
                <Typography variant="h4">${monthlySpend}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {tr("Invoice history", "Історія інвойсів")}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{tr("Period", "Період")}</TableCell>
                  <TableCell>{tr("Amount", "Сума")}</TableCell>
                  <TableCell>{tr("Due date", "Термін оплати")}</TableCell>
                  <TableCell>{tr("Status", "Статус")}</TableCell>
                  <TableCell align="right">{tr("Action", "Дія")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workspace.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate, locale)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={invoiceColor(invoice.status)}
                        label={localizeInvoiceStatus(invoice.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {invoice.status !== "Paid" ? (
                        <Button size="small" variant="outlined" onClick={() => payInvoice(invoice.id)}>
                          {tr("Pay now", "Оплатити")}
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {tr("Completed", "Виконано")}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  function renderDeveloper() {
    return (
      <Stack spacing={2.5}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tr("API keys", "API ключі")}
                </Typography>
                <Stack spacing={1.2}>
                  <TextField
                    label={tr("Key name", "Назва ключа")}
                    value={apiKeyName}
                    onChange={(event) => setApiKeyName(event.target.value)}
                  />
                  <Button variant="contained" onClick={generateApiKey}>
                    {tr("Generate key", "Створити ключ")}
                  </Button>
                  <Divider />
                  {workspace.apiKeys.map((key) => (
                    <Card key={key.id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography fontWeight={600}>{key.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {key.prefix} • {tr("Last used", "Останнє використання")}:{" "}
                              {formatDateTime(key.lastUsed, locale)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.8}>
                            <Chip
                              size="small"
                              color={key.active ? "success" : "default"}
                              label={key.active ? tr("Active", "Активний") : tr("Revoked", "Відкликано")}
                            />
                            {key.active ? (
                              <Button size="small" color="error" onClick={() => revokeApiKey(key.id)}>
                                {tr("Revoke", "Відкликати")}
                              </Button>
                            ) : null}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tr("Webhook endpoints", "Webhook endpoints")}
                </Typography>
                <Stack spacing={1.2}>
                  <TextField
                    label={tr("Webhook URL", "Webhook URL")}
                    value={webhookUrl}
                    onChange={(event) => setWebhookUrl(event.target.value)}
                  />
                  <TextField
                    label={tr("Event key", "Event ключ")}
                    value={webhookEvent}
                    onChange={(event) => setWebhookEvent(event.target.value)}
                    helperText={tr(
                      "Examples: application.created, candidate.shortlisted",
                      "Приклади: application.created, candidate.shortlisted",
                    )}
                  />
                  <Button variant="contained" onClick={addWebhook}>
                    {tr("Add webhook", "Додати webhook")}
                  </Button>
                  <Divider />

                  {workspace.webhooks.map((hook) => (
                    <Card key={hook.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.1}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography fontWeight={600}>{hook.event}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {hook.url}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              color={hook.active ? "success" : "default"}
                              label={hook.active ? tr("Active", "Активний") : tr("Disabled", "Вимкнено")}
                            />
                          </Stack>

                          <Typography variant="caption" color="text.secondary">
                            {hook.secretMasked} • {tr("Last delivery", "Остання доставка")}:{" "}
                            {formatDateTime(hook.lastDelivery, locale)}
                          </Typography>

                          <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                            <Button size="small" onClick={() => toggleWebhook(hook.id)}>
                              {hook.active ? tr("Disable", "Вимкнути") : tr("Enable", "Увімкнути")}
                            </Button>
                            <Button size="small" onClick={() => testWebhookDelivery(hook.id)}>
                              {tr("Test delivery", "Тест доставки")}
                            </Button>
                            <Button size="small" color="error" onClick={() => deleteWebhook(hook.id)}>
                              {tr("Delete", "Видалити")}
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  }

  function renderJobPosts() {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("dashboard.jobPosts.createTitle")}
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label={t("dashboard.jobPosts.fieldTitle")}
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                />
                <TextField
                  label={t("dashboard.jobPosts.fieldCompany")}
                  value={jobCompany}
                  onChange={(event) => setJobCompany(event.target.value)}
                />
                <TextField
                  label={t("dashboard.jobPosts.fieldLocation")}
                  value={jobLocation}
                  onChange={(event) => setJobLocation(event.target.value)}
                />
                <TextField
                  label={t("dashboard.jobPosts.fieldSalary")}
                  value={jobSalary}
                  onChange={(event) => setJobSalary(event.target.value)}
                />
                <Button startIcon={<AddIcon />} variant="contained" onClick={addJobPost}>
                  {t("dashboard.jobPosts.add")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("dashboard.jobPosts.active")}
              </Typography>
              <Stack spacing={1.2}>
                {workspace.jobs.map((job) => (
                  <Card key={job.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Box>
                          <Typography fontWeight={600}>{job.title}</Typography>
                          <Typography color="text.secondary">
                            {job.company} • {job.location} • {job.salaryRange}
                          </Typography>
                        </Box>
                        <Button color="error" size="small" onClick={() => removeJobPost(job.id)}>
                          {t("common.delete")}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  function renderCandidates() {
    return (
      <Stack spacing={2.5}>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              label={t("dashboard.search.candidates")}
              value={candidateSearch}
              onChange={(event) => setCandidateSearch(event.target.value)}
              placeholder={t("dashboard.search.candidates.placeholder")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.candidates.title")}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("dashboard.candidates.name")}</TableCell>
                  <TableCell>{t("dashboard.candidates.stack")}</TableCell>
                  <TableCell>{t("dashboard.candidates.location")}</TableCell>
                  <TableCell>{t("dashboard.candidates.experience")}</TableCell>
                  <TableCell>{tr("Match", "Збіг")}</TableCell>
                  <TableCell>{tr("Source", "Джерело")}</TableCell>
                  <TableCell>{t("dashboard.candidates.status")}</TableCell>
                  <TableCell align="right">{t("dashboard.candidates.action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.stack}</TableCell>
                    <TableCell>{candidate.location}</TableCell>
                    <TableCell>
                      {candidate.yearsExp} {t("dashboard.candidates.years")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={(candidate.matchScore ?? 0) >= 90 ? "success" : "default"}
                        label={`${candidate.matchScore ?? 0}%`}
                      />
                    </TableCell>
                    <TableCell>{candidate.source ?? tr("Direct", "Напряму")}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={localizeCandidateStatus(candidate.status)}
                        color={candidateColor(candidate.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {candidate.status === "Accepted" ? (
                          <Button
                            size="small"
                            onClick={() =>
                              setChatParticipant({
                                id: candidate.id,
                                name: candidate.name,
                                position: candidate.stack,
                                isEmployer: true,
                              })
                            }
                          >
                            {tr("Chat", "Чат")}
                          </Button>
                        ) : null}
                        {candidate.status !== "Accepted" ? (
                          <Button size="small" onClick={() => changeCandidateStatus(candidate.id)}>
                            {t("dashboard.candidates.move")}
                          </Button>
                        ) : null}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  function renderAccountConnections() {
    const providers: IntegrationProvider[] = ["github", "linkedin"];

    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">{t("dashboard.integrations.title")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.integrations.subtitle")}
            </Typography>

            {providers.map((provider) => {
              const meta = providerMeta(provider);
              const providerLabel = t(meta.labelKey);
              const item = workspace.integrations[provider];

              return (
                <Card key={provider} variant="outlined">
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar sx={{ bgcolor: "grey.100", color: "text.primary" }}>
                          {meta.icon}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{providerLabel}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.connected
                              ? `${item.username} ${t("integration.connectedSuffix")}${item.connectedAt
                                ? ` ${formatDate(item.connectedAt, locale)}`
                                : ""
                              }`
                              : t("dashboard.integrations.notConnected")}
                          </Typography>
                          {item.connected && item.profileUrl ? (
                            <Typography variant="body2">
                              <Link href={item.profileUrl} target="_blank" rel="noreferrer">
                                {item.profileUrl}
                              </Link>
                            </Typography>
                          ) : null}
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t("dashboard.integrations.oauth.notice")}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openOAuthPreview(provider)}
                          >
                            {t("dashboard.integrations.oauth")}
                          </Button>
                        </Tooltip>

                        {item.connected ? (
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() => disconnectProvider(provider)}
                          >
                            {t("dashboard.integrations.disconnect")}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => openConnectionDialog(provider)}
                          >
                            {t("dashboard.integrations.connect")}
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  function renderMyAccount() {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("dashboard.resume.title")}
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label={t("dashboard.resume.fullName")}
                  value={workspace.resume.fullName}
                  onChange={(event) => updateResumeField("fullName", event.target.value)}
                />
                <TextField
                  label={t("dashboard.resume.headline")}
                  value={workspace.resume.headline}
                  onChange={(event) => updateResumeField("headline", event.target.value)}
                />
                <TextField
                  label={t("dashboard.resume.location")}
                  value={workspace.resume.location}
                  onChange={(event) => updateResumeField("location", event.target.value)}
                />
                <TextField
                  label={t("dashboard.resume.summary")}
                  multiline
                  minRows={4}
                  value={workspace.resume.summary}
                  onChange={(event) => updateResumeField("summary", event.target.value)}
                />

                <Divider />

                <Typography fontWeight={600}>{t("dashboard.resume.skills")}</Typography>
                <Stack direction="row" spacing={1.2}>
                  <TextField
                    fullWidth
                    label={t("dashboard.resume.addSkill")}
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button variant="outlined" onClick={addSkill}>
                    {t("dashboard.resume.add")}
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {workspace.resume.skills.map((skill) => (
                    <Chip key={skill} label={skill} onDelete={() => removeSkill(skill)} />
                  ))}
                </Stack>

                <Divider />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography fontWeight={600}>{t("dashboard.resume.experience")}</Typography>
                  <Button startIcon={<AddIcon />} onClick={addExperience}>
                    {t("dashboard.resume.addExperience")}
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {workspace.resume.experiences.map((experience) => (
                    <Card key={experience.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.2}>
                          <TextField
                            label={t("dashboard.resume.role")}
                            value={experience.role}
                            onChange={(event) =>
                              updateExperience(experience.id, "role", event.target.value)
                            }
                          />
                          <TextField
                            label={t("dashboard.resume.company")}
                            value={experience.company}
                            onChange={(event) =>
                              updateExperience(experience.id, "company", event.target.value)
                            }
                          />
                          <TextField
                            label={t("dashboard.resume.period")}
                            value={experience.period}
                            onChange={(event) =>
                              updateExperience(experience.id, "period", event.target.value)
                            }
                          />
                          <TextField
                            label={t("dashboard.resume.description")}
                            multiline
                            minRows={3}
                            value={experience.description}
                            onChange={(event) =>
                              updateExperience(experience.id, "description", event.target.value)
                            }
                          />
                          <Box>
                            <Button
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => removeExperience(experience.id)}
                            >
                              {t("dashboard.resume.remove")}
                            </Button>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                <Box>
                  <Button variant="contained" onClick={exportResumeTxt}>
                    {t("dashboard.resume.export")}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            {renderAccountConnections()}

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("dashboard.security.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t("dashboard.security.subtitle")}
                </Typography>
                <Stack spacing={1.2}>
                  <TextField
                    label={t("dashboard.security.currentPassword")}
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                  <TextField
                    label={t("dashboard.security.newPassword")}
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <TextField
                    label={t("auth.confirmPassword")}
                    type="password"
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                  />
                  <Box>
                    <Button variant="contained" onClick={handleChangePassword}>
                      {t("dashboard.security.changePassword")}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("dashboard.resume.preview")}
                </Typography>

                <Stack spacing={1}>
                  <Typography variant="h5">{workspace.resume.fullName}</Typography>
                  <Typography color="text.secondary">{workspace.resume.headline}</Typography>
                  <Typography color="text.secondary">
                    {workspace.resume.location} • {workspace.resume.email}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight={700} gutterBottom>
                  {t("dashboard.resume.summaryBlock")}
                </Typography>
                <Typography color="text.secondary">{workspace.resume.summary}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight={700} gutterBottom>
                  {t("dashboard.resume.skillsBlock")}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {workspace.resume.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" />
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight={700} gutterBottom>
                  {t("dashboard.resume.experienceBlock")}
                </Typography>
                <Stack spacing={1.5}>
                  {workspace.resume.experiences.map((experience) => (
                    <Box key={experience.id}>
                      <Typography fontWeight={600}>
                        {experience.role || t("dashboard.resume.placeholder.role")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {experience.company || t("dashboard.resume.placeholder.company")} •{" "}
                        {experience.period || t("dashboard.resume.placeholder.period")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {experience.description || t("dashboard.resume.placeholder.description")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    );
  }

  if (loadingSession || !session) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography>{t("common.loadingDashboard")}</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          themeMode === "dark"
            ? "radial-gradient(circle at top left, #162338 0%, #0B1220 50%, #0C1D18 100%)"
            : "radial-gradient(circle at top left, #EAF3FF 0%, #F3F6FB 50%, #EEF5F3 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Card sx={{ overflow: "hidden" }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                    {session.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{session.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.email}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      session.role === "job_seeker"
                        ? t("role.seeker")
                        : t("role.employer")
                    }
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>

                <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap" alignItems="center">
                  <Box
                    sx={{
                      height: 36,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      bgcolor: "background.paper",
                    }}
                  >
                    <LanguageRoundedIcon color="action" fontSize="small" />
                    <Select
                      value={language}
                      variant="standard"
                      disableUnderline
                      onChange={(event) => setLanguage(event.target.value as AppLanguage)}
                      sx={{ minWidth: 108, fontSize: 14, fontWeight: 600 }}
                    >
                      <MenuItem value="en">{t("settings.language.en")}</MenuItem>
                      <MenuItem value="uk">{t("settings.language.uk")}</MenuItem>
                    </Select>
                  </Box>

                  <IconButton
                    onClick={(e) => setNotifAnchor(e.currentTarget)}
                    size="small"
                    aria-label="notifications"
                  >
                    <Badge badgeContent={unreadNotifications} color="error" max={9}>
                      <NotificationsOutlinedIcon />
                    </Badge>
                  </IconButton>
                  <Popover
                    open={Boolean(notifAnchor)}
                    anchorEl={notifAnchor}
                    onClose={() => setNotifAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{ paper: { sx: { width: 340, maxHeight: 400, borderRadius: 2 } } }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.notifications.title")}
                      </Typography>
                      {unreadNotifications > 0 && (
                        <Button
                          size="small"
                          onClick={() => {
                            setWorkspace((prev) => ({
                              ...prev,
                              notifications: prev.notifications.map((n) => ({ ...n, read: true })),
                            }));
                            setNotifAnchor(null);
                          }}
                        >
                          {t("dashboard.notifications.markAllRead")}
                        </Button>
                      )}
                    </Stack>
                    <Divider />
                    {workspace.notifications.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                        {t("dashboard.notifications.empty")}
                      </Typography>
                    ) : (
                      <List dense disablePadding sx={{ overflow: "auto" }}>
                        {workspace.notifications.slice(0, 8).map((n) => (
                          <ListItem
                            key={n.id}
                            sx={{
                              bgcolor: n.read ? undefined : "action.hover",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <ListItemText
                              primary={n.title}
                              secondary={n.description}
                              primaryTypographyProps={{ variant: "body2", fontWeight: n.read ? 400 : 600 }}
                              secondaryTypographyProps={{ variant: "caption", noWrap: true }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Popover>

                  <Button component={Link} href="/" variant="outlined">
                    {t("common.home")}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleSignOut}
                  >
                    {t("common.signOut")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {notice ? (
            <Alert severity={notice.severity} onClose={() => setNotice(null)}>
              {notice.message}
            </Alert>
          ) : null}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card
                elevation={0}
                sx={{
                  position: { md: "sticky" },
                  top: 24,
                  border: "1px solid",
                  borderColor: themeMode === "dark" ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: themeMode === "dark" ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.12)",
                    background: themeMode === "dark"
                      ? "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.05))"
                      : "linear-gradient(135deg, rgba(239,246,255,0.9), rgba(245,243,255,0.9))",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: themeMode === "dark" ? "rgba(148,163,184,0.7)" : "rgba(100,116,139,0.7)",
                    }}
                  >
                    {t("dashboard.workspace")}
                  </Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                  {tabs.map((tab) => (
                    <ListItemButton
                      key={tab.value}
                      selected={currentTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.4,
                        py: 1,
                        px: 1.5,
                        transition: "all 200ms",
                        "&.Mui-selected": {
                          background: themeMode === "dark"
                            ? "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.15))"
                            : "linear-gradient(135deg, rgba(219,234,254,0.9), rgba(237,233,254,0.8))",
                          "& .MuiListItemIcon-root": {
                            color: themeMode === "dark" ? "#60A5FA" : "#2563EB",
                          },
                          "& .MuiListItemText-primary": {
                            fontWeight: 700,
                            color: themeMode === "dark" ? "#60A5FA" : "#2563EB",
                          },
                        },
                        "&:hover:not(.Mui-selected)": {
                          bgcolor: themeMode === "dark" ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.8)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>{tab.icon}</ListItemIcon>
                      <ListItemText
                        primary={t(tab.labelKey)}
                        primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                      />
                    </ListItemButton>
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Stack spacing={3}>
                {/* Welcome banner */}
                <Card
                  sx={{
                    borderRadius: 3,
                    background: themeMode === "dark"
                      ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.1))"
                      : "linear-gradient(135deg, rgba(239, 246, 255, 0.98), rgba(249, 245, 255, 0.95))",
                    border: "1px solid",
                    borderColor: themeMode === "dark"
                      ? "rgba(96, 165, 250, 0.2)"
                      : "rgba(147, 197, 253, 0.35)",
                  }}
                >
                  <CardContent sx={{ py: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Typography variant="h5" fontWeight={800} sx={{ color: themeMode === "dark" ? "#F1F5F9" : "#0F172A" }}>
                        {t("dashboard.welcome")}, {session.fullName.split(" ")[0]}! 👋
                      </Typography>
                      <Typography variant="body2" sx={{ color: themeMode === "dark" ? "rgba(203, 213, 225, 0.85)" : "rgba(51, 65, 85, 0.85)" }}>
                        {t("dashboard.welcome.subtitle")}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {(session.role === "job_seeker"
                          ? [
                            { label: t("dashboard.quickAction.jobs"), tab: "jobs" as const },
                            { label: t("dashboard.quickAction.resume"), tab: "my_account" as const },
                            { label: t("dashboard.quickAction.messages"), tab: "messages" as const },
                          ]
                          : [
                            { label: t("dashboard.quickAction.postJob"), tab: "job_posts" as const },
                            { label: t("dashboard.quickAction.candidates"), tab: "candidates" as const },
                            { label: t("dashboard.quickAction.analytics"), tab: "analytics" as const },
                          ]
                        ).map((action) => (
                          <Chip
                            key={action.tab}
                            label={action.label}
                            onClick={() => setActiveTab(action.tab)}
                            color="primary"
                            variant={currentTab === action.tab ? "filled" : "outlined"}
                            sx={{
                              fontWeight: 600,
                              transition: "all 200ms",
                              "&:hover": { transform: "translateY(-1px)" },
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {currentTab === "overview" ? renderOverview(session.role) : null}
                {currentTab === "jobs" ? renderJobs() : null}
                {currentTab === "applications" ? renderApplications() : null}
                {currentTab === "messages" ? renderMessages() : null}
                {currentTab === "notifications" ? renderNotifications() : null}
                {currentTab === "interviews" ? renderInterviews() : null}
                {currentTab === "analytics" ? renderAnalytics() : null}
                {currentTab === "team" ? renderTeam() : null}
                {currentTab === "billing" ? renderBilling() : null}
                {currentTab === "developer" ? renderDeveloper() : null}
                {currentTab === "job_posts" ? renderJobPosts() : null}
                {currentTab === "candidates" ? renderCandidates() : null}
                {currentTab === "my_account" ? renderMyAccount() : null}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Dialog open={!!chatParticipant} onClose={() => setChatParticipant(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {tr("Chat with", "Чат з")} {chatParticipant?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {chatParticipant?.isEmployer
                ? tr("Discussing role:", "Обговорення посади:")
                : tr("Discussing application for:", "Обговорення заявки на:")}{" "}
              {chatParticipant?.position}
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 200, maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
              {(chatParticipant && workspace.chats[chatParticipant.id] || []).map((msg) => {
                const isMine = msg.senderId === session?.email;
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      bgcolor: isMine ? "primary.main" : "background.paper",
                      color: isMine ? "primary.contrastText" : "text.primary",
                      p: 1.5,
                      borderRadius: 2,
                      border: isMine ? "none" : "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {!isMine && (
                      <Typography variant="caption" sx={{ display: "block", mb: 0.5, opacity: 0.7 }}>
                        {msg.senderName} ({msg.isEmployer ? tr("Employer", "Роботодавець") : tr("Candidate", "Кандидат")})
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{msg.text}</Typography>
                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.7, textAlign: "right" }}>
                      {formatDateTime(msg.timestamp, locale)}
                    </Typography>
                  </Box>
                );
              })}
              {(!chatParticipant || !workspace.chats[chatParticipant.id] || workspace.chats[chatParticipant.id].length === 0) && (
                <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                  {tr("No messages yet. Start the conversation!", "Поки немає повідомлень. Почніть спілкування!")}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder={tr("Type your message...", "Введіть ваше повідомлення...")}
              value={chatMessageText}
              onChange={(e) => setChatMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatParticipant(null)}>{t("common.cancel")}</Button>
          <Button onClick={handleSendMessage} variant="contained">
            {tr("Send Message", "Надіслати")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={connectionDialog.open} onClose={closeConnectionDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {t("dashboard.integrations.dialog.titlePrefix")}{" "}
          {t(providerMeta(connectionDialog.provider).labelKey)}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t("dashboard.integrations.dialog.username")}
              value={connectionDialog.username}
              onChange={(event) =>
                setConnectionDialog((prev) => ({
                  ...prev,
                  username: event.target.value,
                  error: "",
                }))
              }
            />
            <TextField
              label={t("dashboard.integrations.dialog.profileUrl")}
              value={connectionDialog.profileUrl}
              onChange={(event) =>
                setConnectionDialog((prev) => ({
                  ...prev,
                  profileUrl: event.target.value,
                  error: "",
                }))
              }
              helperText={`${t("dashboard.integrations.dialog.helper")} ${providerMeta(connectionDialog.provider).profilePrefix}username`}
            />
            {connectionDialog.error ? <Alert severity="error">{connectionDialog.error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConnectionDialog}>{t("common.cancel")}</Button>
          <Button onClick={saveConnection} variant="contained">
            {t("dashboard.integrations.dialog.saveConnection")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
