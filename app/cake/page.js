import dynamic from "next/dynamic";

const Cake = dynamic(() => import("../../components/Cake"), { ssr: false });

export const metadata = {
  title: "Anniversary Cake 🎂",
};

export default function Page() {
  return <Cake />;
}
