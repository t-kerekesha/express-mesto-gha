const express = require('express');

const usersRoutes = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers); // возвращает всех пользователей
usersRoutes.get('/:userId', getUserById); // возвращает пользователя по _id
usersRoutes.post('/', express.json(), createUser); // создаёт пользователя
usersRoutes.patch('/me', express.json(), updateUser); // обновляет профиль
usersRoutes.patch('/me/avatar', express.json(), updateAvatar); // обновляет аватар

module.exports = usersRoutes;
