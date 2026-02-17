"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { sampleCompanies } from "@/lib/mock-data";
import { getSession } from "@/lib/local-auth";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

type IndustryFilter = "all" | "SaaS" | "Fintech" | "E-commerce" | "Consulting" | "Startup";
type SortOption = "rating" | "positions" | "name";

const industryFilterKeys: Record<IndustryFilter, string> = {
    all: "companies.filter.all",
    SaaS: "companies.filter.saas",
    Fintech: "companies.filter.fintech",
    "E-commerce": "companies.filter.ecommerce",
    Consulting: "companies.filter.consulting",
    Startup: "companies.filter.startup",
};

const BOOKMARKS_KEY = "hire_now_company_bookmarks_v1";

function readBookmarks(): string[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    } catch {
        return [];
    }
}

export default function CompaniesPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [search, setSearch] = useState("");
    const [industry, setIndustry] = useState<IndustryFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("rating");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);
    const [toast, setToast] = useState("");

    useEffect(() => {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }, [bookmarks]);

    const isLoggedIn = typeof window !== "undefined" && getSession() !== null;

    function toggleBookmark(id: string) {
        setBookmarks((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
        );
    }

    const filtered = useMemo(() => {
        const list = sampleCompanies.filter((company) => {
            const matchesSearch =
                search.trim() === "" ||
                company.name.toLowerCase().includes(search.trim().toLowerCase());
            const matchesIndustry =
                industry === "all" || company.industry === industry;
            return matchesSearch && matchesIndustry;
        });

        list.sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "positions") return b.openPositions - a.openPositions;
            return a.name.localeCompare(b.name);
        });

        return list;
    }, [search, industry, sortBy]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                py: { xs: 1.5, md: 2 },
                background: isDark
                    ? "linear-gradient(180deg, #0F172A 0%, #101827 100%)"
                    : "linear-gradient(180deg, #F6F8FC 0%, #F8FAFD 100%)",
            }}
        >
            <Container maxWidth="lg">
                <Stack spacing={{ xs: 2.5, md: 3.5 }}>
                    <Navbar />

                    {/* Hero */}
                    <Box sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: isDark ? "#F1F5F9" : "#0F172A",
                                mb: 1,
                                background: isDark
                                    ? "linear-gradient(135deg, #93C5FD, #C4B5FD)"
                                    : "linear-gradient(135deg, #1D4ED8, #7C3AED)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {t("companies.title")}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: isDark
                                    ? "rgba(203, 213, 225, 0.9)"
                                    : "rgba(51, 65, 85, 0.9)",
                                fontWeight: 500,
                                maxWidth: 600,
                                mx: "auto",
                            }}
                        >
                            {t("companies.subtitle")}
                        </Typography>
                    </Box>

                    {/* Filters */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                        <TextField
                            label={t("companies.search")}
                            placeholder={t("companies.search.placeholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: 1 }}
                            size="small"
                        />
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>{t("companies.filter.all")}</InputLabel>
                            <Select
                                value={industry}
                                label={t("companies.filter.all")}
                                onChange={(e) => setIndustry(e.target.value as IndustryFilter)}
                            >
                                {(Object.keys(industryFilterKeys) as IndustryFilter[]).map(
                                    (key) => (
                                        <MenuItem key={key} value={key}>
                                            {t(industryFilterKeys[key])}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>{t("companies.sort.label")}</InputLabel>
                            <Select
                                value={sortBy}
                                label={t("companies.sort.label")}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                            >
                                <MenuItem value="rating">{t("companies.sort.rating")}</MenuItem>
                                <MenuItem value="positions">{t("companies.sort.positions")}</MenuItem>
                                <MenuItem value="name">{t("companies.sort.name")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Results count */}
                    <Typography variant="body2" color="text.secondary">
                        {filtered.length} {filtered.length === 1 ? "company" : "companies"}
                    </Typography>

                    {/* Company Cards */}
                    {filtered.length === 0 ? (
                        <Card sx={{ borderRadius: 3, textAlign: "center", py: 6 }}>
                            <Typography color="text.secondary">
                                {t("companies.empty")}
                            </Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={2.5}>
                            {filtered.map((company) => {
                                const isExpanded = expandedId === company.id;
                                const isBookmarked = bookmarks.includes(company.id);
                                return (
                                    <Grid key={company.id} size={{ xs: 12, md: 6 }}>
                                        <Card
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                                                borderColor: isExpanded
                                                    ? isDark
                                                        ? "rgba(147, 197, 253, 0.4)"
                                                        : "rgba(59, 130, 246, 0.35)"
                                                    : undefined,
                                                "&:hover": {
                                                    borderColor: isDark
                                                        ? "rgba(147, 197, 253, 0.35)"
                                                        : "rgba(59, 130, 246, 0.3)",
                                                    transform: "translateY(-3px)",
                                                    boxShadow: isDark
                                                        ? "0 16px 40px rgba(0, 0, 0, 0.5)"
                                                        : "0 16px 40px rgba(15, 23, 42, 0.1)",
                                                },
                                            }}
                                            onClick={() =>
                                                setExpandedId(isExpanded ? null : company.id)
                                            }
                                        >
                                            <CardContent>
                                                <Stack spacing={1.5}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1.5}
                                                        alignItems="center"
                                                    >
                                                        {/* Company icon */}
                                                        <Box
                                                            sx={{
                                                                width: 46,
                                                                height: 46,
                                                                borderRadius: 2,
                                                                display: "grid",
                                                                placeItems: "center",
                                                                fontSize: 20,
                                                                fontWeight: 800,
                                                                background: isDark
                                                                    ? "linear-gradient(135deg, rgba(30, 64, 175, 0.35), rgba(88, 28, 135, 0.25))"
                                                                    : "linear-gradient(135deg, rgba(239, 246, 255, 0.98), rgba(243, 232, 255, 0.9))",
                                                                color: isDark ? "#93C5FD" : "#1D4ED8",
                                                            }}
                                                        >
                                                            {company.name.charAt(0)}
                                                        </Box>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: isDark ? "#F1F5F9" : "#0F172A",
                                                                    lineHeight: 1.2,
                                                                }}
                                                                noWrap
                                                            >
                                                                {company.name}
                                                            </Typography>
                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                alignItems="center"
                                                                sx={{ mt: 0.3 }}
                                                            >
                                                                <Chip
                                                                    label={company.industry}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontSize: 11,
                                                                        fontWeight: 600,
                                                                        bgcolor: isDark
                                                                            ? "rgba(99, 102, 241, 0.15)"
                                                                            : "rgba(99, 102, 241, 0.08)",
                                                                        color: isDark ? "#A5B4FC" : "#4F46E5",
                                                                    }}
                                                                />
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={0.3}
                                                                    alignItems="center"
                                                                >
                                                                    <LocationOnOutlinedIcon
                                                                        sx={{ fontSize: 14, color: "text.secondary" }}
                                                                    />
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        {company.location}
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>
                                                        </Box>

                                                        {/* Bookmark */}
                                                        <Tooltip
                                                            title={
                                                                isBookmarked
                                                                    ? t("companies.bookmark.remove")
                                                                    : t("companies.bookmark.add")
                                                            }
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleBookmark(company.id);
                                                                }}
                                                                sx={{
                                                                    color: isBookmarked
                                                                        ? "#F59E0B"
                                                                        : "action.active",
                                                                    transition: "transform 200ms",
                                                                    "&:hover": { transform: "scale(1.15)" },
                                                                }}
                                                            >
                                                                {isBookmarked ? (
                                                                    <BookmarkRoundedIcon />
                                                                ) : (
                                                                    <BookmarkBorderRoundedIcon />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>

                                                        {isExpanded ? (
                                                            <ExpandLessRoundedIcon color="action" />
                                                        ) : (
                                                            <ExpandMoreRoundedIcon color="action" />
                                                        )}
                                                    </Stack>

                                                    {/* Stats row */}
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        divider={
                                                            <Box
                                                                sx={{
                                                                    width: 1,
                                                                    alignSelf: "stretch",
                                                                    bgcolor: "divider",
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <StarRoundedIcon
                                                                sx={{ fontSize: 16, color: "#FACC15" }}
                                                            />
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {company.rating}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <WorkOutlineIcon
                                                                sx={{ fontSize: 16, color: "primary.main" }}
                                                            />
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {company.openPositions}{" "}
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {t("companies.positions")}
                                                                </Typography>
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <PeopleOutlinedIcon
                                                                sx={{ fontSize: 16, color: "text.secondary" }}
                                                            />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {company.size}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>

                                                    {/* Expanded details */}
                                                    <Collapse in={isExpanded}>
                                                        <Stack spacing={1.5} sx={{ pt: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: isDark
                                                                        ? "rgba(203, 213, 225, 0.85)"
                                                                        : "rgba(51, 65, 85, 0.85)",
                                                                    lineHeight: 1.7,
                                                                }}
                                                            >
                                                                {company.description}
                                                            </Typography>
                                                            <Box>
                                                                <Typography
                                                                    variant="caption"
                                                                    fontWeight={700}
                                                                    color="text.secondary"
                                                                    sx={{ mb: 0.5, display: "block" }}
                                                                >
                                                                    {t("companies.techStack")}
                                                                </Typography>
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={0.6}
                                                                    useFlexGap
                                                                    flexWrap="wrap"
                                                                >
                                                                    {company.techStack.map((tech) => (
                                                                        <Chip
                                                                            key={tech}
                                                                            label={tech}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                height: 24,
                                                                                fontSize: 12,
                                                                                borderColor: isDark
                                                                                    ? "rgba(148, 163, 184, 0.25)"
                                                                                    : undefined,
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                            <Stack direction="row" spacing={1}>
                                                                <Button
                                                                    component={Link}
                                                                    href={isLoggedIn ? "/dashboard" : "/auth"}
                                                                    variant="contained"
                                                                    size="small"
                                                                    startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                                                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontWeight: 600,
                                                                        borderRadius: 2,
                                                                    }}
                                                                >
                                                                    {t("companies.viewJobs")}
                                                                </Button>
                                                            </Stack>
                                                        </Stack>
                                                    </Collapse>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Stack>

                <Footer language={language} isDark={isDark} />
            </Container>

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={2000}
                onClose={() => setToast("")}
                message={toast}
            />
        </Box>
    );
}
