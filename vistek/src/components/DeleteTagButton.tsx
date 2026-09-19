"use client";

export default function DeleteTagButton() {
  return (
    <button
      type="submit"
      className="text-xs text-red-500 border border-red-500/50 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
      onClick={(e) => {
        if (!confirm("WARNING: Erase this tag from all connected posts?"))
          e.preventDefault();
      }}
    >
      [DELETE]
    </button>
  );
}
