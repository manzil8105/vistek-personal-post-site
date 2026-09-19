"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchFilter({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // NEW

  const currentQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "desc"; // default newest first
  const currentTags = searchParams.get("tag")?.split(",").filter(Boolean) || [];
  const excludedTags =
    searchParams.get("exclude")?.split(",").filter(Boolean) || [];

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // Reset page on filter change
    router.replace(`${pathname}?${params.toString()}`);
  };

  // cycles through: not selected > included > excluded > not selected
  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    let newIncluded = [...currentTags];
    let newExcluded = [...excludedTags];

    if (newIncluded.includes(tag)) {
      // move from included to excluded
      newIncluded = newIncluded.filter((t) => t !== tag);
      newExcluded.push(tag);
    } else if (newExcluded.includes(tag)) {
      // move from excluded back to Off
      newExcluded = newExcluded.filter((t) => t !== tag);
    } else {
      // move from Off to included
      newIncluded.push(tag);
    }

    if (newIncluded.length > 0) params.set("tag", newIncluded.join(","));
    else params.delete("tag");

    if (newExcluded.length > 0) params.set("exclude", newExcluded.join(","));
    else params.delete("exclude");

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-10 border border-[#00f3ff]/30 bg-black/50 p-4 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="SEARCH_DATABANKS..."
          defaultValue={currentQ}
          onChange={(e) => updateUrl("q", e.target.value)}
          className="flex-1 bg-black border border-[#ff00aa]/50 focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] px-4 py-3 text-[#00f3ff] outline-none placeholder-[#00f3ff]/30 uppercase tracking-widest font-mono text-sm transition-all"
        />

        <select
          value={currentSort}
          onChange={(e) => updateUrl("sort", e.target.value)}
          className="bg-black border border-[#ff00aa]/50 focus:border-[#00f3ff] px-4 py-3 text-[#ff00aa] outline-none uppercase tracking-widest font-mono text-sm cursor-pointer"
        >
          <option value="desc">SORT: NEWEST</option>
          <option value="asc">SORT: OLDEST</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isIncluded = currentTags.includes(tag);
          const isExcluded = excludedTags.includes(tag);

          let btnStyle =
            "bg-black text-[#00f3ff] border-[#00f3ff]/30 hover:border-[#00f3ff]";
          if (isIncluded)
            btnStyle =
              "bg-[#ff00aa] text-black border-[#ff00aa] shadow-[0_0_10px_rgba(255,0,170,0.6)] font-bold";
          if (isExcluded)
            btnStyle =
              "bg-red-600/20 text-red-500 border-red-600 line-through font-bold";

          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-all cursor-pointer ${btnStyle}`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
