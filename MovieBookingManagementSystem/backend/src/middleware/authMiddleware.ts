import { FastifyReply, FastifyRequest } from "fastify";

type UserPayload = {
  id: number;
  email: string;
  role: "user" | "admin";
};

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.code(401).send({
      message: "Unauthorized. Please login first.",
    });
  }
};

export const adminOnly = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();

    const user = request.user as UserPayload;

    if (user.role !== "admin") {
      return reply.code(403).send({
        message: "Admin access required",
      });
    }
  } catch (error) {
    return reply.code(401).send({
      message: "Unauthorized. Please login first.",
    });
  }
};
