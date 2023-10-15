import { APIGatewayProxyEvent } from 'aws-lambda';
import { parseUserId } from '../auth/utils'

/**
 * Get a user id from a JWT token
 * @param event API Gateway event
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent) {
  // TODO: Return a user id from the JWT token
  // Get Authorization header from event
  const authorization = event.headers.Authorization;

  // Get the token from the Authorization header
  const split = authorization.split(" ");
  const jwtToken = split[1];

  // Parse the JWT token and return a user id
  return parseUserId(jwtToken);
}