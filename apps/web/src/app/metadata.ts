import type { Metadata } from "next";
import { SITE_INFO, SITE_URL } from "@/site/brand";

export const baseMetaData: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: SITE_INFO.title,
	description: SITE_INFO.description,
	openGraph: {
		title: SITE_INFO.title,
		description: SITE_INFO.description,
		url: SITE_URL,
		siteName: SITE_INFO.title,
		locale: "en_US",
		type: "website",
		images: [
			{
				url: SITE_INFO.openGraphImage,
				width: 1200,
				height: 630,
				alt: "Dreamy Wordmark",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_INFO.title,
		description: SITE_INFO.description,
		creator: "@dreamyapp",
		images: [SITE_INFO.twitterImage],
	},
	pinterest: {
		richPin: false,
	},
	robots: {
		index: true,
		follow: true,
	},
	icons: {
		icon: [
			{ url: "/logos/dreamy/symbol.svg", type: "image/svg+xml" },
		],
		apple: [
			{ url: "/logos/dreamy/symbol.svg", type: "image/svg+xml" },
		],
		shortcut: ["/logos/dreamy/symbol.svg"],
	},
	appleWebApp: {
		capable: true,
		title: SITE_INFO.title,
	},
	manifest: "/manifest.json",
	other: {
		"msapplication-config": "/browserconfig.xml",
	},
};
