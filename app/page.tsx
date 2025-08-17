// app/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <FloatingNav />
      <HeroSection />
    </div>
  );
}
