"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // NEW

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    // Changed from `/?${params.toString()}`
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Generate an array of numbers: [1, 2, 3, ...]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex justify-between items-center border-t border-[#00f3ff]/30 pt-6 font-mono">
      {/* left side prev button */}
      <div className="flex-1 flex justify-start">
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="text-[#ff00aa] hover:text-[#00f3ff] transition-colors text-sm uppercase tracking-widest border border-[#ff00aa] hover:border-[#00f3ff] px-4 py-2 bg-black"
          >
            {"<- PREV"}
          </Link>
        )}
      </div>

      {/* center page numbers */}
      <div className="flex gap-2 overflow-x-auto px-4">
        {pageNumbers.map((num) => {
          const isActive = num === currentPage;
          return (
            <Link
              key={num}
              href={createPageUrl(num)}
              className={`flex items-center justify-center min-w-[32px] h-8 text-xs font-bold border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#ff00aa] text-black border-[#ff00aa] shadow-[0_0_10px_rgba(255,0,170,0.6)]"
                  : "bg-black text-[#00f3ff] border-[#00f3ff]/50 hover:border-[#00f3ff] hover:shadow-[0_0_8px_rgba(0,243,255,0.4)]"
              }`}
            >
              {num}
            </Link>
          );
        })}
      </div>

      {/* right side next button */}
      <div className="flex-1 flex justify-end">
        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="text-[#ff00aa] hover:text-[#00f3ff] transition-colors text-sm uppercase tracking-widest border border-[#ff00aa] hover:border-[#00f3ff] px-4 py-2 bg-black"
          >
            {"NEXT ->"}
          </Link>
        )}
      </div>
    </div>
  );
}
