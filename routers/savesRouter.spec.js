const supertest = require("supertest");

const db = require("../data/dbConfig.js");
const server = require("../api/server.js");
const savesRouter = require("../routers/savesRouter.js");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

server.use("/saves", savesRouter);

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

describe("/saves", () => {
  beforeEach(async () => {
    await db("saves").truncate();
  });

  describe("GET /", () => {
    it("responds 200", async () => {
      await supertest(server)
        .get("/saves")
        .set("Authorization", token)
        .expect(200);
    });
    it("returns an array", async () => {
      let result;
      await supertest(server)
        .get("/saves")
        .set("Authorization", token)
        .then(res => (result = res.body));
      expect(result.length).toEqual(0);
    });
  });

  describe("GET /:id", () => {
    it("responds 200", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      await db("saves").insert(save);

      let { id } = await db("saves")
        .where("lat", 1234)
        .first();

      await supertest(server)
        .get(`/saves/${id}`)
        .set("Authorization", token)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("returns an object with the desired id", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      await db("saves").insert(save);

      let { id } = await db("saves")
        .where("lat", 1234)
        .first();

      await supertest(server)
        .get(`/saves/${id}`)
        .set("Authorization", token)
        .then(res => (result = res.body));
      expect(typeof result).toBe("object");
      expect(result.id).toEqual(id);
    });
  });

  describe("POST /", () => {
    it("responds 201", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      await supertest(server)
        .post("/saves")
        .send(save)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });

    it("returns an object", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      let result;
      await supertest(server)
        .post("/saves")
        .send(save)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .then(res => (result = res.body));
      expect(typeof result).toBe("object");
    });
  });

  describe("PUT /:id", () => {
    it("responds 201", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      let modified = {
        user_id: 1,
        lat: 1235,
        lon: 5678,
        address: "123 4th St."
      };

      await db("saves").insert(save);

      let { id } = await db("saves")
        .where("lat", 1234)
        .first();

      await supertest(server)
        .put(`/saves/${id}`)
        .send(modified)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });

    it("returns the modified object", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      let modified = {
        user_id: 1,
        lat: 1235,
        lon: 5678,
        address: "123 4th St."
      };

      await db("saves").insert(save);

      let { id } = await db("saves")
        .where("lat", 1234)
        .first();

      await supertest(server)
        .put(`/saves/${id}`)
        .send(modified)
        .set("Authorization", token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .then(res => (result = res.body));
      expect(typeof result).toBe("object");
      expect(result.lat).toEqual(1235);
    });
  });
  describe("DELETE /:id", () => {
    it("responds 204", async () => {
      let save = {
        user_id: 1,
        lat: 1234,
        lon: 5678,
        address: "123 4th St."
      };

      await db("saves").insert(save);

      let { id } = await db("saves")
        .where("lat", 1234)
        .first();

      await supertest(server)
        .delete(`/saves/${id}`)
        .set("Authorization", token)
        .expect(204);
    });
  });
});
