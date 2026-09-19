import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyLinkButton from "@/components/CopyLinkButton";
import Footer from "@/components/Footer";

export default async function PublicPostReader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postSlug = resolvedParams.slug;

  const [post] = await db.select().from(posts).where(eq(posts.slug, postSlug));

  if (!post || post.isDraft) {
    notFound();
  }

  const attachedTags = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id));

  const tagList = attachedTags.map((t) => t.name);

  return (
    <main className="min-h-screen flex flex-col bg-black bg-gradient-to-b from-[#05010f] to-[#1a0b2e] font-mono text-white selection:bg-[#00f3ff] selection:text-black">
      <div className="flex-grow p-8">
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

              <div className="flex flex-wrap items-center gap-4 text-[#ff00aa] text-sm uppercase tracking-widest font-bold mt-4">
                <span>
                  TIMESTAMP:{" "}
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "UNKNOWN"}
                </span>
                <span>// {post.readTimeMinutes || 1} MIN READ</span>
                <CopyLinkButton slug={post.slug} />
              </div>
            </header>

            <div className="mt-12 text-[#00f3ff] font-mono leading-relaxed max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-4xl text-[#ff00aa] font-bold mt-10 mb-6 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,0,170,0.6)]"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl text-[#ff00aa] font-bold mt-8 mb-4 uppercase tracking-widest"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl text-[#00f3ff] font-bold mt-6 mb-3 uppercase tracking-widest"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-6 text-gray-300 text-lg" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-6 text-gray-300 marker:text-[#ff00aa]"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-6 text-gray-300 marker:text-[#ff00aa]"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-2" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-bold" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#ff00aa] hover:text-[#00f3ff] underline transition-colors"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-[#ff00aa] pl-4 my-6 italic bg-[#ff00aa]/10 py-2 text-gray-300"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="w-full h-auto border border-[#00f3ff]/50 shadow-[0_0_15px_rgba(0,243,255,0.2)] my-8 block"
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <div className="border border-[#00f3ff]/30 bg-black/80 my-6 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                      <div className="bg-[#00f3ff]/10 px-4 py-1 border-b border-[#00f3ff]/30 text-xs text-[#00f3ff]/50 uppercase tracking-widest">
                        // CODE_BLOCK
                      </div>
                      <pre
                        className="p-4 overflow-x-auto text-sm text-[#00f3ff] [&>code]:bg-transparent [&>code]:text-inherit [&>code]:p-0 [&>code]:font-normal"
                        {...props}
                      />
                    </div>
                  ),
                  code: ({ node, className, children, ...props }: any) => (
                    <code
                      className="bg-[#ff00aa]/20 text-[#ff00aa] px-1.5 py-0.5 rounded text-sm font-bold"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {post.contentHtml}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>

      {/* pro footer */}
      <Footer />
    </main>
  );
}
