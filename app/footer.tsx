"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import {
    Box,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import type { AppLanguage } from "@/lib/app-settings";
import { translate } from "@/lib/i18n";
import { getSession } from "@/lib/local-auth";

type FooterProps = {
    language: AppLanguage;
    isDark: boolean;
};

function FooterLink({
    href,
    children,
    isDark,
}: {
    href: string;
    children: React.ReactNode;
    isDark: boolean;
}) {
    return (
        <Typography
            component={Link}
            href={href}
            variant="body2"
            sx={{
                color: isDark ? "rgba(203, 213, 225, 0.8)" : "rgba(51, 65, 85, 0.78)",
                textDecoration: "none",
                transition: "color 180ms ease",
                "&:hover": {
                    color: isDark ? "#93C5FD" : "#1D4ED8",
                },
            }}
        >
            {children}
        </Typography>
    );
}

export default function Footer({ language, isDark }: FooterProps) {
    const t = (key: string) => translate(language, key);
    const [dashboardLink, setDashboardLink] = useState("/auth");

    useEffect(() => {
        if (getSession()) {
            setDashboardLink("/dashboard");
        }
    }, []);

    const columns = [
        {
            title: t("footer.product"),
            links: [
                { label: t("footer.home"), href: "/" },
                { label: t("footer.dashboard"), href: dashboardLink },
                { label: t("footer.companies"), href: "/companies" },
                { label: t("nav.pricing"), href: "/pricing" },
            ],
        },
        {
            title: t("footer.resources"),
            links: [
                { label: t("footer.salary"), href: "/salary" },
                { label: t("footer.blog"), href: "/blog" },
                { label: t("footer.docs"), href: "#" },
            ],
        },
        {
            title: t("footer.company"),
            links: [
                { label: t("footer.about"), href: "/about" },
                { label: t("footer.careers"), href: "#" },
                { label: t("footer.contact"), href: "/contact" },
            ],
        },
    ];

    return (
        <Box
            component="footer"
            sx={{
                mt: { xs: 4, md: 6 },
                pt: { xs: 4, md: 5 },
                pb: { xs: 3, md: 4 },
                borderTop: `1px solid ${isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.22)"
                    }`,
                background: isDark
                    ? "linear-gradient(180deg, rgba(15, 23, 42, 0.6), rgba(11, 18, 32, 0.85))"
                    : "linear-gradient(180deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.95))",
                backdropFilter: "blur(12px)",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
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
                                    }}
                                >
                                    HireNow
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isDark
                                        ? "rgba(203, 213, 225, 0.7)"
                                        : "rgba(51, 65, 85, 0.72)",
                                    maxWidth: 260,
                                }}
                            >
                                {t("footer.tagline")}
                            </Typography>
                            <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                                {[
                                    { icon: <GitHubIcon sx={{ fontSize: 20 }} />, href: "#" },
                                    { icon: <LinkedInIcon sx={{ fontSize: 20 }} />, href: "#" },
                                    { icon: <XIcon sx={{ fontSize: 18 }} />, href: "#" },
                                ].map((social, index) => (
                                    <Box
                                        key={index}
                                        component="a"
                                        href={social.href}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            display: "grid",
                                            placeItems: "center",
                                            color: isDark ? "rgba(203, 213, 225, 0.7)" : "rgba(51, 65, 85, 0.6)",
                                            border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.25)"
                                                }`,
                                            transition: "all 180ms ease",
                                            "&:hover": {
                                                color: isDark ? "#93C5FD" : "#1D4ED8",
                                                borderColor: isDark ? "rgba(147, 197, 253, 0.4)" : "rgba(29, 78, 216, 0.3)",
                                                background: isDark
                                                    ? "rgba(30, 64, 175, 0.15)"
                                                    : "rgba(239, 246, 255, 0.9)",
                                            },
                                        }}
                                    >
                                        {social.icon}
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {columns.map((column) => (
                        <Grid key={column.title} size={{ xs: 6, sm: 4, md: 2.666 }}>
                            <Stack spacing={1.2}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        color: isDark ? "#E2E8F0" : "#1E293B",
                                        textTransform: "uppercase",
                                        fontSize: 11,
                                        letterSpacing: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    {column.title}
                                </Typography>
                                {column.links.map((link) => (
                                    <FooterLink key={link.label} href={link.href} isDark={isDark}>
                                        {link.label}
                                    </FooterLink>
                                ))}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Box
                    sx={{
                        mt: { xs: 3, md: 4 },
                        pt: 2.5,
                        borderTop: `1px solid ${isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.16)"
                            }`,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: isDark
                                ? "rgba(148, 163, 184, 0.6)"
                                : "rgba(100, 116, 139, 0.6)",
                        }}
                    >
                        {t("footer.copyright")}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
