"use server";

import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentHtml = formData.get("contentHtml") as string;
  const rawTags = formData.get("tags") as string;

  if (!title || !slug || !contentHtml) {
    throw new Error("Missing required fields");
  }

  // insert the post then GET the new unique ID back
  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      slug,
      contentHtml,
      isDraft: true,
    })
    .returning({ id: posts.id });

  // process the Tags (if the user typed any)
  if (rawTags) {
    // split by comma, remove extra spaces, ignore blanks
    const tagArray = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    for (const tagName of tagArray) {
      // auto generate a URL-safe slug for the tag
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // check if this tag is already in the database
      let existingTag = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, tagSlug))
        .then((res) => res[0]);

      // if it doesn't exist, make it
      if (!existingTag) {
        const [insertedTag] = await db
          .insert(tags)
          .values({
            name: tagName,
            slug: tagSlug,
          })
          .returning();
        existingTag = insertedTag;
      }

      // link the tag to the post in the junction table
      await db.insert(postTags).values({
        postId: newPost.id,
        tagId: existingTag.id,
      });
    }
  }

  // clear cache and redirect
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentHtml = formData.get("contentHtml") as string;
  const rawTags = formData.get("tags") as string;
  const isDraft = formData.get("isDraft") === "true"; // Handles the Draft/Live toggle

  if (!id || !title || !slug || !contentHtml) {
    throw new Error("Missing required fields");
  }

  // update the main post data
  await db
    .update(posts)
    .set({ title, slug, contentHtml, isDraft })
    .where(eq(posts.id, id));

  // wipe the old tag relationships for this specific post
  await db.delete(postTags).where(eq(postTags.postId, id));

  // process and link the updated tags
  if (rawTags) {
    const tagArray = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    for (const tagName of tagArray) {
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      let existingTag = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, tagSlug))
        .then((res) => res[0]);

      if (!existingTag) {
        const [insertedTag] = await db
          .insert(tags)
          .values({ name: tagName, slug: tagSlug })
          .returning();
        existingTag = insertedTag;
      }

      await db.insert(postTags).values({ postId: id, tagId: existingTag.id });
    }
  }

  // refresh the cache and redirect to the dashboard
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
