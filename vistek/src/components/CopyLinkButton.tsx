"use client";

import { useState } from "react";

export default function CopyLinkButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // dynamically get the current domain
    const url = `${window.location.origin}/${slug}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const defaultStyle =
    "text-xs uppercase tracking-widest border px-2 py-1 transition-all font-bold cursor-pointer";
  const idleStyle =
    "text-[#00f3ff] border-[#00f3ff]/50 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_10px_rgba(0,243,255,0.8)]";
  const copiedStyle =
    "text-black bg-[#00f3ff] border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.8)]";

  return (
    <button
      onClick={handleCopy}
      className={`${defaultStyle} ${copied ? copiedStyle : idleStyle} ${className || ""}`}
      title="Copy link to clipboard"
    >
      {copied ? "[COPIED!]" : "[COPY_LINK]"}
    </button>
  );
}
