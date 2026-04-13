import SmoothScroll from "@/components/SmoothScroll";
import LandingNavbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import LiveSection from "@/components/landing/LiveSection";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { LoginModalProvider } from "@/components/LoginModal";

export default function Home() {
  return (
    <LoginModalProvider>
      <SmoothScroll>
        <div className="relative">
          {/* Fixed car background for entire page */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{ backgroundImage: "url('https://images.ctfassets.net/gy95mqeyjg28/6I3I5uvbA2JMkc6DvaTsPi/462e97fe09fff5b6f13ab4ff4023cda0/MCL60_Stealth_Mode_Side-Wide.jpg')", filter: "brightness(0.75) saturate(1.3)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,16,32,0.55) 0%, rgba(10,16,32,0.3) 40%, rgba(10,16,32,0.45) 70%, rgba(10,16,32,0.65) 100%)" }} />
          </div>
          <div className="relative z-10">
            <LandingNavbar />
            <Hero />
            <Features />
            <LiveSection />
            <Testimonials />
            <CTA />
            <Footer />
          </div>
        </div>
      </SmoothScroll>
    </LoginModalProvider>
  );
}
