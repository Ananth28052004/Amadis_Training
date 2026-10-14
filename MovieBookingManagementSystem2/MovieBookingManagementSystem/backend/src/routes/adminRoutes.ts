import {FastifyInstance,FastifyReply,FastifyRequest,} from "fastify";
import {getAdminDashboard,} from "../controllers/adminController.js";


// AUTHENTICATION
const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.code(401).send({
      message:
        "Unauthorized. Please login first.",
    });
  }
};

// ADMIN ROUTES
const adminRoutes = async (
  app: FastifyInstance
) => {
  app.get("/dashboard",
    {
      preHandler: authenticate,
    },
    getAdminDashboard
  );
};

export default adminRoutes;