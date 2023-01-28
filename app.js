const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const {
  validateEmailPassword,
  validateUserData,
  validateCookies,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const BadRequestError = require('./errors/BadRequestError');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
app.use(cookieParser());

const {
  PORT = 3000, // cлушаем 3000 порт
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;
app.use(cors());

app.use(express.json({
  verify: (request, response, buffer) => {
    try {
      JSON.parse(buffer);
    } catch (error) {
      throw new BadRequestError('Переданные данные содержат синтаксическую ошибку');
    }
  },
}));

app.use(requestLogger); // логгер запросов

app.post('/signin', validateEmailPassword, login);
app.post('/signup', validateUserData, createUser);
app.use('/users', auth, validateCookies, usersRoutes);
app.use('/cards', auth, validateCookies, cardsRoutes);

app.use('*', auth, (request, response, next) => next(new NotFoundError('Неверный путь')));

app.use(errorLogger); // логгер ошибок

// Обработка ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок

async function connect() {
  await mongoose.connect(MONGO_URL); // подключение к серверу mongo
  console.log(`Server connect db ${MONGO_URL}`);

  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
