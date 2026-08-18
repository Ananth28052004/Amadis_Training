import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { api } from "../services/api";

const Seats = () => {
  const { showId } = useParams({
    from: "/seats/$showId",
  });

  const navigate = useNavigate();

  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const data = await api(`/seats/show/${showId}`);

        setSeats(data.seats || data || []);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [showId]);

  const toggleSeat = (seatId: number, status: string) => {
    if (status !== "AVAILABLE") {
      return;
    }

    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((id) => id !== seatId);
      }

      return [...current, seatId];
    });
  };

  const continueBooking = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    navigate({
      to: "/booking",
      search: {
        showId: String(showId),
        seatIds: selectedSeats.join(","),
      },
    });
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading seats...
      </div>
    );
  }

  if (error && seats.length === 0) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Select Your Seats
        </h1>

        {error && (
          <p className="mb-4 text-center text-red-600">
            {error}
          </p>
        )}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-8 rounded-lg bg-gray-800 p-3 text-center text-white">
            SCREEN
          </div>

          <div className="grid grid-cols-5 gap-4">

            {seats.map((seat) => {

              const isSelected =
                selectedSeats.includes(seat.id);

              const isAvailable =
                seat.status === "AVAILABLE";

              return (
                <button
                  key={seat.id}
                  disabled={!isAvailable}
                  onClick={() =>
                    toggleSeat(
                      seat.id,
                      seat.status
                    )
                  }
                  className={`rounded-lg p-3 text-sm font-semibold ${
                    !isAvailable
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : isSelected
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}

          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="mb-4">
            Selected seats:{" "}
            <span className="font-bold">
              {selectedSeats.length}
            </span>
          </p>

          <button
            onClick={continueBooking}
            className="w-full rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Continue Booking
          </button>

        </div>

      </div>
    </div>
  );
};

export default Seats;
