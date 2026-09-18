import { fetchServer } from "@/lib/server-api";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import FinalCta from "@/components/landing/FinalCta";
import LandingFooter from "@/components/landing/LandingFooter";

export default async function Home() {
    const plansRes = await fetchServer("/api/subscription/plans");
    const plans = plansRes.body?.isSuccess ? plansRes.body.data ?? [] : [];

    return (
        <>
            <LandingNavbar />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing plans={plans} />
                <FinalCta />
            </main>
            <LandingFooter />
        </>
    );
}