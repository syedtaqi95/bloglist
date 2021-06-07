import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

import BlogForm from './BlogForm'
import Togglable from './Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogList = () => {
  // Redux
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  // Refs
  const blogFormRef = useRef()

  // Sends a newly created blog to the server
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  return (
    <div>
      <br />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes) // sorted by likes in descending order
        .map(blog =>
          <Card key={blog.id} body>
            <Link to={`/blogs/${blog.id}`}>
              <strong className="text-dark">{blog.title} - {blog.author}</strong>
            </Link>
          </Card>
        )}
    </div>
  )
}

export default BlogList