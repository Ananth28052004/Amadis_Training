import sequelize from "./config/database.js";
import "./models/associations.js";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Theater from "./models/Theater.js";
import Show from "./models/Show.js";
import { ensureSeatsForShow } from "./services/seatService.js";

async function seed() {
  console.log("🌱 Connecting to database...");
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log("✅ Database synchronized.");

  // 1. Seed Users (Admin & Standard User)
  console.log("👤 Seeding users...");
  const [adminUser] = await User.findOrCreate({
    where: { email: "admin@cinebook.com" },
    defaults: {
      name: "Admin User",
      email: "admin@cinebook.com",
      password: "Admin@123",
      role: "admin",
    },
  });

  const [normalUser] = await User.findOrCreate({
    where: { email: "user@cinebook.com" },
    defaults: {
      name: "Alex Johnson",
      email: "user@cinebook.com",
      password: "User@123",
      role: "user",
    },
  });

  console.log(`✅ Users ready: Admin (${adminUser.email}), User (${normalUser.email})`);

  // 2. Seed Theaters
  console.log("🏛️ Seeding theaters...");
  const theatersData = [
    {
      name: "PVR Grand Dolby Atmos",
      location: "Downtown Plaza, 4th Floor",
      totalSeats: 60,
    },
    {
      name: "INOX Laser IMAX",
      location: "City Centre Mall, North Wing",
      totalSeats: 80,
    },
    {
      name: "Cinepolis VIP Lounge",
      location: "Metro Galleria, Boulevard",
      totalSeats: 40,
    },
  ];

  for (const t of theatersData) {
    await Theater.findOrCreate({
      where: { name: t.name },
      defaults: t,
    });
  }
  const allTheaters = await Theater.findAll();
  console.log(`✅ ${allTheaters.length} Theaters available.`);

  // 3. Seed Movies
  console.log("🎬 Seeding movies...");
  const moviesData = [
    {
      title: "Oppenheimer",
      genre: "Biography / Drama / History",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
      duration: 180,
      rating: 8.9,
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Interstellar",
      genre: "Sci-Fi / Adventure / Drama",
      description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      duration: 169,
      rating: 8.7,
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Dune: Part Two",
      genre: "Action / Adventure / Sci-Fi",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      duration: 166,
      rating: 8.6,
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "The Dark Knight",
      genre: "Action / Crime / Drama",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      duration: 152,
      rating: 9.0,
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Inception",
      genre: "Action / Sci-Fi / Thriller",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      duration: 148,
      rating: 8.8,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Spider-Man: Across the Spider-Verse",
      genre: "Animation / Action / Adventure",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      duration: 140,
      rating: 8.7,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80",
    },
  ];

  for (const m of moviesData) {
    await Movie.findOrCreate({
      where: { title: m.title },
      defaults: m,
    });
  }
  const allMovies = await Movie.findAll();
  console.log(`✅ ${allMovies.length} Movies available.`);

  // 4. Seed Shows
  console.log("🎟️ Seeding shows and generating seats...");
  const now = new Date();
  const showTimes = [
    new Date(now.getTime() + 1000 * 60 * 60 * 3), // +3 hours
    new Date(now.getTime() + 1000 * 60 * 60 * 7), // +7 hours
    new Date(now.getTime() + 1000 * 60 * 60 * 24), // tomorrow
    new Date(now.getTime() + 1000 * 60 * 60 * 28), // tomorrow evening
  ];

  let showCount = 0;
  for (let i = 0; i < allMovies.length; i++) {
    const movie = allMovies[i];
    const theater = allTheaters[i % allTheaters.length];
    const showTime = showTimes[i % showTimes.length];

    const [show] = await Show.findOrCreate({
      where: {
        movieId: movie.id,
        theaterId: theater.id,
      },
      defaults: {
        movieId: movie.id,
        theaterId: theater.id,
        showTime,
        price: 250 + (i % 3) * 50,
      },
    });

    // Ensure seat map for this show
    await ensureSeatsForShow(show.id);
    showCount++;
  }

  console.log(`✅ ${showCount} Shows with complete seat maps ready.`);
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("-----------------------------------------");
  console.log("Credentials:");
  console.log("Admin:  admin@cinebook.com / Admin@123");
  console.log("User:   user@cinebook.com  / User@123");
  console.log("-----------------------------------------");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
