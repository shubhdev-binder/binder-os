import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

import InventorySection from "@/components/InventorySection";
import OperationsSection from "@/components/OperationsSection";
import CooAgentSection from "@/components/CooAgentSection";
import HowItHelpsSection from "@/components/HowItHelpsSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import ComingSoonSection from "@/components/ComingSoonSection";
import WhyBinderSection from "@/components/WhyBinderSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import VerticalSpine from "@/components/VerticalSpine";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <VerticalSpine />
      <Navbar />
      <HeroSection />
      <InventorySection />
      <OperationsSection />
      <CooAgentSection />
      <HowItHelpsSection />
      <WhoItsForSection />
      <ComingSoonSection />
      <WhyBinderSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
