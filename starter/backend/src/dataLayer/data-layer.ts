import Todo from "../models/todo";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { Logger } from "winston";
import { TodoUpdate } from "src/models/todoUpdate";

export default class DataLayer {
  private logger: Logger;
  constructor(private docClient: DocumentClient, private tableName: string) {
    this.logger = createLogger("Todo Repository");
  }

  async getAll(userId: string): Promise<Todo[]> {
    const param = {
      TableName: this.tableName,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await this.docClient.query(param).promise();

    this.logger.info(
      `Successfully retrieved Todos: ${result.Items} for user: ${userId}`
    );

    return result.Items as Todo[];
  }

  async create(todo: Todo): Promise<Todo> {
    const param = {
      TableName: this.tableName,
      Item: todo,
    };

    await this.docClient.put(param).promise();

    this.logger.info(
      `Successfully created Todo: ${todo} for user: ${todo.userId}`
    );

    return todo as Todo;
  }

  async update(
    todoId: string,
    userId: string,
    updateTodo: Partial<TodoUpdate>
  ): Promise<Todo> {
    const param = {
      TableName: this.tableName,
      Key: { todoId: todoId, userId: userId },
      UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done",
      },
      ExpressionAttributeValues: {
        ":name": updateTodo.name,
        ":dueDate": updateTodo.dueDate,
        ":done": updateTodo.done,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await this.docClient.update(param).promise();

    this.logger.info(
      `Successfully updated Todo: ${result.Attributes} for user: ${userId}`
    );

    return result.Attributes as Todo;
  }

  async delete(todoId: string, userId: string): Promise<any> {
    const param = {
      TableName: this.tableName,
      Key: {
        todoId: todoId,
        userId: userId,
      },
    };

    const result = await this.docClient.delete(param).promise();

    this.logger.info(
      `Successfully deleted Todo: ${result} for user: ${userId}`
    );

    return result;
  }

  async updateAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ) {
    const param = {
      TableName: this.tableName,
      Key: {
        todoId,
        userId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl,
      },
    };

    await this.docClient.update(param).promise();

    this.logger.info("Successfully updated attachmentUrl");
  }

  async getById(todoId: string, userId: string): Promise<Todo> {
    const param = {
      TableName: this.tableName,
      Key: {
        todoId,
        userId,
      },
    };

    const result = await this.docClient.get(param).promise();

    const item = result.Item;
    this.logger.info(
      `Successfully retrieved Todo: ${item} for user: ${userId}`
    );

    return item as Todo;
  }
}
