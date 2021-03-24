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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}