"use client";

import Cake from "../../components/Cake";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <>
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
      <Cake />
    </>
  );
}
