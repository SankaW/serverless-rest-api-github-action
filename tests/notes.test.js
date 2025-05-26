const setup = require("./steps/setup");
const { getIdToken } = require("./steps/auth");
const { apiClient } = require("./steps/client");

let idToken, client;

beforeAll(async () => {
  await setup();
  idToken = await getIdToken();
  client = apiClient(idToken);
});

// Create an Item
describe("POST /notes", () => {
  it("should create a new note", async () => {
    const newNote = {
      title: "3 Note from test after usrpool authorization",
      body: "Jest test 3",
    };

    const response = await client.post("notes", newNote);

    //console.log("🔍 Response.data:", response.data);
    // ✅ Assertions
    expect(response.status).toBe(201);
  });
});

// Get All Items list
describe("GET /notes", () => {
  it("should return 200 with notes list", async () => {
    const response = await client.get("notes");

    //console.log("🔑 ID Token:", idToken);
    // console.log("🔍 Response status:", response.status);
    // console.log("🔍 Response Data:", response.data);
    // console.log("📦 Response Type:", typeof response.data);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.Items)).toBe(true);
    expect(response.data.Items.length).toBeGreaterThanOrEqual(0);
  });
});

let notesId = "7a911dde-fd77-456d-9c1b-bd53471f3c78";
// Get Item by ID
describe("GET /notes/${notesId}", () => {
  it("should return 200 with note by ID", async () => {
    const response = await client.get(`notes/${notesId}`);

    //console.log("🔍 Response Data:", response.data);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("notesId");
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("body");
  });
});

// Update Item by ID
describe("PUT /notes/${notesId}", () => {
  it("should update a note by ID", async () => {
    const updatedNote = {
      title: "Updated Note Title",
      body: "This is the updated body of the note.",
    };

    const response = await client.put(`notes/${notesId}`, updatedNote);

    console.log("🔍 Response Data:", response.data);
    expect(response.status).toBe(200);
    // expect(response.data).toHaveProperty("notesId", notesId);
    // expect(response.data).toHaveProperty("title", updatedNote.title);
    // expect(response.data).toHaveProperty("body", updatedNote.body);
  });
});

let deleteNote = "f99ed1b0-3fed-483e-889b-fd8d5df8b46a";
// Delete Item by ID
describe("DELETE /notes/${notesId}", () => {
  it("should delete a note by ID", async () => {
    const response = await client.del(`notes/${deleteNote}`);

    //console.log("🔍 Response Data:", response.data);
    expect(response.status).toBe(204);
  });
});
