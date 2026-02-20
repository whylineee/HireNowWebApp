"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
    MenuItem,
    Select,
    Slider,
    Snackbar,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

const BOOKMARKS_KEY = "hire_now_job_bookmarks_v1";
const ALERTS_KEY = "hire_now_job_alerts_v1";

type ViewMode = "grid" | "list";
type SortOption = "relevance" | "date" | "salary";
type EmploymentFilter = "all" | "Full-time" | "Contract" | "Part-time";

function readBookmarks(): string[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]"); } catch { return []; }
}
function readAlerts(): string[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(ALERTS_KEY) || "[]"); } catch { return []; }
}

const techColors: Record<string, string> = {
    React: "#61DAFB", TypeScript: "#3178C6", "Node.js": "#339933",
    Python: "#3776AB", Go: "#00ADD8", Rust: "#CE422B", Docker: "#2496ED",
    Kubernetes: "#326CE5", AWS: "#FF9900", PostgreSQL: "#336791",
    GraphQL: "#E10098", Vue: "#42B883", Angular: "#DD0031",
    Java: "#ED8B00", Kotlin: "#7F52FF", Swift: "#FA7343",
};

function getTagColor(tag: string) {
    return techColors[tag] || "#6366F1";
}

function getAIScore(jobId: string): number {
    // Deterministic pseudo-random score based on job id
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) hash = (hash * 31 + jobId.charCodeAt(i)) & 0xffffffff;
    return 60 + Math.abs(hash % 38);
}

export default function JobsPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [employment, setEmployment] = useState<EmploymentFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("relevance");
    const [salaryMin, setSalaryMin] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);
    const [alerts, setAlerts] = useState<string[]>(readAlerts);
    const [applyJob, setApplyJob] = useState<any | null>(null);
    const [applyForm, setApplyForm] = useState({ name: "", email: "", cover: "" });
    const [applySubmitted, setApplySubmitted] = useState(false);
    const [toast, setToast] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [alertDialog, setAlertDialog] = useState(false);
    const [alertEmail, setAlertEmail] = useState("");

    type JobEntry = { id: string, title: string, company: string, location: string, tags: string[], salaryRange: string, employmentType: string, description: string };
    const [dbJobs, setDbJobs] = useState<JobEntry[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);

            const { data } = await supabase.from('jobs').select('*');
            if (data) {
                const mapped = data.map(j => ({
                    id: j.id,
                    title: j.title || 'Untitled',
                    company: 'TechCompany',
                    location: j.location || 'Remote',
                    employmentType: 'Full-time',
                    salaryRange: j.salary || 'Negotiable',
                    tags: ['React', 'Next.js'],
                    description: j.description || ''
                }));
                setDbJobs(mapped);
            }
        }
        load();
    }, []);

    useEffect(() => {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }, [bookmarks]);
    useEffect(() => {
        localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    }, [alerts]);

    // All unique tags
    const allTags = useMemo(() => {
        const set = new Set<string>();
        dbJobs.forEach((j) => j.tags.forEach((t: string) => set.add(t)));
        return Array.from(set).slice(0, 14);
    }, [dbJobs]);

    const filtered = useMemo(() => {
        let jobs = dbJobs.filter((job) => {
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                job.title.toLowerCase().includes(q) ||
                job.company.toLowerCase().includes(q) ||
                job.tags.some((t) => t.toLowerCase().includes(q));
            const matchLocation =
                !location || job.location.toLowerCase().includes(location.toLowerCase());
            const matchEmployment =
                employment === "all" || job.employmentType === employment;
            const matchTags =
                selectedTags.length === 0 || selectedTags.every((tag) => job.tags.includes(tag));
            return matchSearch && matchLocation && matchEmployment && matchTags;
        });

        if (sortBy === "relevance") {
            jobs = [...jobs].sort((a, b) => getAIScore(b.id) - getAIScore(a.id));
        } else if (sortBy === "salary") {
            jobs = [...jobs].sort((a, b) => {
                const aVal = parseInt(a.salaryRange.replace(/\D/g, "").slice(0, 4)) || 0;
                const bVal = parseInt(b.salaryRange.replace(/\D/g, "").slice(0, 4)) || 0;
                return bVal - aVal;
            });
        }
        return jobs;
    }, [search, location, employment, sortBy, selectedTags]);

    function toggleBookmark(id: string) {
        if (!isLoggedIn) { setToast(t("jobs.loginRequired")); return; }
        setBookmarks((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
        );
        setToast(bookmarks.includes(id) ? t("jobs.unsaved") : t("jobs.saved"));
    }

    function toggleTag(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    async function handleApply() {
        if (!applyForm.name.trim() || !applyForm.email.includes("@")) return;

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setToast("You must be logged in to apply for a job.");
            return;
        }

        const { error } = await supabase.from('applications').insert({
            job_id: applyJob.id,
            applicant_id: user.id,
            cover_letter: applyForm.cover
        });

        if (error) {
            setToast("Error applying: " + error.message);
            return;
        }

        setApplySubmitted(true);
        setTimeout(() => {
            setApplyJob(null);
            setApplySubmitted(false);
            setApplyForm({ name: "", email: "", cover: "" });
            setToast(t("jobs.applied"));
        }, 1500);
    }

    function handleSetAlert() {
        if (!alertEmail.includes("@")) return;
        setAlerts((prev) => [...prev, alertEmail]);
        setAlertDialog(false);
        setAlertEmail("");
        setToast(t("jobs.alertSet"));
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: isDark
                    ? "radial-gradient(circle at top, #0F1A2E 0%, #0B1220 60%, #0C1A18 100%)"
                    : "radial-gradient(circle at top, #EAF3FF 0%, #F3F6FB 60%, #EEF5F3 100%)",
            }}
        >
            <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 } }}>
                <Navbar />
            </Container>

            {/* Hero search bar */}
            <Box
                sx={{
                    py: { xs: 5, md: 8 },
                    textAlign: "center",
                    background: isDark
                        ? "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.06) 100%)"
                        : "linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(245,243,255,0.8) 100%)",
                    borderBottom: "1px solid",
                    borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />}
                            label={t("jobs.badge")}
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
                                fontSize: { xs: 28, md: 48 },
                                background: isDark
                                    ? "linear-gradient(135deg, #F1F5F9, #A78BFA)"
                                    : "linear-gradient(135deg, #0F172A, #4F46E5)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {t("jobs.hero.title")}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 400,
                                color: isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)",
                                maxWidth: 520,
                            }}
                        >
                            {t("jobs.hero.subtitle")}
                        </Typography>

                        {/* Search row */}
                        <Card
                            elevation={0}
                            sx={{
                                width: "100%",
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.2)",
                                bgcolor: isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(16px)",
                            }}
                        >
                            <CardContent sx={{ p: 1.5 }}>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                    <TextField
                                        fullWidth
                                        placeholder={t("jobs.search.placeholder")}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        size="small"
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <SearchRoundedIcon sx={{ fontSize: 20, mr: 1, color: "text.secondary" }} />
                                                ),
                                            },
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        placeholder={t("jobs.location.placeholder")}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <LocationOnOutlinedIcon sx={{ fontSize: 18, mr: 0.8, color: "text.secondary" }} />
                                                ),
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                                        }}
                                    >
                                        {t("jobs.search.btn")}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Quick stats */}
                        <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
                            {[
                                { value: `${dbJobs.length > 0 ? dbJobs.length : '0'}`, label: t("jobs.stat.open") },
                                { value: "320+", label: t("jobs.stat.companies") },
                                { value: "94%", label: t("jobs.stat.match") },
                            ].map((s) => (
                                <Stack key={s.label} alignItems="center">
                                    <Typography variant="h6" fontWeight={800} sx={{ color: isDark ? "#60A5FA" : "#2563EB" }}>
                                        {s.value}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Sidebar filters */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card
                            elevation={0}
                            sx={{
                                position: { md: "sticky" },
                                top: 24,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                bgcolor: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.8)",
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        <TuneRoundedIcon sx={{ fontSize: 18, mr: 0.8, verticalAlign: "middle" }} />
                                        {t("jobs.filters.title")}
                                    </Typography>
                                    {(employment !== "all" || selectedTags.length > 0) && (
                                        <Button
                                            size="small"
                                            onClick={() => { setEmployment("all"); setSelectedTags([]); }}
                                            sx={{ fontSize: 11 }}
                                        >
                                            {t("jobs.filters.reset")}
                                        </Button>
                                    )}
                                </Stack>

                                <Stack spacing={2.5}>
                                    {/* Employment type */}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                            {t("jobs.filters.type")}
                                        </Typography>
                                        <Stack spacing={0.5}>
                                            {(["all", "Full-time", "Contract", "Part-time"] as EmploymentFilter[]).map((type) => (
                                                <Box
                                                    key={type}
                                                    onClick={() => setEmployment(type)}
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.8,
                                                        borderRadius: 2,
                                                        cursor: "pointer",
                                                        transition: "all 200ms",
                                                        bgcolor: employment === type
                                                            ? isDark ? "rgba(37,99,235,0.2)" : "rgba(219,234,254,0.8)"
                                                            : "transparent",
                                                        color: employment === type
                                                            ? isDark ? "#60A5FA" : "#2563EB"
                                                            : "text.secondary",
                                                        fontWeight: employment === type ? 700 : 400,
                                                        fontSize: 14,
                                                        "&:hover": {
                                                            bgcolor: isDark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.8)",
                                                        },
                                                    }}
                                                >
                                                    {type === "all" ? t("jobs.filters.allTypes") : type}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Sort */}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                            {t("jobs.filters.sort")}
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                <MenuItem value="relevance">{t("jobs.sort.relevance")}</MenuItem>
                                                <MenuItem value="date">{t("jobs.sort.date")}</MenuItem>
                                                <MenuItem value="salary">{t("jobs.sort.salary")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Divider />

                                    {/* Tech tags */}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                                            {t("jobs.filters.tech")}
                                        </Typography>
                                        <Stack direction="row" flexWrap="wrap" gap={0.8}>
                                            {allTags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    onClick={() => toggleTag(tag)}
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: 11,
                                                        cursor: "pointer",
                                                        transition: "all 200ms",
                                                        bgcolor: selectedTags.includes(tag)
                                                            ? `${getTagColor(tag)}22`
                                                            : isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.8)",
                                                        color: selectedTags.includes(tag) ? getTagColor(tag) : "text.secondary",
                                                        border: "1px solid",
                                                        borderColor: selectedTags.includes(tag)
                                                            ? `${getTagColor(tag)}44`
                                                            : isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.2)",
                                                        "&:hover": { transform: "translateY(-1px)" },
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Job alert */}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                            {t("jobs.alert.title")}
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<NotificationsNoneRoundedIcon />}
                                            onClick={() => setAlertDialog(true)}
                                            sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none" }}
                                        >
                                            {t("jobs.alert.btn")}
                                            {alerts.length > 0 && (
                                                <Badge badgeContent={alerts.length} color="primary" sx={{ ml: 1 }} />
                                            )}
                                        </Button>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Job listings */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack spacing={2}>
                            {/* Toolbar */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    <strong style={{ color: isDark ? "#F1F5F9" : "#0F172A" }}>{filtered.length}</strong>{" "}
                                    {t("jobs.results")}
                                    {selectedTags.length > 0 && ` · ${selectedTags.join(", ")}`}
                                </Typography>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(_, v) => v && setViewMode(v)}
                                    size="small"
                                >
                                    <ToggleButton value="grid" aria-label="grid view">
                                        <GridViewRoundedIcon sx={{ fontSize: 18 }} />
                                    </ToggleButton>
                                    <ToggleButton value="list" aria-label="list view">
                                        <ViewListRoundedIcon sx={{ fontSize: 18 }} />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>

                            {filtered.length === 0 ? (
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: "1px solid",
                                        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                        textAlign: "center",
                                        py: 8,
                                    }}
                                >
                                    <WorkOutlineIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                                    <Typography color="text.secondary">{t("jobs.empty")}</Typography>
                                    <Button
                                        sx={{ mt: 2 }}
                                        onClick={() => { setSearch(""); setEmployment("all"); setSelectedTags([]); }}
                                    >
                                        {t("jobs.filters.reset")}
                                    </Button>
                                </Card>
                            ) : (
                                <Grid container spacing={viewMode === "grid" ? 2.5 : 1.5}>
                                    {filtered.map((job) => {
                                        const aiScore = getAIScore(job.id);
                                        const isBookmarked = bookmarks.includes(job.id);
                                        const isGrid = viewMode === "grid";

                                        return (
                                            <Grid key={job.id} size={{ xs: 12, sm: isGrid ? 6 : 12, lg: isGrid ? 4 : 12 }}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        height: "100%",
                                                        borderRadius: 3,
                                                        border: "1px solid",
                                                        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                                        bgcolor: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
                                                        transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
                                                        "&:hover": {
                                                            transform: "translateY(-3px)",
                                                            borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.25)",
                                                            boxShadow: isDark
                                                                ? "0 12px 32px rgba(0,0,0,0.3)"
                                                                : "0 12px 32px rgba(15,23,42,0.08)",
                                                        },
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                                                        <Stack
                                                            direction={isGrid ? "column" : "row"}
                                                            spacing={isGrid ? 1.5 : 2}
                                                            sx={{ flex: 1 }}
                                                        >
                                                            {/* Company avatar */}
                                                            <Avatar
                                                                sx={{
                                                                    width: isGrid ? 44 : 48,
                                                                    height: isGrid ? 44 : 48,
                                                                    borderRadius: 2,
                                                                    bgcolor: `${getTagColor(job.tags[0] || "React")}18`,
                                                                    color: getTagColor(job.tags[0] || "React"),
                                                                    fontWeight: 800,
                                                                    fontSize: 16,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {job.company.charAt(0)}
                                                            </Avatar>

                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            fontWeight={700}
                                                                            noWrap
                                                                            sx={{ color: isDark ? "#F1F5F9" : "#0F172A" }}
                                                                        >
                                                                            {job.title}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary" noWrap>
                                                                            {job.company}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Tooltip title={isBookmarked ? t("jobs.unsave") : t("jobs.save")}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => toggleBookmark(job.id)}
                                                                            sx={{ ml: 0.5, flexShrink: 0 }}
                                                                        >
                                                                            {isBookmarked
                                                                                ? <BookmarkRoundedIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
                                                                                : <BookmarkBorderRoundedIcon sx={{ fontSize: 18 }} />
                                                                            }
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>

                                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                                    <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {job.location}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={job.employmentType}
                                                                        size="small"
                                                                        sx={{
                                                                            fontSize: 10,
                                                                            fontWeight: 600,
                                                                            height: 20,
                                                                            bgcolor: isDark ? "rgba(30,41,59,0.8)" : "rgba(241,245,249,0.9)",
                                                                        }}
                                                                    />
                                                                </Stack>

                                                                {/* AI Match score */}
                                                                <Box sx={{ mt: 1.5 }}>
                                                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                                            <AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: "#8B5CF6" }} />
                                                                            <Typography variant="caption" sx={{ color: "#8B5CF6", fontWeight: 600 }}>
                                                                                AI Match
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Typography variant="caption" fontWeight={700} sx={{ color: aiScore >= 85 ? "#10B981" : aiScore >= 70 ? "#F59E0B" : "#6366F1" }}>
                                                                            {aiScore}%
                                                                        </Typography>
                                                                    </Stack>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={aiScore}
                                                                        sx={{
                                                                            height: 4,
                                                                            borderRadius: 2,
                                                                            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.9)",
                                                                            "& .MuiLinearProgress-bar": {
                                                                                background: aiScore >= 85
                                                                                    ? "linear-gradient(90deg, #10B981, #059669)"
                                                                                    : aiScore >= 70
                                                                                        ? "linear-gradient(90deg, #F59E0B, #D97706)"
                                                                                        : "linear-gradient(90deg, #6366F1, #4F46E5)",
                                                                                borderRadius: 2,
                                                                            },
                                                                        }}
                                                                    />
                                                                </Box>

                                                                {/* Tags */}
                                                                <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 1.5 }}>
                                                                    {job.tags.slice(0, 4).map((tag) => (
                                                                        <Chip
                                                                            key={tag}
                                                                            label={tag}
                                                                            size="small"
                                                                            sx={{
                                                                                fontSize: 10,
                                                                                fontWeight: 600,
                                                                                height: 20,
                                                                                bgcolor: `${getTagColor(tag)}15`,
                                                                                color: getTagColor(tag),
                                                                                border: "1px solid",
                                                                                borderColor: `${getTagColor(tag)}30`,
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Stack>

                                                                <Stack
                                                                    direction="row"
                                                                    justifyContent="space-between"
                                                                    alignItems="center"
                                                                    sx={{ mt: 2 }}
                                                                >
                                                                    <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "#34D399" : "#059669" }}>
                                                                        {job.salaryRange}
                                                                    </Typography>
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        onClick={() => setApplyJob(job)}
                                                                        sx={{
                                                                            borderRadius: 99,
                                                                            fontSize: 12,
                                                                            fontWeight: 700,
                                                                            textTransform: "none",
                                                                            px: 2,
                                                                            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                                                            boxShadow: "none",
                                                                        }}
                                                                    >
                                                                        {t("jobs.apply")}
                                                                    </Button>
                                                                </Stack>
                                                            </Box>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Apply Dialog */}
            <Dialog
                open={Boolean(applyJob)}
                onClose={() => !applySubmitted && setApplyJob(null)}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                {applyJob && (
                    <>
                        <DialogTitle>
                            <Stack spacing={0.5}>
                                <Typography variant="h6" fontWeight={800}>
                                    {t("jobs.applyDialog.title")} {applyJob.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {applyJob.company} · {applyJob.location}
                                </Typography>
                            </Stack>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            {applySubmitted ? (
                                <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                                    <Typography variant="h2">🎉</Typography>
                                    <Typography variant="h6" fontWeight={700}>{t("jobs.applyDialog.success")}</Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        {t("jobs.applyDialog.successDesc")}
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack spacing={2.5} sx={{ mt: 1 }}>
                                    <TextField
                                        fullWidth
                                        label={t("jobs.applyDialog.name")}
                                        value={applyForm.name}
                                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label={t("jobs.applyDialog.email")}
                                        type="email"
                                        value={applyForm.email}
                                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label={t("jobs.applyDialog.cover")}
                                        multiline
                                        rows={4}
                                        value={applyForm.cover}
                                        onChange={(e) => setApplyForm({ ...applyForm, cover: e.target.value })}
                                        placeholder={t("jobs.applyDialog.coverPlaceholder")}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        {t("jobs.applyDialog.hint")}
                                    </Alert>
                                </Stack>
                            )}
                        </DialogContent>
                        {!applySubmitted && (
                            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                                <Button onClick={() => setApplyJob(null)}>{t("common.cancel")}</Button>
                                <Button
                                    variant="contained"
                                    endIcon={<SendRoundedIcon />}
                                    onClick={handleApply}
                                    disabled={!applyForm.name.trim() || !applyForm.email.includes("@")}
                                    sx={{
                                        borderRadius: 99,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                    }}
                                >
                                    {t("jobs.applyDialog.submit")}
                                </Button>
                            </DialogActions>
                        )}
                    </>
                )}
            </Dialog>

            {/* Job Alert Dialog */}
            <Dialog
                open={alertDialog}
                onClose={() => setAlertDialog(false)}
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                <DialogTitle fontWeight={700}>{t("jobs.alert.dialogTitle")}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {t("jobs.alert.dialogDesc")}
                        </Typography>
                        <TextField
                            fullWidth
                            label={t("jobs.alert.email")}
                            type="email"
                            value={alertEmail}
                            onChange={(e) => setAlertEmail(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setAlertDialog(false)}>{t("common.cancel")}</Button>
                    <Button
                        variant="contained"
                        onClick={handleSetAlert}
                        disabled={!alertEmail.includes("@")}
                        sx={{ borderRadius: 99, fontWeight: 700, textTransform: "none" }}
                    >
                        {t("jobs.alert.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={2500}
                onClose={() => setToast("")}
                message={toast}
            />

            <Container maxWidth="xl">
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
