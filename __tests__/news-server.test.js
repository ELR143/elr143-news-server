const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });

  test("404: responds with an error message when given a path that does not exist", () => {
    return request(app)
      .get("/api/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: path does not exist");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object which describes all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const properties = Object.values(body.endpoints);
        properties.forEach((endpoint) => {
          expect(endpoint).toHaveProperty("description");
          expect(endpoint).toHaveProperty("queries");
          expect(endpoint).toHaveProperty("exampleResponse");
          expect(typeof endpoint.description).toBe("string");
          expect(Array.isArray(endpoint.queries)).toBe(true);
          expect(typeof endpoint.exampleResponse).toBe("object");
        });
      });
  });
});
