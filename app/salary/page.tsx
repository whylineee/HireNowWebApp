"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { salaryData } from "@/lib/mock-data";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";

const roles = ["Frontend", "Backend", "QA", "DevOps", "Designer", "Data Engineer"];
const locations = ["Remote EU", "Ukraine", "Poland", "Germany", "USA"];

const roleI18nKeys: Record<string, string> = {
    Frontend: "salary.role.frontend",
    Backend: "salary.role.backend",
    QA: "salary.role.qa",
    DevOps: "salary.role.devops",
    Designer: "salary.role.designer",
    "Data Engineer": "salary.role.data",
};

const locationI18nKeys: Record<string, string> = {
    "Remote EU": "salary.location.remoteEu",
    Ukraine: "salary.location.ukraine",
    Poland: "salary.location.poland",
    Germany: "salary.location.germany",
    USA: "salary.location.usa",
};

function applyExperienceMultiplier(base: number, years: number) {
    const multiplier = 1 + years * 0.06;
    return Math.round(base * multiplier);
}

export default function SalaryPage() {
    const { language, themeMode } = useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [role, setRole] = useState("Frontend");
    const [location, setLocation] = useState("Remote EU");
    const [experience, setExperience] = useState(3);
    const [toast, setToast] = useState("");

    const entry = useMemo(
        () => salaryData.find((d) => d.role === role && d.location === location),
        [role, location]
    );

    const adjusted = useMemo(() => {
        if (!entry) return null;
        return {
            min: applyExperienceMultiplier(entry.min, experience),
            median: applyExperienceMultiplier(entry.median, experience),
            max: applyExperienceMultiplier(entry.max, experience),
        };
    }, [entry, experience]);

    const comparisonRows = useMemo(() => {
        return roles.map((r) => {
            const row: Record<string, number | string> = { role: r };
            locations.forEach((loc) => {
                const found = salaryData.find((d) => d.role === r && d.location === loc);
                row[loc] = found
                    ? `$${applyExperienceMultiplier(found.median, experience).toLocaleString()}`
                    : "—";
            });
            return row;
        });
    }, [experience]);

    const barMax = adjusted ? adjusted.max * 1.1 : 1;

    function handleShareResult() {
        if (!adjusted) return;
        const text = `${t(roleI18nKeys[role])} (${t(locationI18nKeys[location])}, ${experience} yrs): $${adjusted.min.toLocaleString()} – $${adjusted.median.toLocaleString()} – $${adjusted.max.toLocaleString()} /mo`;
        navigator.clipboard.writeText(text).then(() => {
            setToast(t("salary.shared"));
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
                                    ? "linear-gradient(135deg, #60A5FA, #34D399)"
                                    : "linear-gradient(135deg, #2563EB, #059669)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {t("salary.title")}
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
                            {t("salary.subtitle")}
                        </Typography>
                    </Box>

                    {/* Controls + Result */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card sx={{ height: "100%", borderRadius: 3 }}>
                                <CardContent>
                                    <Stack spacing={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>{t("salary.role")}</InputLabel>
                                            <Select
                                                value={role}
                                                label={t("salary.role")}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                {roles.map((r) => (
                                                    <MenuItem key={r} value={r}>
                                                        {t(roleI18nKeys[r])}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>{t("salary.location")}</InputLabel>
                                            <Select
                                                value={location}
                                                label={t("salary.location")}
                                                onChange={(e) => setLocation(e.target.value)}
                                            >
                                                {locations.map((loc) => (
                                                    <MenuItem key={loc} value={loc}>
                                                        {t(locationI18nKeys[loc])}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Box>
                                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                                {t("salary.experience")}: {experience}
                                            </Typography>
                                            <Slider
                                                value={experience}
                                                onChange={(_, val) => setExperience(val as number)}
                                                min={0}
                                                max={10}
                                                step={1}
                                                marks={[
                                                    { value: 0, label: "0" },
                                                    { value: 5, label: "5" },
                                                    { value: 10, label: "10+" },
                                                ]}
                                            />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    borderColor: isDark
                                        ? "rgba(147, 197, 253, 0.25)"
                                        : "rgba(59, 130, 246, 0.2)",
                                    background: isDark
                                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.9))"
                                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(239, 246, 255, 0.95))",
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={2.5}>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TrendingUpRoundedIcon color="primary" />
                                                <Typography variant="h6" fontWeight={700}>
                                                    {t("salary.result.title")}
                                                </Typography>
                                            </Stack>
                                            <Tooltip title={t("salary.share")}>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleShareResult}
                                                    sx={{
                                                        transition: "transform 200ms",
                                                        "&:hover": { transform: "scale(1.1)" },
                                                    }}
                                                >
                                                    <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        {adjusted && (
                                            <>
                                                <Stack direction="row" spacing={2} justifyContent="space-around">
                                                    {[
                                                        { label: t("salary.min"), value: adjusted.min, color: isDark ? "#94A3B8" : "#64748B" },
                                                        { label: t("salary.median"), value: adjusted.median, color: isDark ? "#60A5FA" : "#0A66C2" },
                                                        { label: t("salary.max"), value: adjusted.max, color: isDark ? "#34D399" : "#0F766E" },
                                                    ].map((item) => (
                                                        <Stack key={item.label} alignItems="center" spacing={0.3}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {item.label}
                                                            </Typography>
                                                            <Typography
                                                                variant="h5"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    color: item.color,
                                                                    transition: "all 400ms ease",
                                                                }}
                                                            >
                                                                ${item.value.toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {t("salary.perMonth")}
                                                            </Typography>
                                                        </Stack>
                                                    ))}
                                                </Stack>

                                                {/* Salary bar */}
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        height: 28,
                                                        borderRadius: 99,
                                                        overflow: "hidden",
                                                        background: isDark
                                                            ? "rgba(30, 41, 59, 0.6)"
                                                            : "rgba(241, 245, 249, 0.9)",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: `${(adjusted.min / barMax) * 100}%`,
                                                            width: `${((adjusted.max - adjusted.min) / barMax) * 100}%`,
                                                            height: "100%",
                                                            borderRadius: 99,
                                                            background: isDark
                                                                ? "linear-gradient(90deg, rgba(96, 165, 250, 0.5), rgba(52, 211, 153, 0.5))"
                                                                : "linear-gradient(90deg, rgba(10, 102, 194, 0.25), rgba(15, 118, 110, 0.25))",
                                                            transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: `${(adjusted.median / barMax) * 100}%`,
                                                            top: 0,
                                                            width: 3,
                                                            height: "100%",
                                                            bgcolor: isDark ? "#60A5FA" : "#0A66C2",
                                                            borderRadius: 1,
                                                            transition: "left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                                                        }}
                                                    />
                                                </Box>
                                            </>
                                        )}

                                        <Stack direction="row" spacing={0.8} alignItems="center">
                                            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {t("salary.disclaimer")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Comparison table */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <AttachMoneyRoundedIcon color="primary" />
                                <Typography variant="h5" fontWeight={700}>
                                    {t("salary.comparison")}
                                </Typography>
                                <Chip label={`${experience} ${t("salary.experience")}`} size="small" />
                            </Stack>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>{t("salary.role")}</TableCell>
                                            {locations.map((loc) => (
                                                <TableCell key={loc} sx={{ fontWeight: 700, textAlign: "center" }}>
                                                    {t(locationI18nKeys[loc])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {comparisonRows.map((row) => (
                                            <TableRow
                                                key={row.role as string}
                                                sx={{
                                                    bgcolor:
                                                        row.role === role
                                                            ? isDark
                                                                ? "rgba(37, 99, 235, 0.12)"
                                                                : "rgba(239, 246, 255, 0.8)"
                                                            : undefined,
                                                    transition: "background-color 300ms",
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: 600 }}>
                                                    {t(roleI18nKeys[row.role as string])}
                                                </TableCell>
                                                {locations.map((loc) => (
                                                    <TableCell
                                                        key={loc}
                                                        sx={{
                                                            textAlign: "center",
                                                            fontWeight: loc === location && row.role === role ? 700 : 400,
                                                            color:
                                                                loc === location && row.role === role
                                                                    ? "primary.main"
                                                                    : undefined,
                                                            transition: "all 300ms",
                                                        }}
                                                    >
                                                        {row[loc] as string}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
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
