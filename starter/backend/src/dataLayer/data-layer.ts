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

}
