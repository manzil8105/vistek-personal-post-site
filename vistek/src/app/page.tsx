import Link from "next/link";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import SearchFilter from "@/components/SearchFilter";

export default async function PublicFeed({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  // Safely await Next.js 16 parameters
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  const tagQuery = resolvedParams.tag || "";

  // fetch ONLY live posts
  const livePosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isDraft, false))
    .orderBy(desc(posts.createdAt));

  // attach tags
  const postsWithTags = await Promise.all(
    livePosts.map(async (post) => {
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

  // extract unique tags to populate filter buttons
  const uniqueTags = Array.from(
    new Set(postsWithTags.flatMap((p) => p.tags)),
  ).sort();

  // new parsing: turn the URL tag string into an array
  const activeTags = resolvedParams.tag?.split(",").filter(Boolean) || [];

  // apply URL filters to the data
  const filteredPosts = postsWithTags.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.contentHtml.toLowerCase().includes(searchQuery);

    // NEW LOGIC: The post must include EVERY active tag selected by the user
    const matchesTag =
      activeTags.length === 0 || activeTags.every((t) => post.tags.includes(t));

    return matchesSearch && matchesTag;
  });

  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-[#05010f] to-[#1a0b2e] p-8 font-mono text-white selection:bg-[#ff00aa] selection:text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b-2 border-[#00f3ff] pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold text-[#00f3ff] uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
              VISTEK_NET
            </h1>
            <p className="text-[#ff00aa] mt-2 uppercase tracking-widest text-sm font-bold">
              // Public_Transmission_Log
            </p>
          </div>
          <Link
            href="/login"
            className="text-xs text-[#00f3ff]/50 hover:text-[#00f3ff] uppercase tracking-widest transition-colors"
          >
            [SYS_ADMIN]
          </Link>
        </header>

        {/* Inject the Client Component and pass it the unique tags */}
        <SearchFilter allTags={uniqueTags} />

        <div className="flex flex-col gap-8">
          {filteredPosts.length === 0 ? (
            <div className="border border-[#ff00aa]/30 p-8 text-center bg-[#1a0b2e]/50">
              <p className="text-[#ff00aa] animate-pulse uppercase tracking-widest font-bold">
                No active transmissions match query...
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="border border-[#00f3ff]/30 bg-black/50 p-6 hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] to-[#ff00aa] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-widest text-black bg-[#ff00aa] px-2 py-0.5 font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-[#00f3ff] uppercase tracking-wide group-hover:text-white transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-[#00f3ff]/50 text-xs uppercase tracking-widest">
                  LOGGED:{" "}
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "UNKNOWN"}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
