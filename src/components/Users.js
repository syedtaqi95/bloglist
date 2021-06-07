import React from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'

const Users = () => {
  const users = useSelector(state => state.users)

  return (
    <div>
      <h3>Users</h3>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .map(user => {
              return (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>
                      <strong className="text-dark">{user.name}</strong>
                    </Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    </div>
  )
}

export default Users