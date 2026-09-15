import { loginAdmin } from "../actions/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-[#1a0b2e] to-[#05010f] flex items-center justify-center p-4 font-mono">
      {/* Cyberpunk Terminal Container */}
      <div className="bg-[#05010f]/90 border border-[#ff00aa] shadow-[0_0_20px_rgba(255,0,170,0.4)] p-8 w-full max-w-sm relative overflow-hidden">
        {/* Top Cyan Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f3ff] to-[#ff00aa]"></div>

        <h1 className="text-[#00f3ff] text-2xl font-bold mb-8 tracking-widest uppercase text-center drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
          SYSTEM_LOGIN
        </h1>

        <form action={loginAdmin} className="flex flex-col gap-6 text-white">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-8 py-2 bg-transparent border-2 border-[#ff00aa] text-[#ff00aa] font-bold hover:bg-[#ff00aa] hover:text-black hover:shadow-[0_0_15px_rgba(255,0,170,0.8)] transition-all uppercase tracking-widest cursor-pointer"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
