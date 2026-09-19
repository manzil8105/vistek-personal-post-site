"use client";

export default function DeletePostButton({
  className,
}: {
  className?: string;
}) {
  const defaultStyle =
    "text-xs text-red-500 border border-red-500/50 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest cursor-pointer";

  return (
    <button
      type="submit"
      className={className || defaultStyle}
      onClick={(e) => {
        if (
          !confirm(
            "CRITICAL WARNING: Erase this post and all its data permanently?",
          )
        )
          e.preventDefault();
      }}
    >
      [DELETE]
    </button>
  );
}
