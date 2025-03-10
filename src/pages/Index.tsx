
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import FAQSection from '@/components/home/FAQSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ShowcaseSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
