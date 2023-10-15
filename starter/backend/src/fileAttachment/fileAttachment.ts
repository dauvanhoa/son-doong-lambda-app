import { createLogger } from "../utils/logger";
import * as AWS from "aws-sdk";
import { Logger } from "winston";

export class FileAttachment {
  private logger: Logger;
  constructor(
    private readonly s3Client: AWS.S3,
    private readonly s3BucketName: string,
    private readonly urlExpiration: Number
  ) {
    this.logger = createLogger("Todo Storage");
  }

  async getAttachmentUrl(attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`;
    this.logger.info(`Attachment url: ${attachmentUrl}`);
    return attachmentUrl;
  }

  async getUploadUrl(attachmentId): Promise<string> {
    const uploadUrl = this.s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: attachmentId,
      Expires: this.urlExpiration,
    });
    this.logger.info(`Upload url: ${uploadUrl}`);
    return uploadUrl;
  }
}
