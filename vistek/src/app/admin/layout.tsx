import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-[#1a0b2e] to-[#05010f] p-8 font-mono text-white">
      <div className="bg-[#05010f]/90 border border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)] p-1 max-w-6xl mx-auto relative">
        {/* cyberpunk type top status bar */}
        <div className="bg-[#00f3ff] text-black px-4 py-2 flex justify-between items-center font-bold tracking-widest uppercase">
          <span>MANZIL // OVERSEER_NODE</span>
          <span className="animate-pulse">STATUS: ONLINE</span>
        </div>

        <div className="p-8 min-h-[70vh]">
          <h1 className="text-3xl font-bold mb-8 border-b border-[#ff00aa]/50 pb-4 text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_8px_rgba(255,0,170,0.6)]">
            Network_Dashboard
          </h1>

          <div className="grid grid-cols-4 gap-8">
            {/* sidebar navigation */}
            <div className="col-span-1 flex flex-col gap-3">
              <div className="text-xs text-[#00f3ff] mb-2 uppercase tracking-widest border-b border-[#00f3ff]/30 pb-2">
                Command Modules
              </div>

              <Link
                href="/admin/posts"
                className="block text-left px-4 py-3 bg-[#1a0b2e]/50 border border-[#4a0d3a] text-[#ff00aa] hover:bg-[#ff00aa]/10 hover:border-[#ff00aa] hover:shadow-[0_0_15px_rgba(255,0,170,0.5)] transition-all cursor-pointer"
              >
                [+] Manage_Posts
              </Link>
              <Link
                href="/admin/tags"
                className="block text-left px-4 py-3 bg-[#1a0b2e]/50 border border-[#4a0d3a] text-[#ff00aa] hover:bg-[#ff00aa]/10 hover:border-[#ff00aa] hover:shadow-[0_0_15px_rgba(255,0,170,0.5)] transition-all cursor-pointer"
              >
                [#] Manage_Tags
              </Link>
              <Link
                href="/admin"
                className="block text-left px-4 py-3 bg-[#1a0b2e]/50 border border-[#4a0d3a] text-[#ff00aa] hover:bg-[#ff00aa]/10 hover:border-[#ff00aa] hover:shadow-[0_0_15px_rgba(255,0,170,0.5)] transition-all cursor-pointer"
              >
                [*] dash_
              </Link>

              <div className="mt-8">
                <button className="w-full text-left px-4 py-3 border border-red-600 text-red-500 hover:bg-red-900/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all uppercase tracking-widest cursor-pointer">
                  ?????
                </button>
              </div>
            </div>

            {/* main workspace */}
            <div className="col-span-3 bg-black border border-[#00f3ff]/30 p-6 relative overflow-hidden flex flex-col min-h-[500px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f3ff10_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff10_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

              <div className="relative z-10 w-full h-full flex-grow flex flex-col">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
