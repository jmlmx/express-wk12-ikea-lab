const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8080, () => console.log("Testing on Port 8080"));
const User = require("../models/user");
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close(); //programmatic ctrl+c
  mongoServer.stop(); //getting rid of our MongoDB instance itself
  server.close(); // stop listening on the port
});

describe("Test the user endpoints", () => {
  test("It should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password1",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("John Doe");
    expect(response.body.user.email).toEqual("john.doe@example.com");
    expect(response.body).toHaveProperty("token");
    const user = await User.find();
    await user[0].deleteOne();
  });

  test("It should login a user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password1",
      loggedIn: false,
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .post("/users/login")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "john.doe@example.com", password: "password1" });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("John Doe");
    expect(response.body.user.email).toEqual("john.doe@example.com");
    expect(response.body.user.loggedIn).toBe(true);
    expect(response.body).toHaveProperty("token");
    await user.deleteOne();
  });

  test("It should logout a user", async () => {
    const user = new User({
      name: "Joseph Da Bistro",
      email: "joe@cat.com",
      password: "password1",
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "joe@cat.com", password: "password1" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Logged Out");
    await user.deleteOne();
  });

  test("It should update a user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Jane Doe", email: "jane.doe@example.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("Jane Doe");
    expect(response.body.email).toEqual("jane.doe@example.com");
    await user.deleteOne();
  });

  test("It should delete a user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("User deleted");
    await user.deleteOne();
  });

  test("It should get and show all users", async () => {
    const user1 = new User({
      name: "Jamal Mayon",
      email: "jam@gmail.com",
      password: "pokemon",
    });
    await user1.save();

    const user2 = new User({
      name: "Jim Boyle",
      email: "jim@boy.com",
      password: "monkey",
    });
    await user2.save();

    const user3 = new User({
      name: "Jay Sanchez",
      email: "jay@kmail.com",
      password: "dog",
    });
    await user3.save();

    const users = [user1, user2, user3];

    const loggedInUsers = users.map((user) => {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        loggedIn: user.loggedIn,
      };
    });
    console.log((loggedInUsers, "CLOUD-SCALE!"));

    const response = await request(app).get("/users");
    console.log(response.body, "come on baby!");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(loggedInUsers);
  });
});
