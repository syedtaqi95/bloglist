const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token = null
let userId = null

beforeEach(async () => {
  // Add a new user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  // Generate a token for the user
  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'secret',
    })

  token = response.body.token
  userId = savedUser.id

  // Reset Blog documents
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    blog.user = userId
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET request', () => {
  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('ensures unique identifier is named \'id\'', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    expect(id).toBeDefined()
  })
})

describe('POST and DELETE requests', () => {
  test('new blog is created successfully', async () => {
    const newBlog = {
      title: 'Test title 3',
      author: 'Test author 3',
      url: 'www.test-url-3.com',
      likes: 7,
      user: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('Test title 3')
  })

  test('blog missing likes property defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Test title 4',
      author: 'Test author 4',
      url: 'www.test-url-4.com',
      user: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.likes)
    expect(contents).toContain(0)
  })

  test('invalid blog object is not saved', async () => {
    const newBlog = {
      author: 'Test author 5',
      user: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('an existing blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('POST without token fails with proper statuscode', async () => {
    const newBlog = {
      title: 'Test title 3',
      author: 'Test author 3',
      url: 'www.test-url-3.com',
      likes: 7,
      user: userId,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length)
  })
})

describe('PUT request', () => {
  test('an existing blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 500

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)

    const updatedBlog = response.body
    expect(updatedBlog.likes).toEqual(500)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(500)
  })
})

afterAll(() => {
  mongoose.connection.close()
})