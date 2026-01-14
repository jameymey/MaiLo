import Header from "@/components/header";
import Footer from "@/components/footer";
import PuzzleQuiz from "@/components/ui/puzzle-quiz";

export const metadata = {
  title: "Mailo • Puzzle Quiz",
};

export default function PuzzlePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PuzzleQuiz />
      <Footer />
    </div>
  );
}
