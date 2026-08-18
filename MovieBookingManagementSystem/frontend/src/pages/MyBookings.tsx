import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { api } from "../services/api";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate({
          to: "/login",
        });

        return;
      }

      try {
        const data = await api("/bookings/my");

        setBookings(data.bookings || []);
      } catch (error: any) {
        console.error(error);

        setError(
          error.message || "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }
const cancelBooking = async (bookingId: number) => {
  try {
    setError("");

    await api(`/bookings/${bookingId}/cancel`, {
      method: "PATCH",
    });

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "CANCELLED",
            }
          : booking
      )
    );
  } catch (error: any) {
    console.error(
      "Cancel booking error:",
      error
    );

    setError(
      error.message ||
        "Failed to cancel booking"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">

            <p className="text-gray-500">
              You don't have any bookings yet.
            </p>

            <button
              onClick={() =>
                navigate({
                  to: "/",
                })
              }
              className="mt-5 rounded-lg bg-black px-5 py-3 text-white"
            >
              Browse Movies
            </button>

          </div>
        ) : (
          <div className="space-y-4">

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl bg-white p-6 shadow"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Booking Reference
                    </p>

                    <p className="font-bold">
                      {booking.bookingReference}
                    </p>

                  </div>

                <span
  className={`rounded-full px-3 py-1 text-sm ${
    booking.status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}
>
  {booking.status}
</span>

                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">

                  <div>
                    <p className="text-sm text-gray-500">
                      Show ID
                    </p>

                    <p className="font-semibold">
                      {booking.showId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Seats
                    </p>

                    <p className="font-semibold">
                      {booking.seatIds?.join(", ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="font-semibold">
                      ₹{booking.totalAmount}
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex gap-3">

  <button
    onClick={() =>
      navigate({
        to: "/booking/$bookingId",
        params: {
          bookingId: String(booking.id),
        },
      })
    }
    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
  >
    View Ticket
  </button>

  <button
  onClick={() => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmed) {
      cancelBooking(booking.id);
    }
  }}
  disabled={booking.status === "CANCELLED"}
  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
>
  {booking.status === "CANCELLED"
    ? "Cancelled"
    : "Cancel Booking"}
</button>

</div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
  
};

export default MyBookings;