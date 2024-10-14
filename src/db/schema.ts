import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name")
    .notNull(),
  done: integer("done", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => sql`(unixepoch() * 1000)`),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(tasks, {
  name: schema => schema.name.min(1).max(500),
}).required({
  done: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTaskSchema = insertTasksSchema.partial();
