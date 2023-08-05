const winston = require("winston");

const customColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "blue",
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({ all: true, colors: customColors }),
    winston.format.printf(({ level, message }) => {
      return `${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
