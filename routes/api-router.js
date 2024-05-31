const apiRouter = require('express').Router()
const app = require('../app/app')
const userRouter = require('./users-router')
const articlesRouter = require('../routes/articles-router');
const topicsRouter = require('../routes/topics-router')
const commentsRouter = require('../routes/comments-router');
const { getAPI } = require('../controllers/api.controller');

apiRouter.use('/users', userRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/', getAPI)


apiRouter.get('/', (req, res)=>{
    res.status(200).send('All ok from API Router')
})

module.exports = apiRouter