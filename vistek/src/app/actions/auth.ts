"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

// explicitly typing the return as Promise<void> fixes the form action error
export async function loginAdmin(formData: FormData): Promise<void> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    redirect("/login?error=Missing_fields");
  }

  // fetch the admin user
  const adminUsers = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username));
  const admin = adminUsers[0];

  if (!admin) {
    redirect("/login?error=Invalid_credentials");
  }

  // verify the password
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    redirect("/login?error=Invalid_credentials");
  }

  // create the secure JWT cookie
  await createSession(admin.id);

  // redirect to the protected dashboard
  redirect("/admin");
}
