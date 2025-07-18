import { FAQ } from "@/components/home/Faq";
import HeroSection from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductFeatures } from "@/components/home/ProductFeatures";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { Testimonials } from "@/components/home/Testimonials";


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
