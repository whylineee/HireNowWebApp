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
    IconButton,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import type { AppLanguage, ThemePreference } from "@/lib/app-settings";
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

    useEffect(() => {
        setSession(getSession());
    }, []);

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

    return (
        <Card
            sx={{
                borderRadius: 3,
                borderColor: isDark
                    ? "rgba(148, 163, 184, 0.24)"
                    : "rgba(148, 163, 184, 0.3)",
                background: isDark
                    ? "rgba(17, 24, 39, 0.74)"
                    : "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(12px)",
                position: "sticky",
                top: 12,
                zIndex: 100,
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
                                borderRadius: 1.2,
                                display: "grid",
                                placeItems: "center",
                                color: "#F5F8FF",
                                background:
                                    "linear-gradient(180deg, rgba(65, 120, 235, 0.96), rgba(41, 86, 186, 0.96))",
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
                                        color: isActive
                                            ? "primary.main"
                                            : isDark
                                                ? "rgba(203, 213, 225, 0.9)"
                                                : "rgba(51, 65, 85, 0.85)",
                                        position: "relative",
                                        "&::after": isActive
                                            ? {
                                                content: '""',
                                                position: "absolute",
                                                bottom: 2,
                                                left: "20%",
                                                width: "60%",
                                                height: 2,
                                                borderRadius: 1,
                                                bgcolor: "primary.main",
                                            }
                                            : {},
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
                        <Tooltip title={isDark ? t("settings.theme.light") : t("settings.theme.dark")}>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    setThemePreference(themePreference === "dark" ? "light" : "dark")
                                }
                                sx={{
                                    color: isDark ? "rgba(203, 213, 225, 0.8)" : "rgba(51, 65, 85, 0.7)",
                                }}
                            >
                                {isDark ? (
                                    <LightModeRoundedIcon sx={{ fontSize: 20 }} />
                                ) : (
                                    <NightlightRoundedIcon sx={{ fontSize: 20 }} />
                                )}
                            </IconButton>
                        </Tooltip>

                        {/* Language */}
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

                        {/* Auth area */}
                        {session ? (
                            <Button
                                component={Link}
                                href="/dashboard"
                                variant={pathname === "/dashboard" ? "contained" : "outlined"}
                                size="small"
                                startIcon={
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            fontSize: 11,
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
                                sx={{ textTransform: "none", fontWeight: 600 }}
                            >
                                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                    {session.fullName.split(" ")[0]}
                                </Box>
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={0.8}>
                                <Button
                                    component={Link}
                                    href="/auth"
                                    variant="text"
                                    size="small"
                                    startIcon={<LoginRoundedIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        display: { xs: "none", sm: "inline-flex" },
                                        fontWeight: 600,
                                    }}
                                >
                                    {t("navbar.signin")}
                                </Button>
                                <Button
                                    component={Link}
                                    href="/auth?mode=sign_up"
                                    variant="contained"
                                    size="small"
                                    sx={{ fontWeight: 600, textTransform: "none" }}
                                >
                                    {t("navbar.register")}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
