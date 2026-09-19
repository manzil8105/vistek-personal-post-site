"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function TagSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentQ = searchParams.get("q") || "";

  const updateUrl = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set("q", val);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input
      type="text"
      placeholder="SEARCH_EXISTING_TAGS..."
      defaultValue={currentQ}
      onChange={(e) => updateUrl(e.target.value)}
      className="w-full bg-black border border-[#00f3ff]/50 focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] px-4 py-2 text-[#00f3ff] outline-none placeholder-[#00f3ff]/30 uppercase tracking-widest text-sm transition-all"
    />
  );
}
