"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PuzzleQuiz from "@/components/ui/puzzle-quiz";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PuzzlePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 left-4 z-[100]">
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
      <Header />
      <PuzzleQuiz />
      <Footer />
    </div>
  );
}
