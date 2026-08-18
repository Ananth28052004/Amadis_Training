import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { api } from "../services/api";

const Booking = () => {
  const navigate = useNavigate();

  const { showId, seatIds } = useSearch({
    from: "/booking",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const seats = seatIds
    ? seatIds.split(",").filter(Boolean)
    : [];

  const confirmBooking = async () => {
    setError("");
    setMessage("");

    if (!showId || seats.length === 0) {
      setError("Show or seats are missing");
      return;
    }

    setLoading(true);

    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          showId: Number(showId),
          seatIds: seats.map(Number),
        }),
      });

      setMessage("Booking successful!");

      setTimeout(() => {
        navigate({
          to: "/",
        });
      }, 1000);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-lg">

        <div className="rounded-xl bg-white p-6 shadow">

          <h1 className="mb-6 text-3xl font-bold">
            Confirm Booking
          </h1>

          {error && (
            <p className="mb-4 text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="mb-4 text-green-600">
              {message}
            </p>
          )}

          <div className="space-y-3">

            <p>
              <span className="font-semibold">
                Show ID:
              </span>{" "}
              {showId}
            </p>

            <p>
              <span className="font-semibold">
                Selected Seats:
              </span>{" "}
              {seats.join(", ")}
            </p>

            <p>
              <span className="font-semibold">
                Number of Seats:
              </span>{" "}
              {seats.length}
            </p>

          </div>

          <button
            onClick={confirmBooking}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Booking;

