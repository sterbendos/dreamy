import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Showcase } from "@/components/landing/showcase";
import { CtaBanner } from "@/components/landing/cta-banner";
import { MarqueeStrip } from "@/components/landing/marquee-strip";
import { JourneyLine } from "@/components/landing/journey-line";
import { Scene } from "@/components/landing/scene";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { SITE_URL } from "@/site/brand";

export const metadata: Metadata = {
	alternates: {
		canonical: SITE_URL,
	},
};

export default async function Home() {
	return (
		<div>
			<Header />
			<main className="relative">
				<Hero />
				<MarqueeStrip />
				<JourneyLine>
					<Features />
					<HowItWorks />
				</JourneyLine>
				<Showcase />
				<CtaBanner />
			</main>
			<Footer />
		</div>
	);
}

