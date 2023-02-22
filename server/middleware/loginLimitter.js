const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimitter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again in 60 seconds",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many requests: ${options.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimitter;
