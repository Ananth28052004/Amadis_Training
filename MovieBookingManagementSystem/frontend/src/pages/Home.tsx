import { useNavigate } from "@tanstack/react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-6xl px-6 py-20">

        <div className="text-center">

          <h1 className="text-5xl font-bold">
            Movie Booking
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Find your favorite movies, choose a show,
            select your seats, and book your tickets.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <button
              onClick={() =>
                navigate({
                  to: "/movies",
                })
              }
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Browse Movies
            </button>

            <button
              onClick={() =>
                navigate({
                  to: "/login",
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 hover:bg-gray-50"
            >
              Login
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
