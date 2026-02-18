"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

const plans = [
    {
        key: "free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        popular: false,
        features: [
            { key: "pricing.feat.jobs5", included: true },
            { key: "pricing.feat.basicSearch", included: true },
            { key: "pricing.feat.resume1", included: true },
            { key: "pricing.feat.emailSupport", included: true },
            { key: "pricing.feat.pipeline", included: false },
            { key: "pricing.feat.analytics", included: false },
            { key: "pricing.feat.api", included: false },
            { key: "pricing.feat.team", included: false },
        ],
    },
    {
        key: "pro",
        monthlyPrice: 49,
        yearlyPrice: 39,
        popular: true,
        features: [
            { key: "pricing.feat.unlimitedJobs", included: true },
            { key: "pricing.feat.advancedSearch", included: true },
            { key: "pricing.feat.resumeUnlimited", included: true },
            { key: "pricing.feat.prioritySupport", included: true },
            { key: "pricing.feat.pipeline", included: true },
            { key: "pricing.feat.analytics", included: true },
            { key: "pricing.feat.api", included: false },
            { key: "pricing.feat.team", included: false },
        ],
    },
    {
        key: "enterprise",
        monthlyPrice: 149,
        yearlyPrice: 119,
        popular: false,
        features: [
            { key: "pricing.feat.unlimitedJobs", included: true },
            { key: "pricing.feat.advancedSearch", included: true },
            { key: "pricing.feat.resumeUnlimited", included: true },
            { key: "pricing.feat.dedicatedSupport", included: true },
            { key: "pricing.feat.pipeline", included: true },
            { key: "pricing.feat.analytics", included: true },
            { key: "pricing.feat.api", included: true },
            { key: "pricing.feat.team", included: true },
        ],
    },
];

const comparisonRows = [
    { label: "Job Applications / mo", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
    { label: "AI Resume Builder", free: "Basic", pro: "Advanced", enterprise: "Advanced + Templates" },
    { label: "AI Match Score", free: "✗", pro: "✓", enterprise: "✓" },
    { label: "Candidate Pipeline", free: "✗", pro: "✓", enterprise: "✓" },
    { label: "Analytics Dashboard", free: "✗", pro: "✓", enterprise: "✓" },
    { label: "Team Members", free: "1", pro: "3", enterprise: "Unlimited" },
    { label: "API Access", free: "✗", pro: "✗", enterprise: "✓" },
    { label: "Webhooks", free: "✗", pro: "✗", enterprise: "✓" },
    { label: "SLA Guarantee", free: "✗", pro: "99.5%", enterprise: "99.9%" },
    { label: "Support", free: "Email", pro: "Priority", enterprise: "Dedicated CSM" },
];

const faqs = [
    {
        q: "Can I switch plans at any time?",
        a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
        q: "Is there a free trial for Pro?",
        a: "Absolutely! Every new account gets a 14-day Pro trial with no credit card required. After the trial, you can choose to continue with Pro or stay on the Free plan.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise plans.",
    },
    {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel anytime from your billing settings. You'll retain access until the end of your current billing period.",
    },
    {
        q: "Do you offer discounts for startups or non-profits?",
        a: "Yes! We offer 50% off for early-stage startups and non-profit organizations. Contact our sales team to apply.",
    },
    {
        q: "What's included in the Enterprise plan?",
        a: "Enterprise includes everything in Pro plus API access, webhooks, unlimited team members, a dedicated Customer Success Manager, custom SLA, and priority onboarding.",
    },
];

const testimonials = [
    {
        name: "Dmytro K.",
        role: "CTO @ FinEdge",
        avatar: "DK",
        color: "#3B82F6",
        text: "HireNow Pro cut our time-to-hire by 40%. The AI match scoring alone saved us dozens of hours of manual screening.",
    },
    {
        name: "Olena M.",
        role: "Senior Engineer",
        avatar: "OM",
        color: "#8B5CF6",
        text: "The resume builder helped me land 3 interviews in one week. The ATS score feature is a game-changer for job seekers.",
    },
    {
        name: "Artem B.",
        role: "Head of Talent @ CloudNest",
        avatar: "AB",
        color: "#10B981",
        text: "We switched from 3 separate tools to HireNow Enterprise. The pipeline and analytics features are exactly what we needed.",
    },
];

export default function PricingPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";
    const [yearly, setYearly] = useState(false);

    const cardSx = {
        borderRadius: 4,
        border: "1px solid",
        borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)",
        bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
    };

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

            <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 } }}>
                {/* Header */}
                <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
                    <Chip
                        icon={<RocketLaunchRoundedIcon sx={{ fontSize: 16 }} />}
                        label={t("pricing.badge")}
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
                            fontSize: { xs: 32, md: 48 },
                            color: isDark ? "#F8FAFC" : "#0F172A",
                        }}
                    >
                        {t("pricing.title")}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: 500,
                            color: isDark ? "rgba(148,163,184,0.85)" : "rgba(100,116,139,0.85)",
                        }}
                    >
                        {t("pricing.subtitle")}
                    </Typography>

                    {/* Monthly / Yearly toggle */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: yearly ? 500 : 700,
                                color: yearly
                                    ? (isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.6)")
                                    : (isDark ? "#F1F5F9" : "#0F172A"),
                                transition: "all 200ms",
                            }}
                        >
                            {t("pricing.monthly")}
                        </Typography>
                        <Switch
                            checked={yearly}
                            onChange={() => setYearly(!yearly)}
                            sx={{
                                "& .MuiSwitch-thumb": { bgcolor: "#3B82F6" },
                                "& .MuiSwitch-track": {
                                    bgcolor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.35)",
                                },
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: yearly ? 700 : 500,
                                color: !yearly
                                    ? (isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.6)")
                                    : (isDark ? "#F1F5F9" : "#0F172A"),
                                transition: "all 200ms",
                            }}
                        >
                            {t("pricing.yearly")}
                        </Typography>
                        {yearly && (
                            <Chip
                                label={t("pricing.save")}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
                                    color: "#22C55E",
                                    fontSize: 11,
                                }}
                            />
                        )}
                    </Stack>
                </Stack>

                {/* ── Plan Cards ───────────────────────────────────── */}
                <Grid container spacing={3} alignItems="stretch">
                    {plans.map((plan) => {
                        const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
                        return (
                            <Grid key={plan.key} size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={plan.popular ? 8 : 0}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 4,
                                        border: plan.popular ? "2px solid" : "1px solid",
                                        borderColor: plan.popular
                                            ? (isDark ? "#3B82F6" : "#2563EB")
                                            : (isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)"),
                                        bgcolor: plan.popular
                                            ? (isDark ? "rgba(30, 58, 138, 0.15)" : "rgba(239, 246, 255, 0.7)")
                                            : (isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)"),
                                        backdropFilter: "blur(12px)",
                                        position: "relative",
                                        overflow: "visible",
                                        transition: "all 300ms ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: isDark
                                                ? "0 16px 48px rgba(0,0,0,0.4)"
                                                : "0 16px 48px rgba(0,0,0,0.08)",
                                        },
                                    }}
                                >
                                    {plan.popular && (
                                        <Chip
                                            label={t("pricing.popular")}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: -12,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                fontWeight: 700,
                                                fontSize: 12,
                                                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                                                color: "#fff",
                                            }}
                                        />
                                    )}
                                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {t(`pricing.plan.${plan.key}`)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {t(`pricing.plan.${plan.key}.desc`)}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                                    <Typography
                                                        variant="h2"
                                                        sx={{
                                                            fontWeight: 800,
                                                            fontSize: { xs: 40, md: 48 },
                                                            color: isDark ? "#F8FAFC" : "#0F172A",
                                                        }}
                                                    >
                                                        ${price}
                                                    </Typography>
                                                    {price > 0 && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            /{t("pricing.perMonth")}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                                {yearly && price > 0 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {t("pricing.billedYearly")} (${price * 12}/{t("pricing.year")})
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Button
                                                component={Link}
                                                href="/auth?mode=sign_up"
                                                variant={plan.popular ? "contained" : "outlined"}
                                                fullWidth
                                                size="large"
                                                sx={{
                                                    borderRadius: 99,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    ...(plan.popular && {
                                                        background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                                        boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)",
                                                    }),
                                                    ...(!plan.popular && {
                                                        borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                                                        color: isDark ? "#CBD5E1" : "#475569",
                                                    }),
                                                }}
                                            >
                                                {price === 0 ? t("pricing.startFree") : t("pricing.subscribe")}
                                            </Button>

                                            <Stack spacing={1.5}>
                                                {plan.features.map((feat) => (
                                                    <Stack key={feat.key} direction="row" spacing={1} alignItems="center">
                                                        {feat.included ? (
                                                            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#22C55E" }} />
                                                        ) : (
                                                            <CloseRoundedIcon
                                                                sx={{
                                                                    fontSize: 18,
                                                                    color: isDark ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.4)",
                                                                }}
                                                            />
                                                        )}
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: feat.included
                                                                    ? (isDark ? "#CBD5E1" : "#334155")
                                                                    : (isDark ? "rgba(148,163,184,0.4)" : "rgba(148,163,184,0.5)"),
                                                            }}
                                                        >
                                                            {t(feat.key)}
                                                        </Typography>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* ── Feature Comparison Table ─────────────────────── */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 4, fontSize: { xs: 24, md: 36 } }}>
                        Full Feature Comparison
                    </Typography>
                    <Card elevation={0} sx={cardSx}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, width: "40%" }}>Feature</TableCell>
                                    {["Free", "Pro", "Enterprise"].map((planName) => (
                                        <TableCell
                                            key={planName}
                                            align="center"
                                            sx={{
                                                fontWeight: 800,
                                                color: planName === "Pro"
                                                    ? (isDark ? "#60A5FA" : "#2563EB")
                                                    : "inherit",
                                            }}
                                        >
                                            {planName}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comparisonRows.map((row, i) => (
                                    <TableRow
                                        key={row.label}
                                        sx={{
                                            bgcolor: i % 2 === 0
                                                ? (isDark ? "rgba(15,23,42,0.3)" : "rgba(248,250,252,0.5)")
                                                : "transparent",
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                                        {[row.free, row.pro, row.enterprise].map((val, j) => (
                                            <TableCell key={j} align="center">
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: val === "✓"
                                                            ? "#22C55E"
                                                            : val === "✗"
                                                                ? (isDark ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.4)")
                                                                : "inherit",
                                                    }}
                                                >
                                                    {val}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </Box>

                {/* ── Testimonials ─────────────────────────────────── */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 4, fontSize: { xs: 24, md: 36 } }}>
                        Trusted by IT Professionals
                    </Typography>
                    <Grid container spacing={3}>
                        {testimonials.map((testimonial) => (
                            <Grid key={testimonial.name} size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        ...cardSx,
                                        height: "100%",
                                        transition: "all 250ms",
                                        "&:hover": { transform: "translateY(-3px)" },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <FormatQuoteRoundedIcon
                                            sx={{
                                                fontSize: 32,
                                                color: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.2)",
                                                mb: 1,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{ lineHeight: 1.8, mb: 2.5, color: isDark ? "#CBD5E1" : "#334155" }}
                                        >
                                            &ldquo;{testimonial.text}&rdquo;
                                        </Typography>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: `${testimonial.color}20`,
                                                    color: testimonial.color,
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                }}
                                            >
                                                {testimonial.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700}>{testimonial.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{testimonial.role}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* ── FAQ Accordion ─────────────────────────────────── */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 4, fontSize: { xs: 24, md: 36 } }}>
                        {t("pricing.faq.title")}
                    </Typography>
                    <Stack spacing={1.5} sx={{ maxWidth: 720, mx: "auto" }}>
                        {faqs.map((faq, i) => (
                            <Accordion
                                key={i}
                                disableGutters
                                elevation={0}
                                sx={{
                                    borderRadius: "12px !important",
                                    border: "1px solid",
                                    borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                    bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)",
                                    backdropFilter: "blur(12px)",
                                    "&::before": { display: "none" },
                                    overflow: "hidden",
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                                    <Typography fontWeight={600}>{faq.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {faq.a}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                </Box>

                {/* ── Final CTA ─────────────────────────────────────── */}
                <Box sx={{ mt: 10 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            background: isDark
                                ? "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.12))"
                                : "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(245,243,255,0.9))",
                            border: "1px solid",
                            borderColor: isDark ? "rgba(96,165,250,0.2)" : "rgba(59,130,246,0.15)",
                            textAlign: "center",
                            py: { xs: 5, md: 7 },
                            px: { xs: 3, md: 6 },
                        }}
                    >
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1.5, fontSize: { xs: 24, md: 36 } }}>
                            Start Your Free Trial Today
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 460, mx: "auto" }}>
                            No credit card required. 14-day Pro trial included with every new account.
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                            <Button
                                component={Link}
                                href="/auth?mode=sign_up"
                                variant="contained"
                                size="large"
                                sx={{
                                    borderRadius: 99,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    px: 4,
                                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                                }}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                component={Link}
                                href="/contact"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: 99,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    px: 4,
                                    borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                                    color: isDark ? "#CBD5E1" : "#475569",
                                }}
                            >
                                Talk to Sales
                            </Button>
                        </Stack>
                    </Card>
                </Box>
            </Container>

            <Container maxWidth="lg">
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
