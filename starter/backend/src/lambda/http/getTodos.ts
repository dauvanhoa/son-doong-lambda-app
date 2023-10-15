import { middyfy } from "../../utils/middy";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import Todo from "../../models/todo";
import business from "../../businessLogic";

// TODO: Get all TODO items for a current user
export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Get Todos Handler");

    const userId = getUserId(event);

    const todos: Todo[] = await business.getAll(userId);
    logger.info(`Successfully retrieved Todos: ${todos}`);

    return {
      statusCode: HttpStatusCode.Ok,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        items: todos,
      }),
    };
  }
);
