import { Noise } from "@/components/ui/noise";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { ChangelogNotification } from "@/changelog/components/changelog-notification";
import { TooltipProvider } from "../components/ui/tooltip";
import { baseMetaData } from "./metadata";
import { BotIdClient } from "botid/client";
import { webEnv } from "@/env/web";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

const siteFont = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-inter" });
const serifFont = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata = baseMetaData;

const protectedRoutes = [
	{
		path: "/none",
		method: "GET",
	},
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<BotIdClient protect={protectedRoutes} />
				{process.env.NODE_ENV === "development" && (
					<>
						<Script
							src="//unpkg.com/react-scan/dist/auto.global.js"
							crossOrigin="anonymous"
							strategy="beforeInteractive"
						/>
					</>
				)}
			</head>
			<body className={`${siteFont.variable} ${serifFont.variable} font-sans antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem={true}
					disableTransitionOnChange={true}
				>
					<TooltipProvider>
						<Noise />
						<Toaster />
						{children}
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
