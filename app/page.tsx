"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { sampleJobs, sampleTestimonials } from "@/lib/mock-data";
import Footer from "@/app/footer";
import Navbar from "@/app/navbar";

/* ── Animated counter hook ───────────────────────────────────────── */

function useCountUp(target: number, inView: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, inView, duration]);

  return value;
}

/* ── Animated stat card ─────────────────────────────────────────── */

function AnimatedStatCard({
  stat,
  isDark,
}: {
  stat: { label: string; value: number; suffix: string; icon: ReactNode };
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animatedValue = useCountUp(stat.value, inView);

  return (
    <Box
      ref={ref}
      sx={{
        textAlign: "center",
        py: 3,
        px: 2,
      }}
    >
      <Box sx={{ color: isDark ? "#60A5FA" : "#3B82F6", mb: 1.2 }}>
        {stat.icon}
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: isDark ? "#F1F5F9" : "#0F172A",
          fontSize: { xs: 28, md: 36 },
        }}
      >
        {animatedValue.toLocaleString()}{stat.suffix}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: isDark ? "rgba(148, 163, 184, 0.85)" : "rgba(100, 116, 139, 0.85)",
          fontWeight: 500,
          mt: 0.3,
        }}
      >
        {stat.label}
      </Typography>
    </Box>
  );
}

/* ── Fade-in on scroll wrapper ─────────────────────────────────── */

function FadeInSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
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

/* ── Trusted companies marquee ─────────────────────────────────── */

const trustedCompanies = [
  "DeployNow", "NovaLabs", "SkyMetrics", "CloudNest", "SprintCore", "ByteHive",
  "DeployNow", "NovaLabs", "SkyMetrics", "CloudNest", "SprintCore", "ByteHive",
];

function TrustedMarquee({ isDark }: { isDark: boolean }) {
  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        py: 1,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 80,
          zIndex: 2,
        },
        "&::before": {
          left: 0,
          background: isDark
            ? "linear-gradient(90deg, #0A1120, transparent)"
            : "linear-gradient(90deg, #F6F8FC, transparent)",
        },
        "&::after": {
          right: 0,
          background: isDark
            ? "linear-gradient(270deg, #0A1120, transparent)"
            : "linear-gradient(270deg, #F6F8FC, transparent)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 5,
          animation: "marquee 25s linear infinite",
          "@keyframes marquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
        }}
      >
        {trustedCompanies.map((name, i) => (
          <Typography
            key={`${name}-${i}`}
            variant="body1"
            sx={{
              whiteSpace: "nowrap",
              fontWeight: 700,
              fontSize: 15,
              color: isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.45)",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

/* ── Main component ────────────────────────────────────────────── */

export default function Home() {
  const { language, themeMode } = useAppSettings();
  const t = (key: string) => translate(language, key);
  const isDark = themeMode === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return sampleJobs.slice(0, 3);
    const q = searchQuery.toLowerCase();
    return sampleJobs
      .filter((j) => `${j.title} ${j.company} ${j.tags.join(" ")}`.toLowerCase().includes(q))
      .slice(0, 4);
  }, [searchQuery]);

  function handleEmailSubmit() {
    if (!emailInput.includes("@")) return;
    setEmailSubmitted(true);
    setTimeout(() => setEmailSubmitted(false), 4000);
    setEmailInput("");
  }

  const features = [
    { icon: <WorkOutlineIcon />, key: "landing.feat.jobs" },
    { icon: <AutoAwesomeRoundedIcon />, key: "landing.feat.matching" },
    { icon: <InsightsRoundedIcon />, key: "landing.feat.analytics" },
    { icon: <SecurityRoundedIcon />, key: "landing.feat.auth" },
    { icon: <BusinessRoundedIcon />, key: "landing.feat.pipeline" },
    { icon: <WorkspacePremiumRoundedIcon />, key: "landing.feat.resume" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, #0A1120 0%, #0F172A 100%)"
          : "linear-gradient(180deg, #F6F8FC 0%, #FFFFFF 100%)",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 } }}>
        <Navbar />
      </Container>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 6, md: 10 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Chip
            icon={<RocketLaunchRoundedIcon sx={{ fontSize: 16 }} />}
            label={t("landing.hero.badge")}
            sx={{
              fontWeight: 600,
              px: 1,
              color: isDark ? "#93C5FD" : "#1D4ED8",
              bgcolor: isDark ? "rgba(30, 64, 175, 0.18)" : "rgba(219, 234, 254, 0.9)",
              border: `1px solid ${isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.15)"}`,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 36, sm: 50, md: 64 },
              fontWeight: 800,
              lineHeight: 1.08,
              color: isDark ? "#F8FAFC" : "#0F172A",
              maxWidth: 680,
              "& span": {
                background: isDark
                  ? "linear-gradient(135deg, #60A5FA, #A78BFA)"
                  : "linear-gradient(135deg, #2563EB, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            }}
          >
            {t("landing.v2.hero.title1")} <span>{t("landing.v2.hero.titleHighlight")}</span> {t("landing.v2.hero.title2")}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              maxWidth: 560,
              color: isDark ? "rgba(148, 163, 184, 0.9)" : "rgba(71, 85, 105, 0.9)",
              lineHeight: 1.6,
            }}
          >
            {t("landing.v2.hero.subtitle")}
          </Typography>

          {/* Search bar */}
          <Box sx={{ width: "100%", maxWidth: 520, mt: 1 }}>
            <TextField
              fullWidth
              placeholder={t("landing.v2.hero.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.5)" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 99,
                  height: 52,
                  bgcolor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                  fontSize: 15,
                  "& fieldset": {
                    borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.35)",
                  },
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              component={Link}
              href="/auth?mode=sign_up"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                borderRadius: 99,
                px: 3.5,
                fontWeight: 700,
                textTransform: "none",
                fontSize: 15,
                background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                boxShadow: isDark
                  ? "0 4px 24px rgba(37, 99, 235, 0.3)"
                  : "0 4px 24px rgba(37, 99, 235, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                },
              }}
            >
              {t("landing.v2.hero.cta")}
            </Button>
            <Button
              component={Link}
              href="/companies"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 99,
                px: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: 15,
                borderColor: isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(148, 163, 184, 0.4)",
                color: isDark ? "#CBD5E1" : "#475569",
                "&:hover": {
                  borderColor: isDark ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.4)",
                  bgcolor: isDark ? "rgba(30, 64, 175, 0.1)" : "rgba(239, 246, 255, 0.6)",
                },
              }}
            >
              {t("landing.v2.hero.explore")}
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* ── TRUSTED BY ───────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ pb: 4 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: isDark ? "rgba(148,163,184,0.45)" : "rgba(100,116,139,0.45)",
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            mb: 1.5,
          }}
        >
          {t("landing.v2.trustedBy")}
        </Typography>
        <TrustedMarquee isDark={isDark} />
      </Container>

      {/* ── LIVE JOB SEARCH PREVIEW ──────────────────────────── */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 9 } }}>
        <FadeInSection>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.2)",
              bgcolor: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(16px)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkOutlineIcon sx={{ color: isDark ? "#60A5FA" : "#3B82F6" }} />
                  <Typography variant="h5" fontWeight={700}>
                    {t("landing.v2.liveJobs.title")}
                  </Typography>
                  <Chip
                    label={t("landing.v2.liveJobs.live")}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
                      color: "#22C55E",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  />
                </Stack>

                <Grid container spacing={2}>
                  {filteredJobs.map((job, i) => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          transition: "all 250ms ease",
                          borderColor: isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.2)",
                          "&:hover": {
                            borderColor: isDark ? "rgba(96, 165, 250, 0.35)" : "rgba(59, 130, 246, 0.3)",
                            transform: "translateY(-3px)",
                            boxShadow: isDark
                              ? "0 8px 32px rgba(0,0,0,0.3)"
                              : "0 8px 32px rgba(0, 0, 0, 0.06)",
                          },
                        }}
                      >
                        <CardContent>
                          <Stack spacing={1}>
                            <Chip
                              label={job.employmentType}
                              size="small"
                              sx={{
                                width: "fit-content",
                                fontWeight: 600,
                                fontSize: 11,
                                bgcolor: isDark ? "rgba(96, 165, 250, 0.12)" : "rgba(219, 234, 254, 0.8)",
                                color: isDark ? "#93C5FD" : "#1D4ED8",
                              }}
                            />
                            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.company} • {job.location}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: isDark ? "#60A5FA" : "#2563EB",
                              }}
                            >
                              {job.salaryRange}
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {job.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: 11,
                                    height: 22,
                                    borderColor: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)",
                                  }}
                                />
                              ))}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ textAlign: "center", pt: 1 }}>
                  <Button
                    component={Link}
                    href="/dashboard"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {t("landing.v2.liveJobs.viewAll")}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </FadeInSection>
      </Container>

      {/* ── FEATURES GRID ────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 9 } }}>
        <FadeInSection>
          <Stack spacing={1} sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
              }}
            >
              {t("landing.v2.features.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                maxWidth: 480,
                mx: "auto",
              }}
            >
              {t("landing.v2.features.subtitle")}
            </Typography>
          </Stack>

          <Grid container spacing={2.5}>
            {features.map((feat, i) => (
              <Grid key={feat.key} size={{ xs: 12, sm: 6, md: 4 }}>
                <FadeInSection delay={i * 80}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      transition: "all 250ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: isDark
                          ? "0 8px 32px rgba(0,0,0,0.25)"
                          : "0 8px 32px rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: "grid",
                          placeItems: "center",
                          mb: 2,
                          color: isDark ? "#60A5FA" : "#3B82F6",
                          bgcolor: isDark ? "rgba(96, 165, 250, 0.1)" : "rgba(59, 130, 246, 0.08)",
                        }}
                      >
                        {feat.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                        {t(`${feat.key}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {t(`${feat.key}.desc`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </FadeInSection>
      </Container>

      {/* ── STATS ────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          background: isDark
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.3))"
            : "linear-gradient(180deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))",
        }}
      >
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: "center",
                mb: 4,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
              }}
            >
              {t("landing.stats.title")}
            </Typography>
            <Grid container>
              {[
                { label: t("landing.stats.item1.label"), value: 1250, suffix: "+", icon: <WorkOutlineIcon sx={{ fontSize: 28 }} /> },
                { label: t("landing.stats.item2.label"), value: 320, suffix: "+", icon: <GroupsRoundedIcon sx={{ fontSize: 28 }} /> },
                { label: t("landing.stats.item3.label"), value: 8900, suffix: "+", icon: <VerifiedUserRoundedIcon sx={{ fontSize: 28 }} /> },
                { label: t("landing.stats.item4.label"), value: 4100, suffix: "+", icon: <TrendingUpRoundedIcon sx={{ fontSize: 28 }} /> },
              ].map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                  <AnimatedStatCard stat={stat} isDark={isDark} />
                </Grid>
              ))}
            </Grid>
          </FadeInSection>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <FadeInSection>
          <Stack spacing={1} sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
              }}
            >
              {t("landing.testimonials.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                maxWidth: 480,
                mx: "auto",
              }}
            >
              {t("landing.testimonials.subtitle")}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {sampleTestimonials.map((t_item, i) => (
              <Grid key={t_item.id} size={{ xs: 12, md: 4 }}>
                <FadeInSection delay={i * 100}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                      bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      transition: "all 250ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.2)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={0.3}>
                          {Array.from({ length: 5 }).map((_, si) => (
                            <StarRoundedIcon
                              key={si}
                              sx={{
                                fontSize: 17,
                                color: si < t_item.rating ? "#FACC15" : isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
                              }}
                            />
                          ))}
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: "italic",
                            lineHeight: 1.65,
                            color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.85)",
                          }}
                        >
                          &ldquo;{t_item.quote}&rdquo;
                        </Typography>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: isDark ? "rgba(96,165,250,0.15)" : "rgba(10,102,194,0.1)",
                              color: isDark ? "#93C5FD" : "#1D4ED8",
                            }}
                          >
                            {t_item.name.split(" ").map((n) => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {t_item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t_item.role} • {t_item.company}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </FadeInSection>
      </Container>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: isDark
            ? "linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(124, 58, 237, 0.08))"
            : "linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(245, 243, 255, 0.9))",
        }}
      >
        <Container maxWidth="sm">
          <FadeInSection>
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              <MarkEmailReadRoundedIcon
                sx={{
                  fontSize: 40,
                  color: isDark ? "#60A5FA" : "#3B82F6",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  fontSize: { xs: 24, md: 32 },
                }}
              >
                {t("landing.v2.newsletter.title")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)" }}
              >
                {t("landing.v2.newsletter.subtitle")}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ width: "100%", maxWidth: 440 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("landing.v2.newsletter.placeholder")}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 99,
                      bgcolor: isDark ? "rgba(30, 41, 59, 0.5)" : "#fff",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleEmailSubmit}
                  sx={{
                    borderRadius: 99,
                    px: 3,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  }}
                >
                  {t("landing.v2.newsletter.button")}
                </Button>
              </Stack>

              {emailSubmitted && (
                <Typography variant="body2" sx={{ color: "#22C55E", fontWeight: 600 }}>
                  {t("landing.v2.newsletter.success")}
                </Typography>
              )}
            </Stack>
          </FadeInSection>
        </Container>
      </Box>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <FadeInSection>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 44 },
              }}
            >
              {t("landing.v2.cta.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                maxWidth: 500,
              }}
            >
              {t("landing.v2.cta.subtitle")}
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                href="/auth?mode=sign_up"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderRadius: 99,
                  px: 4,
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  boxShadow: isDark
                    ? "0 4px 24px rgba(37, 99, 235, 0.3)"
                    : "0 4px 24px rgba(37, 99, 235, 0.2)",
                }}
              >
                {t("landing.v2.cta.primary")}
              </Button>
              <Button
                component={Link}
                href="/salary"
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 99,
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                  color: isDark ? "#CBD5E1" : "#475569",
                }}
              >
                {t("landing.v2.cta.secondary")}
              </Button>
            </Stack>
          </Stack>
        </FadeInSection>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg">
        <Footer language={language} isDark={isDark} />
      </Container>
    </Box>
  );
}
