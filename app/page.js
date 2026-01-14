"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cormorant_Garamond } from "next/font/google";
import Header from "../components/header";
import Footer from "@/components/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function computeElapsed(fromDate, toDate = new Date()) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();
  let hours = toDate.getHours() - fromDate.getHours();
  let minutes = toDate.getMinutes() - fromDate.getMinutes();
  let seconds = toDate.getSeconds() - fromDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    months -= 1;
    let borrowMonth = toDate.getMonth() - 1;
    let borrowYear = toDate.getFullYear();
    if (borrowMonth < 0) {
      borrowMonth = 11;
      borrowYear -= 1;
    }
    days += getDaysInMonth(borrowYear, borrowMonth);
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

export default function Home() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // No-button playful interactions
  const [noClicks, setNoClicks] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState(0); // 0 none, 1 first msg, 2 second msg

  const handleNoClick = () => {
    setNoClicks((prev) => {
      const next = prev + 1;
      if (next <= 2) {
        setModalStage(next);
        setModalOpen(true);
      } else {
        setModalOpen(false);
      }
      return next;
    });
  };

  const yesScale = Math.min(1 + Math.max(0, noClicks - 2) * 0.08, 1.6);
  const noScale = Math.max(1 - Math.max(0, noClicks - 2) * 0.1, 0.6);

  useEffect(() => {
    const startDate = new Date(2023, 0, 15, 0, 0, 0);
    setElapsed(computeElapsed(startDate));
    const timer = setInterval(() => {
      setElapsed(computeElapsed(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Home */}
      <section
        id="home"
        className="relative min-h-screen flex items-start justify-center px-6 pt-20 md:pt-24"
      >
        <div className="grid-background z-0" />
        <div className="relative z-10 flex items-center gap-12 w-full max-w-screen-2xl">
          {/* LEFT: TEXT */}
          <div className="flex-1 relative">
            <h1
              className={`text-[clamp(4rem,8vw,8rem)] font-bold leading-[1.05] mb-6 ${cormorant.className}`}
              style={{ color: "#1f324f" }}
            >
              My
              <br />
              beatin&apos; <br />
              heart belongs <br />
              to you
            </h1>

            <p
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
            >
              Happy Anniversary, Mahal ko! <br />I love you always and forever
            </p>

            <p
              className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl"
              style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
            >
              Advance Happy birthday, baby 💗
            </p>

            <hr className="my-8 border-t-2 border-[#1f324f]/20 w-full max-w-3xl mx-auto" />
          </div>

          {/* RIGHT: IMAGE */}
          <div className="flex-1 flex justify-end relative">
            <Image
              src="/Mailo.jpg"
              alt="Mailo Picture"
              width={900}
              height={1200}
              priority
              className="w-full max-w-[1000px] md:max-w-[1100px] h-auto rounded-2xl shadow-lg object-cover"
              sizes="(min-width: 1280px) 60vw, (min-width: 768px) 55vw, 95vw"
            />

            {/* Heart overlay element over the photo */}
            <Image
              src="/Heart-Element.png"
              alt="Heart element"
              width={200}
              height={200}
              className="absolute bottom-6 -left-8 md:bottom-1 md:-left-14 w-36 md:w-48 h-auto select-none pointer-events-none z-20"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mailo*/}

      <section
        id="mailo"
        className="relative min-h-screen flex items-start justify-center px-6 pt-12 pb-20 overflow-hidden bg-white"
      >
        {/* Blurred background layer */}
        <div className="absolute inset-0 -z-10 backdrop-blur-2xl bg-white/50" />

        {/* Blur circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#183252] rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#183252] rounded-full opacity-30 blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl">
          <div className="text-center">
            <h2
              className={`mb-6 text-[clamp(2.25rem,4vw,3rem)] font-bold ${cormorant.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}
              style={{ color: "#1f324f" }}
            >
              Who is MaiLo?
            </h2>
            <p
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
            >
              MaiLo began with a simple “congratulations” and turned into a
              lifetime of choosing each other. It’s love, friendship, patience,
              and growth wrapped into one name.
            </p>
          </div>

          {/* Image grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative h-[420px] w-full">
                <Image
                  src={`/MaiLo-${num}.jpg`}
                  alt={`MaiLo memory ${num}`}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Days*/}
      <section
        id="days"
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center">
          <h2
            className={`mb-10 text-[clamp(3rem,6vw,6rem)] font-bold ${cormorant.className}`}
            style={{ color: "#1f324f" }}
          >
            We&apos;ve been together for
          </h2>

          <div className="inline-grid mx-auto place-items-center grid-cols-2 sm:grid-cols-6 gap-10 md:gap-12">
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.years}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                years
              </p>
            </div>
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.months}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                months
              </p>
            </div>
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.days}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                days
              </p>
            </div>
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.hours}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                hours
              </p>
            </div>
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.minutes}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                minutes
              </p>
            </div>
            <div>
              <div
                className="font-bold mb-2 leading-none tracking-tight text-[clamp(4rem,10vw,14rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                {elapsed.seconds}
              </div>
              <p
                className="text-[clamp(1rem,3vw,2.5rem)]"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                seconds
              </p>
            </div>
          </div>
          <p
            className="text-[clamp(1rem,2.5vw,2rem)] mt-8"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
          >
            Since January 15, 2023
          </p>
        </div>
      </section>

      {/* surprise*/}
      <section
        id="surprise"
        className="relative min-h-screen flex items-center justify-center px-6 py-20 md:py-28 bg-white"
        style={{
          backgroundImage: "url('/Bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      >
        <div className="text-center w-full max-w-6xl">
          <h2
            className="mb-10 font-bold text-[clamp(3rem,6vw,5rem)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
          >
            Hi Jann Paulo Joaquin!
          </h2>
          <p
            className="text-[clamp(2.25rem,6vw,4rem)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
          >
            do you want to see a little surprise for you?
          </p>

          <div className="mt-8 flex justify-center">
            <Image
              src="/Cake.png"
              alt="Cake"
              width={250}
              height={250}
              className="select-none pointer-events-none"
              priority
            />
          </div>

          <div className="mt-12 md:mt-16 flex justify-center items-center gap-12 md:gap-20">
            <div className="relative flex items-center">
              <Button
                variant="link"
                className="px-0 font-normal text-[clamp(2rem,4vw,3rem)] text-[#1f324f] hover:no-underline transition-transform duration-300"
                style={{
                  fontFamily: "'Myfont'",
                  transform: `scale(${yesScale})`,
                }}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("mailo:play-audio"));
                  }
                  router.push("/yes");
                }}
              >
                Yes
              </Button>
            </div>
            <div className="relative flex items-center">
              <Button
                variant="link"
                className="px-0 font-normal text-[clamp(2rem,4vw,3rem)] text-[#1f324f] hover:no-underline transition-transform duration-300"
                style={{
                  fontFamily: "'Myfont'",
                  transform: `scale(${noScale})`,
                }}
                onClick={handleNoClick}
              >
                No
              </Button>
            </div>
          </div>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white border border-[#1f324f] rounded-xl px-6 py-6 max-w-md w-[92%] text-center shadow-xl">
                <p
                  className="mb-6 text-[clamp(1.25rem,3.5vw,2rem)]"
                  style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
                >
                  {modalStage === 1
                    ? "OOPS Error! Try Again"
                    : "Are you sure about that? Give me a chance"}
                </p>
                <Button
                  className="mx-auto px-6 py-2 bg-[#1f324f] text-white"
                  onClick={() => setModalOpen(false)}
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
