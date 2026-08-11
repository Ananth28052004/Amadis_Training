const userController = require('../controllers/userController');

/**
 * Fastify plugin: Route → HTTP Method → Controller
 *
 * GET    /users       → getAllUsers   (list users, supports ?page=2&limit=10)
 * GET    /users/:id   → getUserById   (single user, :id is route param)
 * POST   /users       → createUser    (create + send welcome email)
 * PUT    /users/:id   → replaceUser   (full update)
 * PATCH  /users/:id   → patchUser     (partial update)
 * DELETE /users/:id   → deleteUser    (delete)
 */
async function userRoutes(fastify) {
  fastify.get('/', userController.getAllUsers);
  fastify.get('/:id', userController.getUserById);
  fastify.post('/', userController.createUser);
  fastify.put('/:id', userController.replaceUser);
  fastify.patch('/:id', userController.patchUser);
  fastify.delete('/:id', userController.deleteUser);
}

module.exports = userRoutes;
