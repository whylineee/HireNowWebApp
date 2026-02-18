"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Drawer,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import type { AppLanguage } from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { getSession, type LocalSession } from "@/lib/local-auth";

export default function Navbar() {
    const pathname = usePathname();
    const { language, setLanguage, themeMode, themePreference, setThemePreference } =
        useAppSettings();
    const t = (key: string) => translate(language, key);
    const isDark = themeMode === "dark";

    const [session, setSession] = useState<LocalSession | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setSession(getSession());
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/", label: t("nav.home") },
        { href: "/companies", label: t("nav.companies") },
        { href: "/salary", label: t("nav.salary") },
        { href: "/blog", label: t("nav.blog") },
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/about", label: t("nav.about") },
    ];

    const initials = session
        ? session.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "";

    const ThemeToggle = () => (
        <Tooltip title={isDark ? t("settings.theme.light") : t("settings.theme.dark")}>
            <IconButton
                size="small"
                onClick={() =>
                    setThemePreference(themePreference === "dark" ? "light" : "dark")
                }
                sx={{
                    color: isDark ? "rgba(203, 213, 225, 0.8)" : "rgba(51, 65, 85, 0.7)",
                    transition: "all 200ms",
                    "&:hover": {
                        color: isDark ? "#93C5FD" : "#2563EB",
                        bgcolor: isDark ? "rgba(96,165,250,0.1)" : "rgba(37,99,235,0.08)",
                    },
                }}
            >
                {isDark ? (
                    <LightModeRoundedIcon sx={{ fontSize: 20 }} />
                ) : (
                    <NightlightRoundedIcon sx={{ fontSize: 20 }} />
                )}
            </IconButton>
        </Tooltip>
    );

    const LangSelect = () => (
        <Box
            sx={{
                height: 34,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                px: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                bgcolor: "background.paper",
                transition: "border-color 200ms",
                "&:hover": {
                    borderColor: isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.3)",
                },
            }}
        >
            <LanguageRoundedIcon sx={{ fontSize: 16, color: "action.active" }} />
            <Select
                value={language}
                variant="standard"
                disableUnderline
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                sx={{ minWidth: 42, fontSize: 13, fontWeight: 600 }}
            >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="uk">UK</MenuItem>
            </Select>
        </Box>
    );

    return (
        <>
            <Card
                sx={{
                    borderRadius: 3,
                    borderColor: isDark
                        ? scrolled ? "rgba(96, 165, 250, 0.15)" : "rgba(148, 163, 184, 0.18)"
                        : scrolled ? "rgba(37, 99, 235, 0.12)" : "rgba(148, 163, 184, 0.25)",
                    background: isDark
                        ? scrolled
                            ? "rgba(10, 17, 32, 0.92)"
                            : "rgba(17, 24, 39, 0.74)"
                        : scrolled
                            ? "rgba(255, 255, 255, 0.98)"
                            : "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(16px)",
                    position: "sticky",
                    top: 12,
                    zIndex: 100,
                    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: scrolled
                        ? isDark
                            ? "0 4px 24px rgba(0,0,0,0.4)"
                            : "0 4px 24px rgba(15,23,42,0.08)"
                        : "none",
                }}
            >
                <CardContent sx={{ py: "12px !important", px: { xs: 2, md: 3 } }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        {/* Logo */}
                        <Stack
                            component={Link}
                            href="/"
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ textDecoration: "none", flexShrink: 0 }}
                        >
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 1.5,
                                    display: "grid",
                                    placeItems: "center",
                                    color: "#F5F8FF",
                                    background:
                                        "linear-gradient(135deg, #3B82F6, #4F46E5)",
                                    boxShadow: "0 2px 8px rgba(59,130,246,0.35)",
                                    transition: "transform 200ms, box-shadow 200ms",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
                                    },
                                }}
                            >
                                <AppsRoundedIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    color: isDark ? "#E6EDF8" : "#14243D",
                                    fontSize: 18,
                                    display: { xs: "none", sm: "block" },
                                    letterSpacing: "-0.3px",
                                }}
                            >
                                HireNow
                            </Typography>
                        </Stack>

                        {/* Nav links — desktop only */}
                        <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Button
                                        key={link.href}
                                        component={Link}
                                        href={link.href}
                                        variant="text"
                                        size="small"
                                        sx={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: 14,
                                            color: isActive
                                                ? isDark ? "#60A5FA" : "#2563EB"
                                                : isDark
                                                    ? "rgba(203, 213, 225, 0.85)"
                                                    : "rgba(51, 65, 85, 0.8)",
                                            position: "relative",
                                            textTransform: "none",
                                            px: 1.2,
                                            "&::after": isActive
                                                ? {
                                                    content: '""',
                                                    position: "absolute",
                                                    bottom: 4,
                                                    left: "20%",
                                                    width: "60%",
                                                    height: 2,
                                                    borderRadius: 1,
                                                    background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
                                                }
                                                : {},
                                            "&:hover": {
                                                color: isDark ? "#93C5FD" : "#2563EB",
                                                bgcolor: isDark ? "rgba(96,165,250,0.08)" : "rgba(37,99,235,0.05)",
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </Stack>

                        {/* Right side: controls + auth */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Language — desktop only */}
                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                <LangSelect />
                            </Box>

                            {/* Auth area — desktop */}
                            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
                                {session ? (
                                    <Button
                                        component={Link}
                                        href="/dashboard"
                                        variant={pathname === "/dashboard" ? "contained" : "outlined"}
                                        size="small"
                                        startIcon={
                                            <Avatar
                                                sx={{
                                                    width: 22,
                                                    height: 22,
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    bgcolor: isDark
                                                        ? "rgba(96, 165, 250, 0.25)"
                                                        : "rgba(10, 102, 194, 0.15)",
                                                    color: isDark ? "#93C5FD" : "#1D4ED8",
                                                }}
                                            >
                                                {initials}
                                            </Avatar>
                                        }
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            ...(pathname !== "/dashboard" && {
                                                borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                                                color: isDark ? "#CBD5E1" : "#475569",
                                                "&:hover": {
                                                    borderColor: isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.35)",
                                                },
                                            }),
                                        }}
                                    >
                                        {session.fullName.split(" ")[0]}
                                    </Button>
                                ) : (
                                    <Stack direction="row" spacing={0.8}>
                                        <Button
                                            component={Link}
                                            href="/auth"
                                            variant="text"
                                            size="small"
                                            startIcon={<LoginRoundedIcon sx={{ fontSize: 17 }} />}
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: "none",
                                                color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.8)",
                                                "&:hover": { color: isDark ? "#93C5FD" : "#2563EB" },
                                            }}
                                        >
                                            {t("navbar.signin")}
                                        </Button>
                                        <Button
                                            component={Link}
                                            href="/auth?mode=sign_up"
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                textTransform: "none",
                                                borderRadius: 2,
                                                background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #1D4ED8, #4338CA)",
                                                    boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                                                },
                                            }}
                                        >
                                            {t("navbar.register")}
                                        </Button>
                                    </Stack>
                                )}
                            </Box>

                            {/* Hamburger — mobile only */}
                            <IconButton
                                size="small"
                                onClick={() => setMobileOpen(true)}
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    color: isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.8)",
                                    border: "1px solid",
                                    borderColor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
                                    borderRadius: 1.5,
                                    p: 0.7,
                                }}
                            >
                                <MenuRoundedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* ── Mobile Drawer ─────────────────────────────────────── */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: isDark
                            ? "linear-gradient(180deg, #0D1829 0%, #0A1120 100%)"
                            : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                        borderLeft: "1px solid",
                        borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)",
                    },
                }}
            >
                <Box sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 1.2,
                                    display: "grid",
                                    placeItems: "center",
                                    color: "#F5F8FF",
                                    background: "linear-gradient(135deg, #3B82F6, #4F46E5)",
                                }}
                            >
                                <AppsRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography fontWeight={800} sx={{ color: isDark ? "#E6EDF8" : "#14243D" }}>
                                HireNow
                            </Typography>
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={() => setMobileOpen(false)}
                            sx={{ color: isDark ? "rgba(203,213,225,0.7)" : "rgba(51,65,85,0.6)" }}
                        >
                            <CloseRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Stack>

                    {/* Nav links */}
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Box
                                    key={link.href}
                                    component={Link}
                                    href={link.href}
                                    sx={{
                                        display: "block",
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        textDecoration: "none",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 15,
                                        color: isActive
                                            ? isDark ? "#60A5FA" : "#2563EB"
                                            : isDark ? "rgba(203,213,225,0.85)" : "rgba(51,65,85,0.85)",
                                        bgcolor: isActive
                                            ? isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.07)"
                                            : "transparent",
                                        transition: "all 180ms",
                                        "&:hover": {
                                            bgcolor: isDark ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.06)",
                                            color: isDark ? "#93C5FD" : "#2563EB",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    {link.label}
                                </Box>
                            );
                        })}
                    </Stack>

                    <Divider sx={{ mb: 2.5, borderColor: isDark ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)" }} />

                    {/* Controls */}
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ThemeToggle />
                            <LangSelect />
                        </Stack>

                        {session ? (
                            <Button
                                component={Link}
                                href="/dashboard"
                                variant="contained"
                                fullWidth
                                sx={{
                                    fontWeight: 700,
                                    textTransform: "none",
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <Stack spacing={1}>
                                <Button
                                    component={Link}
                                    href="/auth"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        borderColor: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.4)",
                                        color: isDark ? "#CBD5E1" : "#475569",
                                    }}
                                >
                                    {t("navbar.signin")}
                                </Button>
                                <Button
                                    component={Link}
                                    href="/auth?mode=sign_up"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                                    }}
                                >
                                    {t("navbar.register")}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
}
