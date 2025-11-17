import { db } from "./db";
import { users, movies, theaters, screens, showtimes } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(users).values({
      username: "admin",
      email: "admin@cinemamax.com",
      password: hashedPassword,
      role: "admin",
    }).returning().onConflictDoNothing();
    
    if (admin) {
      console.log("✅ Admin user created:", admin.email);
    }

    // Create demo user
    const demoPassword = await bcrypt.hash("demo123", 10);
    const [demoUser] = await db.insert(users).values({
      username: "demo",
      email: "demo@example.com",
      password: demoPassword,
      role: "user",
    }).returning().onConflictDoNothing();
    
    if (demoUser) {
      console.log("✅ Demo user created:", demoUser.email);
    }

    // Create sample movies
    const movieData = [
      {
        title: "Stellar Odyssey",
        synopsis: "In a distant galaxy, a crew of explorers embarks on a journey to find a new home for humanity. As they traverse uncharted space, they encounter ancient civilizations, face cosmic dangers, and discover secrets that could change the fate of their species forever.",
        posterUrl: "/attached_assets/generated_images/Sci-fi_movie_poster_462d13fe.png",
        backdropUrl: "/attached_assets/generated_images/Sci-fi_movie_poster_462d13fe.png",
        genre: JSON.stringify(["Sci-Fi", "Adventure", "Drama"]),
        language: "English",
        duration: 148,
        cast: JSON.stringify(["Alex Rivera", "Maya Chen", "James Wilson", "Sarah Thompson"]),
        rating: "4.5",
        releaseDate: new Date("2025-03-15"),
        featured: true,
      },
      {
        title: "Urban Strike",
        synopsis: "When a rogue terrorist organization threatens to destroy the city, an elite special forces team must race against time to prevent catastrophe. With high-stakes action sequences and explosive confrontations, this thriller keeps you on the edge of your seat.",
        posterUrl: "/attached_assets/generated_images/Action_movie_poster_240bae26.png",
        backdropUrl: "/attached_assets/generated_images/Action_movie_poster_240bae26.png",
        genre: JSON.stringify(["Action", "Thriller", "Crime"]),
        language: "English",
        duration: 132,
        cast: JSON.stringify(["Marcus Kane", "Elena Rodriguez", "Tom Bradley", "Lisa Park"]),
        rating: "4.2",
        releaseDate: new Date("2025-03-20"),
        featured: true,
      },
      {
        title: "The Last Symphony",
        synopsis: "A renowned composer loses his hearing and must find new ways to create music. This emotional journey explores the power of art, resilience, and the human spirit's ability to overcome seemingly insurmountable obstacles.",
        posterUrl: null,
        backdropUrl: null,
        genre: JSON.stringify(["Drama", "Music", "Biography"]),
        language: "English",
        duration: 125,
        cast: JSON.stringify(["David Morrison", "Emma Stone", "Robert Chen"]),
        rating: "4.7",
        releaseDate: new Date("2025-04-01"),
        featured: true,
      },
      {
        title: "Laugh Out Loud",
        synopsis: "A struggling comedian gets one last chance to make it big at a famous comedy club. Through hilarious misadventures and heartwarming moments, he learns that success isn't just about making people laugh—it's about staying true to yourself.",
        posterUrl: null,
        backdropUrl: null,
        genre: JSON.stringify(["Comedy", "Drama"]),
        language: "English",
        duration: 105,
        cast: JSON.stringify(["Chris Parker", "Jennifer Lee", "Mike Anderson"]),
        rating: "3.9",
        releaseDate: new Date("2025-04-10"),
        featured: false,
      },
    ];

    const createdMovies = await db.insert(movies).values(movieData).returning().onConflictDoNothing();
    console.log(`✅ Created ${createdMovies.length} movies`);

    // Create theater
    const [theater] = await db.insert(theaters).values({
      name: "CinemaMax Downtown",
      location: "123 Main Street",
      city: "New York",
    }).returning().onConflictDoNothing();

    if (theater) {
      console.log("✅ Theater created:", theater.name);

      // Create screens
      const screenData = [
        {
          theaterId: theater.id,
          name: "Screen 1",
          capacity: 150,
          rows: 10,
          seatsPerRow: 15,
        },
        {
          theaterId: theater.id,
          name: "Screen 2 (IMAX)",
          capacity: 200,
          rows: 12,
          seatsPerRow: 17,
        },
        {
          theaterId: theater.id,
          name: "Screen 3",
          capacity: 120,
          rows: 8,
          seatsPerRow: 15,
        },
      ];

      const createdScreens = await db.insert(screens).values(screenData).returning().onConflictDoNothing();
      console.log(`✅ Created ${createdScreens.length} screens`);

      // Create showtimes for movies
      if (createdMovies.length > 0 && createdScreens.length > 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const showtimeData = [];

        // Create multiple showtimes for each movie
        for (const movie of createdMovies.slice(0, 3)) {
          for (const screen of createdScreens) {
            // Today's showtimes
            const times = ["14:00", "17:30", "21:00"];
            for (const time of times) {
              const [hours, minutes] = time.split(":");
              const showDateTime = new Date(today);
              showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

              const basePrice = 250;
              const mlRecommendedPrice = basePrice * (0.85 + Math.random() * 0.3); // Random pricing between 85% to 115%
              
              showtimeData.push({
                movieId: movie.id,
                screenId: screen.id,
                startTime: showDateTime,
                basePrice: basePrice.toString(),
                currentPrice: Math.floor(mlRecommendedPrice).toString(),
                pricingSource: Math.random() > 0.5 ? "ml" : "base",
                mlPredictedSales: Math.floor(Math.random() * screen.capacity * 0.8),
                mlConfidence: (75 + Math.random() * 20).toFixed(2),
                occupiedSeats: Math.floor(Math.random() * screen.capacity * 0.3),
              });
            }

            // Tomorrow's showtimes
            for (const time of times) {
              const [hours, minutes] = time.split(":");
              const showDateTime = new Date(tomorrow);
              showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

              const basePrice = 250;
              const mlRecommendedPrice = basePrice * (0.85 + Math.random() * 0.3);
              
              showtimeData.push({
                movieId: movie.id,
                screenId: screen.id,
                startTime: showDateTime,
                basePrice: basePrice.toString(),
                currentPrice: Math.floor(mlRecommendedPrice).toString(),
                pricingSource: Math.random() > 0.5 ? "ml" : "base",
                mlPredictedSales: Math.floor(Math.random() * screen.capacity * 0.8),
                mlConfidence: (75 + Math.random() * 20).toFixed(2),
                occupiedSeats: 0,
              });
            }
          }
        }

        const createdShowtimes = await db.insert(showtimes).values(showtimeData).returning().onConflictDoNothing();
        console.log(`✅ Created ${createdShowtimes.length} showtimes`);
      }
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nLogin credentials:");
    console.log("Admin: admin@cinemamax.com / admin123");
    console.log("Demo User: demo@example.com / demo123");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
