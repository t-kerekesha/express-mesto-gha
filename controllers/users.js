const User = require('../models/user');

// Возвращение всех пользователей
module.exports.getUsers = (request, response) => {
  User.find({})
    .then((users) => response.status(200).send({ data: users }))
    .catch((error) => {
      // Обработка ошибок по умолчанию
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Возвращение пользователя по _id
module.exports.getUserById = (request, response) => {
  User.findById(request.params.userId)
    .then((user) => response.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        response.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Cоздание пользователя
module.exports.createUser = (request, response) => {
  const { name, about, avatar } = request.body;

  User.create({ name, about, avatar })
    .then((user) => response.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        response.status(400).send({ message: `Переданы некорректные данные при создании пользователя: ${error.message}` });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Обновление профиля
module.exports.updateUser = (request, response) => {
  const { name, about } = request.body;
  User.findByIdAndUpdate(
    request.user._id,
    { name, about },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
      upsert: true, // если документ не найден, создать его
    },
  )
    .then((user) => response.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        response.status(400).send({ message: `Переданы некорректные данные при обновлении профиля: ${error.message}` });
        return;
      }
      if (error.name === 'CastError') {
        response.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Обновление аватара
module.exports.updateAvatar = (request, response) => {
  const { avatar } = request.body;
  User.findByIdAndUpdate(
    request.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => response.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        response.status(400).send({ message: `Переданы некорректные данные при обновлении аватара: ${error.message}` });
        return;
      }
      if (error.name === 'CastError') {
        response.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};
