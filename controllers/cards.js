const Card = require('../models/card');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_COMMON = 500;

// Возвращение всех карточек
module.exports.getCards = (request, response) => {
  Card.find({})
    .then((cards) => response.send({ data: cards }))
    .catch((error) => {
      // Обработка ошибок по умолчанию
      response.status(ERROR_CODE_COMMON).send({
        message: `На сервере произошла ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Создание карточки
module.exports.createCard = (request, response) => {
  const { name, link } = request.body;
  Card.create({ name, link, owner: request.user._id })
    .then((card) => response.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        response.status(ERROR_CODE_VALIDATION).send({ message: `Переданы некорректные данные при создании карточки: ${error.message}` });
        return;
      }
      response.status(ERROR_CODE_COMMON).send({
        message: `На сервере произошла ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Удаление карточки по идентификатору
module.exports.deleteCardById = (request, response) => {
  Card.findByIdAndRemove(request.params.cardId)
    .then((card) => {
      if (!card) throw new Error('Not found');
      // if (request.user._id !== card.owner) throw new Error('Not owner');
      response.send({ message: 'Пост удалён' });
    })
    .catch((error) => {
      if (error.name === 'CastError' || error.message === 'Not found') {
        response.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      response.status(ERROR_CODE_COMMON).send({
        message: `На сервере произошла ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Добавление лайка карточке
module.exports.likeCard = (request, response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $addToSet: { likes: request.user._id } }, // добавить _id в массив лайков, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('Not found');
      response.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        response.status(ERROR_CODE_VALIDATION).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${error.message}` });
        return;
      }
      if (error.message === 'Not found') {
        response.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      response.status(ERROR_CODE_COMMON).send({
        message: `На сервере произошла ошибка ${error.name}: ${error.message}`,
      });
    });
};

// Удаление лайка у карточки
module.exports.dislikeCard = (request, response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: request.user._id } }, // убрать _id из массива лайков
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('Not found');
      response.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        response.status(ERROR_CODE_VALIDATION).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${error.message}` });
        return;
      }
      if (error.message === 'Not found') {
        response.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      response.status(ERROR_CODE_COMMON).send({
        message: `На сервере произошла ошибка ${error.name}: ${error.message}`,
      });
    });
};
