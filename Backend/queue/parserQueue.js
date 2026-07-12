const Queue = require("bull");

const parserQueue = new Queue("pdf-parser", {
    redis: {
        host: "127.0.0.1",
        port: 6379
    }
});

module.exports = parserQueue;