import {
  users,
  movies,
  theaters,
  screens,
  showtimes,
  bookings,
  pricingHistory,
  type User,
  type InsertUser,
  type Movie,
  type InsertMovie,
  type Theater,
  type InsertTheater,
  type Screen,
  type InsertScreen,
  type Showtime,
  type InsertShowtime,
  type Booking,
  type InsertBooking,
  type PricingHistory,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Movies
  getAllMovies(): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  getFeaturedMovies(): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: string, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: string): Promise<boolean>;
  
  // Theaters
  getAllTheaters(): Promise<Theater[]>;
  getTheater(id: string): Promise<Theater | undefined>;
  createTheater(theater: InsertTheater): Promise<Theater>;
  
  // Screens
  getScreensByTheater(theaterId: string): Promise<Screen[]>;
  getScreen(id: string): Promise<Screen | undefined>;
  createScreen(screen: InsertScreen): Promise<Screen>;
  
  // Showtimes
  getShowtimesByMovie(movieId: string): Promise<Showtime[]>;
  getShowtime(id: string): Promise<Showtime | undefined>;
  getUpcomingShowtimes(): Promise<Showtime[]>;
  createShowtime(showtime: InsertShowtime): Promise<Showtime>;
  updateShowtime(id: string, showtime: Partial<InsertShowtime>): Promise<Showtime | undefined>;
  updateShowtimeOccupancy(id: string, count: number): Promise<void>;
  
  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string, method?: string): Promise<Booking | undefined>;
  getBookingsByShowtime(showtimeId: string): Promise<Booking[]>;
  
  // Pricing History
  createPricingHistory(history: Omit<PricingHistory, 'id' | 'createdAt'>): Promise<PricingHistory>;
  getPricingHistoryByShowtime(showtimeId: string): Promise<PricingHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // Helper to normalize movie data
  private normalizeMovie(movie: any): Movie {
    return {
      ...movie,
      genre: typeof movie.genre === 'string' ? JSON.parse(movie.genre) : movie.genre,
      cast: typeof movie.cast === 'string' ? JSON.parse(movie.cast) : movie.cast,
    };
  }

  // Mock data for development when database is not available
  private getMockMovies(): Movie[] {
    return [
      {
        id: "1",
        title: "Stellar Odyssey",
        synopsis: "In a distant galaxy, a crew of explorers embarks on a journey to find a new home for humanity. As they traverse uncharted space, they encounter ancient civilizations, face cosmic dangers, and discover secrets that could change the fate of their species forever.",
        posterUrl: "/attached_assets/generated_images/Sci-fi_movie_poster_462d13fe.png",
        backdropUrl: "/attached_assets/generated_images/Sci-fi_movie_poster_462d13fe.png",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        language: "English",
        duration: 148,
        cast: ["Alex Rivera", "Maya Chen", "James Wilson", "Sarah Thompson"],
        rating: "4.5",
        releaseDate: new Date("2025-03-15"),
        featured: true,
      },
      {
        id: "2",
        title: "Urban Strike",
        synopsis: "When a rogue terrorist organization threatens to destroy the city, an elite special forces team must race against time to prevent catastrophe. With high-stakes action sequences and explosive confrontations, this thriller keeps you on the edge of your seat.",
        posterUrl: "/attached_assets/generated_images/Action_movie_poster_240bae26.png",
        backdropUrl: "/attached_assets/generated_images/Action_movie_poster_240bae26.png",
        genre: ["Action", "Thriller", "Crime"],
        language: "English",
        duration: 132,
        cast: ["Marcus Kane", "Elena Rodriguez", "Tom Bradley", "Lisa Park"],
        rating: "4.2",
        releaseDate: new Date("2025-03-20"),
        featured: true,
      },
      {
        id: "3",
        title: "The Last Symphony",
        synopsis: "A renowned composer loses his hearing and must find new ways to create music. This emotional journey explores the power of art, resilience, and the human spirit's ability to overcome seemingly insurmountable obstacles.",
        posterUrl: null,
        backdropUrl: null,
        genre: ["Drama", "Music", "Biography"],
        language: "English",
        duration: 125,
        cast: ["David Morrison", "Emma Stone", "Robert Chen"],
        rating: "4.7",
        releaseDate: new Date("2025-04-01"),
        featured: true,
      },
    ];
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Movies
  async getAllMovies(): Promise<Movie[]> {
    try {
      const result = await db.select().from(movies).orderBy(desc(movies.releaseDate));
      return result.map(m => this.normalizeMovie(m));
    } catch (error) {
      // Fallback to mock data if database is not available
      console.warn("Database not available, using mock movie data");
      return this.getMockMovies();
    }
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    try {
      const [movie] = await db.select().from(movies).where(eq(movies.id, id));
      return movie ? this.normalizeMovie(movie) : undefined;
    } catch (error) {
      // Fallback to mock data if database is not available
      console.warn("Database not available, using mock movie data");
      return this.getMockMovies().find(m => m.id === id);
    }
  }

  async getFeaturedMovies(): Promise<Movie[]> {
    try {
      const result = await db.select().from(movies)
        .where(eq(movies.featured, true))
        .limit(8);
      return result.map(m => this.normalizeMovie(m));
    } catch (error) {
      // Fallback to mock data if database is not available
      console.warn("Database not available, using mock movie data");
      return this.getMockMovies().filter(m => m.featured);
    }
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const [created] = await db.insert(movies).values(movie).returning();
    return this.normalizeMovie(created);
  }

  async updateMovie(id: string, movie: Partial<InsertMovie>): Promise<Movie | undefined> {
    const [updated] = await db
      .update(movies)
      .set(movie)
      .where(eq(movies.id, id))
      .returning();
    return updated ? this.normalizeMovie(updated) : undefined;
  }

  async deleteMovie(id: string): Promise<boolean> {
    const result = await db.delete(movies).where(eq(movies.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Theaters
  async getAllTheaters(): Promise<Theater[]> {
    return await db.select().from(theaters);
  }

  async getTheater(id: string): Promise<Theater | undefined> {
    const [theater] = await db.select().from(theaters).where(eq(theaters.id, id));
    return theater || undefined;
  }

  async createTheater(theater: InsertTheater): Promise<Theater> {
    const [created] = await db.insert(theaters).values(theater).returning();
    return created;
  }

  // Screens
  async getScreensByTheater(theaterId: string): Promise<Screen[]> {
    return await db.select().from(screens).where(eq(screens.theaterId, theaterId));
  }

  async getScreen(id: string): Promise<Screen | undefined> {
    const [screen] = await db.select().from(screens).where(eq(screens.id, id));
    return screen || undefined;
  }

  async createScreen(screen: InsertScreen): Promise<Screen> {
    const [created] = await db.insert(screens).values(screen).returning();
    return created;
  }

  // Showtimes
  async getShowtimesByMovie(movieId: string): Promise<Showtime[]> {
    const now = new Date();
    return await db.select().from(showtimes)
      .where(and(
        eq(showtimes.movieId, movieId),
        gte(showtimes.startTime, now)
      ))
      .orderBy(showtimes.startTime);
  }

  async getShowtime(id: string): Promise<Showtime | undefined> {
    const [showtime] = await db.select().from(showtimes).where(eq(showtimes.id, id));
    return showtime || undefined;
  }

  async getUpcomingShowtimes(): Promise<Showtime[]> {
    const now = new Date();
    return await db.select().from(showtimes)
      .where(gte(showtimes.startTime, now))
      .orderBy(showtimes.startTime)
      .limit(20);
  }

  async createShowtime(showtime: InsertShowtime): Promise<Showtime> {
    const [created] = await db.insert(showtimes).values(showtime).returning();
    return created;
  }

  async updateShowtime(id: string, showtime: Partial<InsertShowtime>): Promise<Showtime | undefined> {
    const [updated] = await db
      .update(showtimes)
      .set(showtime)
      .where(eq(showtimes.id, id))
      .returning();
    return updated || undefined;
  }

  async updateShowtimeOccupancy(id: string, count: number): Promise<void> {
    await db
      .update(showtimes)
      .set({ occupiedSeats: count })
      .where(eq(showtimes.id, id));
  }

  // Bookings
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }

  async updateBookingStatus(id: string, status: string, method?: string): Promise<Booking | undefined> {
    const updateData: any = { paymentStatus: status };
    if (method) updateData.paymentMethod = method;
    
    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }

  async getBookingsByShowtime(showtimeId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.showtimeId, showtimeId));
  }

  // Pricing History
  async createPricingHistory(history: Omit<PricingHistory, 'id' | 'createdAt'>): Promise<PricingHistory> {
    const [created] = await db.insert(pricingHistory).values(history as any).returning();
    return created;
  }

  async getPricingHistoryByShowtime(showtimeId: string): Promise<PricingHistory[]> {
    return await db.select().from(pricingHistory)
      .where(eq(pricingHistory.showtimeId, showtimeId))
      .orderBy(desc(pricingHistory.createdAt));
  }
}

export const storage = new DatabaseStorage();
