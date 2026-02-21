"use client";

import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
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
    Grid,
    IconButton,
    LinearProgress,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

/* ─── Types ─────────────────────────────────────────────────────── */
interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    bullets: string[];
}
interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}
interface ResumeData {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    languages: string[];
    certifications: string[];
}

/* ─── AI Suggestion bank ─────────────────────────────────────────── */
const aiSuggestions: Record<string, string[]> = {
    summary: [
        "Results-driven software engineer with 5+ years building scalable web applications using React, TypeScript, and Node.js. Passionate about clean architecture and developer experience.",
        "Full-stack developer specializing in cloud-native solutions. Experienced in leading cross-functional teams and delivering high-impact products from concept to production.",
        "Senior frontend engineer with deep expertise in React ecosystem. Proven track record of improving Core Web Vitals by 40%+ and reducing bundle sizes through advanced optimization.",
    ],
    bullet: [
        "Led migration of monolithic app to microservices, reducing deployment time by 65%",
        "Architected real-time notification system serving 50K+ concurrent users with <100ms latency",
        "Reduced API response times by 40% through query optimization and Redis caching layer",
        "Mentored 4 junior engineers, conducting weekly code reviews and pair programming sessions",
        "Implemented CI/CD pipeline with GitHub Actions, cutting release cycle from 2 weeks to 2 days",
        "Built component library used across 8 product teams, saving ~200 dev hours per quarter",
    ],
};

/* ─── ATS Score Calculator ───────────────────────────────────────── */
function calcATSScore(data: ResumeData): number {
    let score = 0;
    if (data.name.trim()) score += 10;
    if (data.email.includes("@")) score += 10;
    if (data.summary.length > 80) score += 15;
    if (data.skills.length >= 5) score += 15;
    if (data.experience.length >= 1) score += 20;
    if (data.experience.some((e) => e.bullets.some((b) => b.length > 30))) score += 10;
    if (data.education.length >= 1) score += 10;
    if (data.linkedin || data.github) score += 5;
    if (data.certifications.length >= 1) score += 5;
    return Math.min(score, 100);
}

const defaultData: ResumeData = {
    name: "Alex Johnson",
    title: "Senior Frontend Engineer",
    email: "alex@example.com",
    phone: "+1 (555) 000-0000",
    location: "Remote, EU",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    summary:
        "Results-driven frontend engineer with 6+ years building high-performance web applications using React, TypeScript, and Next.js. Passionate about developer experience and clean UI architecture.",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "Docker", "AWS", "PostgreSQL"],
    experience: [
        {
            id: "exp-1",
            company: "NovaLabs",
            role: "Senior Frontend Engineer",
            period: "2022 – Present",
            bullets: [
                "Led redesign of core product UI, improving NPS by 28 points",
                "Built real-time collaboration features serving 15K+ daily users",
                "Reduced bundle size by 42% through code splitting and lazy loading",
            ],
        },
        {
            id: "exp-2",
            company: "CloudNest",
            role: "Frontend Developer",
            period: "2019 – 2022",
            bullets: [
                "Developed component library adopted by 6 product teams",
                "Implemented CI/CD pipeline cutting release time from 2 weeks to 2 days",
            ],
        },
    ],
    education: [
        {
            id: "edu-1",
            school: "Kyiv Polytechnic Institute",
            degree: "B.Sc. Computer Science",
            year: "2019",
        },
    ],
    languages: ["English (Fluent)", "Ukrainian (Native)"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional"],
};

type TabKey = "info" | "experience" | "education" | "skills" | "preview";

export default function ResumeBuilderPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [data, setData] = useState<ResumeData>(defaultData);
    const [tab, setTab] = useState<TabKey>("info");
    const [atsScore, setAtsScore] = useState(0);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiDialog, setAiDialog] = useState<{ type: "summary" | "bullet"; expId?: string } | null>(null);
    const [toast, setToast] = useState("");
    const [newSkill, setNewSkill] = useState("");
    const [newLang, setNewLang] = useState("");
    const [newCert, setNewCert] = useState("");

    useEffect(() => {
        setAtsScore(calcATSScore(data));
    }, [data]);

    function update(field: keyof ResumeData, value: unknown) {
        setData((prev) => ({ ...prev, [field]: value }));
    }

    function addExperience() {
        const newExp: Experience = {
            id: `exp-${Date.now()}`,
            company: "",
            role: "",
            period: "",
            bullets: [""],
        };
        update("experience", [...data.experience, newExp]);
    }

    function updateExp(id: string, field: keyof Experience, value: unknown) {
        update(
            "experience",
            data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    }

    function removeExp(id: string) {
        update("experience", data.experience.filter((e) => e.id !== id));
    }

    function addBullet(expId: string) {
        update(
            "experience",
            data.experience.map((e) =>
                e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
            )
        );
    }

    function updateBullet(expId: string, idx: number, val: string) {
        update(
            "experience",
            data.experience.map((e) =>
                e.id === expId
                    ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? val : b)) }
                    : e
            )
        );
    }

    function removeBullet(expId: string, idx: number) {
        update(
            "experience",
            data.experience.map((e) =>
                e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
            )
        );
    }

    function addEducation() {
        update("education", [
            ...data.education,
            { id: `edu-${Date.now()}`, school: "", degree: "", year: "" },
        ]);
    }

    function updateEdu(id: string, field: keyof Education, value: string) {
        update(
            "education",
            data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    }

    function removeEdu(id: string) {
        update("education", data.education.filter((e) => e.id !== id));
    }

    function addSkill() {
        if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
            update("skills", [...data.skills, newSkill.trim()]);
            setNewSkill("");
        }
    }

    function removeSkill(s: string) {
        update("skills", data.skills.filter((sk) => sk !== s));
    }

    function handleAISuggest(type: "summary" | "bullet", expId?: string) {
        setAiDialog({ type, expId });
    }

    function applyAISuggestion(suggestion: string) {
        if (!aiDialog) return;
        if (aiDialog.type === "summary") {
            update("summary", suggestion);
        } else if (aiDialog.expId) {
            update(
                "experience",
                data.experience.map((e) =>
                    e.id === aiDialog.expId
                        ? { ...e, bullets: [...e.bullets, suggestion] }
                        : e
                )
            );
        }
        setAiDialog(null);
        setToast("AI suggestion applied!");
    }

    function exportText() {
        const lines = [
            data.name,
            data.title,
            `${data.email} | ${data.phone} | ${data.location}`,
            data.linkedin && `LinkedIn: ${data.linkedin}`,
            data.github && `GitHub: ${data.github}`,
            "",
            "SUMMARY",
            data.summary,
            "",
            "SKILLS",
            data.skills.join(", "),
            "",
            "EXPERIENCE",
            ...data.experience.flatMap((e) => [
                `${e.role} @ ${e.company} (${e.period})`,
                ...e.bullets.map((b) => `  • ${b}`),
                "",
            ]),
            "EDUCATION",
            ...data.education.map((e) => `${e.degree}, ${e.school} (${e.year})`),
            "",
            data.languages.length ? `LANGUAGES\n${data.languages.join(", ")}` : "",
            data.certifications.length ? `\nCERTIFICATIONS\n${data.certifications.join(", ")}` : "",
        ]
            .filter(Boolean)
            .join("\n");

        const blob = new Blob([lines], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.name.replace(/\s+/g, "_")}_Resume.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setToast("Resume exported!");
    }

    function exportPdf() {
        window.print();
        setToast("Preparing PDF...");
    }

    const scoreColor =
        atsScore >= 80 ? "#10B981" : atsScore >= 60 ? "#F59E0B" : "#EF4444";

    const cardSx = {
        borderRadius: 3,
        border: "1px solid",
        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
        bgcolor: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
    };

    const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: 2 } };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: isDark
                    ? "radial-gradient(circle at top, #0F1A2E 0%, #0B1220 60%)"
                    : "radial-gradient(circle at top, #EAF3FF 0%, #F3F6FB 60%)",
            }}
        >
            <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 } }}>
                <Navbar />
            </Container>

            {/* Hero */}
            <Box
                sx={{
                    py: { xs: 4, md: 6 },
                    textAlign: "center",
                    borderBottom: "1px solid",
                    borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={2} alignItems="center">
                        <Chip
                            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />}
                            label="AI-Powered Resume Builder"
                            sx={{
                                fontWeight: 700,
                                bgcolor: isDark ? "rgba(139,92,246,0.15)" : "rgba(237,233,254,0.9)",
                                color: isDark ? "#A78BFA" : "#6D28D9",
                                border: "1px solid",
                                borderColor: isDark ? "rgba(167,139,250,0.2)" : "rgba(109,40,217,0.15)",
                            }}
                        />
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: 26, md: 44 },
                                background: isDark
                                    ? "linear-gradient(135deg, #F1F5F9, #A78BFA)"
                                    : "linear-gradient(135deg, #0F172A, #4F46E5)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Build a Resume That Gets Hired
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
                            AI-assisted writing, real-time ATS scoring, and instant export — all in one place.
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Left: Editor */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Stack spacing={2}>
                            {/* ATS Score card */}
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <SpeedRoundedIcon sx={{ fontSize: 18, color: scoreColor }} />
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    ATS Score
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={900}
                                                    sx={{ color: scoreColor, ml: 1 }}
                                                >
                                                    {atsScore}/100
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={atsScore}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.9)",
                                                    "& .MuiLinearProgress-bar": {
                                                        background:
                                                            atsScore >= 80
                                                                ? "linear-gradient(90deg, #10B981, #059669)"
                                                                : atsScore >= 60
                                                                    ? "linear-gradient(90deg, #F59E0B, #D97706)"
                                                                    : "linear-gradient(90deg, #EF4444, #DC2626)",
                                                        borderRadius: 3,
                                                    },
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {atsScore >= 80
                                                    ? "🎉 Excellent! Your resume is ATS-ready."
                                                    : atsScore >= 60
                                                        ? "⚡ Good. Add more skills and experience bullets."
                                                        : "📝 Needs work. Fill in all sections for better results."}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<DownloadRoundedIcon />}
                                                onClick={exportText}
                                                sx={{
                                                    borderRadius: 99,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                TXT
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<DownloadRoundedIcon />}
                                                onClick={exportPdf}
                                                sx={{
                                                    borderRadius: 99,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                PDF
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Tabs */}
                            <Card elevation={0} sx={cardSx}>
                                <Tabs
                                    value={tab}
                                    onChange={(_, v) => setTab(v)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        px: 2,
                                        borderBottom: "1px solid",
                                        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.15)",
                                        "& .MuiTab-root": { fontWeight: 600, textTransform: "none", minWidth: 90 },
                                        "& .Mui-selected": { color: isDark ? "#60A5FA" : "#2563EB" },
                                        "& .MuiTabs-indicator": {
                                            background: "linear-gradient(90deg, #2563EB, #4F46E5)",
                                            height: 3,
                                            borderRadius: 2,
                                        },
                                    }}
                                >
                                    <Tab value="info" label="Info" icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                                    <Tab value="experience" label="Experience" icon={<WorkRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                                    <Tab value="education" label="Education" icon={<SchoolRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                                    <Tab value="skills" label="Skills" icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                                </Tabs>

                                <CardContent sx={{ p: 3 }}>
                                    {/* ── INFO TAB ── */}
                                    {tab === "info" && (
                                        <Stack spacing={2.5}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Full Name" value={data.name} onChange={(e) => update("name", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Job Title" value={data.title} onChange={(e) => update("title", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Email" value={data.email} onChange={(e) => update("email", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Phone" value={data.phone} onChange={(e) => update("phone", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Location" value={data.location} onChange={(e) => update("location", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="LinkedIn URL" value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} sx={inputSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField fullWidth label="GitHub URL" value={data.github} onChange={(e) => update("github", e.target.value)} sx={inputSx} />
                                                </Grid>
                                            </Grid>

                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        Professional Summary
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />}
                                                        onClick={() => handleAISuggest("summary")}
                                                        sx={{
                                                            borderRadius: 99,
                                                            fontWeight: 700,
                                                            textTransform: "none",
                                                            fontSize: 12,
                                                            background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                                                            color: "#fff",
                                                            px: 1.5,
                                                        }}
                                                    >
                                                        AI Write
                                                    </Button>
                                                </Stack>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    value={data.summary}
                                                    onChange={(e) => update("summary", e.target.value)}
                                                    placeholder="Write a compelling professional summary..."
                                                    sx={inputSx}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {data.summary.length}/500 chars · Aim for 80–200 chars for best ATS results
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}

                                    {/* ── EXPERIENCE TAB ── */}
                                    {tab === "experience" && (
                                        <Stack spacing={3}>
                                            {data.experience.map((exp, expIdx) => (
                                                <Card
                                                    key={exp.id}
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 2,
                                                        border: "1px solid",
                                                        borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)",
                                                        bgcolor: isDark ? "rgba(15,23,42,0.4)" : "rgba(248,250,252,0.8)",
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2.5 }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "#60A5FA" : "#2563EB" }}>
                                                                Experience #{expIdx + 1}
                                                            </Typography>
                                                            <IconButton size="small" onClick={() => removeExp(exp.id)} color="error">
                                                                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Stack>
                                                        <Grid container spacing={2}>
                                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                                <TextField fullWidth label="Company" value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                                <TextField fullWidth label="Role / Title" value={exp.role} onChange={(e) => updateExp(exp.id, "role", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                            <Grid size={{ xs: 12 }}>
                                                                <TextField fullWidth label="Period (e.g. 2022 – Present)" value={exp.period} onChange={(e) => updateExp(exp.id, "period", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                        </Grid>

                                                        <Box sx={{ mt: 2 }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                                                    ACHIEVEMENTS & BULLETS
                                                                </Typography>
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
                                                                    onClick={() => handleAISuggest("bullet", exp.id)}
                                                                    sx={{
                                                                        borderRadius: 99,
                                                                        fontWeight: 700,
                                                                        textTransform: "none",
                                                                        fontSize: 11,
                                                                        background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                                                                        color: "#fff",
                                                                        px: 1.2,
                                                                        py: 0.3,
                                                                    }}
                                                                >
                                                                    AI Suggest
                                                                </Button>
                                                            </Stack>
                                                            <Stack spacing={1}>
                                                                {exp.bullets.map((bullet, bIdx) => (
                                                                    <Stack key={bIdx} direction="row" spacing={1} alignItems="center">
                                                                        <Typography sx={{ color: isDark ? "#60A5FA" : "#2563EB", flexShrink: 0, fontSize: 16 }}>•</Typography>
                                                                        <TextField
                                                                            fullWidth
                                                                            size="small"
                                                                            value={bullet}
                                                                            onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                                                                            placeholder="Describe an achievement with metrics..."
                                                                            sx={inputSx}
                                                                        />
                                                                        <IconButton size="small" onClick={() => removeBullet(exp.id, bIdx)}>
                                                                            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    </Stack>
                                                                ))}
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<AddRoundedIcon />}
                                                                    onClick={() => addBullet(exp.id)}
                                                                    sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
                                                                >
                                                                    Add bullet
                                                                </Button>
                                                            </Stack>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddRoundedIcon />}
                                                onClick={addExperience}
                                                sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                                            >
                                                Add Experience
                                            </Button>
                                        </Stack>
                                    )}

                                    {/* ── EDUCATION TAB ── */}
                                    {tab === "education" && (
                                        <Stack spacing={2.5}>
                                            {data.education.map((edu, eduIdx) => (
                                                <Card
                                                    key={edu.id}
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 2,
                                                        border: "1px solid",
                                                        borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)",
                                                        bgcolor: isDark ? "rgba(15,23,42,0.4)" : "rgba(248,250,252,0.8)",
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2.5 }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "#60A5FA" : "#2563EB" }}>
                                                                Education #{eduIdx + 1}
                                                            </Typography>
                                                            <IconButton size="small" onClick={() => removeEdu(edu.id)} color="error">
                                                                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Stack>
                                                        <Grid container spacing={2}>
                                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                                <TextField fullWidth label="School / University" value={edu.school} onChange={(e) => updateEdu(edu.id, "school", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                                <TextField fullWidth label="Degree / Field" value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                            <Grid size={{ xs: 12 }}>
                                                                <TextField fullWidth label="Graduation Year" value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} size="small" sx={inputSx} />
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddRoundedIcon />}
                                                onClick={addEducation}
                                                sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                                            >
                                                Add Education
                                            </Button>
                                        </Stack>
                                    )}

                                    {/* ── SKILLS TAB ── */}
                                    {tab === "skills" && (
                                        <Stack spacing={3}>
                                            {/* Skills */}
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                                                    Technical Skills
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                                    {data.skills.map((skill) => (
                                                        <Chip
                                                            key={skill}
                                                            label={skill}
                                                            onDelete={() => removeSkill(skill)}
                                                            sx={{
                                                                fontWeight: 600,
                                                                bgcolor: isDark ? "rgba(37,99,235,0.15)" : "rgba(219,234,254,0.8)",
                                                                color: isDark ? "#60A5FA" : "#1D4ED8",
                                                                border: "1px solid",
                                                                borderColor: isDark ? "rgba(96,165,250,0.2)" : "rgba(59,130,246,0.2)",
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                                <Stack direction="row" spacing={1}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="Add skill (e.g. React)"
                                                        value={newSkill}
                                                        onChange={(e) => setNewSkill(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                                        sx={{ flex: 1, ...inputSx }}
                                                    />
                                                    <Button variant="outlined" onClick={addSkill} sx={{ borderRadius: 2, fontWeight: 700 }}>
                                                        Add
                                                    </Button>
                                                </Stack>
                                            </Box>

                                            <Divider />

                                            {/* Languages */}
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                                                    Languages
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                                    {data.languages.map((lang) => (
                                                        <Chip
                                                            key={lang}
                                                            label={lang}
                                                            onDelete={() => update("languages", data.languages.filter((l) => l !== lang))}
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    ))}
                                                </Stack>
                                                <Stack direction="row" spacing={1}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="e.g. English (Fluent)"
                                                        value={newLang}
                                                        onChange={(e) => setNewLang(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && newLang.trim()) {
                                                                update("languages", [...data.languages, newLang.trim()]);
                                                                setNewLang("");
                                                            }
                                                        }}
                                                        sx={{ flex: 1, ...inputSx }}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            if (newLang.trim()) {
                                                                update("languages", [...data.languages, newLang.trim()]);
                                                                setNewLang("");
                                                            }
                                                        }}
                                                        sx={{ borderRadius: 2, fontWeight: 700 }}
                                                    >
                                                        Add
                                                    </Button>
                                                </Stack>
                                            </Box>

                                            <Divider />

                                            {/* Certifications */}
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                                                    Certifications
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                                    {data.certifications.map((cert) => (
                                                        <Chip
                                                            key={cert}
                                                            label={cert}
                                                            onDelete={() => update("certifications", data.certifications.filter((c) => c !== cert))}
                                                            sx={{
                                                                fontWeight: 600,
                                                                bgcolor: isDark ? "rgba(16,185,129,0.12)" : "rgba(209,250,229,0.8)",
                                                                color: isDark ? "#34D399" : "#065F46",
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                                <Stack direction="row" spacing={1}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="e.g. AWS Certified Developer"
                                                        value={newCert}
                                                        onChange={(e) => setNewCert(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && newCert.trim()) {
                                                                update("certifications", [...data.certifications, newCert.trim()]);
                                                                setNewCert("");
                                                            }
                                                        }}
                                                        sx={{ flex: 1, ...inputSx }}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            if (newCert.trim()) {
                                                                update("certifications", [...data.certifications, newCert.trim()]);
                                                                setNewCert("");
                                                            }
                                                        }}
                                                        sx={{ borderRadius: 2, fontWeight: 700 }}
                                                    >
                                                        Add
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right: Live Preview */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Box sx={{ position: { lg: "sticky" }, top: 24 }}>
                            <Card elevation={0} sx={{ ...cardSx, overflow: "hidden" }}>
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        borderBottom: "1px solid",
                                        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.15)",
                                        background: isDark
                                            ? "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))"
                                            : "linear-gradient(135deg, rgba(239,246,255,0.9), rgba(245,243,255,0.8))",
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            📄 Live Preview
                                        </Typography>
                                        <Tooltip title="Copy as text">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(data.name + "\n" + data.title);
                                                    setToast("Copied!");
                                                }}
                                            >
                                                <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>

                                {/* Global Print Styles */}
                                <style jsx global>{`
                                    @media print {
                                        body * {
                                            visibility: hidden !important;
                                        }
                                        #resume-preview-content, #resume-preview-content * {
                                            visibility: visible !important;
                                            color: black !important;
                                        }
                                        #resume-preview-content {
                                            position: absolute !important;
                                            left: 0 !important;
                                            top: 0 !important;
                                            width: 100% !important;
                                            max-height: none !important;
                                            overflow: visible !important;
                                            padding: 2rem !important;
                                            box-shadow: none !important;
                                            background: white !important;
                                        }
                                        @page {
                                            margin: 0.5cm;
                                        }
                                    }
                                `}</style>

                                {/* Resume Preview */}
                                <Box
                                    id="resume-preview-content"
                                    sx={{
                                        p: 3,
                                        maxHeight: { lg: "calc(100vh - 280px)" },
                                        overflowY: "auto",
                                        fontFamily: "'Georgia', serif",
                                        fontSize: 13,
                                        lineHeight: 1.6,
                                        color: isDark ? "#E2E8F0" : "#1E293B",
                                    }}
                                >
                                    {/* Header */}
                                    <Box sx={{ mb: 2, pb: 2, borderBottom: "2px solid", borderColor: isDark ? "#3B82F6" : "#2563EB" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                fontFamily: "inherit",
                                                color: isDark ? "#F1F5F9" : "#0F172A",
                                            }}
                                        >
                                            {data.name || "Your Name"}
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, color: isDark ? "#93C5FD" : "#2563EB", fontWeight: 600 }}>
                                            {data.title || "Job Title"}
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
                                            {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
                                        </Typography>
                                        {(data.linkedin || data.github) && (
                                            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                                                {[data.linkedin, data.github].filter(Boolean).join(" · ")}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Summary */}
                                    {data.summary && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 0.5, textTransform: "uppercase" }}>
                                                Summary
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, lineHeight: 1.7 }}>{data.summary}</Typography>
                                        </Box>
                                    )}

                                    {/* Skills */}
                                    {data.skills.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 0.5, textTransform: "uppercase" }}>
                                                Skills
                                            </Typography>
                                            <Typography sx={{ fontSize: 12 }}>{data.skills.join(" · ")}</Typography>
                                        </Box>
                                    )}

                                    {/* Experience */}
                                    {data.experience.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 1, textTransform: "uppercase" }}>
                                                Experience
                                            </Typography>
                                            <Stack spacing={1.5}>
                                                {data.experience.map((exp) => (
                                                    <Box key={exp.id}>
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                                                {exp.role || "Role"} · {exp.company || "Company"}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{exp.period}</Typography>
                                                        </Stack>
                                                        {exp.bullets.filter(Boolean).map((b, i) => (
                                                            <Typography key={i} sx={{ fontSize: 12, pl: 1.5, "&::before": { content: '"• "' } }}>
                                                                {b}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Education */}
                                    {data.education.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 0.5, textTransform: "uppercase" }}>
                                                Education
                                            </Typography>
                                            {data.education.map((edu) => (
                                                <Stack key={edu.id} direction="row" justifyContent="space-between">
                                                    <Typography sx={{ fontSize: 12 }}>
                                                        {edu.degree || "Degree"} · {edu.school || "School"}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{edu.year}</Typography>
                                                </Stack>
                                            ))}
                                        </Box>
                                    )}

                                    {/* Languages */}
                                    {data.languages.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 0.5, textTransform: "uppercase" }}>
                                                Languages
                                            </Typography>
                                            <Typography sx={{ fontSize: 12 }}>{data.languages.join(" · ")}</Typography>
                                        </Box>
                                    )}

                                    {/* Certifications */}
                                    {data.certifications.length > 0 && (
                                        <Box>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isDark ? "#60A5FA" : "#1D4ED8", mb: 0.5, textTransform: "uppercase" }}>
                                                Certifications
                                            </Typography>
                                            <Typography sx={{ fontSize: 12 }}>{data.certifications.join(" · ")}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Card>

                            {/* Tips */}
                            <Card elevation={0} sx={{ ...cardSx, mt: 2 }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                        <LightbulbRoundedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            Pro Tips
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {[
                                            "Use numbers to quantify achievements (e.g. 'reduced load time by 40%')",
                                            "Keep summary to 2-3 sentences with keywords from job descriptions",
                                            "List 8-12 skills for optimal ATS keyword coverage",
                                            "Add certifications to boost credibility by 35%",
                                        ].map((tip, i) => (
                                            <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                                                <CheckCircleRoundedIcon sx={{ fontSize: 14, color: "#10B981", mt: 0.3, flexShrink: 0 }} />
                                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                                    {tip}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* AI Suggestion Dialog */}
            <Dialog
                open={Boolean(aiDialog)}
                onClose={() => setAiDialog(null)}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <AutoAwesomeRoundedIcon sx={{ color: "#8B5CF6" }} />
                        <Typography fontWeight={800}>AI Suggestions</Typography>
                    </Stack>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            Select a suggestion to apply it. You can edit it afterwards.
                        </Alert>
                        {(aiDialog?.type === "summary" ? aiSuggestions.summary : aiSuggestions.bullet).map(
                            (suggestion, i) => (
                                <Card
                                    key={i}
                                    elevation={0}
                                    onClick={() => applyAISuggestion(suggestion)}
                                    sx={{
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.2)",
                                        cursor: "pointer",
                                        transition: "all 200ms",
                                        "&:hover": {
                                            borderColor: "#8B5CF6",
                                            bgcolor: isDark ? "rgba(139,92,246,0.08)" : "rgba(237,233,254,0.5)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                                            {suggestion}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setAiDialog(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={2500}
                onClose={() => setToast("")}
                message={toast}
            />

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
