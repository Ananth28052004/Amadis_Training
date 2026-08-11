import Fastify from "fastify";
import sequelize from "./config/database.js";
import User from "./models/User.js";

const fastify = Fastify();

try {
  await sequelize.authenticate();
  console.log("✅ PostgreSQL connected successfully.");

  await sequelize.sync();
  console.log("Models synced.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
fastify.get("/users", async (request, reply) => {
  const users = await User.findAll();
  return users;
});
fastify.get("/users/:id", async (request, reply) => {
  const user = await User.findByPk(request.params.id);
  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }
  return user;
});
fastify.post("/users", async (request, reply) => {
  const { name, email } = request.body;
  const user = await User.create({ name, email });
  return reply.code(201).send(user);
});
fastify.put("/users/:id", async (request, reply) => {
  const user = await User.findByPk(request.params.id);
  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }
  await user.update(request.body);
  return user;
});

fastify.delete("/users/:id", async (request, reply) => {
  const user = await User.findByPk(request.params.id);
  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }
  await user.destroy();
  return { message: "User deleted" };
});

try {
  await fastify.listen({ port: 3000 });
  console.log("Server running on http://localhost:3000");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}