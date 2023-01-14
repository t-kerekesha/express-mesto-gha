const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: 2,
    maxlength: 30,
  },
  about: { // информация о пользователе
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
