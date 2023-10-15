import Todo from "../models/todo";
import DataLayer from "../dataLayer/data-layer";
import { createLogger } from "../utils/logger";
import { Logger } from "aws-xray-sdk-core";

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
}
