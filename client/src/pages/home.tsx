import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import TrendingSection from "@/components/trending-section";
import SubscriptionPlans from "@/components/subscription-plans";
import ComparisonSection from "@/components/comparison-section";
import BenefitsSection from "@/components/benefits-section";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";
import SupportChat from "@/components/support-chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-primary">
      <Header />
      <main>
        <HeroSection />
        <TrendingSection />
        <SubscriptionPlans />
        <ComparisonSection />
        <BenefitsSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}
