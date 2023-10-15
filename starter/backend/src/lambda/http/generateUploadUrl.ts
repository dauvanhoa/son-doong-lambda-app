import { middyfy } from "../../utils/middy";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import business from "../../businessLogic";
import { v4 } from "uuid";
import { HttpStatusCode } from "axios";

// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Generate Upload Url Handler");
    const userId = getUserId(event);

    const todoId = event.pathParameters.todoId;
    const attachmentId = v4();

    const uploadUrl = await business.generateUploadUrl(attachmentId);
    logger.info(`Successfully generated upload url: ${uploadUrl}`);

    try {
      await business.updateAttachmentUrl(userId, todoId, attachmentId);
      logger.info(`Successfully updated Todo attachment url: ${uploadUrl}`);

      return {
        statusCode: HttpStatusCode.Ok,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl,
        }),
      };
    } catch (e) {
      logger.error(`Error updating Todo attachment url: ${e.message}`);

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
