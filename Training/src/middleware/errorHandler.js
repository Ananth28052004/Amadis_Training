function errorHandler(error, request, reply) {
  request.log.error(error);

  if (error.name === 'SequelizeValidationError') {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return reply.status(400).send({
      message: 'Duplicate value',
      errors: error.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  reply.status(500).send({ message: 'Internal Server Error' });
}

module.exports = errorHandler;
