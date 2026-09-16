"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilter({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";

  // parse the comma separated URL string into an array of tags
  const currentTags = searchParams.get("tag")?.split(",").filter(Boolean) || [];

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`/?${params.toString()}`);
  };

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    let newTags = [...currentTags];

    // if the tag is already active, remove. otherwise, add.
    if (newTags.includes(tag)) {
      newTags = newTags.filter((t) => t !== tag);
    } else {
      newTags.push(tag);
    }

    // update the URL with the new comma separated list, or delete the parameter if empty
    if (newTags.length > 0) {
      params.set("tag", newTags.join(","));
    } else {
      params.delete("tag");
    }

    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="mb-10 border border-[#00f3ff]/30 bg-black/50 p-4 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="SEARCH_DATABANKS..."
          defaultValue={currentQ}
          onChange={(e) => updateSearch(e.target.value)}
          className="w-full bg-black border border-[#ff00aa]/50 focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] px-4 py-3 text-[#00f3ff] outline-none placeholder-[#00f3ff]/30 uppercase tracking-widest font-mono text-sm transition-all"
        />

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = currentTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#ff00aa] text-black border-[#ff00aa] shadow-[0_0_10px_rgba(255,0,170,0.6)] font-bold"
                    : "bg-black text-[#ff00aa] border-[#ff00aa]/30 hover:border-[#00f3ff] hover:text-[#00f3ff]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
