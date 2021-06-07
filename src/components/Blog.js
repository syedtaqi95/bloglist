import React, { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog, commentOnBlog } from '../reducers/blogReducer'
import { Button, Form, Row, Col, ListGroup } from 'react-bootstrap'

const Blog = () => {
  // React states
  const [comment, setComment] = useState('')

  // Redux
  const blogs = useSelector(state => state.blogs)
  const loggedInUser = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  const history = useHistory()

  // Find blog if in individual blog view
  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  if (!blog) {
    return null
  }

  // Adds a like and sends a server request
  const handleLike = (blog) => {
    dispatch(likeBlog(blog))
  }

  // Asks for confirmation, then sends a delete request to the server
  const handleRemove = (blogToDelete) => {
    const prompt = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`
    if (window.confirm(prompt)) {
      dispatch(removeBlog(blogToDelete))
      history.push('/') // Redirect to home page
    }
  }

  // Add comment event handler
  const handleAddComment = (e) => {
    e.preventDefault()
    dispatch(commentOnBlog(comment, blog))
    setComment('')
  }

  // Sets the display for 'Remove' button only if logged in user is the creator
  const displayRemoveButton = () => {
    return blog.user.id === loggedInUser.id ? '' : 'none'
  }

  return (
    <div className="blogDetailedView">
      <h3>{blog.title} - {blog.author}</h3>

      <a className="urlDiv" href={`https://${blog.url}`}>
        {blog.url}
      </a>
      <div className="likesDiv">
        likes {blog.likes}
        <Button variant="info" onClick={() => handleLike(blog)} className="likeButton">like</Button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div style={{ display: displayRemoveButton(blog) }}>
        <Button variant="info" onClick={() => handleRemove(blog)} className="removeButton">remove</Button>
      </div>

      <h3>comments</h3>
      <Form onSubmit={handleAddComment}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              value={comment}
              id="comment"
              name="Comment"
              onChange={({ target }) => setComment(target.value)}
            />
          </Col>
          <Col>
            <Button variant="info" type="submit">add comment</Button>
          </Col>
        </Row>
      </Form>
      <br />
      <ListGroup>
        {blog.comments.map(comment => (
          <ListGroup.Item key={comment}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Blog