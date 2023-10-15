import * as winston from "winston";
import { Logger } from "winston";

/**
 * Creates a logger with the given name.
 * @param loggerName The name of the logger.
 * @returns The logger.
 */
export function createLogger(loggerName: string): Logger {
  return winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [new winston.transports.Console()],
  });
}
