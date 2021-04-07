const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Test title 1",
        author: "Test author 1",
        url: "www.test-url-1.com",
        likes: 50,
    },
    {
        title: "Test title 2",
        author: "Test author 2",
        url: "www.test-url-2.com",
        likes: 35,
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}