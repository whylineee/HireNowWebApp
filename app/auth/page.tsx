"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import type { AppLanguage } from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import {
  resetPasswordByEmail,
  signIn,
  signUp,
  type UserRole,
} from "@/lib/local-auth";

type AuthMode = "sign_in" | "sign_up";

function getInitialMode(): AuthMode {
  if (typeof window === "undefined") {
    return "sign_in";
  }

  const mode = new URLSearchParams(window.location.search).get("mode");
  return mode === "sign_up" ? "sign_up" : "sign_in";
}

export default function AuthPage() {
  const router = useRouter();
  const { language, setLanguage, themeMode } = useAppSettings();
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
    if (!email.includes("@")) {
      setError(t("auth.error.email"));
      return false;
    }
    if (password.length < 6) {
      setError(t("auth.error.password"));
      return false;
    }
    if (mode === "sign_up" && fullName.trim().length < 2) {
      setError(t("auth.error.fullName"));
      return false;
    }
    if (mode === "sign_up" && password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return false;
    }
    return true;
  }

  function mapAuthError(message: string) {
    if (message.includes("already exists")) {
      return t("auth.error.exists");
    }
    if (message.includes("does not exist")) {
      return t("auth.error.accountNotFound");
    }
    if (message.includes("Invalid email or password")) {
      return t("auth.error.invalidCredentials");
    }
    if (message.includes("Current password is incorrect")) {
      return t("auth.error.currentPassword");
    }
    if (message.includes("different from current")) {
      return t("auth.error.samePassword");
    }
    if (message.includes("at least 6 characters")) {
      return t("auth.error.password");
    }
    return message;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) {
      return;
    }

    if (mode === "sign_up") {
      const result = signUp({ email, password, fullName, role });
      if (!result.ok) {
        setError(mapAuthError(result.message ?? "Unable to create account."));
        return;
      }
      setSuccess(t("auth.success.created"));
      router.push("/dashboard");
      return;
    }

    const result = signIn({ email, password });
    if (!result.ok) {
      setError(mapAuthError(result.message ?? "Unable to sign in."));
      return;
    }

    setSuccess(t("auth.success.signedIn"));
    router.push("/dashboard");
  }

  function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetEmail.includes("@")) {
      setResetError(t("auth.error.email"));
      return;
    }

    if (resetPassword.length < 6) {
      setResetError(t("auth.error.password"));
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setResetError(t("auth.error.passwordMismatch"));
      return;
    }

    const result = resetPasswordByEmail({
      email: resetEmail,
      newPassword: resetPassword,
    });

    if (!result.ok) {
      setResetError(mapAuthError(result.message ?? "Unable to reset password."));
      return;
    }

    setResetSuccess(t("auth.success.passwordReset"));
    setTimeout(() => {
      setResetOpen(false);
      setResetPassword("");
      setResetConfirmPassword("");
      setResetError("");
      setResetSuccess("");
    }, 650);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        background: isDark
          ? "radial-gradient(circle at top left, #15243E 0%, #0D162A 50%, #0A1220 100%)"
          : "radial-gradient(circle at top left, #EAF2FF 0%, #F3F7FF 55%, #F8FAFF 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button component={Link} href="/" variant="text">
              {t("common.home")}
            </Button>
            <Box
              sx={{
                height: 40,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                px: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                bgcolor: "background.paper",
              }}
            >
              <LanguageRoundedIcon color="action" fontSize="small" />
              <Select
                value={language}
                variant="standard"
                disableUnderline
                onChange={(event) => setLanguage(event.target.value as AppLanguage)}
                sx={{ minWidth: 122, fontWeight: 600 }}
              >
                <MenuItem value="en">{t("settings.language.en")}</MenuItem>
                <MenuItem value="uk">{t("settings.language.uk")}</MenuItem>
              </Select>
            </Box>
          </Stack>

          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
              bgcolor: isDark ? "rgba(17, 24, 39, 0.86)" : "rgba(255, 255, 255, 0.92)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={2.6}>
                <Box>
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    {t("auth.title")}
                  </Typography>
                  <Typography color="text.secondary">{t("auth.subtitle")}</Typography>
                </Box>

                <Tabs
                  value={mode}
                  onChange={(_, value: AuthMode) => {
                    setMode(value);
                    setError("");
                    setSuccess("");
                  }}
                  variant="fullWidth"
                >
                  <Tab value="sign_in" label={t("auth.signin")} />
                  <Tab value="sign_up" label={t("auth.register")} />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.2}>
                    {mode === "sign_up" ? (
                      <TextField
                        label={t("auth.fullName")}
                        required
                        fullWidth
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                      />
                    ) : null}

                    <TextField
                      label={t("auth.email")}
                      type="email"
                      required
                      fullWidth
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />

                    <TextField
                      label={t("auth.password")}
                      type="password"
                      required
                      fullWidth
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />

                    {mode === "sign_up" ? (
                      <TextField
                        label={t("auth.confirmPassword")}
                        type="password"
                        required
                        fullWidth
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                      />
                    ) : null}

                    {mode === "sign_up" ? (
                      <FormControl fullWidth>
                        <InputLabel id="role-label">{t("auth.accountType")}</InputLabel>
                        <Select
                          labelId="role-label"
                          label={t("auth.accountType")}
                          value={role}
                          onChange={(event) => setRole(event.target.value as UserRole)}
                        >
                          <MenuItem value="job_seeker">{t("auth.jobSeeker")}</MenuItem>
                          <MenuItem value="employer">{t("auth.employer")}</MenuItem>
                        </Select>
                      </FormControl>
                    ) : null}

                    {mode === "sign_in" ? (
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip title={t("auth.forgotPasswordHint")}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              setResetEmail(email);
                              setResetOpen(true);
                              setResetError("");
                              setResetSuccess("");
                            }}
                          >
                            {t("auth.forgotPassword")}
                          </Button>
                        </Tooltip>
                      </Box>
                    ) : null}

                    {error ? <Alert severity="error">{error}</Alert> : null}
                    {success ? <Alert severity="success">{success}</Alert> : null}

                    <Button type="submit" variant="contained" size="large">
                      {mode === "sign_in" ? t("auth.signinButton") : t("auth.createAccount")}
                    </Button>
                  </Stack>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {mode === "sign_in" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setMode(mode === "sign_in" ? "sign_up" : "sign_in")}
                  >
                    {mode === "sign_in" ? t("auth.register") : t("auth.signin")}
                  </Button>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("auth.resetPasswordTitle")}</DialogTitle>
        <Box component="form" onSubmit={handleResetPassword}>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t("auth.resetPasswordSubtitle")}
              </Typography>
              <TextField
                label={t("auth.email")}
                type="email"
                required
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
              />
              <TextField
                label={t("auth.newPassword")}
                type="password"
                required
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
              />
              <TextField
                label={t("auth.confirmPassword")}
                type="password"
                required
                value={resetConfirmPassword}
                onChange={(event) => setResetConfirmPassword(event.target.value)}
              />
              {resetError ? <Alert severity="error">{resetError}</Alert> : null}
              {resetSuccess ? <Alert severity="success">{resetSuccess}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetOpen(false)}>{t("common.cancel")}</Button>
            <Button type="submit" variant="contained">
              {t("auth.resetPasswordButton")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
