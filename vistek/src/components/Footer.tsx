import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#00f3ff]/30 bg-[#05010f] py-12 font-mono text-white relative overflow-hidden mt-10">
      {/* subtle cyberpunk scanline background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 relative z-10">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[#00f3ff] text-2xl font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
            MANZIL
          </span>
          <span className="text-[#ff00aa] text-xs uppercase tracking-widest mt-1 font-bold">
            // End_Of_Transmission
          </span>
        </div>

        {/* Navigation / External Links */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span className="text-[#00f3ff]/50 text-xs uppercase tracking-widest mb-1 border-b border-[#00f3ff]/20 pb-1">
            System_Links
          </span>
          <div className="flex gap-6 text-sm uppercase tracking-widest text-gray-300 font-bold">
            <a
              href="https://instagram.com/manzil_mahim/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff00aa] hover:drop-shadow-[0_0_5px_rgba(255,0,170,0.8)] transition-all"
            >
              INSTAGRAM
            </a>
            <a
              href="https://github.com/manzil8105"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff00aa] hover:drop-shadow-[0_0_5px_rgba(255,0,170,0.8)] transition-all"
            >
              GitHub
            </a>
            <a
              href="https://shorturl.at/ODkPC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff00aa] hover:drop-shadow-[0_0_5px_rgba(255,0,170,0.8)] transition-all"
            >
              Linktree
            </a>
          </div>
        </div>

        {/* Copyright & Status */}
        <div className="flex flex-col items-center md:items-end text-right gap-1">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest">
            © {currentYear} Manzil Ahsan. All rights reserved.
          </span>
          <span className="text-[#00f3ff]/40 text-[10px] uppercase tracking-widest flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse border border-green-300"></span>
            SYSTEM_VERSION 1.0.0 // ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}
