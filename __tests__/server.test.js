const format = require("pg-format")
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')
const express= require('express');
const app = require("../app/app.js");
const jestSorted = require('jest-sorted');

const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index')


beforeAll(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());


describe("Testing APIs", () => {
    test("Status  200 and return all topics", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) =>{
        expect(body).toHaveLength(3)


      })
        
    })
    test("Status  200 and return an array with the properties slug and description", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) =>{
        const arrayOfTopics = body

        arrayOfTopics.forEach((topic)=>{
          expect(topic).toMatchObject({
            description:expect.any(String),
            slug:expect.any(String)
          })
        })


      })
        
    })
})
    

describe("Testing APIs", () => {
  test("Status  200 and return all available api endpoints", () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) =>{
      console.log(body)
      expect(body).toMatchObject(
        {
          "GET /api": {
            "description": "serves up a json representation of all the available endpoints of the api"
          },
          "GET /api/topics": {
            "description": "serves an array of all topics",
            "queries": [],
            "exampleResponse": {
              "topics": [{ "slug": "football", "description": "Footie!" }]
            }
          },
          "GET /api/articles": {
            "description": "serves an array of all articles",
            "queries": ["author", "topic", "sort_by", "order"],
            "exampleResponse": {
              "articles": [
                {
                  "title": "Seafood substitutions are increasing",
                  "topic": "cooking",
                  "author": "weegembump",
                  "body": "Text from the article..",
                  "created_at": "2018-05-30T15:59:13.341Z",
                  "votes": 0,
                  "comment_count": 6
                }
              ]
            }
          }
        }
        

      )


    })
      
  })
})
  