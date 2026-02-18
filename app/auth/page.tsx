"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import {
  resetPasswordByEmail,
  signIn,
  signUp,
  type UserRole,
} from "@/lib/local-auth";

function getPasswordStrength(pw: string): { score: number; label: string; color: string; key: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "#EF4444", key: "auth.strength.weak" };
  if (score === 2) return { score: 45, label: "Fair", color: "#F59E0B", key: "auth.strength.fair" };
  if (score === 3) return { score: 70, label: "Good", color: "#10B981", key: "auth.strength.good" };
  return { score: 100, label: "Strong", color: "#059669", key: "auth.strength.strong" };
}

type AuthMode = "sign_in" | "sign_up";

function getInitialMode(): AuthMode {
  if (typeof window === "undefined") return "sign_in";
  const mode = new URLSearchParams(window.location.search).get("mode");
  return mode === "sign_up" ? "sign_up" : "sign_in";
}

const leftPanelFeatures = [
  { icon: <WorkOutlineIcon sx={{ fontSize: 20 }} />, color: "#3B82F6", title: "1,250+ IT Jobs", desc: "Fresh listings daily" },
  { icon: <GroupsRoundedIcon sx={{ fontSize: 20 }} />, color: "#8B5CF6", title: "320+ Companies", desc: "Top tech employers" },
  { icon: <InsightsRoundedIcon sx={{ fontSize: 20 }} />, color: "#10B981", title: "Salary Insights", desc: "Real market data" },
  { icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />, color: "#F59E0B", title: "AI Matching", desc: "Smart recommendations" },
  { icon: <SecurityRoundedIcon sx={{ fontSize: 20 }} />, color: "#EF4444", title: "Secure & Private", desc: "Your data is safe" },
];

export default function AuthPage() {
  const router = useRouter();
  const { language, themeMode, toggleTheme } = useAppSettings();
  const t = (key: string) => translate(language, key);
  const isDark = themeMode === "dark";

  const [mode, setMode] = useState<AuthMode>(() => getInitialMode());
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  function validate() {
    if (!email.includes("@")) { setError(t("auth.error.email")); return false; }
    if (password.length < 6) { setError(t("auth.error.password")); return false; }
    if (mode === "sign_up" && fullName.trim().length < 2) { setError(t("auth.error.fullName")); return false; }
    if (mode === "sign_up" && password !== confirmPassword) { setError(t("auth.error.passwordMismatch")); return false; }
    return true;
  }

  function mapAuthError(message: string) {
    if (message.includes("already exists")) return t("auth.error.exists");
    if (message.includes("does not exist")) return t("auth.error.accountNotFound");
    if (message.includes("Invalid email or password")) return t("auth.error.invalidCredentials");
    if (message.includes("Current password is incorrect")) return t("auth.error.currentPassword");
    if (message.includes("different from current")) return t("auth.error.samePassword");
    if (message.includes("at least 6 characters")) return t("auth.error.password");
    return message;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    if (mode === "sign_up") {
      const result = signUp({ email, password, fullName, role });
      if (!result.ok) { setError(mapAuthError(result.message ?? "Unable to create account.")); return; }
      setSuccess(t("auth.success.created"));
      router.push("/dashboard");
      return;
    }

    const result = signIn({ email, password });
    if (!result.ok) { setError(mapAuthError(result.message ?? "Unable to sign in.")); return; }
    setSuccess(t("auth.success.signedIn"));
    router.push("/dashboard");
  }

  function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetError("");
    setResetSuccess("");
    if (!resetEmail.includes("@")) { setResetError(t("auth.error.email")); return; }
    if (resetPassword.length < 6) { setResetError(t("auth.error.password")); return; }
    if (resetPassword !== resetConfirmPassword) { setResetError(t("auth.error.passwordMismatch")); return; }

    const result = resetPasswordByEmail({ email: resetEmail, newPassword: resetPassword });
    if (!result.ok) { setResetError(mapAuthError(result.message ?? "Unable to reset password.")); return; }
    setResetSuccess(t("auth.success.passwordReset"));
    setTimeout(() => {
      setResetOpen(false);
      setResetPassword("");
      setResetConfirmPassword("");
      setResetError("");
      setResetSuccess("");
    }, 650);
  }

  const pwStrength = useMemo(() => getPasswordStrength(password), [password]);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
      transition: "all 200ms",
      "& fieldset": { borderColor: isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)" },
      "&:hover fieldset": { borderColor: isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.3)" },
      "&.Mui-focused fieldset": { borderColor: isDark ? "rgba(96,165,250,0.6)" : "rgba(37,99,235,0.5)" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: isDark
          ? "linear-gradient(135deg, #070D1A 0%, #0A1120 100%)"
          : "linear-gradient(135deg, #F0F4FF 0%, #F6F8FC 100%)",
      }}
    >
      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          width: 420,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(160deg, #0D1829 0%, #111827 100%)"
            : "linear-gradient(160deg, #1E3A8A 0%, #312E81 100%)",
          p: 5,
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            top: -100,
            right: -100,
            background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            bottom: -80,
            left: -80,
            background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack spacing={4} sx={{ position: "relative", zIndex: 1, height: "100%" }}>
          {/* Logo */}
          <Stack component={Link} href="/" direction="row" spacing={1.5} alignItems="center" sx={{ textDecoration: "none" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              <AppsRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography fontWeight={800} fontSize={20} sx={{ color: "#fff" }}>
              HireNow
            </Typography>
          </Stack>

          {/* Headline */}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#fff",
                fontSize: { lg: 34, xl: 40 },
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                mb: 1.5,
              }}
            >
              {language === "uk"
                ? "Знайди роботу мрії в IT"
                : "Find your dream IT job"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}
            >
              {language === "uk"
                ? "Приєднуйся до тисяч розробників, які вже знайшли роботу через HireNow"
                : "Join thousands of developers who already found jobs through HireNow"}
            </Typography>
          </Box>

          {/* Features list */}
          <Stack spacing={2}>
            {leftPanelFeatures.map((feat, i) => (
              <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: `${feat.color}22`,
                    border: `1px solid ${feat.color}33`,
                    color: feat.color,
                    flexShrink: 0,
                  }}
                >
                  {feat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: "#fff", lineHeight: 1.2 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    {feat.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          {/* Bottom social proof */}
          <Box sx={{ mt: "auto" }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />
            <Stack direction="row" spacing={3}>
              {[
                { value: "1,250+", label: language === "uk" ? "Вакансій" : "Jobs" },
                { value: "320+", label: language === "uk" ? "Компаній" : "Companies" },
                { value: "8,900+", label: language === "uk" ? "Кандидатів" : "Candidates" },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography fontWeight={800} sx={{ color: "#fff", fontSize: 18 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* ── RIGHT PANEL (form) ──────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 5, md: 6 },
          overflowY: "auto",
        }}
      >
        {/* Top bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", maxWidth: 460, mb: 4 }}
        >
          {/* Mobile logo */}
          <Stack
            component={Link}
            href="/"
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ textDecoration: "none", display: { lg: "none" } }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #3B82F6, #4F46E5)",
                color: "#fff",
              }}
            >
              <AppsRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} sx={{ color: isDark ? "#E6EDF8" : "#14243D" }}>
              HireNow
            </Typography>
          </Stack>
          <Box sx={{ display: { lg: "none" } }} />

          {/* Theme toggle */}
          <Button
            variant="outlined"
            size="small"
            onClick={toggleTheme}
            startIcon={isDark ? <LightModeRoundedIcon sx={{ fontSize: 16 }} /> : <NightlightRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 2,
              borderColor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
              color: isDark ? "#CBD5E1" : "#475569",
            }}
          >
            {isDark ? (language === "uk" ? "Світла" : "Light") : (language === "uk" ? "Темна" : "Dark")}
          </Button>
        </Stack>

        {/* Form card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 460,
            borderRadius: 4,
            border: "1px solid",
            borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.18)",
            bgcolor: isDark ? "rgba(10, 17, 32, 0.85)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.5)"
              : "0 20px 60px rgba(15,23,42,0.08)",
            p: { xs: 3, sm: 4 },
            animation: "fade-in-up 0.5s ease both",
          }}
        >
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  letterSpacing: "-0.5px",
                  mb: 0.5,
                }}
              >
                {mode === "sign_in"
                  ? (language === "uk" ? "Вхід до акаунту" : "Welcome back")
                  : (language === "uk" ? "Створити акаунт" : "Create account")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mode === "sign_in"
                  ? (language === "uk" ? "Увійди щоб продовжити" : "Sign in to continue")
                  : (language === "uk" ? "Зареєструйся безкоштовно" : "Get started for free")}
              </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
              value={mode}
              onChange={(_, value: AuthMode) => { setMode(value); setError(""); setSuccess(""); }}
              variant="fullWidth"
              sx={{
                bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(241,245,249,0.8)",
                borderRadius: 2.5,
                p: 0.5,
                minHeight: 40,
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  zIndex: 0,
                },
                "& .MuiTab-root": {
                  minHeight: 36,
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none",
                  zIndex: 1,
                  transition: "color 250ms",
                  "&.Mui-selected": { color: "#fff" },
                  "&:not(.Mui-selected)": { color: isDark ? "rgba(148,163,184,0.7)" : "rgba(100,116,139,0.7)" },
                },
              }}
            >
              <Tab value="sign_in" label={t("auth.signin")} />
              <Tab value="sign_up" label={t("auth.register")} />
            </Tabs>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {mode === "sign_up" && (
                  <TextField
                    label={t("auth.fullName")}
                    required
                    fullWidth
                    size="small"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={inputSx}
                  />
                )}

                <TextField
                  label={t("auth.email")}
                  type="email"
                  required
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={inputSx}
                />

                <TextField
                  label={t("auth.password")}
                  type="password"
                  required
                  fullWidth
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputSx}
                />

                {mode === "sign_up" && password.length > 0 && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">{t("auth.passwordStrength")}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: pwStrength.color }}>
                        {t(pwStrength.key)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={pwStrength.score}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.9)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: pwStrength.color,
                          borderRadius: 3,
                          transition: "width 400ms, background-color 400ms",
                        },
                      }}
                    />
                  </Box>
                )}

                {mode === "sign_up" && (
                  <TextField
                    label={t("auth.confirmPassword")}
                    type="password"
                    required
                    fullWidth
                    size="small"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={inputSx}
                  />
                )}

                {mode === "sign_up" && (
                  <FormControl fullWidth size="small">
                    <InputLabel id="role-label">{t("auth.accountType")}</InputLabel>
                    <Select
                      labelId="role-label"
                      label={t("auth.accountType")}
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="job_seeker">{t("auth.jobSeeker")}</MenuItem>
                      <MenuItem value="employer">{t("auth.employer")}</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {mode === "sign_in" && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -0.5 }}>
                    <Tooltip title={t("auth.forgotPasswordHint")}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => { setResetEmail(email); setResetOpen(true); setResetError(""); setResetSuccess(""); }}
                        sx={{ textTransform: "none", fontSize: 13, color: isDark ? "#60A5FA" : "#2563EB" }}
                      >
                        {t("auth.forgotPassword")}
                      </Button>
                    </Tooltip>
                  </Box>
                )}

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 15,
                    py: 1.3,
                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                      boxShadow: "0 6px 24px rgba(37,99,235,0.45)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 250ms",
                  }}
                >
                  {mode === "sign_in" ? t("auth.signinButton") : t("auth.createAccount")}
                </Button>
              </Stack>
            </Box>

            {/* Switch mode */}
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {mode === "sign_in" ? t("auth.noAccount") : t("auth.haveAccount")}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => { setMode(mode === "sign_in" ? "sign_up" : "sign_in"); setError(""); setSuccess(""); }}
                sx={{ textTransform: "none", fontWeight: 700, fontSize: 14, color: isDark ? "#60A5FA" : "#2563EB" }}
              >
                {mode === "sign_in" ? t("auth.register") : t("auth.signin")}
              </Button>
            </Stack>

            {/* Demo hint */}
            <Box
              sx={{
                borderRadius: 2.5,
                p: 1.5,
                bgcolor: isDark ? "rgba(30,64,175,0.1)" : "rgba(219,234,254,0.5)",
                border: "1px solid",
                borderColor: isDark ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <CheckCircleRoundedIcon sx={{ fontSize: 16, color: isDark ? "#60A5FA" : "#2563EB", mt: 0.1, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)", lineHeight: 1.5 }}>
                  {language === "uk"
                    ? "Демо-режим: реєструйся з будь-яким email. Дані зберігаються локально."
                    : "Demo mode: register with any email. Data is stored locally in your browser."}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Back to home */}
        <Button
          component={Link}
          href="/"
          variant="text"
          size="small"
          sx={{
            mt: 3,
            textTransform: "none",
            color: isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.6)",
            fontSize: 13,
            "&:hover": { color: isDark ? "#93C5FD" : "#2563EB" },
          }}
        >
          ← {language === "uk" ? "Назад на головну" : "Back to home"}
        </Button>
      </Box>

      {/* ── Reset Password Dialog ───────────────────────────── */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? "#0D1829" : "#fff",
            border: "1px solid",
            borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{t("auth.resetPasswordTitle")}</DialogTitle>
        <Box component="form" onSubmit={handleResetPassword}>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">{t("auth.resetPasswordSubtitle")}</Typography>
              <TextField label={t("auth.email")} type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} sx={inputSx} />
              <TextField label={t("auth.newPassword")} type="password" required value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} sx={inputSx} />
              <TextField label={t("auth.confirmPassword")} type="password" required value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} sx={inputSx} />
              {resetError && <Alert severity="error" sx={{ borderRadius: 2 }}>{resetError}</Alert>}
              {resetSuccess && <Alert severity="success" sx={{ borderRadius: 2 }}>{resetSuccess}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setResetOpen(false)} sx={{ textTransform: "none" }}>{t("common.cancel")}</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                background: "linear-gradient(135deg, #2563EB, #4F46E5)",
              }}
            >
              {t("auth.resetPasswordButton")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
