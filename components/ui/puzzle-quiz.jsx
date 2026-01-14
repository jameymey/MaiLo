"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const QUESTIONS = [
  {
    prompt: "When did we first start talking as a couple?",
    options: [
      "June 15, 2022",
      "June 20, 2022",
      "July 9, 2022",
      "January 15, 2023",
    ],
    answer: 0,
  },
  {
    prompt: "When was our first date?",
    options: [
      "June 20, 2022",
      "June 15, 2022",
      "July 9, 2022",
      "December 25, 2022",
    ],
    answer: 0,
  },
  {
    prompt: "How did we become friends?",
    options: [
      "Dahil sa ex ko?",
      "Basketball",
      "Psst... Alaska ka?",
      "PUP",
    ],
    answer: 2,
  },
  {
    prompt: "When was our first kiss?",
    options: [
      "July 9, 2022",
      "June 20, 2022",
      "August 1, 2022",
      "July 1, 2022",
    ],
    answer: 0,
  },
  {
    prompt: "What movie did we watch when we officially became boyfriend and girlfriend?",
    options: [
      "Avatar: The Way of Water",
      "Lightyear",
      "Orphan 2",
      "The Notebook",
    ],
    answer: 0,
  },
  {
    prompt: "What movie did we watch for the first time?",
    options: [
      "Lightyear",
      "Avatar: The Way of Water",
      "Orphan 2",
      "Barbie",
    ],
    answer: 0,
  },
  {
    prompt: "What was my first CoCo order?",
    options: [
      "Matcha Milk Tea",
      "Caramel Macchiato",
      "Wintermelon Milk Tea",
      "Taro Milk Tea",
    ],
    answer: 0,
  },
  {
    prompt: "Who was my first dog?",
    options: ["Jah Live", "Ricric", "JZ", "Tom"],
    answer: 0,
  },
];

export default function PuzzleQuiz() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const onNext = () => {
    if (selected === null) return;
    if (selected === QUESTIONS[step].answer) setScore((s) => s + 1);

    if (step + 1 < QUESTIONS.length) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const onRestart = () => {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-6">
      <div className="max-w-3xl w-full">
        <Card className="border-[#1f324f]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
              >
                MaiLo Puzzle Quiz
              </h2>
              <div className="text-sm" style={{ color: "#1f324f" }}>
                {finished ? "Done" : `Question ${step + 1} / ${QUESTIONS.length}`}
              </div>
            </div>

            {!finished ? (
              <div>
                <p
                  className="text-xl md:text-2xl mb-6"
                  style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
                >
                  {QUESTIONS[step].prompt}
                </p>

                <div className="grid gap-3">
                  {QUESTIONS[step].options.map((opt, idx) => (
                    <button
                      key={opt}
                      onClick={() => setSelected(idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        selected === idx
                          ? "bg-[#1f324f] text-white border-[#1f324f]"
                          : "bg-white text-[#1f324f] border-[#1f324f] hover:bg-[#1f324f]/5"
                      }`}
                      style={{ fontFamily: "'Myfont'" }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div style={{ color: "#1f324f" }}>
                    {selected === null ? "Select an answer" : "Ready when you are"}
                  </div>
                  <Button
                    className="bg-[#1f324f] text-white"
                    onClick={onNext}
                    disabled={selected === null}
                  >
                    {step + 1 < QUESTIONS.length ? "Next" : "Finish"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image
                  src="/Heart-Element.png"
                  alt="Heart"
                  width={140}
                  height={140}
                  className="mx-auto mb-4 select-none"
                />
                <p
                  className="text-2xl md:text-3xl mb-2"
                  style={{ color: "#1f324f", fontFamily: "'Myfont'" }}
                >
                  You scored {score} / {QUESTIONS.length}!
                </p>
                <p className="mb-6" style={{ color: "#1f324f" }}>
                  Thanks for playing — want to try again?
                </p>
                <div className="flex justify-center gap-3">
                  <Button className="bg-[#1f324f] text-white" onClick={onRestart}>
                    Restart
                  </Button>
                  <a href="/" className="px-4 py-2 border border-[#1f324f] rounded-lg" style={{ color: "#1f324f" }}>
                    Back Home
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
