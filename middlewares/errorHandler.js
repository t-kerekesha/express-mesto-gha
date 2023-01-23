const { CelebrateError } = require('celebrate');

module.exports.errorHandler = (error, request, response, next) => {
  // if (error instanceof SyntaxError) {
  //   response.status(error.status).send({ message: 'Переданные данные содержат синтаксическую ошибку' });
  // } else if (error instanceof CelebrateError) {
  //   const messageCelebrateError = Object.values(Object.fromEntries(error.details))
  //     .map((value) => value.details
  //       .map((detail) => detail.message)
  //       .join(', '))
  //     .join(', ');

  //   response.status(400).send({ message: messageCelebrateError });
  // } else {
    const { statusCode = 500, message } = error;

    response.status(statusCode).send({
      message: statusCode === 500
        ? `На сервере произошла ошибка ${error.name}: ${error.message}` // Обработка ошибок по умолчанию
        : message,
    });
  // }
  next();
};
