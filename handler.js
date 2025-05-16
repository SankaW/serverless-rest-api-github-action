"use strict";
const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.NOTES_TABLE_NAME;

module.exports.createNote = async (event) => {
  let data = JSON.parse(event.body);
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          notesId: crypto.randomUUID(),
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
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
};

module.exports.updateNote = async (event) => {
  let data = JSON.parse(event.body);
  const noteId = event.pathParameters.id;
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          notesId: noteId,
        },
        ConditionExpression: "attribute_exists(notesId)",
        UpdateExpression: "set title = :t, body = :b",
        ExpressionAttributeValues: {
          ":t": data.title,
          ":b": data.body,
        },
      })
    );
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${noteId} is updated`),
  };
};

module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          notesId: noteId,
        },
        ConditionExpression: "attribute_exists(notesId)",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`The note with id ${noteId} is deleted`),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("All notes are returned"),
  };
};

module.exports.getNoteById = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${noteId} is returned`),
  };
};
