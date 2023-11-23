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
        expect(body.msg).toBe("Error: 404 not found");
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article selected by its id, inputted by the user", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: responds with an error message when given an article_id that is invalid", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 400 bad request");
      });
  });
  test("404: responds with an error message when given a valid path but the id doesn't exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles sorted by the newest first", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
  test("404: responds with an error message when path is misspelled", () => {
    return request(app)
      .get("/api/artecles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an empty array if article_id is valid but has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).not.toBe(0);
        body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: responds with an error message if passed an id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
  test("400: responds with an error message if given an article_id that is invalid", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 400 bad request");
      });
  });
});
