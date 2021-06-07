import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

const User = () => {
  const users = useSelector(state => state.users)

  // find user info if in individual user view
  const match = useRouteMatch('/users/:id')
  const user = match
    ? users.find(u => u.id === match.params.id)
    : null

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name}</h3>
      <h4>added blogs</h4>
      <ListGroup>
        {user.blogs.map(blog => (
          <ListGroup.Item key={blog.id}>
            <Link to={`/blogs/${blog.id}`}><strong className="text-dark">{blog.title}</strong></Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default User