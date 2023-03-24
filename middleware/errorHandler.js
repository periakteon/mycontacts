// body ile gelen veride eksik alanlar varsa onları handle etmek amacıyla oluşturduk
// eğer hata olursa, hatayı HTML'e ekliyor, biz bu scripti middleware, yani aracı olarak kullanıp, transformasyon yapacağız JSON olarak

const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  // statusCode varsa onu al, yoksa tüm durumlarda 500 al
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });

    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });

    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });

    default:
      console.log("Hata yok. Her şey yolunda!");
      break;
  }
};

module.exports = errorHandler;
