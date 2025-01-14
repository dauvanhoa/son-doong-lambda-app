import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk-core";
import { FileAttachment } from "./fileAttachment";

if (process.env.IS_OFFLINE) {
  AWSXRay.setContextMissingStrategy("LOG_ERROR");
}

const XAWS = AWSXRay.captureAWS(AWS);
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

const s3Client: AWS.S3 = new XAWS.S3({
  signatureVersion: "v4",
});

const fileStorage = new FileAttachment(
  s3Client,
  process.env.S3_BUCKET_NAME,
  urlExpiration
);
export default fileStorage;
