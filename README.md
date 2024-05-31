# Northcoders News API

## Summary of project
The project is a building an API for accessing application data programmatically, the idea is to mimic a backend service such as a blog or article based site. The idea is to create the back end architecture that will provide the necessary information and environment for the front-end application.

## Instructions


### How to create the .env files
- Create two new files in the main project folder, ".env.test" and ".env.development".
- In the ".env.test" file, add only the line : "PGDATABASE=nc_news_test;" 
- In the ".env.development" file, add only the line : "PGDATABASE=nc_news_development;" 
- This will assign the correct databases required for the test and development folders so any changes on either do not affect the other.
---
### Installing dependencies

The list of npm packages required are listed below (run "npm i [package_name] " to install):
- express
- dotenv
- node-postgres
- pg
- pg-format


Additional optional dev dependencies (run "npm i [package_name] -D" to install):
- jest
- husky
- jest-sorted
- supertest

---

### Seeding the local database
- "npm run setup-dbs" will create the databases required
- Running the server.test.js script using "npm test server.test.js" will seed the database for the 
"nc-news-test" database.  
- "npm run seed" will seed the development database "nc-news"

---

Link to hosted version of the page:
https://nc-news-davidhcodes.onrender.com/api/

---

### Minimum package requirements:
- Node.js: v21.7.2
- Postgres:  "node-postgres": v ^0.6.2
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
