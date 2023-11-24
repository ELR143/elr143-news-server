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
          expect(endpoint).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            exampleResponse: expect.any(Object),
          });
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
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
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
        });
      });
  });
  test("200: accepts a topic query which responds with all articles of the given topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: responds with an empty array when topic exists but there are no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("404: responds with an error message when query is invalid", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
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
  test("404: responds with an error message when given a valid path but the article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/850/comments")
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: posts a new comment for a given article_id, and responds with the comment", () => {
    const testPost = {
      username: "butter_bridge",
      body: "This is a test!",
    };

    const testPostExpected = {
      comment_id: expect.any(Number),
      votes: 0,
      created_at: expect.any(String),
      author: "butter_bridge",
      body: "This is a test!",
      article_id: 3,
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(testPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(testPostExpected);
        expect(body.comment.article_id).toBe(3);
      });
  });
  test("201: posts a new comment and ignores extra fields", () => {
    const testPost = {
      username: "butter_bridge",
      body: "This is a test!",
      extra: "I am an extra field!",
    };

    const testPostExpected = {
      comment_id: expect.any(Number),
      votes: 0,
      created_at: expect.any(String),
      author: "butter_bridge",
      body: "This is a test!",
      article_id: 3,
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(testPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(testPostExpected);
        expect(body.comment.article_id).toBe(3);
      });
  });
  describe("400 errors", () => {
    test("400: responds with an error message if comment is passed with missing body", () => {
      const testPost = {
        username: "testUser",
      };

      return request(app)
        .post("/api/articles/3/comments")
        .send(testPost)
        .expect(400)
        .then(({ body }) => {
          {
            expect(body.msg).toBe("Error: 400 bad request");
          }
        });
    });
    test("400: responds with an error message if comment is passed with missing username", () => {
      const testPost = {
        body: "This is a test!",
      };

      return request(app)
        .post("/api/articles/3/comments")
        .send(testPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Error: 400 bad request");
        });
    });
    test("400: responds with an error message when given a path that is invalid", () => {
      const testPost = {
        username: "butter_bridge",
        body: "This is a test!",
      };

      return request(app)
        .post("/api/articles/notAnId/comments")
        .send(testPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Error: 400 bad request");
        });
    });
  });
  test("404: responds with an error message if username does not exist in database", () => {
    const testPost = {
      username: "notAUser",
      body: "This is a test!",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(testPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
  test("404: responds with an error message when given a valid path but the article_id doesn't exist", () => {
    const testPost = {
      username: "butter_bridge",
      body: "This is a test!",
    };

    return request(app)
      .post("/api/articles/850/comments")
      .send(testPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes with a positive number and responds with the updated article", () => {
    const testPatch = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 105,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: increments votes with a negative number and responds with the updated article", () => {
    const testPatch = { inc_votes: -110 };

    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: -10,
          article_img_url: expect.any(String),
        });
      });
  });
  describe("400 errors", () => {
    test("400: responds with an error message when request body is in the wrong format (empty)", () => {
      const testPatch = {};

      return request(app)
        .patch("/api/articles/1")
        .send(testPatch)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Error: 400 bad request");
        });
    });
    test("400: responds with an error message if given an article_id that is invalid", () => {
      return request(app)
        .patch("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Error: 400 bad request");
        });
    });
  });
  test("404: responds with an error message if passed an id that does not exist", () => {
    const testPatch = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/55975433")
      .send(testPatch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment from database", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: responds with an error message when the path is invalid", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 400 bad request");
      });
  });
  test("404: responds with an error message when the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/23423")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: 404 not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).not.toBe(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
