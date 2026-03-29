import { HeroSection } from "@/components/landing/HeroSection";
import { ThesisSection } from "@/components/landing/ThesisSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ApplySection } from "@/components/landing/ApplySection";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <HeroSection />
      <ThesisSection />
      <PortfolioSection />
      <ApplySection />
      <Footer />
    </main>
  );
}
