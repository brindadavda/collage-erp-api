/* eslint-disable */
import { createLogger , transports , format } from "winston";

export const logger = createLogger({
    transports: [
        new transports.File({
            dirname: "logs",
            filename: "winston_example.log",
        }),
    ],
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, service }) => {
            return `[${timestamp}] ${service} ${level}: ${message}`;
        })
    ),
    defaultMeta: {
        service: "ServerWorking",
    },
});

