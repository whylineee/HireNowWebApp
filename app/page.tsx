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
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
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
function useCountUp(target: number, inView: boolean, duration = 1800) {
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
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, inView, duration]);

  return value;
}

/* ── Animated stat card ─────────────────────────────────────────── */
function AnimatedStatCard({
  stat,
  isDark,
}: {
  stat: { label: string; value: number; suffix: string; icon: ReactNode; color: string };
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animatedValue = useCountUp(stat.value, inView);

  return (
    <Box ref={ref} sx={{ textAlign: "center", py: 3, px: 2 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: 2,
          background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`,
          border: `1px solid ${stat.color}33`,
          color: stat.color,
        }}
      >
        {stat.icon}
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: isDark ? "#F1F5F9" : "#0F172A",
          fontSize: { xs: 32, md: 40 },
          letterSpacing: "-1px",
        }}
      >
        {animatedValue.toLocaleString()}{stat.suffix}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: isDark ? "rgba(148, 163, 184, 0.8)" : "rgba(100, 116, 139, 0.8)",
          fontWeight: 500,
          mt: 0.5,
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
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}

/* ── Trusted companies marquee ─────────────────────────────────── */
const trustedCompanies = [
  "DeployNow", "NovaLabs", "SkyMetrics", "CloudNest", "SprintCore", "ByteHive", "PulseGrid",
  "DeployNow", "NovaLabs", "SkyMetrics", "CloudNest", "SprintCore", "ByteHive", "PulseGrid",
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
          width: 100,
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
          gap: 6,
          animation: "marquee 30s linear infinite",
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
              fontSize: 14,
              color: isDark ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.4)",
              letterSpacing: 2,
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

/* ── How it works step ─────────────────────────────────────────── */
function HowItWorksStep({
  step,
  title,
  desc,
  icon,
  isDark,
  isLast,
}: {
  step: number;
  title: string;
  desc: string;
  icon: ReactNode;
  isDark: boolean;
  isLast: boolean;
}) {
  return (
    <Box sx={{ position: "relative", textAlign: "center" }}>
      {/* Connector line */}
      {!isLast && (
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: 28,
            left: "calc(50% + 36px)",
            right: "calc(-50% + 36px)",
            height: 2,
            background: isDark
              ? "linear-gradient(90deg, rgba(96,165,250,0.4), rgba(96,165,250,0.1))"
              : "linear-gradient(90deg, rgba(37,99,235,0.25), rgba(37,99,235,0.05))",
            borderRadius: 1,
          }}
        />
      )}

      {/* Step number + icon */}
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(79,70,229,0.15))"
              : "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(79,70,229,0.07))",
            border: `2px solid ${isDark ? "rgba(96,165,250,0.3)" : "rgba(37,99,235,0.2)"}`,
            color: isDark ? "#60A5FA" : "#2563EB",
            mx: "auto",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {step}
        </Box>
      </Box>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.8, color: isDark ? "#F1F5F9" : "#0F172A" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)", lineHeight: 1.7, maxWidth: 220, mx: "auto" }}>
        {desc}
      </Typography>
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
    { icon: <WorkOutlineIcon />, key: "landing.feat.jobs", color: "#3B82F6" },
    { icon: <AutoAwesomeRoundedIcon />, key: "landing.feat.matching", color: "#8B5CF6" },
    { icon: <InsightsRoundedIcon />, key: "landing.feat.analytics", color: "#10B981" },
    { icon: <SecurityRoundedIcon />, key: "landing.feat.auth", color: "#F59E0B" },
    { icon: <BusinessRoundedIcon />, key: "landing.feat.pipeline", color: "#EF4444" },
    { icon: <WorkspacePremiumRoundedIcon />, key: "landing.feat.resume", color: "#06B6D4" },
  ];

  const howItWorks = [
    {
      icon: <PersonSearchRoundedIcon />,
      title: language === "uk" ? "Створи профіль" : "Create Profile",
      desc: language === "uk" ? "Зареєструйся та налаштуй свій акаунт за 2 хвилини" : "Sign up and set up your account in 2 minutes",
    },
    {
      icon: <SearchRoundedIcon />,
      title: language === "uk" ? "Знайди вакансії" : "Find Opportunities",
      desc: language === "uk" ? "Переглядай IT-вакансії з зарплатами та tech stack" : "Browse IT jobs with salaries and tech stacks",
    },
    {
      icon: <RocketLaunchRoundedIcon />,
      title: language === "uk" ? "Відгукнись" : "Apply Fast",
      desc: language === "uk" ? "Надсилай відгуки та відстежуй статус в dashboard" : "Send applications and track status in dashboard",
    },
    {
      icon: <CheckCircleRoundedIcon />,
      title: language === "uk" ? "Отримай оффер" : "Get Hired",
      desc: language === "uk" ? "Проходь інтерв'ю та отримуй офери від топ компаній" : "Interview and receive offers from top companies",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, #070D1A 0%, #0A1120 40%, #0F172A 100%)"
          : "linear-gradient(180deg, #F0F4FF 0%, #F6F8FC 40%, #FFFFFF 100%)",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 } }}>
        <Navbar />
      </Container>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* Animated blobs */}
        <Box
          className="blob"
          sx={{
            width: { xs: 300, md: 600 },
            height: { xs: 300, md: 600 },
            top: -100,
            left: -150,
            background: isDark
              ? "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          }}
        />
        <Box
          className="blob blob-2"
          sx={{
            width: { xs: 250, md: 500 },
            height: { xs: 250, md: 500 },
            top: 50,
            right: -100,
            background: isDark
              ? "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          }}
        />

        <Container maxWidth="md" sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
          <Stack spacing={3.5} alignItems="center" textAlign="center">
            <Chip
              icon={<RocketLaunchRoundedIcon sx={{ fontSize: 15 }} />}
              label={t("landing.hero.badge")}
              sx={{
                fontWeight: 600,
                px: 1,
                fontSize: 13,
                color: isDark ? "#93C5FD" : "#1D4ED8",
                bgcolor: isDark ? "rgba(30, 64, 175, 0.2)" : "rgba(219, 234, 254, 0.9)",
                border: `1px solid ${isDark ? "rgba(96, 165, 250, 0.25)" : "rgba(59, 130, 246, 0.2)"}`,
                animation: "fade-in-up 0.6s ease both",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 38, sm: 54, md: 70 },
                fontWeight: 900,
                lineHeight: 1.05,
                color: isDark ? "#F8FAFC" : "#0F172A",
                maxWidth: 720,
                letterSpacing: "-2px",
                animation: "fade-in-up 0.7s ease 0.1s both",
                "& .highlight": {
                  background: isDark
                    ? "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #60A5FA 100%)"
                    : "linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #2563EB 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 4s linear infinite",
                },
              }}
            >
              {t("landing.v2.hero.title1")}{" "}
              <span className="highlight">{t("landing.v2.hero.titleHighlight")}</span>{" "}
              {t("landing.v2.hero.title2")}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                maxWidth: 580,
                color: isDark ? "rgba(148, 163, 184, 0.9)" : "rgba(71, 85, 105, 0.9)",
                lineHeight: 1.65,
                fontSize: { xs: 16, md: 18 },
                animation: "fade-in-up 0.7s ease 0.2s both",
              }}
            >
              {t("landing.v2.hero.subtitle")}
            </Typography>

            {/* Search bar */}
            <Box sx={{ width: "100%", maxWidth: 540, animation: "fade-in-up 0.7s ease 0.3s both" }}>
              <TextField
                fullWidth
                placeholder={t("landing.v2.hero.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: isDark ? "rgba(148,163,184,0.5)" : "rgba(100,116,139,0.45)" }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 99,
                    height: 56,
                    bgcolor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(12px)",
                    fontSize: 15,
                    boxShadow: isDark
                      ? "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                      : "0 4px 24px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                    "& fieldset": {
                      borderColor: isDark ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.25)",
                    },
                    "&:hover fieldset": {
                      borderColor: isDark ? "rgba(96, 165, 250, 0.35)" : "rgba(59, 130, 246, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: isDark ? "rgba(96, 165, 250, 0.6)" : "rgba(37, 99, 235, 0.5)",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ animation: "fade-in-up 0.7s ease 0.4s both" }}>
              <Button
                component={Link}
                href="/auth?mode=sign_up"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderRadius: 99,
                  px: 3.5,
                  py: 1.4,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 15,
                  background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  boxShadow: isDark
                    ? "0 4px 24px rgba(37, 99, 235, 0.4)"
                    : "0 4px 24px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                    boxShadow: isDark
                      ? "0 8px 32px rgba(37, 99, 235, 0.5)"
                      : "0 8px 32px rgba(37, 99, 235, 0.35)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 250ms",
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
                  py: 1.4,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 15,
                  borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.35)",
                  color: isDark ? "#CBD5E1" : "#475569",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    borderColor: isDark ? "rgba(96, 165, 250, 0.45)" : "rgba(59, 130, 246, 0.35)",
                    bgcolor: isDark ? "rgba(30, 64, 175, 0.1)" : "rgba(239, 246, 255, 0.7)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 250ms",
                }}
              >
                {t("landing.v2.hero.explore")}
              </Button>
            </Stack>

            {/* Social proof */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ animation: "fade-in-up 0.7s ease 0.5s both" }}>
              <Stack direction="row">
                {["O", "A", "D", "K"].map((initial, i) => (
                  <Avatar
                    key={i}
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: 11,
                      fontWeight: 700,
                      ml: i === 0 ? 0 : -0.8,
                      border: `2px solid ${isDark ? "#0A1120" : "#F0F4FF"}`,
                      background: [
                        "linear-gradient(135deg, #3B82F6, #2563EB)",
                        "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        "linear-gradient(135deg, #10B981, #059669)",
                        "linear-gradient(135deg, #F59E0B, #D97706)",
                      ][i],
                    }}
                  >
                    {initial}
                  </Avatar>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: isDark ? "rgba(148,163,184,0.7)" : "rgba(100,116,139,0.7)", fontSize: 13 }}>
                {language === "uk" ? "8,900+ активних кандидатів" : "8,900+ active candidates"}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── TRUSTED BY ───────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ pb: 5 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: isDark ? "rgba(148,163,184,0.35)" : "rgba(100,116,139,0.35)",
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            mb: 2,
            fontSize: 11,
          }}
        >
          {t("landing.v2.trustedBy")}
        </Typography>
        <TrustedMarquee isDark={isDark} />
      </Container>

      {/* ── LIVE JOB SEARCH PREVIEW ──────────────────────────── */}
      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 10 } }}>
        <FadeInSection>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.18)",
              bgcolor: isDark ? "rgba(10, 17, 32, 0.7)" : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.4)"
                : "0 20px 60px rgba(15,23,42,0.07)",
            }}
          >
            {/* Card header bar */}
            <Box
              sx={{
                px: { xs: 2.5, md: 4 },
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {["#EF4444", "#F59E0B", "#22C55E"].map((color) => (
                <Box key={color} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, opacity: 0.8 }} />
              ))}
              <Typography variant="caption" sx={{ ml: 1, color: isDark ? "rgba(148,163,184,0.5)" : "rgba(100,116,139,0.5)", fontWeight: 600 }}>
                hirenow.io/jobs
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <WorkOutlineIcon sx={{ color: isDark ? "#60A5FA" : "#3B82F6" }} />
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? "#F1F5F9" : "#0F172A" }}>
                    {t("landing.v2.liveJobs.title")}
                  </Typography>
                  <Chip
                    label={t("landing.v2.liveJobs.live")}
                    size="small"
                    sx={{
                      bgcolor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
                      color: "#22C55E",
                      fontWeight: 700,
                      fontSize: 11,
                      "& .MuiChip-label": { px: 1 },
                      animation: "pulse-ring 2s infinite",
                    }}
                  />
                </Stack>

                <Grid container spacing={2}>
                  {filteredJobs.map((job, i) => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <FadeInSection delay={i * 80}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            borderRadius: 3,
                            transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                            borderColor: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.18)",
                            bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255,255,255,0.7)",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.3)",
                              transform: "translateY(-4px)",
                              boxShadow: isDark
                                ? "0 12px 40px rgba(0,0,0,0.4)"
                                : "0 12px 40px rgba(0, 0, 0, 0.08)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.2}>
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
                              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                                {job.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                {job.company} · {job.location}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: isDark ? "#60A5FA" : "#2563EB", fontSize: 14 }}
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
                                      color: isDark ? "rgba(203,213,225,0.7)" : "rgba(71,85,105,0.7)",
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </FadeInSection>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ textAlign: "center", pt: 0.5 }}>
                  <Button
                    component={Link}
                    href="/dashboard"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: isDark ? "#60A5FA" : "#2563EB",
                      "&:hover": { bgcolor: isDark ? "rgba(96,165,250,0.08)" : "rgba(37,99,235,0.05)" },
                    }}
                  >
                    {t("landing.v2.liveJobs.viewAll")}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </FadeInSection>
      </Container>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          background: isDark
            ? "linear-gradient(180deg, rgba(15,23,42,0.5), rgba(10,17,32,0.3))"
            : "linear-gradient(180deg, rgba(240,244,255,0.8), rgba(246,248,252,0.5))",
        }}
      >
        <Container maxWidth="lg">
          <FadeInSection>
            <Stack spacing={1} sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: isDark ? "#60A5FA" : "#2563EB",
                  fontWeight: 700,
                  letterSpacing: 2,
                  fontSize: 12,
                }}
              >
                {language === "uk" ? "ЯК ЦЕ ПРАЦЮЄ" : "HOW IT WORKS"}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  fontSize: { xs: 28, md: 40 },
                  letterSpacing: "-0.5px",
                }}
              >
                {language === "uk" ? "Від реєстрації до офера" : "From signup to offer"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)",
                  maxWidth: 480,
                  mx: "auto",
                }}
              >
                {language === "uk"
                  ? "Чотири прості кроки щоб знайти роботу мрії або найкращого кандидата"
                  : "Four simple steps to find your dream job or the best candidate"}
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {howItWorks.map((step, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <FadeInSection delay={i * 100}>
                    <HowItWorksStep
                      step={i + 1}
                      title={step.title}
                      desc={step.desc}
                      icon={step.icon}
                      isDark={isDark}
                      isLast={i === howItWorks.length - 1}
                    />
                  </FadeInSection>
                </Grid>
              ))}
            </Grid>
          </FadeInSection>
        </Container>
      </Box>

      {/* ── FEATURES GRID ────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <FadeInSection>
          <Stack spacing={1} sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: isDark ? "#60A5FA" : "#2563EB", fontWeight: 700, letterSpacing: 2, fontSize: 12 }}
            >
              {language === "uk" ? "МОЖЛИВОСТІ" : "FEATURES"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
                letterSpacing: "-0.5px",
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
                <FadeInSection delay={i * 70}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3.5,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                      bgcolor: isDark ? "rgba(10, 17, 32, 0.6)" : "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(12px)",
                      transition: "all 280ms cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "default",
                      "&:hover": {
                        borderColor: `${feat.color}44`,
                        transform: "translateY(-4px)",
                        boxShadow: isDark
                          ? `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${feat.color}22`
                          : `0 12px 40px rgba(0,0,0,0.06), 0 0 0 1px ${feat.color}18`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          display: "grid",
                          placeItems: "center",
                          mb: 2.5,
                          color: feat.color,
                          background: `linear-gradient(135deg, ${feat.color}20, ${feat.color}10)`,
                          border: `1px solid ${feat.color}25`,
                        }}
                      >
                        {feat.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.8, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                        {t(`${feat.key}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
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
          py: { xs: 6, md: 8 },
          background: isDark
            ? "linear-gradient(135deg, rgba(30,58,138,0.12), rgba(88,28,135,0.08))"
            : "linear-gradient(135deg, rgba(239,246,255,0.9), rgba(245,243,255,0.8))",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.12)",
        }}
      >
        <Container maxWidth="lg">
          <FadeInSection>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: "center",
                mb: 5,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
                letterSpacing: "-0.5px",
              }}
            >
              {t("landing.stats.title")}
            </Typography>
            <Grid container>
              {[
                { label: t("landing.stats.item1.label"), value: 1250, suffix: "+", icon: <WorkOutlineIcon sx={{ fontSize: 24 }} />, color: "#3B82F6" },
                { label: t("landing.stats.item2.label"), value: 320, suffix: "+", icon: <GroupsRoundedIcon sx={{ fontSize: 24 }} />, color: "#8B5CF6" },
                { label: t("landing.stats.item3.label"), value: 8900, suffix: "+", icon: <VerifiedUserRoundedIcon sx={{ fontSize: 24 }} />, color: "#10B981" },
                { label: t("landing.stats.item4.label"), value: 4100, suffix: "+", icon: <TrendingUpRoundedIcon sx={{ fontSize: 24 }} />, color: "#F59E0B" },
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
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <FadeInSection>
          <Stack spacing={1} sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: isDark ? "#60A5FA" : "#2563EB", fontWeight: 700, letterSpacing: 2, fontSize: 12 }}
            >
              {language === "uk" ? "ВІДГУКИ" : "TESTIMONIALS"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: isDark ? "#F1F5F9" : "#0F172A",
                fontSize: { xs: 28, md: 40 },
                letterSpacing: "-0.5px",
              }}
            >
              {t("landing.testimonials.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(100,116,139,0.8)", maxWidth: 480, mx: "auto" }}
            >
              {t("landing.testimonials.subtitle")}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {sampleTestimonials.map((item, i) => (
              <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                <FadeInSection delay={i * 100}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3.5,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)",
                      bgcolor: isDark ? "rgba(10, 17, 32, 0.6)" : "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(12px)",
                      transition: "all 280ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(96,165,250,0.25)" : "rgba(59,130,246,0.2)",
                        transform: "translateY(-4px)",
                        boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.4)" : "0 16px 48px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <FormatQuoteRoundedIcon
                          sx={{
                            fontSize: 32,
                            color: isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.25)",
                          }}
                        />
                        <Stack direction="row" spacing={0.3}>
                          {Array.from({ length: 5 }).map((_, si) => (
                            <StarRoundedIcon
                              key={si}
                              sx={{
                                fontSize: 16,
                                color: si < item.rating ? "#FACC15" : isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
                              }}
                            />
                          ))}
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: "italic",
                            lineHeight: 1.7,
                            color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.85)",
                          }}
                        >
                          &ldquo;{item.quote}&rdquo;
                        </Typography>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              fontSize: 13,
                              fontWeight: 700,
                              background: "linear-gradient(135deg, #3B82F6, #4F46E5)",
                              color: "#fff",
                            }}
                          >
                            {item.name.split(" ").map((n) => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "#F1F5F9" : "#0F172A" }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.role} · {item.company}
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
          py: { xs: 7, md: 9 },
          background: isDark
            ? "linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(124, 58, 237, 0.1))"
            : "linear-gradient(135deg, rgba(239, 246, 255, 0.98), rgba(245, 243, 255, 0.95))",
          borderTop: "1px solid",
          borderColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.12)",
        }}
      >
        <Container maxWidth="sm">
          <FadeInSection>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  background: isDark
                    ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(79,70,229,0.15))"
                    : "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(79,70,229,0.08))",
                  border: `1px solid ${isDark ? "rgba(96,165,250,0.25)" : "rgba(37,99,235,0.15)"}`,
                  color: isDark ? "#60A5FA" : "#2563EB",
                  animation: "float-up 4s ease-in-out infinite",
                }}
              >
                <MarkEmailReadRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  fontSize: { xs: 24, md: 32 },
                  letterSpacing: "-0.5px",
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

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ width: "100%", maxWidth: 460 }}>
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
                      height: 46,
                      bgcolor: isDark ? "rgba(15,23,42,0.7)" : "#fff",
                      backdropFilter: "blur(8px)",
                      "& fieldset": { borderColor: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)" },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleEmailSubmit}
                  sx={{
                    borderRadius: 99,
                    px: 3,
                    height: 46,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                      boxShadow: "0 6px 24px rgba(37,99,235,0.4)",
                    },
                  }}
                >
                  {t("landing.v2.newsletter.button")}
                </Button>
              </Stack>

              {emailSubmitted && (
                <Chip
                  icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                  label={t("landing.v2.newsletter.success")}
                  sx={{
                    bgcolor: "rgba(34,197,94,0.12)",
                    color: "#22C55E",
                    fontWeight: 600,
                    border: "1px solid rgba(34,197,94,0.25)",
                    animation: "fade-in-up 0.4s ease",
                  }}
                />
              )}
            </Stack>
          </FadeInSection>
        </Container>
      </Box>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ py: { xs: 9, md: 14 } }}>
        <FadeInSection>
          <Box
            sx={{
              textAlign: "center",
              borderRadius: 5,
              p: { xs: 4, md: 7 },
              background: isDark
                ? "linear-gradient(135deg, rgba(30,58,138,0.25), rgba(88,28,135,0.18))"
                : "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(245,243,255,0.9))",
              border: "1px solid",
              borderColor: isDark ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)",
              backdropFilter: "blur(16px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative blobs inside CTA */}
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                top: -100,
                right: -80,
                background: isDark
                  ? "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Stack spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  fontSize: { xs: 26, md: 44 },
                  letterSpacing: "-0.5px",
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href="/auth?mode=sign_up"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    borderRadius: 99,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 15,
                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                    boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                      boxShadow: "0 8px 32px rgba(37,99,235,0.45)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 250ms",
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
                    px: 3.5,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 15,
                    borderColor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.35)",
                    color: isDark ? "#CBD5E1" : "#475569",
                    "&:hover": {
                      borderColor: isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.3)",
                      bgcolor: isDark ? "rgba(30,64,175,0.1)" : "rgba(239,246,255,0.7)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 250ms",
                  }}
                >
                  {t("landing.v2.cta.secondary")}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </FadeInSection>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg">
        <Footer language={language} isDark={isDark} />
      </Container>
    </Box>
  );
}
