import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  wpm: integer("wpm").notNull(),
  rawWpm: integer("raw_wpm").notNull(),
  accuracy: integer("accuracy").notNull(),
  durationMode: text("duration_mode").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});
