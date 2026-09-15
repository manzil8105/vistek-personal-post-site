import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function ManagePosts() {
  // 1. fetch all posts from Supabase, newest first
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  // 2. Cross-reference the database to fetch the attached tags for each post
  const postsWithTags = await Promise.all(
    allPosts.map(async (post) => {
      const attachedTags = await db
        .select({ name: tags.name })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, post.id));

      return {
        ...post,
        tags: attachedTags.map((t) => t.name),
      };
    }),
  );

  return (
    <div className="flex flex-col h-full text-white font-mono">
      <div className="flex justify-between items-center mb-6 border-b border-[#00f3ff]/30 pb-4">
        <h2 className="text-xl text-[#00f3ff] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
          Data_Core // Posts
        </h2>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#1a0b2e] border border-[#ff00aa] text-[#ff00aa] hover:bg-[#ff00aa] hover:text-black hover:shadow-[0_0_15px_rgba(255,0,170,0.8)] transition-all uppercase tracking-widest text-sm"
        >
          + Initialize_New_Record
        </Link>
      </div>

      <div className="flex-grow overflow-auto relative z-10">
        {postsWithTags.length === 0 ? (
          <p className="text-[#00f3ff]/50 animate-pulse text-center mt-10 uppercase tracking-widest">
            No records found in the databanks...
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ff00aa]/50 text-[#ff00aa]">
                <th className="p-2 uppercase text-xs tracking-wider">Title</th>
                <th className="p-2 uppercase text-xs tracking-wider">Tags</th>
                <th className="p-2 uppercase text-xs tracking-wider">Status</th>
                <th className="p-2 uppercase text-xs tracking-wider">
                  Created
                </th>
                <th className="p-2 uppercase text-xs tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {postsWithTags.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[#00f3ff]/10 hover:bg-[#00f3ff]/5 transition-colors"
                >
                  {/* Clickable Title */}
                  <td className="p-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-[#00f3ff] font-bold hover:text-[#ff00aa] hover:underline transition-all"
                    >
                      {post.title}
                    </Link>
                  </td>

                  {/* Tags Column */}
                  <td className="p-2 text-xs text-[#b829ff]">
                    {post.tags.length > 0 ? post.tags.join(" // ") : "---"}
                  </td>

                  <td className="p-2 text-xs">
                    {post.isDraft ? (
                      <span className="text-yellow-500 border border-yellow-500/50 px-2 py-1 bg-yellow-500/10">
                        DRAFT
                      </span>
                    ) : (
                      <span className="text-green-500 border border-green-500/50 px-2 py-1 bg-green-500/10">
                        LIVE
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "UNKNOWN"}
                  </td>

                  {/* Edit Button */}
                  <td className="p-2 text-right">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-xs text-[#ff00aa] border border-[#ff00aa]/50 px-2 py-1 hover:bg-[#ff00aa] hover:text-black transition-colors uppercase tracking-widest"
                    >
                      [EDIT]
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
