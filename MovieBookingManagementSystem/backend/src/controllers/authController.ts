import { FastifyInstance } from "fastify";

import {
  registerUser,
  loginUser,
} from "../controllers/authController";

const authRoutes = async (
  app: FastifyInstance
) => {
  app.post("/register", registerUser);
  app.post("/login", loginUser);
};

export default authRoutes;