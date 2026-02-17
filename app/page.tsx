"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Box,
  ButtonBase,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import EngineeringRoundedIcon from "@mui/icons-material/EngineeringRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import type { AppLanguage, ThemePreference } from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { sampleJobs } from "@/lib/mock-data";

type RoleFilter = "all" | "frontend" | "backend" | "qa" | "devops";

const CHECKLIST_STORAGE_KEY = "hire_now_home_checklist_v1";
const JOB_FIT_STORAGE_KEY = "hire_now_home_job_fit_v1";

const defaultChecklist = {
  profile: false,
  resume: false,
  links: false,
  filters: false,
  firstApply: false,
};

type ChecklistKey = keyof typeof defaultChecklist;

const roleKeywords: Record<RoleFilter, string[]> = {
  all: [],
  frontend: ["frontend", "react", "next.js", "ui"],
  backend: ["backend", "node", "api", "postgres", "nest"],
  qa: ["qa", "test", "automation", "cypress", "playwright"],
  devops: ["devops", "aws", "kubernetes", "terraform", "ci/cd"],
};

function roleFilterMatches(
  filter: RoleFilter,
  job: { title: string; tags: string[] },
) {
  if (filter === "all") {
    return true;
  }

  const text = `${job.title} ${job.tags.join(" ")}`.toLowerCase();
  return roleKeywords[filter].some((keyword) => text.includes(keyword));
}

function parseSkills(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function readChecklistFromStorage() {
  if (typeof window === "undefined") {
    return defaultChecklist;
  }

  try {
    const rawChecklist = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!rawChecklist) {
      return defaultChecklist;
    }

    const parsed = JSON.parse(rawChecklist) as Partial<typeof defaultChecklist>;
    return {
      profile: Boolean(parsed.profile),
      resume: Boolean(parsed.resume),
      links: Boolean(parsed.links),
      filters: Boolean(parsed.filters),
      firstApply: Boolean(parsed.firstApply),
    };
  } catch {
    return defaultChecklist;
  }
}

function readSkillInputFromStorage() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const rawJobFit = window.localStorage.getItem(JOB_FIT_STORAGE_KEY);
    if (!rawJobFit) {
      return "";
    }

    const parsed = JSON.parse(rawJobFit) as { skillInput?: string };
    return typeof parsed.skillInput === "string" ? parsed.skillInput : "";
  } catch {
    return "";
  }
}

function readRoleFilterFromStorage(): RoleFilter {
  if (typeof window === "undefined") {
    return "all";
  }

  try {
    const rawJobFit = window.localStorage.getItem(JOB_FIT_STORAGE_KEY);
    if (!rawJobFit) {
      return "all";
    }

    const parsed = JSON.parse(rawJobFit) as { roleFilter?: RoleFilter };
    return parsed.roleFilter === "all" ||
      parsed.roleFilter === "frontend" ||
      parsed.roleFilter === "backend" ||
      parsed.roleFilter === "qa" ||
      parsed.roleFilter === "devops"
      ? parsed.roleFilter
      : "all";
  } catch {
    return "all";
  }
}

export default function Home() {
  const { language, themeMode, themePreference, setLanguage, setThemePreference } =
    useAppSettings();
  const t = (key: string) => translate(language, key);

  const isDark = themeMode === "dark";
  const [checklist, setChecklist] = useState(readChecklistFromStorage);
  const [skillInput, setSkillInput] = useState(readSkillInputFromStorage);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(readRoleFilterFromStorage);

  const themeOptions: { value: ThemePreference; icon: ReactNode; label: string }[] = [
    {
      value: "light",
      icon: <LightModeRoundedIcon fontSize="small" />,
      label: t("settings.theme.light"),
    },
    {
      value: "dark",
      icon: <NightlightRoundedIcon fontSize="small" />,
      label: t("settings.theme.dark"),
    },
    {
      value: "system",
      icon: <DesktopWindowsRoundedIcon fontSize="small" />,
      label: t("settings.theme.system"),
    },
  ];

  const languageOptions: { value: AppLanguage; label: string }[] = [
    { value: "en", label: t("settings.language.en") },
    { value: "uk", label: t("settings.language.uk") },
  ];

  const featureKeys = [
    "resume",
    "auth",
    "matching",
    "workspace",
    "pipeline",
    "analytics",
  ];

  const checklistItems: { key: ChecklistKey; icon: ReactNode; label: string }[] = [
    {
      key: "profile",
      icon: <VerifiedUserRoundedIcon fontSize="small" color="primary" />,
      label: t("landing.checklist.item.profile"),
    },
    {
      key: "resume",
      icon: <WorkHistoryRoundedIcon fontSize="small" color="primary" />,
      label: t("landing.checklist.item.resume"),
    },
    {
      key: "links",
      icon: <EngineeringRoundedIcon fontSize="small" color="primary" />,
      label: t("landing.checklist.item.links"),
    },
    {
      key: "filters",
      icon: <ChecklistRoundedIcon fontSize="small" color="primary" />,
      label: t("landing.checklist.item.filters"),
    },
    {
      key: "firstApply",
      icon: <RocketLaunchRoundedIcon fontSize="small" color="primary" />,
      label: t("landing.checklist.item.firstApply"),
    },
  ];

  const completionPercent = useMemo(() => {
    const completed = Object.values(checklist).filter(Boolean).length;
    return Math.round((completed / checklistItems.length) * 100);
  }, [checklist, checklistItems.length]);

  const normalizedSkills = useMemo(() => parseSkills(skillInput), [skillInput]);

  const rankedJobs = useMemo(() => {
    const candidates = sampleJobs.filter((job) => roleFilterMatches(roleFilter, job));

    return candidates
      .map((job) => {
        const text = `${job.title} ${job.tags.join(" ")}`.toLowerCase();
        const matchedSkills = normalizedSkills.filter((skill) => text.includes(skill));
        const score =
          normalizedSkills.length === 0
            ? roleFilter === "all"
              ? 62
              : 74
            : Math.min(
                98,
                Math.max(
                  25,
                  Math.round((matchedSkills.length / normalizedSkills.length) * 100),
                ),
              );

        return {
          ...job,
          matchedSkills,
          score,
        };
      })
      .filter((job) => normalizedSkills.length === 0 || job.matchedSkills.length > 0)
      .sort((first, second) => second.score - first.score);
  }, [normalizedSkills, roleFilter]);

  const topRecommendations = rankedJobs.slice(0, 3);
  const averageScore =
    topRecommendations.length > 0
      ? Math.round(
          topRecommendations.reduce((sum, job) => sum + job.score, 0) /
            topRecommendations.length,
        )
      : 0;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
    } catch {
      // Ignore storage errors.
    }
  }, [checklist]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        JOB_FIT_STORAGE_KEY,
        JSON.stringify({ skillInput, roleFilter }),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [roleFilter, skillInput]);

  function toggleChecklistItem(key: ChecklistKey) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function resetChecklist() {
    setChecklist(defaultChecklist);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2.5, md: 5 },
        background: isDark
          ? "linear-gradient(180deg, #0F172A 0%, #101827 100%)"
          : "linear-gradient(180deg, #F6F8FC 0%, #F8FAFD 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              borderColor: isDark ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.3)",
              background: isDark ? "rgba(17, 24, 39, 0.74)" : "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", lg: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 1.4,
                      display: "grid",
                      placeItems: "center",
                      color: "#F5F8FF",
                      background:
                        "linear-gradient(180deg, rgba(65, 120, 235, 0.96), rgba(41, 86, 186, 0.96))",
                    }}
                  >
                    <AppsRoundedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: isDark ? "#E6EDF8" : "#14243D",
                        lineHeight: 1.1,
                      }}
                    >
                      {t("landing.nav.productName")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? "rgba(226, 232, 240, 0.7)" : "rgba(51, 65, 85, 0.72)" }}
                    >
                      {t("landing.nav.tagline")}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
                  <Box
                    sx={{
                      height: 40,
                      borderRadius: 2,
                      border: `1px solid ${
                        isDark ? "rgba(148, 163, 184, 0.34)" : "rgba(148, 163, 184, 0.36)"
                      }`,
                      background: isDark ? "rgba(30, 41, 59, 0.78)" : "rgba(255, 255, 255, 0.95)",
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                    }}
                  >
                    <LanguageRoundedIcon
                      sx={{ color: isDark ? "rgba(226, 232, 240, 0.84)" : "rgba(30, 41, 59, 0.72)" }}
                      fontSize="small"
                    />
                    <Select
                      value={language}
                      variant="standard"
                      disableUnderline
                      onChange={(event) => setLanguage(event.target.value as AppLanguage)}
                      sx={{
                        minWidth: 130,
                        color: isDark ? "#E2E8F0" : "#1E293B",
                        fontWeight: 600,
                        "& .MuiSelect-icon": {
                          color: isDark ? "rgba(226, 232, 240, 0.86)" : "rgba(30, 41, 59, 0.68)",
                        },
                      }}
                    >
                      {languageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      borderRadius: 999,
                      border: `1px solid ${
                        isDark ? "rgba(148, 163, 184, 0.36)" : "rgba(148, 163, 184, 0.4)"
                      }`,
                      overflow: "hidden",
                    }}
                  >
                    {themeOptions.map((option, index) => {
                      const active = themePreference === option.value;

                      return (
                        <ButtonBase
                          key={option.value}
                          onClick={() => setThemePreference(option.value)}
                          aria-label={option.label}
                          aria-pressed={active}
                          sx={{
                            width: 42,
                            height: 40,
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                            borderRight:
                              index < themeOptions.length - 1
                                ? `1px solid ${
                                    isDark
                                      ? "rgba(148, 163, 184, 0.24)"
                                      : "rgba(148, 163, 184, 0.28)"
                                  }`
                                : "none",
                            color: active
                              ? isDark
                                ? "#93C5FD"
                                : "#1D4ED8"
                              : isDark
                                ? "#E2E8F0"
                                : "#1E293B",
                            background: active
                              ? isDark
                                ? "linear-gradient(180deg, rgba(37, 99, 235, 0.28), rgba(30, 64, 175, 0.3))"
                                : "linear-gradient(180deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.98))"
                              : isDark
                                ? "rgba(15, 23, 42, 0.84)"
                                : "rgba(255, 255, 255, 0.85)",
                            transition: "all 160ms ease",
                          }}
                        >
                          {option.icon}
                        </ButtonBase>
                      );
                    })}
                  </Box>

                  <Button component={Link} href="/dashboard" variant="outlined" sx={{ height: 40 }}>
                    {t("landing.nav.openDashboard")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: { xs: 3, md: 4 },
              borderColor: isDark ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.26)",
              background: isDark
                ? "linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(17, 24, 39, 0.84))"
                : "linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.97))",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2.3, md: 4 } }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <Chip
                      label={t("landing.hero.badge")}
                      sx={{
                        width: "fit-content",
                        color: isDark ? "#93C5FD" : "#1D4ED8",
                        border: `1px solid ${
                          isDark ? "rgba(147, 197, 253, 0.36)" : "rgba(59, 130, 246, 0.34)"
                        }`,
                        background: isDark ? "rgba(30, 64, 175, 0.2)" : "rgba(239, 246, 255, 0.96)",
                      }}
                    />

                    <Typography
                      variant="h1"
                      sx={{
                        maxWidth: 760,
                        color: isDark ? "#F1F5F9" : "#0F172A",
                        fontSize: { xs: 36, md: 56 },
                        lineHeight: 1.05,
                      }}
                    >
                      {t("landing.hero.title")}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        maxWidth: 760,
                        color: isDark ? "rgba(203, 213, 225, 0.9)" : "rgba(51, 65, 85, 0.9)",
                        fontWeight: 500,
                      }}
                    >
                      {t("landing.hero.subtitle")}
                    </Typography>

                    <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                      {t("landing.projectBrief")}
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4}>
                      <Button
                        component={Link}
                        href="/auth?mode=sign_in"
                        variant="contained"
                        size="large"
                      >
                        {t("landing.hero.primary")}
                      </Button>
                      <Button component={Link} href="/dashboard" variant="outlined" size="large">
                        {t("landing.hero.secondary")}
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      borderColor: isDark ? "rgba(148, 163, 184, 0.32)" : "rgba(148, 163, 184, 0.34)",
                      background: isDark
                        ? "linear-gradient(180deg, rgba(30, 41, 59, 0.82), rgba(15, 23, 42, 0.88))"
                        : "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))",
                    }}
                  >
                    <CardContent>
                      <Stack spacing={1.3}>
                        <Typography variant="h6" sx={{ color: isDark ? "#F1F5F9" : "#0F172A" }}>
                          {t("landing.snapshot.title")}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {t("landing.snapshot.subtitle")}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={86}
                          sx={{ height: 8, borderRadius: 99 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {t("landing.snapshot.progress")}
                        </Typography>
                        {[1, 2, 3].map((item) => (
                          <Box key={item} sx={{ py: 0.6 }}>
                            <Typography fontWeight={700}>
                              {t(`landing.snapshot.item${item}.title`)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t(`landing.snapshot.item${item}.desc`)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2.4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ChecklistRoundedIcon color="primary" />
                      <Typography variant="h5">{t("landing.checklist.title")}</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      {t("landing.checklist.subtitle")}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={completionPercent}
                      sx={{ height: 9, borderRadius: 99 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("landing.checklist.completed")} {completionPercent}%
                    </Typography>

                    {checklistItems.map((item) => (
                      <FormControlLabel
                        key={item.key}
                        control={
                          <Checkbox
                            checked={checklist[item.key]}
                            onChange={() => toggleChecklistItem(item.key)}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            {item.icon}
                            <Typography>{item.label}</Typography>
                          </Stack>
                        }
                      />
                    ))}

                    <Box>
                      <Button variant="text" onClick={resetChecklist}>
                        {t("landing.checklist.reset")}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AutoAwesomeRoundedIcon color="primary" />
                      <Typography variant="h5">{t("landing.jobfit.title")}</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      {t("landing.jobfit.subtitle")}
                    </Typography>

                    <TextField
                      label={t("landing.jobfit.skillsLabel")}
                      placeholder={t("landing.jobfit.skillsPlaceholder")}
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel id="home-role-filter-label">
                        {t("landing.jobfit.roleLabel")}
                      </InputLabel>
                      <Select
                        labelId="home-role-filter-label"
                        label={t("landing.jobfit.roleLabel")}
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
                      >
                        <MenuItem value="all">{t("landing.jobfit.role.all")}</MenuItem>
                        <MenuItem value="frontend">{t("landing.jobfit.role.frontend")}</MenuItem>
                        <MenuItem value="backend">{t("landing.jobfit.role.backend")}</MenuItem>
                        <MenuItem value="qa">{t("landing.jobfit.role.qa")}</MenuItem>
                        <MenuItem value="devops">{t("landing.jobfit.role.devops")}</MenuItem>
                      </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2}>
                      <Chip
                        color="primary"
                        label={`${t("landing.jobfit.matches")}: ${topRecommendations.length}`}
                      />
                      <Chip
                        color="secondary"
                        label={`${t("landing.jobfit.score")}: ${averageScore}%`}
                      />
                    </Stack>

                    {topRecommendations.length > 0 ? (
                      <Stack spacing={1}>
                        {topRecommendations.map((job) => (
                          <Card key={job.id} variant="outlined">
                            <CardContent sx={{ py: "12px !important" }}>
                              <Typography fontWeight={700}>{job.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {job.company} • {job.location}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        {t("landing.jobfit.empty")}
                      </Typography>
                    )}

                    <Box>
                      <Button component={Link} href="/dashboard" variant="outlined">
                        {t("landing.jobfit.openDashboard")}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={1} sx={{ mb: 2.2 }}>
                <Typography variant="h4">{t("landing.features.title")}</Typography>
                <Typography color="text.secondary">{t("landing.features.subtitle")}</Typography>
              </Stack>

              <Grid container spacing={2}>
                {featureKeys.slice(0, 4).map((key) => (
                  <Grid key={key} size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.8 }}>
                          {key === "pipeline" ? (
                            <WorkHistoryRoundedIcon color="primary" fontSize="small" />
                          ) : (
                            <VerifiedUserRoundedIcon color="primary" fontSize="small" />
                          )}
                          <Typography fontWeight={700}>
                            {t(`landing.feature.${key}.title`)}
                          </Typography>
                        </Stack>
                        <Typography color="text.secondary">
                          {t(`landing.feature.${key}.desc`)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2 }}>{t("landing.accounts.title")}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 1 }}>{t("landing.accounts.seeker.title")}</Typography>
                      <Typography color="text.secondary" sx={{ mb: 1.4 }}>
                        {t("landing.accounts.seeker.desc")}
                      </Typography>
                      <Stack spacing={0.6}>
                        {[1, 2, 3].map((item) => (
                          <Typography key={item} variant="body2">• {t(`landing.accounts.seeker.point${item}`)}</Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 1 }}>{t("landing.accounts.employer.title")}</Typography>
                      <Typography color="text.secondary" sx={{ mb: 1.4 }}>
                        {t("landing.accounts.employer.desc")}
                      </Typography>
                      <Stack spacing={0.6}>
                        {[1, 2, 3].map((item) => (
                          <Typography key={item} variant="body2">• {t(`landing.accounts.employer.point${item}`)}</Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderColor: isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.28)",
              background: isDark
                ? "linear-gradient(90deg, rgba(30, 41, 59, 0.74), rgba(15, 23, 42, 0.8))"
                : "linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98))",
            }}
          >
            <CardContent>
              <Stack spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
                <Typography variant="h4">{t("landing.cta.title")}</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 740, textAlign: { md: "center" } }}>
                  {t("landing.cta.subtitle")}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                  <Button
                    component={Link}
                    href="/auth?mode=sign_in"
                    variant="contained"
                    size="large"
                  >
                    {t("landing.cta.primary")}
                  </Button>
                  <Button component={Link} href="/dashboard" variant="outlined" size="large">
                    {t("landing.cta.secondary")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
