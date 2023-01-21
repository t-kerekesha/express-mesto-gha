const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
} = require('../utils/constants');

// Возвращение всех карточек
module.exports.getCards = (request, response, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => response.status(STATUS_CODE_OK).send({ data: cards }))
    .catch(next);
};

// Создание карточки
module.exports.createCard = (request, response, next) => {
  // const { name, link } = request.body;
  Card.create({
    name: request.body.name,
    link: request.body.link,
    owner: request.user._id,
  })
    .then((card) => Card.populate(card, { path: 'owner' }))
    .then((card) => response.status(STATUS_CODE_CREATED).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при создании карточки: ${error.message}`));
      } else {
        next(error);
      }
    });
};

// Удаление карточки по идентификатору
module.exports.deleteCardById = (request, response, next) => {
  Card.findById(request.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      if (request.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError('Удалять карточки других пользователей нельзя');
      }

      Card.findByIdAndRemove(request.params.cardId)
        .then(() => response.status(STATUS_CODE_OK).send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: ${error.message}`));
      } else {
        next(error);
      }
    });
};

// Добавление или удаление лайка
function updateLike(request, response, next, { operator }) {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { [operator]: { likes: request.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Передан несуществующий id карточки'))
    .then((card) => response.status(STATUS_CODE_OK).send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные для постановки или снятии лайка: ${error.message}`));
      } else {
        next(error);
      }
    });
}

// Добавление лайка карточке
module.exports.likeCard = (request, response, next) => {
  updateLike(request, response, next, { operator: '$pull' }); // добавить id в массив лайков, если его там нет
};

// Удаление лайка у карточки
module.exports.dislikeCard = (request, response, next) => {
  updateLike(request, response, next, { operator: '$pull' }); // убрать id из массива лайков
};
