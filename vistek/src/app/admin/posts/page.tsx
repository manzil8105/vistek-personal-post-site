import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import SearchFilter from "@/components/SearchFilter";
import Pagination from "@/components/Pagination";
import { deletePost } from "@/app/actions/posts";
import DeletePostButton from "@/components/DeletePostButton";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function ManagePosts({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    page?: string;
    sort?: string;
    exclude?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  const tagQuery = resolvedParams.tag || "";
  const sortQuery = resolvedParams.sort || "desc";
  const excludeQuery = resolvedParams.exclude || "";

  const currentPage = Number(resolvedParams.page) || 1;
  const POSTS_PER_PAGE = 10;

  const allPosts = await db.select().from(posts);

  const postsWithTags = await Promise.all(
    allPosts.map(async (post) => {
      const attachedTags = await db
        .select({ name: tags.name })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, post.id));

      return { ...post, tags: attachedTags.map((t) => t.name) };
    }),
  );

  const uniqueTags = Array.from(
    new Set(postsWithTags.flatMap((p) => p.tags)),
  ).sort();
  const activeTags = tagQuery.split(",").filter(Boolean);
  const excludedTags = excludeQuery.split(",").filter(Boolean);

  let filteredPosts = postsWithTags.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.contentHtml.toLowerCase().includes(searchQuery);

    const matchesTags =
      activeTags.length === 0 || activeTags.every((t) => post.tags.includes(t));
    const hasNoExcludedTags =
      excludedTags.length === 0 ||
      !excludedTags.some((t) => post.tags.includes(t));

    return matchesSearch && matchesTags && hasNoExcludedTags;
  });

  filteredPosts = filteredPosts.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (sortQuery === "asc") return dateA - dateB;
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

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

      <SearchFilter allTags={uniqueTags} />

      <div className="flex-grow overflow-auto relative z-10">
        {paginatedPosts.length === 0 ? (
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
              {paginatedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[#00f3ff]/10 hover:bg-[#00f3ff]/5 transition-colors"
                >
                  <td className="p-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-[#00f3ff] font-bold hover:text-[#ff00aa] hover:underline transition-all"
                    >
                      {post.title}
                    </Link>
                  </td>
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
                  <td className="p-2">
                    {/* INJECTED COPY BUTTON INTO ACTION FLEX CONTAINER */}
                    <div className="flex justify-end gap-2 items-center">
                      <CopyLinkButton slug={post.slug} />
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-xs text-[#ff00aa] border border-[#ff00aa]/50 px-2 py-1 hover:bg-[#ff00aa] hover:text-black transition-colors uppercase tracking-widest"
                      >
                        [EDIT]
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <DeletePostButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
