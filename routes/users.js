const express = require('express');

const usersRoutes = express.Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validateUserId,
  validateNameAbout,
  validateAvatar,
} = require('../middlewares/validation');

usersRoutes.get('/', getUsers); // Возвращение всех пользователей
usersRoutes.get('/me', getCurrentUser); // Возвращение информации о текущем пользователе
usersRoutes.get('/:userId', validateUserId, getUserById); // Возвращение пользователя по _id
usersRoutes.patch('/me', validateNameAbout, updateUser); // обновляет профиль
usersRoutes.patch('/me/avatar', validateAvatar, updateAvatar); // обновляет аватар

module.exports = usersRoutes;
