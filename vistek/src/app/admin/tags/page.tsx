import { db } from "@/db";
import { tags, postTags } from "@/db/schema";
import { asc, sql, ilike } from "drizzle-orm"; // Changed desc to asc, added ilike
import { createTag, deleteTag } from "@/app/actions/tags";
import DeleteTagButton from "@/components/DeleteTagButton";
import TagSearch from "@/components/TagSearch"; // NEW IMPORT

export default async function ManageTags({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";

  // fetch tags alphabetically, apply search filter if typing
  const allTags = await db
    .select()
    .from(tags)
    .where(searchQuery ? ilike(tags.name, `%${searchQuery}%`) : undefined)
    .orderBy(asc(tags.name));

  // count active uses
  const tagCounts = await db
    .select({
      tagId: postTags.tagId,
      count: sql<number>`count(${postTags.postId})`,
    })
    .from(postTags)
    .groupBy(postTags.tagId);

  const countMap = new Map(tagCounts.map((tc) => [tc.tagId, Number(tc.count)]));

  return (
    <div className="flex flex-col h-full text-white font-mono">
      <div className="flex justify-between items-center mb-6 border-b border-[#00f3ff]/30 pb-4">
        <h2 className="text-xl text-[#00f3ff] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
          Data_Core // Tags
        </h2>
      </div>

      {/* add tag form */}
      <form
        action={createTag}
        className="mb-6 flex gap-4 p-4 border border-[#ff00aa]/30 bg-black/50 shadow-[0_0_15px_rgba(255,0,170,0.05)]"
      >
        <input
          type="text"
          name="name"
          placeholder="NEW_TAG_NAME..."
          required
          className="flex-1 bg-black border border-[#4a0d3a] focus:border-[#ff00aa] focus:shadow-[0_0_10px_rgba(255,0,170,0.4)] px-4 py-2 text-[#ff00aa] outline-none placeholder-[#ff00aa]/30 uppercase tracking-widest text-sm transition-all"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] font-bold hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.8)] transition-all uppercase tracking-widest cursor-pointer"
        >
          [ADD_TAG]
        </button>
      </form>

      {/* injected search bar */}
      <div className="mb-4">
        <TagSearch />
      </div>

      {/* forced scroll container, max-h-[500px] ensures it scrolls internally */}
      <div className="flex-grow overflow-auto relative z-10 max-h-[500px] border border-[#00f3ff]/20 bg-black/40 p-2">
        {allTags.length === 0 ? (
          <p className="text-[#00f3ff]/50 animate-pulse text-center mt-10 uppercase tracking-widest">
            No tags match search query...
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-black z-20">
              <tr className="border-b border-[#ff00aa]/50 text-[#ff00aa]">
                <th className="p-2 uppercase text-xs tracking-wider bg-black">
                  Name
                </th>
                <th className="p-2 uppercase text-xs tracking-wider bg-black">
                  Slug
                </th>
                <th className="p-2 uppercase text-xs tracking-wider text-center bg-black">
                  Active Uses
                </th>
                <th className="p-2 uppercase text-xs tracking-wider bg-black">
                  Created
                </th>
                <th className="p-2 uppercase text-xs tracking-wider text-right bg-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allTags.map((tag) => (
                <tr
                  key={tag.id}
                  className="border-b border-[#00f3ff]/10 hover:bg-[#00f3ff]/5 transition-colors"
                >
                  <td className="p-2 text-[#00f3ff] font-bold uppercase">
                    {tag.name}
                  </td>
                  <td className="p-2 text-xs text-[#00f3ff]/50">{tag.slug}</td>
                  <td className="p-2 text-center text-xs text-[#ff00aa] font-bold">
                    {countMap.get(tag.id) || 0}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {tag.createdAt
                      ? new Date(tag.createdAt).toLocaleDateString()
                      : "UNKNOWN"}
                  </td>
                  <td className="p-2 text-right">
                    <form action={deleteTag}>
                      <input type="hidden" name="id" value={tag.id} />
                      <DeleteTagButton />
                    </form>
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
