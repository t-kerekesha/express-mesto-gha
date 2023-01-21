const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { validateEmailPassword, validateCookies } = require('./middlewares/validation');

const NotFoundError = require('./errors/NotFoundError');

const app = express();
app.use(cookieParser());

const {
  PORT = 3000, // cлушаем 3000 порт
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;
app.use(cors());

// app.use(express.json());

app.post('/signin', express.json(), validateEmailPassword, login);
app.post('/signup', express.json(), validateEmailPassword, createUser);
app.use('/users', validateCookies, auth, usersRoutes);
app.use('/cards', validateCookies, auth, cardsRoutes);

app.use('*', (request, response, next) => next(new NotFoundError('Неверный путь')));

// Обработка ошибок
// app.use(errors());
app.use(errorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL); // подключение к серверу mongo
  console.log(`Server connect db ${MONGO_URL}`);

  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
