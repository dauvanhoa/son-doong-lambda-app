import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

/**
 * Middyfy a handler.
 * @param handler The handler to middyfy.
 * @returns The middyfied handler.
 */
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
