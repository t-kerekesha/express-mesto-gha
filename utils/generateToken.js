const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

module.exports.generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret-key',
    { expiresIn: '7d' },
  );
  return token;
};
