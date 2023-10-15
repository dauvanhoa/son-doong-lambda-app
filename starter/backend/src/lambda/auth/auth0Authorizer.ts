import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult,
} from "aws-lambda";
import Axios from "axios";
import { JwtPayload, verify } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

const jwksUrl = process.env.JWKS_URL;

// TODO: Implement tokenAuthorizer
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    // Get the token from the header
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info(`User was authorized with JWT token: ${jwtToken}`);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error(`Failed to login! Message: {e.message}`);
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

/**
 * Verify token
 * @param authHeader Authorization Token Header
 * @returns JwtPayload
 */
async function verifyToken(authHeader) {
  // TODO: Implement token verification
  try {
    // Get the token from the header
    const token = getToken(authHeader);

    // Get the JWKS from the endpoint
    const res = await Axios.get(jwksUrl);

    // Get the signing key from the JWKS endpoint
    const pemData = res["data"]["keys"][0]["x5c"][0];

    // Create the certificate
    const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;

    // Verify the token using the cert from the jwks endpoint
    return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
  } catch (err) {
    logger.error(`Failed to verify token! Message: ${err.message}`);
    throw new Error("Failed to verify token");
  }
}

/**
 * Get token from Authorization header
 * @param authHeader Authorization Token Header
 * @returns token
 */
function getToken(authHeader) {
  // Check if the header is undefined
  if (!authHeader) {
    logger.error("No authentication header");
    throw new Error("No authentication header");
  }

  // Check if the header starts with "bearer "
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    logger.error("Invalid authentication header");
    throw new Error("Invalid authentication header");
  }

  // Get the token from the header
  const split = authHeader.split(" ");
  const token = split[1];

  // Return the token
  return token;
}
