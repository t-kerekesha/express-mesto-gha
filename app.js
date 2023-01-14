const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');

const app = express();

const {
  PORT = 3000, // cлушаем 3000 порт
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

app.use((request, response, next) => {
  request.user = {
    _id: '63bf00ae8b0bfddc3d95f78e',
  };
  next();
});
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', (request, response, next) => {
  response.status(ERROR_CODE_NOT_FOUND).send({ message: 'Неверный путь' });
  next();
});

async function connect() {
  await mongoose.connect(MONGO_URL, {}); // подключение к серверу mongo
  console.log(`Server connect db ${MONGO_URL}`);

  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
