import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ addBlog }) => {
  // States
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // New blog event handler
  const handleAddBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }
    addBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>create new</h3>

      <Form onSubmit={handleAddBlog}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            id="title"
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            id="author"
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            id="url"
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button variant="info" type="submit" id="create-button">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm