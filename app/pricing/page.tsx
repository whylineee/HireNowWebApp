"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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

export default function PricingPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";
    const [yearly, setYearly] = useState(false);

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

                    {/* Toggle */}
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
                                "& .MuiSwitch-thumb": {
                                    bgcolor: "#3B82F6",
                                },
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

                {/* Plan Cards */}
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
                                                            <CheckCircleRoundedIcon
                                                                sx={{ fontSize: 18, color: "#22C55E" }}
                                                            />
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

                {/* FAQ teaser */}
                <Stack spacing={2} alignItems="center" sx={{ mt: 8, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                        {t("pricing.faq.title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                        {t("pricing.faq.subtitle")}
                    </Typography>
                    <Button
                        component={Link}
                        href="/contact"
                        variant="outlined"
                        sx={{
                            borderRadius: 99,
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                            color: isDark ? "#CBD5E1" : "#475569",
                        }}
                    >
                        {t("pricing.faq.cta")}
                    </Button>
                </Stack>
            </Container>

            <Container maxWidth="lg">
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
