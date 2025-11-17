import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, loginSchema, insertMovieSchema, insertTheaterSchema, insertScreenSchema, insertShowtimeSchema, insertBookingSchema } from "../shared/schema";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Middleware to check admin role
function requireAdmin(req: any, res: any, next: any) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // ===== AUTH ENDPOINTS =====
  
  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== MOVIE ENDPOINTS =====
  
  // Get all movies
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get featured movies
  app.get("/api/movies/featured", async (req, res) => {
    try {
      const movies = await storage.getFeaturedMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single movie
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create movie (admin only)
  app.post("/api/movies", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMovieSchema.parse(req.body);
      const movie = await storage.createMovie(validatedData);
      res.status(201).json(movie);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update movie (admin only)
  app.put("/api/movies/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMovieSchema.partial().parse(req.body);
      const movie = await storage.updateMovie(req.params.id, validatedData);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete movie (admin only)
  app.delete("/api/movies/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteMovie(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== THEATER ENDPOINTS =====
  
  app.get("/api/theaters", async (req, res) => {
    try {
      const theaters = await storage.getAllTheaters();
      res.json(theaters);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/theaters", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTheaterSchema.parse(req.body);
      const theater = await storage.createTheater(validatedData);
      res.status(201).json(theater);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== SCREEN ENDPOINTS =====
  
  app.get("/api/screens/theater/:theaterId", async (req, res) => {
    try {
      const screens = await storage.getScreensByTheater(req.params.theaterId);
      res.json(screens);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/screens", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertScreenSchema.parse(req.body);
      const screen = await storage.createScreen(validatedData);
      res.status(201).json(screen);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== SHOWTIME ENDPOINTS =====
  
  // Get showtimes by movie
  app.get("/api/showtimes/movie/:movieId", async (req, res) => {
    try {
      const showtimes = await storage.getShowtimesByMovie(req.params.movieId);
      res.json(showtimes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single showtime with details
  app.get("/api/showtimes/:id", async (req, res) => {
    try {
      const showtime = await storage.getShowtime(req.params.id);
      if (!showtime) {
        return res.status(404).json({ message: "Showtime not found" });
      }
      
      // Get movie and screen details
      const movie = await storage.getMovie(showtime.movieId);
      const screen = await storage.getScreen(showtime.screenId);
      
      // Get booked seats
      const bookings = await storage.getBookingsByShowtime(req.params.id);
      const bookedSeats = bookings
        .filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'pending')
        .flatMap(b => b.seats as any[]);

      res.json({
        ...showtime,
        movie,
        screen,
        bookedSeats,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get upcoming showtimes
  app.get("/api/showtimes", async (req, res) => {
    try {
      const showtimes = await storage.getUpcomingShowtimes();
      res.json(showtimes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create showtime (admin only)
  app.post("/api/showtimes", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertShowtimeSchema.parse(req.body);
      const showtime = await storage.createShowtime(validatedData);
      res.status(201).json(showtime);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update showtime pricing (admin only)
  app.patch("/api/showtimes/:id/pricing", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { currentPrice, pricingSource } = req.body;
      const showtime = await storage.updateShowtime(req.params.id, {
        currentPrice,
        pricingSource,
      });
      
      if (!showtime) {
        return res.status(404).json({ message: "Showtime not found" });
      }

      // Log pricing history
      await storage.createPricingHistory({
        showtimeId: req.params.id,
        basePrice: showtime.basePrice,
        finalPrice: currentPrice,
        source: pricingSource,
        adminOverride: pricingSource === 'override',
        adminUserId: pricingSource === 'override' ? req.user.id : null,
      });

      res.json(showtime);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== BOOKING ENDPOINTS =====
  
  // Create booking
  app.post("/api/bookings", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Generate booking reference
      const bookingReference = `CM-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      
      // Set expiry time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      const booking = await storage.createBooking({
        ...validatedData,
        userId: req.user.id,
        bookingReference,
        expiresAt,
      });

      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user's bookings
  app.get("/api/bookings/user", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Get showtime and movie details
      const showtime = await storage.getShowtime(booking.showtimeId);
      const movie = showtime ? await storage.getMovie(showtime.movieId) : null;
      const screen = showtime ? await storage.getScreen(showtime.screenId) : null;

      res.json({
        ...booking,
        showtime,
        movie,
        screen,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== PAYMENT ENDPOINTS (Mock) =====
  
  // Initiate payment
  app.post("/api/payment/initiate", authenticateToken, async (req, res) => {
    try {
      const { bookingId, paymentMethod } = req.body;
      
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update booking status to processing
      await storage.updateBookingStatus(bookingId, "processing");

      res.json({
        success: true,
        message: "Payment initiated",
        bookingId,
        amount: booking.totalAmount,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Confirm payment (mock - marks as paid)
  app.post("/api/payment/confirm", authenticateToken, async (req, res) => {
    try {
      const { bookingId, paymentMethod } = req.body;
      
      const booking = await storage.updateBookingStatus(bookingId, "paid", paymentMethod);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update showtime occupancy
      const seats = booking.seats as any[];
      const currentBookings = await storage.getBookingsByShowtime(booking.showtimeId);
      const totalOccupied = currentBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.seats as any[]).length, 0);
      
      await storage.updateShowtimeOccupancy(booking.showtimeId, totalOccupied);

      res.json({
        success: true,
        message: "Payment confirmed",
        booking,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== ML PREDICTION ENDPOINTS =====
  
  // Get predictions (mock for now - will integrate Python service later)
  app.get("/api/ml/predictions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      // Mock predictions - will be replaced with actual ML service
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Predict for a showtime
  app.post("/api/ml/predict", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { showtimeId } = req.body;
      
      // Mock prediction - will integrate with Python ML service
      const mockPrediction = {
        showtimeId,
        predictedTickets: Math.floor(Math.random() * 200) + 50,
        confidence: Math.floor(Math.random() * 30) + 70,
        recommendedPrice: Math.floor(Math.random() * 100) + 200,
        modelVersion: "v2.1",
      };

      res.json(mockPrediction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== ADMIN ANALYTICS ENDPOINTS =====
  
  app.get("/api/admin/analytics", authenticateToken, requireAdmin, async (req, res) => {
    try {
      // Mock analytics data
      res.json({
        revenue: 125000,
        bookings: 342,
        occupancy: 68,
        mlAccuracy: 87,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
