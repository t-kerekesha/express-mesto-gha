const { CelebrateError } = require('celebrate');

module.exports.errorHandler = (error, request, response, next) => {
  if (error instanceof CelebrateError) {
    const messageCelebrateError = Object.values(Object.fromEntries(error.details))
      .map((value) => value.details
        .map((detail) => detail.message)
        .join(', '))
      .join(', ');

    response.status(400).send({ message: messageCelebrateError });
    return;
  }

  const { statusCode = 500, message } = error;

  response.status(statusCode).send({
    message: statusCode === 500
      ? `На сервере произошла ошибка ${error.name}: ${error.message}` // Обработка ошибок по умолчанию
      : message,
  });

  next();
};
