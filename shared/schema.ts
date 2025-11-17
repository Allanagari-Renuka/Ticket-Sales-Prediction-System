import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

// Movies table
export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  posterUrl: text("poster_url"),
  backdropUrl: text("backdrop_url"),
  genre: text("genre").notNull(), // JSON array: ['Action', 'Sci-Fi']
  language: text("language").notNull(),
  duration: integer("duration").notNull(), // in minutes
  cast: text("cast"), // JSON array
  rating: decimal("rating", { precision: 2, scale: 1 }), // e.g., 4.5
  releaseDate: timestamp("release_date"),
  featured: boolean("featured").default(false),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  showtimes: many(showtimes),
}));

// Theaters table
export const theaters = pgTable("theaters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
});

export const theatersRelations = relations(theaters, ({ many }) => ({
  screens: many(screens),
}));

// Screens table
export const screens = pgTable("screens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theaterId: varchar("theater_id").notNull().references(() => theaters.id),
  name: text("name").notNull(), // e.g., "Screen 1", "IMAX"
  capacity: integer("capacity").notNull(),
  rows: integer("rows").notNull(), // number of rows
  seatsPerRow: integer("seats_per_row").notNull(),
});

export const screensRelations = relations(screens, ({ one, many }) => ({
  theater: one(theaters, {
    fields: [screens.theaterId],
    references: [theaters.id],
  }),
  showtimes: many(showtimes),
}));

// Showtimes table with dynamic pricing
export const showtimes = pgTable("showtimes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  movieId: varchar("movie_id").notNull().references(() => movies.id),
  screenId: varchar("screen_id").notNull().references(() => screens.id),
  startTime: timestamp("start_time").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  pricingSource: text("pricing_source").notNull().default("base"), // 'base' | 'ml' | 'override'
  mlPredictedSales: integer("ml_predicted_sales"),
  mlConfidence: decimal("ml_confidence", { precision: 5, scale: 2 }),
  occupiedSeats: integer("occupied_seats").default(0),
});

export const showtimesRelations = relations(showtimes, ({ one, many }) => ({
  movie: one(movies, {
    fields: [showtimes.movieId],
    references: [movies.id],
  }),
  screen: one(screens, {
    fields: [showtimes.screenId],
    references: [screens.id],
  }),
  bookings: many(bookings),
  pricingHistory: many(pricingHistory),
}));

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  showtimeId: varchar("showtime_id").notNull().references(() => showtimes.id),
  seats: jsonb("seats").notNull(), // [{row: 'A', number: 5, type: 'regular'}]
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
  paymentMethod: text("payment_method"), // 'upi' | 'card' | 'cash'
  bookingReference: text("booking_reference").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // for 10-min hold
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  showtime: one(showtimes, {
    fields: [bookings.showtimeId],
    references: [showtimes.id],
  }),
}));

// Pricing history for ML tracking and admin overrides
export const pricingHistory = pgTable("pricing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showtimeId: varchar("showtime_id").notNull().references(() => showtimes.id),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  mlRecommendedPrice: decimal("ml_recommended_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // 'ml' | 'override' | 'base'
  adminOverride: boolean("admin_override").default(false),
  adminUserId: varchar("admin_user_id").references(() => users.id),
  mlModelVersion: text("ml_model_version"),
  occupancyRate: decimal("occupancy_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pricingHistoryRelations = relations(pricingHistory, ({ one }) => ({
  showtime: one(showtimes, {
    fields: [pricingHistory.showtimeId],
    references: [showtimes.id],
  }),
  admin: one(users, {
    fields: [pricingHistory.adminUserId],
    references: [users.id],
  }),
}));

// Zod schemas for validation

// Users
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional(),
}).omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Movies
export const insertMovieSchema = createInsertSchema(movies, {
  title: z.string().min(1),
  synopsis: z.string().min(10),
  duration: z.number().min(1),
  genre: z.string(),
  language: z.string(),
  rating: z.string().optional(),
}).omit({ id: true });

// Theaters
export const insertTheaterSchema = createInsertSchema(theaters).omit({ id: true });

// Screens
export const insertScreenSchema = createInsertSchema(screens, {
  capacity: z.number().min(1),
  rows: z.number().min(1),
  seatsPerRow: z.number().min(1),
}).omit({ id: true });

// Showtimes
export const insertShowtimeSchema = createInsertSchema(showtimes, {
  basePrice: z.string().min(1),
  currentPrice: z.string().min(1),
}).omit({ id: true, mlPredictedSales: true, mlConfidence: true, occupiedSeats: true });

// Bookings
export const insertBookingSchema = createInsertSchema(bookings, {
  seats: z.array(z.object({
    row: z.string(),
    number: z.number(),
    type: z.string(),
  })),
  totalAmount: z.string().min(1),
  paymentMethod: z.enum(["upi", "card", "cash"]).optional(),
}).omit({ id: true, createdAt: true, expiresAt: true, bookingReference: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertTheater = z.infer<typeof insertTheaterSchema>;
export type Theater = typeof theaters.$inferSelect;

export type InsertScreen = z.infer<typeof insertScreenSchema>;
export type Screen = typeof screens.$inferSelect;

export type InsertShowtime = z.infer<typeof insertShowtimeSchema>;
export type Showtime = typeof showtimes.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type PricingHistory = typeof pricingHistory.$inferSelect;
