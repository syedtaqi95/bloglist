const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const morgan = require('morgan')
const path = require('path')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(morgan('dev'))

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Health check to confirm if the app is running
app.get('/health', (req, res) => {
  res.send('ok')
})

// Serve static files from React app
app.use(express.static('build'))
// Route any unknown routes to index.html
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname + '/build/index.html'))
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app
