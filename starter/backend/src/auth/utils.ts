import { decode, JwtPayload } from 'jsonwebtoken'
import { createLogger } from '../utils/logger'

const logger = createLogger('utils')

/**
 * Parse a user id from a JWT token
 * @param jwtToken JWT token
 * @returns a user id from a JWT token
 */
export function parseUserId(jwtToken: string) {
  // Decode the JWT token
  const decodedJwt = decode(jwtToken) as JwtPayload;
  logger.info("Decode JWT: ", decodedJwt);
  
  // Return the user id from the decoded JWT token
  return decodedJwt.sub;
}