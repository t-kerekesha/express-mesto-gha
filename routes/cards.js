const express = require('express');

const cardsRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/', getCards); // возвращает все карточки
cardsRoutes.post('/', express.json(), createCard); // создаёт карточку
cardsRoutes.delete('/:cardId', deleteCardById); // удаляет карточку по идентификатору
cardsRoutes.put('/:cardId/likes', likeCard); // поставить лайк карточке
cardsRoutes.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = cardsRoutes;
