"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/* eslint-disable */
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.File({
            dirname: "logs",
            filename: "winston_example.log",
        }),
    ],
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message, service }) => {
        return `[${timestamp}] ${service} ${level}: ${message}`;
    })),
    defaultMeta: {
        service: "ServerWorking",
    },
});
