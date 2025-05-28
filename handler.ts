import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import crypto from "crypto";
import {
  DynamoDBClient,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// Setup DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" } as DynamoDBClientConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Environment variable
const TABLE_NAME = process.env.NOTES_TABLE_NAME || "";

interface NoteData {
  title: string;
  body: string;
}

export const createNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data: NoteData = JSON.parse(event.body || "{}");
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          notesId: `test-note-${Date.now()}`,//crypto.randomUUID(),
          title: data.title,
          body: data.body,
        },
        ConditionExpression: "attribute_not_exists(notesId)",
      })
    );
    return {
      statusCode: 201,
      body: JSON.stringify("A new note is created"),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
};

export const updateNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data: NoteData = JSON.parse(event.body || "{}");
  const noteId = event.pathParameters?.id || "";

  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { notesId: noteId },
        ConditionExpression: "attribute_exists(notesId)",
        UpdateExpression: "set title = :t, body = :b",
        ExpressionAttributeValues: {
          ":t": data.title,
          ":b": data.body,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`The note with id ${noteId} is updated`),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
};

export const deleteNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const noteId = event.pathParameters?.id || "";
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { notesId: noteId },
        ConditionExpression: "attribute_exists(notesId)",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`The note with id ${noteId} is deleted`),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};

export const getNoteById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const noteId = event.pathParameters?.id || "";
  try {
    const data = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { notesId: noteId },
        ConditionExpression: "attribute_exists(notesId)",
      })
    );

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify(`The note with id ${noteId} is not found`),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};

export const getAllNotes = async (): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Limit: 2,
    };

    let lastEvaluatedKey: any = undefined;
    let allItems: any[] = [];

    do {
      if (lastEvaluatedKey) {
        (params as any).ExclusiveStartKey = lastEvaluatedKey;
      }
      const data = await docClient.send(new ScanCommand(params));
      lastEvaluatedKey = data.LastEvaluatedKey;
      allItems = allItems.concat(data.Items || []);
    } while (lastEvaluatedKey);

    return {
      statusCode: 200,
      body: JSON.stringify({ Items: allItems }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
