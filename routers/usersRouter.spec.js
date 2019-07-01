const supertest = require("supertest");

const db = require("../data/dbConfig.js");
const server = require("../api/server.js");
const usersRouter = require("../routers/usersRouter.js");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

server.use("/users", usersRouter);

function makeToken(user) {
  const payload = {
    sub: user.id,
    username: user.username
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

const token = makeToken({ username: "Slab Bulkhead", id: 1 });

/* PostgreSQL was not happy about me truncating the users table,
and instead of messing with my schema I decided to get a 
bit creative. */

describe("/users", () => {
  beforeEach(async () => {
    await db("saves").truncate();
  });

  describe("GET /", () => {
    it("responds 200", async () => {
      await supertest(server)
        .get("/users")
        .set("Authorization", token)
        .expect(200);
    });

    it("returns an array", async () => {
      let users = await db("users")
      let result;
      await supertest(server)
        .get("/users")
        .set("Authorization", token)
        .then(res => (result = res.body));
      expect(result.length).toEqual(users.length);
    });
  });

  describe("GET /:id", () => {
    it("responds 200", async () => {
      let { id } = await db("users")
        .first();

      await supertest(server)
        .get(`/users/${id}`)
        .set("Authorization", token)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("returns an object with the desired id", async () => {
      let { id } = await db("users")
        .first();

      await supertest(server)
        .get(`/users/${id}`)
        .set("Authorization", token)
        .then(res => (result = res.body));
      expect(typeof result).toBe("object");
      expect(result.id).toEqual(id);
    });
  });

  describe("POST /register", () => {
    it("responds 201", async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      await supertest(server)
        .post("/users/register")
        .send(user)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });

    it("returns an object", async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      await supertest(server)
        .post("/users/register")
        .send(user)
        .set("Accept", "application/json")
        .then(res => result = res.body)
      expect(typeof result).toBe("object");
    });
  });

  describe("POST /login", () => {
    it("responds 200", async () => {
      let user = { username: "Slab Bulkhead", password: "mst3k" }

      await supertest(server)
        .post("/users/login")
        .send(user)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("welcomes the user and returns a token", async () => {
      let user = { username: "Slab Bulkhead", password: "mst3k" }

      await supertest(server)
        .post("/users/login")
        .send(user)
        .set("Accept", "application/json")
        .then(res => result = res.body)
      expect(result.message).toEqual("Welcome!");
      expect(result.token).toBeTruthy();
    });
  });

  describe("PUT /:id", () => {
    it("responds 201", async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      let modified = {
        username: `ButchDeadlift${num}`,
        password: "mst3k"
      };

      await db("users").insert(user);

      let { id } = await db("users")
        .where("username", `RollFizzlebeef${num}`)
        .first();

      await supertest(server)
        .put(`/users/${id}`)
        .send(modified)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });

    it("returns the modified object", async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      let modified = {
        username: `ButchDeadlift${num}`,
        password: "mst3k"
      };

      await db("users").insert(user);

      let { id } = await db("users")
        .where("username", `RollFizzlebeef${num}`)
        .first();

      await supertest(server)
        .put(`/users/${id}`)
        .send(modified)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .then(res => (result = res.body));
      expect(typeof result).toBe("object");
      expect(result.username).toEqual(`ButchDeadlift${num}`);
    });
  });

  describe("DELETE /:id", () => {
    it("responds 204", async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      await db("users").insert(user);

      let { id } = await db("users")
        .where("username", `RollFizzlebeef${num}`)
        .first();

      await supertest(server)
        .delete(`/users/${id}`)
        .set("Authorization", token)
        .expect(204);
    });
  });

  describe("GET /:id/saves", () => {
    it("responds 200", async () => {
      let { id } = await db("users")
        .first();

      await supertest(server)
        .get(`/users/${id}/saves`)
        .set("Authorization", token)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("returns an array of saves", async () => {
      let { id } = await db("users")
        .first();

      let save = {
        user_id: id,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };
      
      await db('saves')
        .insert(save)

      await supertest(server)
        .get(`/users/${id}/saves`)
        .set("Authorization", token)
        .then(res => result = res.body)
      expect (result[0].lon).toEqual(5678);
    });
  });
});
