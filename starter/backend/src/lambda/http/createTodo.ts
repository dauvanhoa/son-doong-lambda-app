import { middyfy } from "../../utils/middy";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import business from "../../businessLogic";
import { TodoCreate } from "../../models/todoCreate";

export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Create Todo Handler");
    try {
      const userId = getUserId(event);

      const todoCreate: TodoCreate = event.body as any;

      const toDoItem = await business.create(todoCreate, userId);

      logger.info(`Successfully created Todo: ${toDoItem}`);

      return {
        statusCode: HttpStatusCode.Created,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          item: toDoItem,
        }),
      };
    } catch (e) {
      logger.error(`Error creating Todo: ${e.message}`);

      return {
        statusCode: HttpStatusCode.InternalServerError,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: e.message,
        }),
      };
    }
  }
);
