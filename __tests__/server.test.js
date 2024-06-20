const format = require("pg-format");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const express = require("express");
const app = require("../app/app.js");
const fs = require("fs/promises");
const jestSorted = require("jest-sorted");

const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeAll(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("Testing APIs", () => {
  test("Status  200 and return all topics with the properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        let topics = body.topics;

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("Testing APIs for GET /api", () => {
  it("Status  200 and return all available api endpoints", async () => {
    /* Retrieves the endpoints file data and parses the data into a object */
    const endpointFileData = await fs.readFile("./endpoints.json", "utf-8");
    const endPoints = JSON.parse(endpointFileData);

    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject(endPoints);
      });
  });
});

describe("Testing APIs for GET /api/articles/:article_id", () => {
  test("Status  200 and return an article object with the expected properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const arrayOfTopics = body;

        arrayOfTopics.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  test("400: respond with an error message for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/notvalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: respond with an error message for an non-existent article_id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});

describe("Testing APIs for GET /api/articles", () => {
  test("Status  200 and return an array of article objects with the expected properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(articles.length).toBe(13);
      });
  });
});

describe("Testing APIs for GET /api/articles/:article_id/comments", () => {
  test("Status 200 and return an array of comments for the specified article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const arrayOfComments = body;

        expect(arrayOfComments.length).toBe(11);

        arrayOfComments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });

  test("Status 200 and return an empty array for the specified article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const arrayOfComments = body;

        expect(arrayOfComments.length).toBe(0);
      });
  });

  test("GET:400 and sends an appropriate status and error message when given an invalid id ", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("Testing APIs for POST /api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment for a specific article id to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great article!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(response.body.comment.body).toBe("Great article!");
        expect(response.body.comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });

  test("GET:400 and sends an appropriate status and error message when given an invalid id ", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Respond with status 200 and the updated article object to change the number of votes", () => {
    let newVote = 1;
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: newVote,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Respond with status 404 when the article_id does not exist", () => {
    let newVote = 1;
    return request(app)
      .patch("/api/articles/99999")
      .send({
        inc_votes: newVote,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("Respond with status 400 when the inc_votes is not a number", () => {
    let newVote = "not-a-number";
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: newVote,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: respond with an error message for an invalid article_id", () => {
    let newVote = 1;
    return request(app)
      .patch("/api/articles/not-a-valid-article")
      .send({
        inc_votes: newVote,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Checking /api/comments/:comment_id", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: error status code 204, no response expected", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });
    test("404: error status code 404, no response expected", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist");
        });
    });
    test("400: respond with an error message for an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/not-a-valid-comment")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    test("200: Respond with an updated comment object with the inc_votes property updated", () => {
      let newVote = 1;
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: newVote,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 17,
            author: "butter_bridge",
            article_id: 9,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });

    test("Respond with status 404 when the comment_id does not exist", () => {
      let newVote = 1;
      return request(app)
        .patch("/api/comments/99999")
        .send({
          inc_votes: newVote,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist");
        });
    });
    test("Respond with status 400 when the inc_votes is not a number", () => {
      let newVote = "not-a-number";
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: newVote,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Testing APIs for GET /api/users", () => {
  test("Status  200 and return an array of user objects with the expected properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const arrayOfUsers = body.user_data;

        arrayOfUsers.forEach((topic) => {
          expect(topic).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });

        expect(arrayOfUsers.length).toBe(4);
      });
  });
});

describe("Testing APIs for GET /api/articles (topic query)", () => {
  test("Status  200 and return an array of article objects with the expected properties where the topic is specified", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        arrayOfArticles.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });

        arrayOfArticles.forEach((topic) => {
          expect(topic.topic).toBe("mitch");
        });

        expect(arrayOfArticles.length).toBe(12);
      });
  });
  test("400: Return status code 400 with a valid query but no article match it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const arrayOfComments = body.articles;

        expect(arrayOfComments.length).toBe(0);
      });
  });
  test("404: Return status code 404 and a message for invalid query", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This query is invalid");
      });
  });
});

describe("Testing APIs for GET /api/articles/:article_id (comment_count)", () => {
  test("Status  200 and return an article object with the expected properties including a comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const singleTopic = body;

        singleTopic.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("400: respond with an error message for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/asdd")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: respond with an error message for an non-existent article_id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});

describe("Testing APIs for GET /api/articles to check if sort (default: created_by) and order (default: desc) queries are accepted", () => {
  test("Status  200 and return an array of article objects sorted ", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("author", {
          descending: false,
        });
      });
  });
  test("Status  200 and return an array of article objects sorted by comment count ", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((topic) => {
          expect(topic).toMatchObject({
            author: expect.any(String),
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("comment_count", {
          descending: false,
        });
      });
  });
  test("400: Return error code 400 when an invalid sort_by is requested ", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidname&order_by=ASC")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This query is invalid");
      });
  });
  test("400: Return error code 400 when an invalid order_by is requested ", () => {
    return request(app)
      .get("/api/articles?order_by=invald_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This query is invalid");
      });
  });
});

describe("Testing APIs for GET /api/users/:username", () => {
  test("Status  200 and return a single user objects specified by the username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("404: respond with an error message for an invalid username", () => {
    return request(app)
      .get("/api/users/invalidname")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
  test("400: respond with an error message for an invalid username as a number", () => {
    return request(app)
      .get("/api/users/9999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

// describe("Testing APIs for POST /api/articles", () => {
//   test.only("POST:201 inserts a new article to the db and sends the new article back to the client", () => {
//     const newarticle = {
//       title: "Who is mitch?",
//       topic: "mitch",
//       author: "butter_bridge",
//       body: "I never knew who mitch was",
//       article_img_url:"https://static.standard.co.uk/s3fs-public/thumbnails/image/2015/12/21/15/stick-man.jpg?width=1200&height=900&fit=crop"

//     };

//     return request(app)
//     .post('/api/articles')
//     .send(newarticle)
//     .expect(201)
//     .then((response) => {

//      const newArticle = response.body.newArticle
//       expect(newArticle).toMatchObject({
//         author:expect.any(String),
//         article_id:expect.any(Number),
//         title:expect.any(String),
//         topic:expect.any(String),
//         created_at:expect.any(String),
//         votes:expect.any(Number),
//         article_img_url:expect.any(String),
//         comment_count:expect.any(Number)
//       })

//           })
//       });

//     })
