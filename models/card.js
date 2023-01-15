const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на картинку
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
    },
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: { // список лайкнувших пост пользователей
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: { // дата создания
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
