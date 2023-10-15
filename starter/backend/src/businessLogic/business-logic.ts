import { FileAttachment } from './../fileAttachment/fileAttachment';
import Todo from "../models/todo";
import DataLayer from "../dataLayer/data-layer";
import { createLogger } from "../utils/logger";
import { Logger } from "winston";
import { v4 } from "uuid";
import { TodoCreate } from "../models/todoCreate";
import { TodoUpdate } from "src/models/todoUpdate";

export default class BusinessLogic {
  private logger: Logger;
  constructor(
    private dataAccess: DataLayer,
    private fileAttachment: FileAttachment
  ) {
    this.logger = createLogger("Todo Service");
  }

  async getAll(userId: string): Promise<Todo[]> {
    this.logger.info(`Getting all todos for user: ${userId}`);

    return this.dataAccess.getAll(userId);
  }

  async create(todoCreate: TodoCreate, userId: string): Promise<Todo> {
    const todoId = v4();
    const newTodo: Todo = Object.assign({}, todoCreate, {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: "",
      done: false,
    });

    this.logger.info(`Creating todo: ${newTodo} for user: ${userId}`);

    return await this.dataAccess.create(newTodo);
  }

  async update(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<Todo> {
    this.logger.info(`Updating todo: ${todoId} for user: ${userId}`);

    return await this.dataAccess.update(todoId, userId, todoUpdate);
  }

  async delete(todoId: string, userId: string): Promise<any> {
    this.logger.info(`Deleting todo: ${todoId} for user: ${userId}`);
    return await this.dataAccess.delete(todoId, userId);
  }

  async updateAttachmentUrl(
    userId: string,
    todoId: string,
    attachmentId: string
  ) {
    const attachmentUrl = await this.fileAttachment.getAttachmentUrl(attachmentId);
    this.logger.info(
      `Updating attachment url: ${attachmentUrl} for todo: ${todoId} for user: ${userId}`
    );

    const item = await this.dataAccess.getById(todoId, userId);

    if (!item) {
      this.logger.error(
        `Item with id: ${todoId} not found to update attachment url`
      );
      throw new Error("Item not found");
    }
    if (item.userId !== userId) {
      this.logger.error(
        `User: ${userId} is not authorized to update item: ${todoId}`
      );
      throw new Error("User is not authorized to update item");
    }

    await this.dataAccess.updateAttachmentUrl(
      todoId,
      userId,
      attachmentUrl
    );

    this.logger.info(
      `Successfully updated attachment url: ${attachmentUrl} for todo: ${todoId} for user: ${userId}`
    );
  }

  async generateUploadUrl(attachmentId: string): Promise<string> {
    const uploadUrl = await this.fileAttachment.getUploadUrl(attachmentId);
    this.logger.info(
      `Successfully generated upload url: ${uploadUrl} for attachment: ${attachmentId}`
    );
    return uploadUrl;
  }
}
