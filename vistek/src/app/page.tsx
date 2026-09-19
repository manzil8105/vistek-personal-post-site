import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import SearchFilter from "@/components/SearchFilter";
import Pagination from "@/components/Pagination";
import CopyLinkButton from "@/components/CopyLinkButton";
import Footer from "@/components/Footer";

export default async function PublicFeed({
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
  const POSTS_PER_PAGE = 5;

  const livePosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isDraft, false));

  const postsWithTags = await Promise.all(
    livePosts.map(async (post) => {
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
    <main className="min-h-screen flex flex-col bg-black bg-gradient-to-b from-[#05010f] to-[#1a0b2e] font-mono text-white selection:bg-[#ff00aa] selection:text-white">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 border-b-2 border-[#00f3ff] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-5xl font-bold text-[#00f3ff] uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                MANZIL
              </h1>
              <p className="text-[#ff00aa] mt-2 uppercase tracking-widest text-sm font-bold">
                // Public_Transmission_Log
              </p>
            </div>

            {/* EXTERNAL GATEWAY LINKS */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://your-portfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00f3ff] border border-[#00f3ff]/50 px-3 py-1.5 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest font-bold"
              >
                [PORTFOLIO]
              </a>
              <a
                href="https://instagram.com/manzil_mahim/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00f3ff] border border-[#00f3ff]/50 px-3 py-1.5 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest font-bold"
              >
                [INSTAGRAM]
              </a>
              <a
                href="https://github.com/manzil8105"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00f3ff] border border-[#00f3ff]/50 px-3 py-1.5 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest font-bold"
              >
                [GITHUB]
              </a>
              <a
                href="https://shorturl.at/ODkPC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00f3ff] border border-[#00f3ff]/50 px-3 py-1.5 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest font-bold"
              >
                [LINKTREE]
              </a>
            </div>
          </header>

          <SearchFilter allTags={uniqueTags} />

          <div className="flex flex-col gap-8">
            {paginatedPosts.length === 0 ? (
              <div className="border border-[#ff00aa]/30 p-8 text-center bg-[#1a0b2e]/50">
                <p className="text-[#ff00aa] animate-pulse uppercase tracking-widest font-bold">
                  No active transmissions match query...
                </p>
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="border border-[#00f3ff]/30 bg-black/50 p-6 hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all group relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] to-[#ff00aa] opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                  {post.thumbnailUrl && (
                    <div className="w-full h-48 mb-4 border border-[#00f3ff]/30 overflow-hidden relative">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest text-black bg-[#ff00aa] px-2 py-0.5 font-bold z-10 relative"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/${post.slug}`} className="z-10 relative">
                    <h2 className="text-2xl font-bold text-[#00f3ff] uppercase tracking-wide group-hover:text-white transition-colors mb-2">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#00f3ff]/10 z-10 relative">
                    <p className="text-[#00f3ff]/50 text-xs uppercase tracking-widest">
                      LOGGED:{" "}
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "UNKNOWN"}
                    </p>
                    <CopyLinkButton slug={post.slug} />
                  </div>
                </article>
              ))
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>

      {/* pro footer */}
      <Footer />
    </main>
  );
}
