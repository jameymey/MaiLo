"use client";

export default function Footer() {
    return (
        <footer
            className="w-full flex justify-center items-center p-2 bg-white shadow text-sm text-[#1f324f]"
        >
            <div
            className="mb-2 font-semibold text-[clamp(1rem,2.5vw,1.5rem)]"
            style={{ color: "#1f324f", fontFamily: "'Myfont'" }}>
                <p>Made with love by Jam</p>
            </div>
        </footer>
    );
}
