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
    private todoRepository: DataLayer
  ) {
    this.logger = createLogger("Todo Service");
  }

  async getAll(userId: string): Promise<Todo[]> {
    this.logger.info(`Getting all todos for user: ${userId}`);

    return this.todoRepository.getAll(userId);
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

    return await this.todoRepository.create(newTodo);
  }

  async update(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<Todo> {
    this.logger.info(`Updating todo: ${todoId} for user: ${userId}`);

    return await this.todoRepository.update(todoId, userId, todoUpdate);
  }
}
