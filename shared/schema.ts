import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hosts = pgTable("hosts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  category: text("category").notNull(),
  avatar: text("avatar").notNull(),
  coverArt: text("cover_art").notNull(),
  rating: integer("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  hourlyRate: integer("hourly_rate").notNull(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => hosts.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  duration: integer("duration").notNull().default(60),
  status: text("status").notNull().default("confirmed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => hosts.id),
  reviewerName: text("reviewer_name").notNull(),
  reviewerAvatar: text("reviewer_avatar").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  verified: boolean("verified").notNull().default(false),
  helpful: integer("helpful").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const availability = pgTable("availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => hosts.id),
  dayOfWeek: integer("day_of_week").notNull(),
  timeSlot: text("time_slot").notNull(),
  available: boolean("available").notNull().default(true),
});

export const insertHostSchema = createInsertSchema(hosts).omit({ id: true, rating: true, reviewCount: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, status: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, helpful: true });
export const insertAvailabilitySchema = createInsertSchema(availability).omit({ id: true });

export type Host = typeof hosts.$inferSelect;
export type InsertHost = z.infer<typeof insertHostSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
