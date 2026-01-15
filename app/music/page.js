"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MusicPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section
        className="relative flex items-center justify-center px-6 mt-16 md:mt-20 pt-6 md:pt-8 pb-20 bg-white min-h-[calc(100vh-4rem)]"
        style={{
          backgroundImage: "url('/Bg1.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute top-4 left-4 z-[100]">
          <Button
            variant="link"
            className="px-0 font-normal text-[clamp(1rem,2.5vw,1.5rem)] text-[#1f324f] hover:no-underline"
            aria-label="Go back"
            onClick={() => router.back()}
            style={{ fontFamily: "'Myfont'" }}
          >
            ← Back
          </Button>
        </div>

        <div className="text-center w-full max-w-5xl">
          <h2
            className="mb-6 font-bold text-[clamp(2rem,4.5vw,3.5rem)]"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
          >
            my music for u
          </h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-[#1f324f]/10">
            <iframe
              title="YouTube video player"
              src="https://www.youtube-nocookie.com/embed/LsAdis1cU_M?list=RDLsAdis1cU_M&rel=0"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
