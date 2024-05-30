const format = require("pg-format")
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')
const express= require('express');
const app = require("../app/app.js");
const fs = require('fs/promises');

const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index')


beforeAll(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());


describe("Testing APIs", () => {
    test("Status  200 and return all topics with the properties slug and description", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) =>{

       let topics = body.topics


        topics.forEach((topic)=>{
          expect(topic).toMatchObject({
            description:expect.any(String),
            slug:expect.any(String)
          })
        })

      })
        
    })
})
    

describe("Testing APIs for GET /api",  () => {
  it("Status  200 and return all available api endpoints", async () => {

    /* Retrieves the endpoints file data and parses the data into a object */
    const endpointFileData = await fs.readFile("./endpoints.json", "utf-8")
    const endPoints = JSON.parse(endpointFileData)


    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) =>{
      expect(body).toMatchObject(endPoints)


    })
      
  })
})
  

describe("Testing APIs for GET /api/articles/:article_id", () => {
  test("Status  200 and return an article object with the expected properties", () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body}) =>{
      const arrayOfTopics = body
      
      arrayOfTopics.forEach((topic)=>{
        expect(topic).toMatchObject({
          author:expect.any(String),
          article_id:expect.any(Number),
          body:expect.any(String),
          title:expect.any(String),
          topic:expect.any(String),
          created_at:expect.any(String),
          votes:expect.any(Number),
          article_img_url:expect.any(String)
        })
      })


    })


    })

    test("400: respond with an error message for an invalid article_id", () => {
      return request(app)
      .get('/api/articles/asdd')
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe("Bad Request")
      })
  
  
      })

      test("404: respond with an error message for an non-existent article_id", () => {
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({body})=>{
          expect(body.msg).toBe("article does not exist")
        })
    
    
        })
  
  
      
      
  })

  describe("Testing APIs for GET /api/articles", () => {
    test("Status  200 and return an array of article objects with the expected properties", () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) =>{

   
        const arrayOfArticles = body

   
        arrayOfArticles.forEach((topic)=>{
          expect(topic).toMatchObject({
            author:expect.any(String),
            article_id:expect.any(Number),
            title:expect.any(String),
            topic:expect.any(String),
            created_at:expect.any(String),
            votes:expect.any(Number),
            article_img_url:expect.any(String),
            comment_count:expect.any(Number)
          })
        })

        expect(arrayOfArticles.length).toBe(13)


  
  
      })
  
  
      })
    })

    describe("Testing APIs for GET /api/articles/:article_id/comments", () => {
      test("Status 200 and return an array of comments for the specified article_id", () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) =>{
  
     
          const arrayOfComments = body
  
        
  
          expect(arrayOfComments.length).toBe(11)
  
          arrayOfComments.forEach((comment)=>{
            expect(comment).toMatchObject({
              author:expect.any(String),
              comment_id:expect.any(Number),
              body:expect.any(String),
              article_id:expect.any(Number),
              created_at:expect.any(String),
              votes:expect.any(Number),
            })
          })
    
    
        })
    
    
        })

      test("GET:400 and sends an appropriate status and error message when given an invalid id ", () => {
        return request(app)
        .get('/api/articles/not-an-article/comments')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
        })

        test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
          return request(app)
          .get('/api/articles/9999/comments')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe('Article does not exist');
            });
        });


      })


      describe("Testing APIs for POST /api/articles/:article_id/comments", () => {
        test("POST:201 inserts a new comment for a specific article id to the db and sends the new comment back to the client", () => {
          const newComment = {
            username: 'butter_bridge',
            body: 'Great article!'
          };
          
          return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201)
          .then((response) => {
              expect(response.body.comment.author).toBe('butter_bridge');
              expect(response.body.comment.body).toBe( 'Great article!');
            });
      
          })
  
        test("GET:400 and sends an appropriate status and error message when given an invalid id ", () => {
          return request(app)
          .get('/api/articles/not-an-article/comments')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
          });
          })
  
          test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
            return request(app)
            .get('/api/articles/9999/comments')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Article does not exist');
              });
          });
  
  
        })


        describe("PATCH /api/articles/:article_id", () => {
          test("Respond with status 200 and the updated article object to change the number of votes", () => {
            let newVote = 1;
              return request(app)
              .patch('/api/articles/1')
              .send(
                  {
                    inc_votes: newVote,
                  })
              .expect(200)
              .then(({body})=>{
                   expect(body).toMatchObject(
                                  
                        {
                          article_id: 1,
                          title: "Living in the shadow of a great man",
                          topic: "mitch",
                          author: "butter_bridge",
                          body: "I find this existence challenging",
                          created_at: "2020-07-09T20:11:00.000Z",
                          votes: 101,
                          article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        }
                                           
                        
                   )                                                                  
              }
              )
          });  
          test("Respond with status 404 when the article_id does not exist", () => {
            let newVote = 1;
              return request(app)
              .patch('/api/articles/99999')
              .send(
                  {
                    inc_votes: newVote,
                  })
              .expect(404)
              .then(({body})=>{
                expect(body.msg).toBe("Article does not exist")
              })
            
          });  

          test("400: respond with an error message for an invalid article_id", () => {
            let newVote = 1;
            return request(app)
            .patch('/api/articles/not-a-valid-article')
            .send(
                {
                  inc_votes: newVote,
                })
            .expect(400)
            .then(({body})=>{
              expect(body.msg).toBe("Bad Request")
            })
      })

    })


    describe("DELETE /api/comments/:comment_id", () => {
      test("204: error status code 204, no response expected", () => {
          return request(app)
          .delete('/api/comments/2')
          .expect(204)
          }
          )
          test("404: error status code 404, no response expected", () => {
            return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({body})=>{
              expect(body.msg).toBe("Comment does not exist")
            })
            }
            )
            test("400: respond with an error message for an invalid comment_id", () => {
              return request(app)
              .delete('/api/comments/not-a-valid-comment')
              .expect(400)
              .then(({body})=>{
                expect(body.msg).toBe("Bad Request")
              })
        })
  
      });  

      describe("Testing APIs for GET /api/users", () => {
        test("Status  200 and return an array of user objects with the expected properties", () => {
          return request(app)
          .get('/api/users')
          .expect(200)
          .then(({body}) =>{
    
       
            const arrayOfUsers = body
    
       
            arrayOfUsers.forEach((topic)=>{
              expect(topic).toMatchObject({
                username:expect.any(String),
                name:expect.any(String),
                avatar_url:expect.any(String),
              })
            })
    
            expect(arrayOfUsers.length).toBe(4)
    
    
      
      
          })
      
      
          })
        })

        describe("Testing APIs for GET /api/articles (topic query)", () => {
          test("Status  200 and return an array of article objects with the expected properties where the topic is not specified", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) =>{
      
         
              const arrayOfArticles = body
      
         
              arrayOfArticles.forEach((topic)=>{
                expect(topic).toMatchObject({
                  author:expect.any(String),
                  article_id:expect.any(Number),
                  title:expect.any(String),
                  topic:expect.any(String),
                  created_at:expect.any(String),
                  votes:expect.any(Number),
                  article_img_url:expect.any(String),
                  comment_count:expect.any(Number)
                })
              })
      
              expect(arrayOfArticles.length).toBe(13)
      
      
        
        
            })
        
        
            })
            test("Status  200 and return an array of article objects with the expected properties where the topic is specified", () => {
              return request(app)
              .get('/api/articles?topic=mitch')
              .expect(200)
              .then(({body}) =>{
        
           
                const arrayOfArticles = body
        
           
                arrayOfArticles.forEach((topic)=>{
                  expect(topic).toMatchObject({
                    author:expect.any(String),
                    article_id:expect.any(Number),
                    title:expect.any(String),
                    topic:expect.any(String),
                    created_at:expect.any(String),
                    votes:expect.any(Number),
                    article_img_url:expect.any(String),
                    comment_count:expect.any(Number)
                  })
                })
        
                expect(arrayOfArticles.length).toBe(12)
        
        
          
          
              })
          
          
              })
              test("400: Return status code 400 and a message for invalid query", () => {
                return request(app)
                .get('/api/articles?topic=invalid-query-name')
                .expect(400)
                .then(({body})=>{
                  expect(body.msg).toBe("This query is invalid")
                })
            
            
                })
          })


