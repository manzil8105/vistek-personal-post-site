import { createPost } from "@/app/actions/posts";
import Link from "next/link";

export default function NewPostForm() {
  return (
    <div className="flex flex-col h-full text-white font-mono">
      <div className="mb-6 border-b border-[#00f3ff]/30 pb-4 flex justify-between items-center">
        <h2 className="text-xl text-[#00f3ff] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
          Data_Core // Inject_Record
        </h2>
        <Link
          href="/admin/posts"
          className="text-[#ff00aa] hover:text-[#00f3ff] transition-colors text-sm uppercase tracking-widest"
        >
          [Abort_Injection]
        </Link>
      </div>

      <form
        action={createPost}
        className="flex flex-col gap-6 max-w-3xl relative z-10"
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Title_
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Enter post title..."
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            URL_Slug_ (e.g. my-first-post)
          </label>
          <input
            type="text"
            name="slug"
            required
            placeholder="my-cyberpunk-post"
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        {/* THUMBNAIL INPUT INJECTED HERE */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Thumbnail_URL_ (Optional)
          </label>
          <input
            type="url"
            name="thumbnailUrl"
            placeholder="https://i.imgur.com/..."
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Tags_ (Comma separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="cyberpunk, nextjs, devlog"
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Content
          </label>
          <textarea
            name="contentHtml"
            required
            rows={12}
            placeholder="Write your markdown content here..."
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full resize-y font-mono text-sm leading-relaxed"
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-4 px-8 py-3 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] font-bold hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest w-fit cursor-pointer self-end"
        >
          Execute_Write()
        </button>
      </form>
    </div>
  );
}
