import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

import { api } from "../services/api";
import type { Seat } from "../types/types";

const SeatSelection = () => {
  const { showId } = useParams({
    from: "/seats/$showId",
  });

  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [locking, setLocking] = useState(false);
const [lockMessage, setLockMessage] = useState("");

const lockSeats = async () => {
  if (selectedSeats.length === 0) {
    setLockMessage("Please select at least one seat");
    return;
  }

  setLocking(true);
  setLockMessage("");

  try {
    const result = await api("/bookings/lock", {
      method: "POST",
      body: JSON.stringify({
        showId: Number(showId),
        seatIds: selectedSeats,
      }),
    });

    console.log("Lock result:", result);

    setLockMessage(
      "Seats locked successfully for 5 minutes"
    );
  } catch (error: any) {
    console.error("Lock seats error:", error);

    setLockMessage(
      error.message || "Failed to lock seats"
    );
  } finally {
    setLocking(false);
  }
};
useEffect(() => {
  if (!token) {
    navigate({
      to: "/login",
    });

    return;
  }

  const getSeats = async () => {
    try {
      const data = await api(`/seats/show/${showId}`);

      setSeats(data.seats || data);
    } catch (error: any) {
      setError(error.message || "Failed to load seats");
    } finally {
      setLoading(false);
    }
  };

  getSeats();
}, [showId, token, navigate]);
useEffect(() => {
  const loadSeats = async () => {
    try {
      const data = await api(
        `/seats/show/${showId}`
      );

      setSeats(data.seats || data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Failed to load seats"
      );
    } finally {
      setLoading(false);
    }
  };

  loadSeats();
}, [showId]);
  const selectSeat = (seat: Seat) => {
    if (seat.status !== "AVAILABLE") {
      return;
    }

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(
        selectedSeats.filter((id) => id !== seat.id)
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat.id,
      ]);
    }
  };

 const continueBooking = async () => {
  if (selectedSeats.length === 0) {
    setError("Please select at least one seat");
    return;
  }

  try {
    setError("");

    const data = await api("/bookings", {
      method: "POST",
      body: JSON.stringify({
        showId: Number(showId),
        seatIds: selectedSeats,
      }),
    });

    navigate({
      to: "/booking/$bookingId",
      params: {
        bookingId: String(data.booking.id),
      },
    });
  } catch (error: any) {
    console.error("Booking error:", error);

    setError(
      error.message || "Booking failed"
    );
  }
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
      <div className="mx-auto max-w-5xl p-10">
        <p className="rounded-md bg-red-100 p-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <h1 className="mb-2 text-3xl font-bold">
          Select Your Seats
        </h1>

        <p className="mb-8 text-gray-500">
          Show ID: {showId}
        </p>

        {/* Screen */}
        <div className="mb-10">

          <div className="mx-auto max-w-2xl rounded-lg bg-gray-800 py-3 text-center text-white">
            SCREEN
          </div>

        </div>

        {/* Seats */}
        <div className="rounded-xl bg-white p-8 shadow">

          <div className="grid grid-cols-5 gap-4 sm:grid-cols-8 md:grid-cols-10">

            {seats.map((seat) => {

              const selected =
                selectedSeats.includes(seat.id);

              const unavailable =
                seat.status !== "AVAILABLE";

              return (
                <button
                  key={seat.id}
                  onClick={() => selectSeat(seat)}
                  disabled={unavailable}
                  className={`
                    flex h-10 items-center justify-center rounded-md text-sm font-medium
                    ${
                      unavailable
                        ? "cursor-not-allowed bg-red-500 text-white"
                        : selected
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                    }
                  `}
                >
                  {seat.seatNumber}
                </button>
              );
            })}

          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-gray-200" />
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-green-500" />
              Selected
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-red-500" />
              Booked
            </div>
            <button
  onClick={lockSeats}
  disabled={
    locking || selectedSeats.length === 0
  }
  className="mt-6 rounded-lg bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
>
  {locking
    ? "Locking Seats..."
    : "Continue"}
</button>
{lockMessage && (
  <p className="mt-4">
    {lockMessage}
  </p>
)}

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-5 shadow">

          <div>
            <p className="text-sm text-gray-500">
              Selected Seats
            </p>

            <p className="text-xl font-bold">
              {selectedSeats.length}
            </p>
          </div>

          <button
            onClick={continueBooking}
            className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Continue
          </button>

        </div>

      </div>
    </div>
  );
  
};

export default SeatSelection;