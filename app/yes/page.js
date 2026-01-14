"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function YesPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* surprise */}
      <section
        id="surprise"
        className="relative flex items-center justify-center px-6 mt-16 md:mt-20 pt-6 md:pt-8 pb-20 bg-white min-h-[calc(100vh-4rem)]"
        style={{
          backgroundImage: "url('/Bg1.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      >
        {/* Back button */}
        <div className="absolute top-4 left-4">
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

        <div className="text-center w-full max-w-6xl">
          <h2
            className="mb-10 font-bold text-[clamp(3rem,6vw,5rem)]"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
          >
            THESE ARE FOR YOU
          </h2>

          {/* Image buttons */}
          <div className="mt-12 flex items-center justify-center gap-10">
            <a
              href="https://simplebooklet.com/three-years-with-you"
              aria-label="Open Camera surprise"
              className="inline-block hover:scale-105 transition-transform"
            >
              <Image
                src="/Camera.png"
                alt="Camera"
                width={150}
                height={150}
                className="select-none"
                priority
              />
            </a>

            <a
              href="/music"
              aria-label="Play Music surprise"
              className="inline-block hover:scale-105 transition-transform"
            >
              <Image
                src="/Music.png"
                alt="Music"
                width={150}
                height={150}
                className="select-none"
                priority
              />
            </a>

            <a
              href="/puzzle"
              aria-label="Open Puzzle Quiz"
              className="inline-block hover:scale-105 transition-transform"
            >
              <Image
                src="/Quiz.png"
                alt="Quiz"
                width={150}
                height={150}
                className="select-none"
                priority
              />
            </a>
            <a
              href="/letter"
              aria-label="Open Letter"
              className="inline-block hover:scale-105 transitio-transform"
            >
              <Image
                src="/Letter.png"
                alt="Letter"
                width={150}
                height={150}
                className="select-none"
                priority
              />
            </a>
            <a
              href="/cake"
              aria-label="Open Cake"
              className="inline-block hover:scale-105 transitio-transform"
            >
              <Image
                src="/Cake2.png"
                alt="Cake"
                width={150}
                height={150}
                className="select-none"
                priority
              />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
