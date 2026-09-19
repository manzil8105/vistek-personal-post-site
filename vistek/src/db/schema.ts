import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  unique,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    contentHtml: text("content_html").notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 512 }),
    isDraft: boolean("is_draft").default(true),
    likes: integer("likes").default(0).notNull(),
    readTimeMinutes: integer("read_time_minutes").default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_posts_slug").on(table.slug),
    index("idx_posts_published_at").on(table.publishedAt),
  ],
);

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  isAliasFor: uuid("is_alias_for"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

export const postRevisions = pgTable(
  "post_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    contentSnapshot: jsonb("content_snapshot").notNull(),
    createdByAdmin: boolean("created_by_admin").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_revisions_post_id").on(table.postId)],
);

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    visitorHash: varchar("visitor_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("unique_visitor_like").on(table.postId, table.visitorHash),
    index("idx_likes_post_id").on(table.postId),
  ],
);

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
