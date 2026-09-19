"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData): Promise<void> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const secretKey = formData.get("secretKey") as string; // NEW: The hidden key

  if (!username || !password) {
    redirect(`/gateway-override?error=Missing_fields&key=${secretKey}`);
  }

  const adminUsers = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username));
  const admin = adminUsers[0];

  if (!admin) {
    redirect(`/gateway-override?error=Invalid_credentials&key=${secretKey}`);
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    redirect(`/gateway-override?error=Invalid_credentials&key=${secretKey}`);
  }

  await createSession(admin.id);
  redirect("/admin");
}
