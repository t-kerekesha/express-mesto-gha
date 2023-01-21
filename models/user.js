const mongoose = require('mongoose');
const validator = require('validator');
const { regExpUrl } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Обязательное поле'],
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
  name: { // имя пользователя
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: { // информация о пользователе
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => regExpUrl.test(value),
    },
  },
});

module.exports = mongoose.model('user', userSchema);
