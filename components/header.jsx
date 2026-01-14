"use client";

import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const Header = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 border-b bg-white font-bold ${cormorant.className}`}>
            <div className="container mx-auto h-16 px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Image src="/Logo.png" alt="Logo" width={200} height={60} className="h-10 w-auto object-contain" />
                </div>
                <nav className="flex items-center gap-6 text-xl font-bold">
                    <button onClick={() => scrollToSection("home")} className="cursor-pointer hover:text-blue-600" style={{ color: "#1f324f" }}>Home</button>
                    <button onClick={() => scrollToSection("mailo")} className="cursor-pointer hover:text-blue-600" style={{ color: "#1f324f" }}>MaiLo</button>
                    <button onClick={() => scrollToSection("days")} className="cursor-pointer hover:text-blue-600" style={{ color: "#1f324f" }}>Days</button>
                    <button onClick={() => scrollToSection("surprise")} className="cursor-pointer hover:text-blue-600" style={{ color: "#1f324f" }}>Surprise</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;

