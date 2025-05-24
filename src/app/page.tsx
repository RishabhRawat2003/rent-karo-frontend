
import { FAQ } from "@/components/Home/Faq";
import HeroSection from "@/components/Home/HeroSection";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { Newsletter } from "@/components/Home/Newsletter";
import { ProductFeatures } from "@/components/Home/ProductFeatures";
import { ProductShowcase } from "@/components/Home/ProductShowcase";
import { Testimonials } from "@/components/Home/Testimonials";


export default function Home() {
  return (
    <>
    <HeroSection />
    <ProductFeatures />
    <ProductShowcase />
    <Testimonials />
    <HowItWorks />
    <Newsletter />
    <FAQ />
    </>
  );
}
