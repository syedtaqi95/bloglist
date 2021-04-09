const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('GET returns the list of users', async () => {
    const usersInDb = await User.find({})
    
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const usernames = response.body.map(user => user.username)
    expect(usernames).toHaveLength(usersInDb.length)
    expect(usernames).toContain(usersInDb[0].username)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'shaider',
      name: 'Syed Haider',
      password: 'pw1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })  
})

describe('username and password input validation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails when username is too short', async () => {
    const invalidUser = {
      username: 'ab',
      name:'Invalid username',
      password: '123456',
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(u => u.username)

    expect(usernames).not.toContain(invalidUser.username)
  })

  test('creation fails when password is too short', async () => {
    const invalidUser = {
      username: 'abcd',
      name:'Invalid password',
      password: '1',
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(u => u.username)

    expect(usernames).not.toContain(invalidUser.username)
  })

  test('creation fails when username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUser = {
      username: 'root',
      name:'Duplicate user',
      password: '145345',
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
