import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicPostReader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postSlug = resolvedParams.slug;

  // fetch the post by its unique URL slug
  const [post] = await db.select().from(posts).where(eq(posts.slug, postSlug));

  // security Check, if it doesn't exist / if it is still a draft,  a 404
  if (!post || post.isDraft) {
    notFound();
  }

  // fetch tags
  const attachedTags = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id));

  const tagList = attachedTags.map((t) => t.name);

  return (
    <main className="min-h-screen bg-black bg-gradient-to-b from-[#05010f] to-[#1a0b2e] p-8 font-mono text-white selection:bg-[#00f3ff] selection:text-black">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link
            href="/"
            className="text-[#ff00aa] hover:text-[#00f3ff] transition-colors text-sm uppercase tracking-widest font-bold border border-[#ff00aa] hover:border-[#00f3ff] px-4 py-2 bg-black"
          >
            {"<- RETURN_TO_NODE"}
          </Link>
        </div>

        <article className="bg-[#05010f]/90 border border-[#00f3ff]/50 shadow-[0_0_20px_rgba(0,243,255,0.1)] p-8 md:p-12 relative">
          {/* Header block */}
          <header className="mb-10 border-b border-[#ff00aa]/30 pb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-widest text-[#00f3ff] border border-[#00f3ff]/50 px-2 py-1 bg-[#00f3ff]/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mb-4">
              {post.title}
            </h1>

            <p className="text-[#ff00aa] text-sm uppercase tracking-widest font-bold">
              TIMESTAMP:{" "}
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "UNKNOWN"}
            </p>
          </header>

          {/* HTML content injection */}
          <div
            className="prose prose-invert max-w-none break-words prose-p:text-gray-300 prose-headings:text-[#00f3ff] prose-headings:uppercase prose-headings:tracking-wider prose-a:text-[#ff00aa] prose-a:no-underline hover:prose-a:underline prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </div>
    </main>
  );
}
