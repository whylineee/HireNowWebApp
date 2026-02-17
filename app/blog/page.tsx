"use client";

import { useMemo, useState } from "react";
import {
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
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { sampleArticles, type BlogArticle } from "@/lib/mock-data";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

type CategoryFilter = "all" | "career" | "tech" | "hiring" | "remote";

const categoryKeys: Record<CategoryFilter, string> = {
    all: "blog.filter.all",
    career: "blog.filter.career",
    tech: "blog.filter.tech",
    hiring: "blog.filter.hiring",
    remote: "blog.filter.remote",
};

const categoryColors: Record<string, string> = {
    career: "#10B981",
    tech: "#6366F1",
    hiring: "#F59E0B",
    remote: "#EC4899",
};

export default function BlogPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [category, setCategory] = useState<CategoryFilter>("all");
    const [search, setSearch] = useState("");
    const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
    const [toast, setToast] = useState("");

    const filtered = useMemo(() => {
        return sampleArticles.filter((article) => {
            const matchesCategory =
                category === "all" || article.category.toLowerCase() === category;
            const matchesSearch =
                search.trim() === "" ||
                article.title.toLowerCase().includes(search.trim().toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [category, search]);

    function handleShare(article: BlogArticle) {
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/blog#${article.id}`;
        navigator.clipboard.writeText(url).then(() => {
            setToast(t("blog.article.shared"));
        });
    }

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
                                mb: 1,
                                background: isDark
                                    ? "linear-gradient(135deg, #34D399, #60A5FA)"
                                    : "linear-gradient(135deg, #059669, #2563EB)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {t("blog.title")}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: isDark ? "rgba(203, 213, 225, 0.9)" : "rgba(51, 65, 85, 0.9)",
                                fontWeight: 500,
                                maxWidth: 600,
                                mx: "auto",
                            }}
                        >
                            {t("blog.subtitle")}
                        </Typography>
                    </Box>

                    {/* Filters + Search */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ sm: "center" }}
                    >
                        <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap" sx={{ flex: 1 }}>
                            {(Object.keys(categoryKeys) as CategoryFilter[]).map((key) => (
                                <Chip
                                    key={key}
                                    label={t(categoryKeys[key])}
                                    onClick={() => setCategory(key)}
                                    variant={category === key ? "filled" : "outlined"}
                                    color={category === key ? "primary" : "default"}
                                    sx={{
                                        fontWeight: 600,
                                        transition: "all 200ms",
                                        "&:hover": { transform: "translateY(-1px)" },
                                    }}
                                />
                            ))}
                        </Stack>
                        <TextField
                            placeholder={t("blog.search.placeholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <SearchRoundedIcon sx={{ fontSize: 18, mr: 0.8, color: "action.active" }} />
                                    ),
                                },
                            }}
                            sx={{ minWidth: 220 }}
                        />
                    </Stack>

                    {/* Articles Grid */}
                    {filtered.length === 0 ? (
                        <Card sx={{ borderRadius: 3, textAlign: "center", py: 6 }}>
                            <Typography color="text.secondary">{t("blog.empty")}</Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {filtered.map((article) => {
                                const accentColor =
                                    categoryColors[article.category.toLowerCase()] || "#6366F1";
                                return (
                                    <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Card
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                                                borderTop: `3px solid ${accentColor}`,
                                                display: "flex",
                                                flexDirection: "column",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: isDark
                                                        ? `0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px ${accentColor}30`
                                                        : `0 20px 50px rgba(15, 23, 42, 0.1), 0 0 0 1px ${accentColor}30`,
                                                },
                                            }}
                                            onClick={() => setSelectedArticle(article)}
                                        >
                                            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                                <Chip
                                                    label={article.category}
                                                    size="small"
                                                    sx={{
                                                        alignSelf: "flex-start",
                                                        mb: 1.5,
                                                        fontWeight: 600,
                                                        fontSize: 11,
                                                        bgcolor: `${accentColor}18`,
                                                        color: accentColor,
                                                        border: `1px solid ${accentColor}30`,
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 1,
                                                        lineHeight: 1.3,
                                                        color: isDark ? "#F1F5F9" : "#0F172A",
                                                    }}
                                                >
                                                    {article.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        flex: 1,
                                                        color: isDark
                                                            ? "rgba(203, 213, 225, 0.78)"
                                                            : "rgba(51, 65, 85, 0.78)",
                                                        mb: 2,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {article.excerpt}
                                                </Typography>
                                                <Divider sx={{ mb: 1.5 }} />
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <PersonOutlineRoundedIcon
                                                            sx={{ fontSize: 15, color: "text.secondary" }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {article.author}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <AccessTimeRoundedIcon
                                                            sx={{ fontSize: 15, color: "text.secondary" }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {article.readingTime} {t("blog.readTime")}
                                                        </Typography>
                                                    </Stack>
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

            {/* Article Detail Dialog */}
            <Dialog
                open={Boolean(selectedArticle)}
                onClose={() => setSelectedArticle(null)}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: isDark ? "#111827" : "#fff",
                        },
                    },
                }}
            >
                {selectedArticle && (
                    <>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Stack spacing={1}>
                                <Chip
                                    label={selectedArticle.category}
                                    size="small"
                                    sx={{
                                        alignSelf: "flex-start",
                                        fontWeight: 600,
                                        bgcolor: `${categoryColors[selectedArticle.category.toLowerCase()] || "#6366F1"}18`,
                                        color: categoryColors[selectedArticle.category.toLowerCase()] || "#6366F1",
                                    }}
                                />
                                <Typography variant="h5" fontWeight={800}>
                                    {selectedArticle.title}
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    sx={{ color: "text.secondary" }}
                                >
                                    <Typography variant="body2">
                                        {t("blog.by")} {selectedArticle.author}
                                    </Typography>
                                    <Typography variant="body2">{selectedArticle.date}</Typography>
                                    <Typography variant="body2">
                                        {selectedArticle.readingTime} {t("blog.readTime")}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Typography
                                variant="body1"
                                sx={{
                                    lineHeight: 1.8,
                                    color: isDark ? "rgba(203, 213, 225, 0.9)" : "rgba(51, 65, 85, 0.9)",
                                    mb: 2,
                                }}
                            >
                                {selectedArticle.excerpt}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    lineHeight: 1.8,
                                    color: isDark ? "rgba(203, 213, 225, 0.7)" : "rgba(51, 65, 85, 0.7)",
                                }}
                            >
                                {t("blog.article.fullContent")}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Tooltip title={t("blog.article.share")}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleShare(selectedArticle)}
                                >
                                    <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                            <Button onClick={() => setSelectedArticle(null)}>
                                {t("blog.article.close")}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={2000}
                onClose={() => setToast("")}
                message={toast}
            />
        </Box>
    );
}
