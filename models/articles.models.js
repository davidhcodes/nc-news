const db = require("../db/connection.js");
const { sort } = require("../db/data/test-data/articles.js");
const { articleData } = require("../db/data/test-data/index.js");
const {
  articlesTable,
  commentsTable,
  articlesTableColumns,
} = require("../utils/query.js");

exports.fetchArticlesById = (articleID) => {
  const queryValues = [];

  let sqlQuery = `SELECT  articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(*)::int AS comment_count 
    FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (articleID) {
    (sqlQuery += ` WHERE articles.article_id = $1 `), [articleID];
    queryValues.push(articleID);
  }

  sqlQuery += `  GROUP BY articles.article_id  `;

  sqlQuery += ` ORDER BY articles.created_at DESC`;

  sqlQuery += `;`;

  return db
    .query(sqlQuery, queryValues)

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows;
    });
};

exports.fetchArticles = async (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  const queryValues = [];

  articles = await articlesTable();
  articlesColumns = await articlesTableColumns();

  console.log("1");
  /* If the query 'sort_by' is not a valid table column to query, a 400 error is flagged */

  if (
    ![
      "created_at",
      "votes",
      "author",
      "title",
      "article_id",
      "topic",
      "comment_count",
    ].includes(sort_by)
  ) {
    console.log("2");

    console.log("3");
    return Promise.reject({ status: 400, msg: "This query is invalid" });
  }

  if (!["ASC", "DESC", "asc", "desc"].includes(order)) {
    console.log("4");
    return Promise.reject({ status: 400, msg: "This query is invalid" });
  }

  let sqlQuery = `SELECT  articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ,  COUNT(comments.comment_id)::int AS comment_count 
    FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    (sqlQuery += ` WHERE articles.topic = $1 `), [topic];
    queryValues.push(topic);
  }

  sqlQuery += `  GROUP BY articles.article_id  `;
  console.log("5");

  sqlQuery += ` ORDER BY ${sort_by} ${order} `;

  sqlQuery += `;`;
  return db
    .query(sqlQuery, queryValues)

    .then(({ rows }) => {
      console.log("6");
      console.log(rows);
      return rows;
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "This query is invalid" });
      }
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
    });
};

exports.fetchCommentsByArticleID = async (article_id) => {
  const queryValues = [];

  comments = await commentsTable();

  if (article_id) {
    if (!comments.some((comment) => comment.article_id === article_id)) {
    }
  }

  let sqlQuery = `SELECT  * FROM comments `;

  if (article_id) {
    (sqlQuery += `WHERE comments.article_id = $1 `), [article_id];
    queryValues.push(article_id);
  }

  sqlQuery += `ORDER BY comments.created_at DESC `;

  sqlQuery += `;`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentsByArticleID = ({ username, body }, article_id) => {
  let author = username;
  let queryValues = [username, body, article_id];

  const now = new Date();

  return db
    .query(
      `INSERT INTO comments
        (author, body, article_id, votes, created_at)
        VALUES
        ($1, $2, $3, 0, $4)
        RETURNING * ;`,
      [author, body, article_id, now]
    )

    .then((result) => {
      const newComment = result.rows;

      return newComment[0];
    });
};

exports.updateArticle = async (voteChange, article_id) => {
  let inc_votes = voteChange.inc_votes;
  const article_id_num = Number(article_id);

  articles = await articlesTable();

  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING*;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }

      return rows[0];
    });
};

exports.insertArticle = ({
  author,
  body,
  title,
  topic,
  article_img_url = "https://arthurmillerfoundation.org/wp-content/uploads/2018/06/default-placeholder.png",
}) => {
  let queryValues = [author, body, title, topic, article_img_url];

  const now = new Date();
  return db
    .query(
      `INSERT INTO articles
         (author, body, title, topic, article_img_url, created_at, votes)
         VALUES
         ($1, $2, $3, $4, $5, $6, 0)
         RETURNING * ;`,
      [author, body, title, topic, article_img_url, now]
    )

    .then((result) => {
      const newArticle = result.rows;

      return newArticle[0];
    });
};
