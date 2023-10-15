import { middyfy } from "../../utils/middy";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import business from "../../businessLogic";
import { TodoUpdate } from "../../models/todoUpdate";

// TODO: Implement updateTodo handler
export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Update Todo Handler");
    try {
      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;
      const updatedTodo: TodoUpdate = event.body as any;

      const toDoItem = await business.update(todoId, userId, updatedTodo);
      logger.info(`Successfully updated Todo: ${toDoItem}`);

      return {
        statusCode: HttpStatusCode.Ok,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          item: toDoItem,
        }),
      };
    } catch (e) {
      logger.error(`Error updating Todo: ${e.message}`);

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
