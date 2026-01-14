import { Caveat, Poppins, Cormorant_Garamond } from "next/font/google";
import AudioOnLoad from "../components/audio-on-load";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-sans",
});

export const metadata = {
  title: "Mailo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} ${cormorant.variable}`}>
        {/* Global audio initializer */}
        <AudioOnLoad />
        {children}
      </body>
    </html>
  );
}
