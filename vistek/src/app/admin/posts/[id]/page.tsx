import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePost, deletePost } from "@/app/actions/posts";
import DeletePostButton from "@/components/DeletePostButton";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));

  if (!post) {
    notFound();
  }

  const attachedTags = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));

  const tagString = attachedTags.map((t) => t.name).join(", ");

  return (
    <div className="flex flex-col h-full text-white font-mono">
      <div className="mb-6 border-b border-[#00f3ff]/30 pb-4 flex justify-between items-center">
        <h2 className="text-xl text-[#00f3ff] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
          Data_Core // Edit_Record
        </h2>
        <Link
          href="/admin/posts"
          className="text-[#ff00aa] hover:text-[#00f3ff] transition-colors text-sm uppercase tracking-widest"
        >
          [Abort_Edit]
        </Link>
      </div>

      <form
        action={updatePost}
        className="flex flex-col gap-6 max-w-3xl relative z-10"
      >
        <input type="hidden" name="id" value={post.id} />

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-grow">
            <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
              Title_
            </label>
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              required
              className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-2 w-48">
            <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
              Status_
            </label>
            <select
              name="isDraft"
              defaultValue={post.isDraft ? "true" : "false"}
              className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] outline-none text-[#00f3ff] w-full appearance-none cursor-pointer"
            >
              <option value="true">DRAFT</option>
              <option value="false">LIVE</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            URL_Slug_
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={post.slug}
            required
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        {/* thumbnail input injected here */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Thumbnail_URL_ (Optional)
          </label>
          <input
            type="url"
            name="thumbnailUrl"
            defaultValue={post.thumbnailUrl || ""}
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
            defaultValue={tagString}
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#ff00aa] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">
            Content_
          </label>
          <textarea
            name="contentHtml"
            defaultValue={post.contentHtml}
            required
            rows={12}
            className="px-3 py-2 bg-black border border-[#4a0d3a] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] outline-none text-[#00f3ff] transition-all w-full resize-y font-mono text-sm leading-relaxed"
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-4 px-8 py-3 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] font-bold hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest w-fit cursor-pointer self-end"
        >
          Execute_Override()
        </button>
      </form>

      {/* danger stuff */}
      <div className="mt-12 pt-6 border-t border-red-900/50 flex justify-between items-center max-w-3xl relative z-10">
        <span className="text-red-500/50 text-xs uppercase tracking-widest font-bold">
          // Danger_Zone: Irreversible_Action
        </span>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <DeletePostButton className="px-6 py-2 bg-transparent border-2 border-red-600 text-red-500 font-bold hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.8)] transition-all uppercase tracking-widest cursor-pointer" />
        </form>
      </div>
    </div>
  );
}
