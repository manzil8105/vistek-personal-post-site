"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTag(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Tag name required");

  // auto generate the URL safe slug
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // insert tag, ignoring if the slug already exists to prevent crashes
  await db.insert(tags).values({ name, slug }).onConflictDoNothing();

  revalidatePath("/admin/tags");
  revalidatePath("/admin/posts");
}

export async function deleteTag(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Tag ID required");

  // deleting the tag automatically deletes the association in the post_tags table
  await db.delete(tags).where(eq(tags.id, id));

  revalidatePath("/admin/tags");
  revalidatePath("/admin/posts");
}
