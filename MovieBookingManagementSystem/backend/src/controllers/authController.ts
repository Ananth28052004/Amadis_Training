import { FastifyReply, FastifyRequest } from "fastify";
import User from "../models/User.js";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export const registerUser = async (
  request: FastifyRequest<{
    Body: RegisterBody;
  }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password } = request.body;

    // Check required fields
    if (!name || !email || !password) {
      return reply.code(400).send({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return reply.code(409).send({
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });
    return reply.code(201).send({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return reply.code(500).send({
      message: "Registration failed",
    });
  }
};

export const loginUser = async (
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    // Check required fields
    if (!email || !password) {
      return reply.code(400).send({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return reply.code(401).send({
        message: "Invalid email or password",
      });
    }

    // Check password
    if (user.password !== password) {
      return reply.code(401).send({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return reply.code(500).send({
      message: "Login failed",
    });
  }
};
