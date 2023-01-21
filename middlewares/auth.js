const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

module.exports.auth = (request, response, next) => {
  const token = request.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    // Верификация токена
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret-key',
    );
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Неверный токен'));
    } else {
      next(error);
    }
  }

  request.user = payload;

  next();
};
