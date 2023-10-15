import { middyfy } from "../../utils/middy";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import business from "../../businessLogic";

// TODO: Delete a TODO item with the provided id
export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Delete Todo Handler");
    try {
      const userId = getUserId(event);

      const todoId = event.pathParameters.todoId;

      const deleteData = await business.delete(todoId, userId);
      logger.info(`Successfully deleted Todo: ${deleteData}`);

      return {
        statusCode: HttpStatusCode.Ok,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          result: deleteData,
        }),
      };
    } catch (e) {
      logger.error(`Error deleting Todo: ${e.message}`);

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
