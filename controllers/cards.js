const Card = require('../models/card');

// Возвращение всех карточек
module.exports.getCards = (request, response) => {
  Card.find({})
    .then((cards) => response.send({ data: cards }))
    .catch((error) => {
      // Обработка ошибок по умолчанию
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
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
        response.status(400).send({ message: `Переданы некорректные данные при создании карточки: ${error.message}` });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
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
        response.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
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
      if (error.name === 'ValidationError') {
        response.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${error.message}` });
        return;
      }
      if (error.name === 'CastError' || error.message === 'Not found') {
        response.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
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
      if (error.name === 'ValidationError') {
        response.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${error.message}` });
        return;
      }
      if (error.name === 'CastError' || error.message === 'Not found') {
        response.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      response.status(500).send({
        message: `Произошла неизвестная ошибка ${error.name}: ${error.message}`,
      });
    });
};