"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6"];

const offices = [
    { city: "Kyiv", country: "Ukraine", address: "вул. Хрещатик, 22", timezone: "UTC+2" },
    { city: "Berlin", country: "Germany", address: "Friedrichstraße 123", timezone: "UTC+1" },
    { city: "San Francisco", country: "USA", address: "Market St 456", timezone: "UTC-8" },
];

export default function ContactPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    function handleSubmit() {
        const newErrors: Record<string, boolean> = {};
        if (!form.name.trim()) newErrors.name = true;
        if (!form.email.includes("@")) newErrors.email = true;
        if (!form.message.trim()) newErrors.message = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setSubmitted(true);
        setForm({ name: "", email: "", topic: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
    }

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
                <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
                    <Chip
                        icon={<HeadsetMicRoundedIcon sx={{ fontSize: 16 }} />}
                        label={t("contact.badge")}
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
                        {t("contact.title")}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: 500,
                            color: isDark ? "rgba(148,163,184,0.85)" : "rgba(100,116,139,0.85)",
                        }}
                    >
                        {t("contact.subtitle")}
                    </Typography>
                </Stack>

                {/* Contact cards */}
                <Grid container spacing={2.5} sx={{ mb: 6 }}>
                    {[
                        { icon: <EmailRoundedIcon />, title: t("contact.card.email.title"), desc: "hello@hirenow.io" },
                        { icon: <SupportAgentRoundedIcon />, title: t("contact.card.support.title"), desc: t("contact.card.support.desc") },
                        { icon: <LocationOnRoundedIcon />, title: t("contact.card.offices.title"), desc: t("contact.card.offices.desc") },
                    ].map((card) => (
                        <Grid key={card.title} size={{ xs: 12, md: 4 }}>
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
                                        borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.25)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ color: isDark ? "#60A5FA" : "#3B82F6", mb: 1.5 }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Main content: Form + FAQ */}
                <Grid container spacing={4}>
                    {/* Contact Form */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)",
                                bgcolor: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.8)",
                                backdropFilter: "blur(16px)",
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                                    {t("contact.form.title")}
                                </Typography>

                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth
                                        label={t("contact.form.name")}
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        error={errors.name}
                                        helperText={errors.name ? t("contact.form.nameError") : ""}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label={t("contact.form.email")}
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        error={errors.email}
                                        helperText={errors.email ? t("contact.form.emailError") : ""}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel>{t("contact.form.topic")}</InputLabel>
                                        <Select
                                            label={t("contact.form.topic")}
                                            value={form.topic}
                                            onChange={(e) => setForm({ ...form, topic: e.target.value as string })}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="general">{t("contact.topic.general")}</MenuItem>
                                            <MenuItem value="support">{t("contact.topic.support")}</MenuItem>
                                            <MenuItem value="billing">{t("contact.topic.billing")}</MenuItem>
                                            <MenuItem value="partnership">{t("contact.topic.partnership")}</MenuItem>
                                            <MenuItem value="bug">{t("contact.topic.bug")}</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        label={t("contact.form.message")}
                                        multiline
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        error={errors.message}
                                        helperText={errors.message ? t("contact.form.messageError") : ""}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<SendRoundedIcon />}
                                        onClick={handleSubmit}
                                        sx={{
                                            borderRadius: 99,
                                            fontWeight: 700,
                                            textTransform: "none",
                                            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                        }}
                                    >
                                        {t("contact.form.send")}
                                    </Button>

                                    {submitted && (
                                        <Typography variant="body2" sx={{ color: "#22C55E", fontWeight: 600 }}>
                                            ✓ {t("contact.form.success")}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* FAQ */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                            {t("contact.faq.title")}
                        </Typography>

                        <Stack spacing={1.5}>
                            {faqKeys.map((key) => (
                                <Accordion
                                    key={key}
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
                                        <Typography fontWeight={600}>{t(`contact.${key}.q`)}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {t(`contact.${key}.a`)}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Office locations */}
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, textAlign: "center" }}>
                        {t("contact.offices.title")}
                    </Typography>
                    <Grid container spacing={2.5}>
                        {offices.map((office) => (
                            <Grid key={office.city} size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: "1px solid",
                                        borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
                                        bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.7)",
                                        backdropFilter: "blur(12px)",
                                        transition: "all 250ms",
                                        "&:hover": {
                                            borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.25)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack spacing={1}>
                                            <LocationOnRoundedIcon sx={{ color: isDark ? "#60A5FA" : "#3B82F6" }} />
                                            <Typography variant="h6" fontWeight={700}>
                                                {office.city}, {office.country}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {office.address}
                                            </Typography>
                                            <Chip
                                                label={office.timezone}
                                                size="small"
                                                sx={{
                                                    width: "fit-content",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    bgcolor: isDark ? "rgba(96,165,250,0.1)" : "rgba(59,130,246,0.08)",
                                                    color: isDark ? "#93C5FD" : "#1D4ED8",
                                                }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            <Container maxWidth="lg">
                <Footer language={language} isDark={isDark} />
            </Container>
        </Box>
    );
}
