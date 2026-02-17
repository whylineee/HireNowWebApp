"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

/* ── Fade-in on scroll ─────────────────────────────────────────── */

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={ref}
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
            }}
        >
            {children}
        </Box>
    );
}

/* ── Team data ─────────────────────────────────────────────────── */

const teamMembers = [
    { name: "Dmytro Koval", role: "about.team.ceo", initials: "DK", color: "#3B82F6" },
    { name: "Olena Marchenko", role: "about.team.cto", initials: "OM", color: "#8B5CF6" },
    { name: "Andriy Melnyk", role: "about.team.design", initials: "AM", color: "#EC4899" },
    { name: "Nina Klym", role: "about.team.product", initials: "NK", color: "#F59E0B" },
    { name: "Artem Bondarenko", role: "about.team.eng", initials: "AB", color: "#10B981" },
    { name: "Kateryna Bondar", role: "about.team.marketing", initials: "KB", color: "#F43F5E" },
];

const timeline = [
    { year: "2024", key: "about.timeline.2024" },
    { year: "2025", key: "about.timeline.2025" },
    { year: "2026", key: "about.timeline.2026" },
    { year: "2027", key: "about.timeline.2027" },
];

const values = [
    { icon: <LightbulbRoundedIcon />, key: "about.value.innovation" },
    { icon: <Diversity3RoundedIcon />, key: "about.value.inclusion" },
    { icon: <SpeedRoundedIcon />, key: "about.value.speed" },
    { icon: <HandshakeRoundedIcon />, key: "about.value.trust" },
];

export default function AboutPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: isDark
                    ? "linear-gradient(180deg, #0A1120, #0F172A)"
                    : "linear-gradient(180deg, #F6F8FC, #FFFFFF)",
            }}
        >
            <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 } }}>
                <Navbar />
            </Container>

            {/* ── Hero ──────────────────────────────────────────── */}
            <Container maxWidth="md" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 } }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Chip
                        icon={<GroupsRoundedIcon sx={{ fontSize: 16 }} />}
                        label={t("about.badge")}
                        sx={{
                            fontWeight: 600,
                            color: isDark ? "#93C5FD" : "#1D4ED8",
                            bgcolor: isDark ? "rgba(30, 64, 175, 0.18)" : "rgba(219, 234, 254, 0.9)",
                            border: `1px solid ${isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.15)"}`,
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: 32, md: 52 },
                            color: isDark ? "#F8FAFC" : "#0F172A",
                            "& span": {
                                background: isDark
                                    ? "linear-gradient(135deg, #60A5FA, #A78BFA)"
                                    : "linear-gradient(135deg, #2563EB, #7C3AED)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            },
                        }}
                    >
                        {t("about.title1")} <span>{t("about.titleHighlight")}</span> {t("about.title2")}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 400,
                            maxWidth: 520,
                            color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)",
                            lineHeight: 1.6,
                        }}
                    >
                        {t("about.subtitle")}
                    </Typography>
                </Stack>
            </Container>

            {/* ── Mission + Stats ──────────────────────────────── */}
            <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 9 } }}>
                <FadeIn>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Typography variant="h4" fontWeight={800}>
                                    {t("about.mission.title")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.75,
                                        color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.85)",
                                    }}
                                >
                                    {t("about.mission.text1")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.75,
                                        color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.85)",
                                    }}
                                >
                                    {t("about.mission.text2")}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Grid container spacing={2}>
                                {[
                                    { value: "8,900+", labelKey: "about.stat.candidates" },
                                    { value: "320+", labelKey: "about.stat.companies" },
                                    { value: "12", labelKey: "about.stat.countries" },
                                    { value: "4,100+", labelKey: "about.stat.hires" },
                                ].map((stat) => (
                                    <Grid key={stat.labelKey} size={{ xs: 6 }}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                textAlign: "center",
                                                py: 3,
                                                borderRadius: 3,
                                                border: "1px solid",
                                                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                                bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)",
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{ fontWeight: 800, color: isDark ? "#60A5FA" : "#2563EB" }}
                                            >
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {t(stat.labelKey)}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </FadeIn>
            </Container>

            {/* ── Values ────────────────────────────────────────── */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    background: isDark
                        ? "linear-gradient(180deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.3))"
                        : "linear-gradient(180deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))",
                }}
            >
                <Container maxWidth="lg">
                    <FadeIn>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                textAlign: "center",
                                mb: 4,
                                fontSize: { xs: 28, md: 40 },
                            }}
                        >
                            {t("about.values.title")}
                        </Typography>
                        <Grid container spacing={3}>
                            {values.map((val, i) => (
                                <Grid key={val.key} size={{ xs: 12, sm: 6, md: 3 }}>
                                    <FadeIn delay={i * 100}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                border: "1px solid",
                                                borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                                bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)",
                                                backdropFilter: "blur(12px)",
                                                textAlign: "center",
                                                transition: "all 250ms ease",
                                                "&:hover": {
                                                    transform: "translateY(-3px)",
                                                    borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.25)",
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        mx: "auto",
                                                        mb: 2,
                                                        color: isDark ? "#60A5FA" : "#3B82F6",
                                                        bgcolor: isDark ? "rgba(96,165,250,0.1)" : "rgba(59,130,246,0.08)",
                                                    }}
                                                >
                                                    {val.icon}
                                                </Box>
                                                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                                    {t(`${val.key}.title`)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    {t(`${val.key}.desc`)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </FadeIn>
                                </Grid>
                            ))}
                        </Grid>
                    </FadeIn>
                </Container>
            </Box>

            {/* ── Team ──────────────────────────────────────────── */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
                <FadeIn>
                    <Stack spacing={1} sx={{ textAlign: "center", mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 40 } }}>
                            {t("about.team.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                                maxWidth: 480,
                                mx: "auto",
                            }}
                        >
                            {t("about.team.subtitle")}
                        </Typography>
                    </Stack>

                    <Grid container spacing={3}>
                        {teamMembers.map((member, i) => (
                            <Grid key={member.name} size={{ xs: 6, sm: 4, md: 2 }}>
                                <FadeIn delay={i * 60}>
                                    <Stack spacing={1} alignItems="center" textAlign="center">
                                        <Avatar
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                fontSize: 22,
                                                fontWeight: 700,
                                                bgcolor: `${member.color}18`,
                                                color: member.color,
                                                border: `2px solid ${member.color}30`,
                                                transition: "all 250ms",
                                                "&:hover": {
                                                    transform: "scale(1.08)",
                                                    boxShadow: `0 8px 24px ${member.color}20`,
                                                },
                                            }}
                                        >
                                            {member.initials}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={700}>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {t(member.role)}
                                        </Typography>
                                    </Stack>
                                </FadeIn>
                            </Grid>
                        ))}
                    </Grid>
                </FadeIn>
            </Container>

            {/* ── Timeline ──────────────────────────────────────── */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    background: isDark
                        ? "linear-gradient(135deg, rgba(30, 64, 175, 0.08), rgba(124, 58, 237, 0.06))"
                        : "linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(245, 243, 255, 0.9))",
                }}
            >
                <Container maxWidth="md">
                    <FadeIn>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                textAlign: "center",
                                mb: 5,
                                fontSize: { xs: 28, md: 40 },
                            }}
                        >
                            {t("about.timeline.title")}
                        </Typography>

                        <Stack spacing={0}>
                            {timeline.map((item, i) => (
                                <FadeIn key={item.year} delay={i * 120}>
                                    <Stack
                                        direction="row"
                                        spacing={3}
                                        sx={{
                                            position: "relative",
                                            pb: 4,
                                            "&::before": i < timeline.length - 1 ? {
                                                content: '""',
                                                position: "absolute",
                                                left: 20,
                                                top: 48,
                                                bottom: 0,
                                                width: 2,
                                                bgcolor: isDark ? "rgba(96,165,250,0.2)" : "rgba(59,130,246,0.15)",
                                            } : {},
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                                display: "grid",
                                                placeItems: "center",
                                                flexShrink: 0,
                                                background: isDark
                                                    ? "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(167,139,250,0.15))"
                                                    : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.08))",
                                                border: "2px solid",
                                                borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.2)",
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: isDark ? "#93C5FD" : "#2563EB",
                                                    fontSize: 11,
                                                }}
                                            >
                                                {item.year}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ pt: 0.5 }}>
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {t(`${item.key}.title`)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mt: 0.5 }}>
                                                {t(`${item.key}.desc`)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </FadeIn>
                            ))}
                        </Stack>
                    </FadeIn>
                </Container>
            </Box>

            {/* ── Join CTA ──────────────────────────────────────── */}
            <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
                <FadeIn>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                        <FavoriteRoundedIcon sx={{ fontSize: 36, color: isDark ? "#F43F5E" : "#E11D48" }} />
                        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 44 } }}>
                            {t("about.join.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                                maxWidth: 460,
                            }}
                        >
                            {t("about.join.subtitle")}
                        </Typography>
                    </Stack>
                </FadeIn>
            </Container>

            <Container maxWidth="lg">
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
