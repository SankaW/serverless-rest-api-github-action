"use strict";

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify("A new note is created"),
  };
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
