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
  const thumbnailUrl = formData.get("thumbnailUrl") as string;

  if (!title || !slug || !contentHtml) {
    throw new Error("Missing required fields");
  }

  // calculate reading time based on raw markdown word count
  const wordCount = contentHtml.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      slug,
      contentHtml,
      thumbnailUrl: thumbnailUrl || null,
      isDraft: true,
      readTimeMinutes,
    })
    .returning({ id: posts.id });

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
      await db
        .insert(postTags)
        .values({ postId: newPost.id, tagId: existingTag.id });
    }
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const contentHtml = formData.get("contentHtml") as string;
  const rawTags = formData.get("tags") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const isDraft = formData.get("isDraft") === "true";

  if (!id || !title || !slug || !contentHtml) {
    throw new Error("Missing required fields");
  }

  // calculate reading time based on raw markdown word count
  const wordCount = contentHtml.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  await db
    .update(posts)
    .set({
      title,
      slug,
      contentHtml,
      thumbnailUrl: thumbnailUrl || null,
      isDraft,
      readTimeMinutes,
    })
    .where(eq(posts.id, id));

  // wipe old tag relationships and rebuild them
  await db.delete(postTags).where(eq(postTags.postId, id));

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

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Post ID required");

  // cascading delete automatically wipes linked tags and likes in the DB
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/"); // Update public feed
  redirect("/admin/posts");
}
