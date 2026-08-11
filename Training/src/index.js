require('dotenv').config();

const Fastify = require('fastify');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({ logger: true });

/**
 * Health check — simple GET endpoint to verify server is running
 */
fastify.get('/', async () => ({
  message: 'API Training Project is running',
  docs: 'See README.md for API examples',
}));

fastify.register(userRoutes, { prefix: '/users' });
fastify.setErrorHandler(errorHandler);

async function startServer() {
  await sequelize.sync();
  console.log('Database connected. "users" table is ready.');

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Try: GET http://localhost:${PORT}/users`);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
