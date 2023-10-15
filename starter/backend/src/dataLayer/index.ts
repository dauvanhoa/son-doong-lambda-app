import dynamoDBClient from "../dynamodb/dynamodbClient";
import DataLayer from "./data-layer";

const dataLayer = new DataLayer(
  dynamoDBClient(),
  process.env.TODO_TABLE
);

export default dataLayer;
