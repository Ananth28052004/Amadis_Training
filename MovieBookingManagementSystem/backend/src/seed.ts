import sequelize from "./config/database.js";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Theater from "./models/Theater.js";
import Show from "./models/Show.js";
import Seat from "./models/Seat.js";
import Booking from "./models/Booking.js";
import "./models/associations.js";
import { ensureSeatsForShow } from "./services/seatService.js";

async function seedDatabase() {
  try {
    console.log("🔄 Connecting to PostgreSQL database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    console.log("🔄 Synchronizing database tables...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database schema synchronized.");

    // 1. Seed Users (Admin & Customer)
    console.log("🌱 Seeding Users...");
    const [adminUser] = await User.findOrCreate({
      where: { email: "admin@cinebook.com" },
      defaults: {
        name: "CineBook Admin",
        email: "admin@cinebook.com",
        password: "Admin@123",
        role: "admin",
      },
    });

    const [normalUser] = await User.findOrCreate({
      where: { email: "user@cinebook.com" },
      defaults: {
        name: "John Doe",
        email: "user@cinebook.com",
        password: "User@123",
        role: "user",
      },
    });

    console.log(`✅ Users verified (Admin: ${adminUser.email}, Customer: ${normalUser.email})`);

    // 2. Seed Theaters
    console.log("🌱 Seeding Theaters...");
    const theaterData = [
      {
        name: "PVR Grand Cinema",
        location: "Downtown City Mall, Audi 1",
        totalSeats: 60,
      },
      {
        name: "IMAX Luxe Experience",
        location: "Metro Square, Screen 2",
        totalSeats: 80,
      },
      {
        name: "Cinepolis VIP",
        location: "Phoenix Marketcity, Audi 3",
        totalSeats: 40,
      },
    ];

    const theaters: Theater[] = [];
    for (const t of theaterData) {
      const [theater] = await Theater.findOrCreate({
        where: { name: t.name },
        defaults: t,
      });
      theaters.push(theater);
    }
    console.log(`✅ ${theaters.length} Theaters verified.`);

    // 3. Seed Movies
    console.log("🌱 Seeding Movies...");
    const movieData = [
      {
        title: "Oppenheimer",
        description:
          "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
        genre: "Biography / Drama / History",
        duration: 180,
        rating: 8.9,
        image:
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Interstellar",
        description:
          "When Earth becomes uninhabitable in the future, a team of explorers travel through a wormhole in space in search of a new home for mankind.",
        genre: "Adventure / Drama / Sci-Fi",
        duration: 169,
        rating: 8.7,
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Dune: Part Two",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        genre: "Action / Adventure / Sci-Fi",
        duration: 166,
        rating: 8.6,
        image:
          "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        genre: "Action / Crime / Drama",
        duration: 152,
        rating: 9.0,
        image:
          "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop&q=80",
      },
    ];

    const movies: Movie[] = [];
    for (const m of movieData) {
      const [movie] = await Movie.findOrCreate({
        where: { title: m.title },
        defaults: m,
      });
      movies.push(movie);
    }
    console.log(`✅ ${movies.length} Movies verified.`);

    // 4. Seed Shows & Generate Seats
    console.log("🌱 Seeding Shows & Generating Seat Layouts...");
    const now = new Date();
    const showSchedules = [
      { dayOffset: 0, hour: 10, minute: 0, price: 250 },
      { dayOffset: 0, hour: 14, minute: 30, price: 300 },
      { dayOffset: 0, hour: 18, minute: 45, price: 350 },
      { dayOffset: 1, hour: 11, minute: 15, price: 250 },
      { dayOffset: 1, hour: 16, minute: 0, price: 300 },
      { dayOffset: 1, hour: 20, minute: 30, price: 350 },
    ];

    let totalShowsCreated = 0;
    let totalSeatsEnsured = 0;

    for (let mIdx = 0; mIdx < movies.length; mIdx++) {
      const movie = movies[mIdx];
      const theater = theaters[mIdx % theaters.length];

      for (let sIdx = 0; sIdx < 2; sIdx++) {
        const schedule = showSchedules[(mIdx * 2 + sIdx) % showSchedules.length];
        const showTime = new Date(now);
        showTime.setDate(now.getDate() + schedule.dayOffset);
        showTime.setHours(schedule.hour, schedule.minute, 0, 0);

        const [show, created] = await Show.findOrCreate({
          where: {
            movieId: movie.id,
            theaterId: theater.id,
            showTime: showTime,
          },
          defaults: {
            movieId: movie.id,
            theaterId: theater.id,
            showTime: showTime,
            price: schedule.price,
          },
        });

        if (created) {
          totalShowsCreated++;
        }

        // Ensure seats are generated for this show
        const { seats } = await ensureSeatsForShow(show.id);
        totalSeatsEnsured += seats.length;
      }
    }

    console.log(`✅ Shows verified (Newly created: ${totalShowsCreated}, Seat instances verified: ${totalSeatsEnsured}).`);
    console.log("\n🎉 Database Seeding Complete!");
    console.log("==================================================");
    console.log("  ADMIN LOGIN:    admin@cinebook.com  /  Admin@123");
    console.log("  CUSTOMER LOGIN: user@cinebook.com   /  User@123");
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();
