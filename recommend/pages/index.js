import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <header>Recommend</header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       <a
          href="/login"
          className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#005bb5] transition-colors"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#005bb5] transition-colors"
        >
          Register
        </a>
        <a
          href="/dashboard"
          className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#005bb5] transition-colors">
          Dashboard
        </a>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
