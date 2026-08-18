export type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type Movie = {
  id: number;
  title: string;
  description: string;
  poster: string;
  duration: number;
  language: string;
};

export type Show = {
  id: number;
  movieId: number;
  showDate: string;
  showTime: string;
  price: number;
};

export type Seat = {
  id: number;
  showId: number;
  seatNumber: string;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  lockedUntil?: string | null;
};

export type Booking = {
  id: number;
  userId: number;
  showId: number;
  seatIds: number[];
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
  bookingReference: string;
};