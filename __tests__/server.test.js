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
    