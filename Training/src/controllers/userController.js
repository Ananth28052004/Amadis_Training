const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

/**
 * GET /users
 * Retrieve all users (HTTP GET = read data)
 */
async function getAllUsers(request, reply) {
  const {  limit = 10 } = request.query;

  const users = await User.findAll({
    limit: Number(limit),
    order: [['id', 'ASC']],
  });

  return reply.status(200).send({
    message: 'Users fetched successfully',
    data: users,
  });
}

/**
 * GET /users/:id
 * Retrieve one user by route parameter (e.g. /users/101)
 */
async function getUserById(request, reply) {
  const user = await User.findByPk(request.params.id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  return reply.status(200).send({
    message: 'User fetched successfully',
    data: user,
  });
}

/**
 * POST /users
 * Create a new user (HTTP POST = create data)
 * Body example: { "name": "Preethi", "email": "preethi@gmail.com", "age": 25 }
 */
async function createUser(request, reply) {
  const { name, email, age } = request.body;

  if (!name || !email) {
    return reply.status(400).send({ message: 'name and email are required' });
  }

  const user = await User.create({ name, email, age });

  const emailResult = await sendWelcomeEmail(user);

  return reply.status(201).send({
    message: 'User created successfully',
    data: user,
    email: emailResult,
  });
}

/**
 * PUT /users/:id
 * Replace/update entire user (HTTP PUT = full update)
 */
async function replaceUser(request, reply) {
  const user = await User.findByPk(request.params.id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  const { name, email, age } = request.body;

  if (!name || !email) {
    return reply.status(400).send({ message: 'name and email are required for PUT' });
  }

  await user.update({ name, email, age });

  return reply.status(200).send({
    message: 'User updated successfully',
    data: user,
  });
}

/**
 * PATCH /users/:id
 * Partial update (HTTP PATCH = update only sent fields)
 */
async function patchUser(request, reply) {
  const user = await User.findByPk(request.params.id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  await user.update(request.body);

  return reply.status(200).send({
    message: 'User partially updated successfully',
    data: user,
  });
}

/**
 * DELETE /users/:id
 * Remove a user (HTTP DELETE = delete data)
 */
async function deleteUser(request, reply) {
  const user = await User.findByPk(request.params.id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  await user.destroy();

  return reply.status(204).send();
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  replaceUser,
  patchUser,
  deleteUser,
};
