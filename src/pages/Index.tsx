import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PillarsSection from "@/components/landing/PillarsSection";
import GamesSection from "@/components/landing/GamesSection";
import LeaderboardPreview from "@/components/landing/LeaderboardPreview";
import BadgesSection from "@/components/landing/BadgesSection";
import WaitlistSection from "@/components/landing/WaitlistSection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <PillarsSection />
    <GamesSection />
    <LeaderboardPreview />
    <BadgesSection />
    <WaitlistSection />
    <Footer />
  </div>
);

export default Index;
