const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.reduce((prev, cur) => {
    return (prev.likes > cur.likes)
      ? prev
      : cur
  }, {})
}

const mostBlogs = (blogs) => {
  try {
    const blogCount = _.countBy(blogs, (blog) => blog.author)
    const mostBlogsAuthor = Object.keys(blogCount).reduce((prev, cur) => {
      return blogCount[prev] > blogCount[cur] ? prev : cur
    })
    return { 
      author: mostBlogsAuthor,
      blogs: blogCount[mostBlogsAuthor]
    }
  }
  catch {
    return {}
  }  
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}