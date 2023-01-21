const express = require('express');

const cardsRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validateNameLink, validateСardId } = require('../middlewares/validation');

cardsRoutes.get('/', getCards); // возвращает все карточки
cardsRoutes.post('/', express.json(), validateNameLink, createCard); // создаёт карточку
cardsRoutes.delete('/:cardId', validateСardId, deleteCardById); // удаляет карточку по идентификатору
cardsRoutes.put('/:cardId/likes', validateСardId, likeCard); // поставить лайк карточке
cardsRoutes.delete('/:cardId/likes', validateСardId, dislikeCard); // убрать лайк с карточки

module.exports = cardsRoutes;
