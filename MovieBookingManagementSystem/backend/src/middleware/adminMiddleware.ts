import { FastifyReply, FastifyRequest } from "fastify";

export const adminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();

    const user = request.user as {
      id: number;
      role: string;
    };

    if (user.role !== "ADMIN") {
      return reply.code(403).send({
        message: "Admin access required",
      });
    }
  } catch (error) {
    return reply.code(401).send({
      message: "Unauthorized",
    });
  }
};