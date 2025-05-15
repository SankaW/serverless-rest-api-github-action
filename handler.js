"use strict";
const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = DynamoDBDocumentClient.from(client);

module.exports.createNote = async (event) => {
  let data = JSON.parse(event.body);
  try {
    await docClient.send(
      new PutCommand({
        TableName: "notes",
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
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${noteId} is updated`),
  };
};

module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id ${noteId} is deleted`),
  };
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
