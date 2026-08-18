import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

import { api } from "../services/api";

const BookingConfirmation = () => {
  const { bookingId } = useParams({
    from: "/booking/$bookingId",
  });

  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getBooking = async () => {
      try {
        const data = await api(`/bookings/${bookingId}`);

        setTicket(data.ticket);
      } catch (error: any) {
        console.error(error);

        setError(
          error.message || "Failed to load booking"
        );
      } finally {
        setLoading(false);
      }
    };

    getBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading booking...
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

  if (!ticket) {
    return (
      <div className="p-10 text-center">
        Booking not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-2xl">

        {/* Success */}
        <div className="mb-6 text-center">

          <div className="text-5xl">
            ✅
          </div>

          <h1 className="mt-3 text-3xl font-bold">
            Booking Confirmed!
          </h1>

          <p className="mt-2 text-gray-500">
            Your movie ticket has been booked successfully.
          </p>

        </div>

        {/* Ticket */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <div className="border-b pb-5">

            <p className="text-sm text-gray-500">
              Booking Reference
            </p>

            <p className="text-xl font-bold">
              {ticket.bookingReference}
            </p>

          </div>

          {/* Show */}
          <div className="mt-6 space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Show Date
              </p>

              <p className="font-semibold">
                {ticket.show?.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Show Time
              </p>

              <p className="font-semibold">
                {ticket.show?.time?.slice(0, 5)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Seats
              </p>

              <p className="font-semibold">
                {ticket.seats?.join(", ")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <p className="text-2xl font-bold">
                ₹{ticket.totalAmount}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {ticket.status}
              </span>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">

            <button
              onClick={() => navigate({
                to: "/my-bookings",
              })}
              className="flex-1 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
              My Bookings
            </button>

            <button
              onClick={() => navigate({
                to: "/",
              })}
              className="flex-1 rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100"
            >
              Home
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingConfirmation;