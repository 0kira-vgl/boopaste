import { FloatingNav } from "@/components/floating-nav";
import { ScrollVideoBackground } from "@/components/scroll-video-background";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Terminals } from "@/components/sections/terminals";
import { OpenSource } from "@/components/sections/open-source";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <ScrollVideoBackground />
      <FloatingNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Problem />
        <HowItWorks />
        <Terminals />
        <OpenSource />
      </main>
      <SiteFooter />
    </div>
  );
}
