const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  body = request.body

  // Input validation
  const lengthCorrect = (body.username.length > 3) && (body.password.length > 3)  
  const users = await User.find({})
  const usernames = users.map(user => user.username)
  const uniqueUsername = !usernames.includes(body.username)

  if (!(body.username && body.password && lengthCorrect && uniqueUsername)) {
    return response
      .status(401)
      .json({
        error: 'invalid username or password'
      })
  }

  // Save new user to Db
  const passwordHash = await bcrypt.hash(body.password, 10)
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter