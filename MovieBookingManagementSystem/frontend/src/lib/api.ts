import axios from "axios";

export const API_URL = "http://localhost:5050/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cinebook_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type Movie = {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  rating: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Theater = {
  id: number;
  name: string;
  location: string;
  totalSeats: number;
};

export type Show = {
  id: number;
  movieId: number;
  theaterId: number;
  showTime: string;
  price: number;
  movie?: Movie;
  theater?: Theater;
  seats?: Seat[];
};

export type Seat = {
  id: number;
  showId: number;
  seatNumber: string;
  status: "available" | "booked";
};

export type Booking = {
  id: number;
  userId: number;
  showId: number;
  seatId: number;
  status: "confirmed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  show?: Show & { movie?: Movie; theater?: Theater };
  seat?: Seat;
};

export const saveSession = (token: string, user: User) => {
  localStorage.setItem("cinebook_token", token);
  localStorage.setItem("cinebook_user", JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  const value = localStorage.getItem("cinebook_user");
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem("cinebook_user");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("cinebook_token");
  localStorage.removeItem("cinebook_user");
};

export const isLoggedIn = () =>
  Boolean(localStorage.getItem("cinebook_token"));
