import React from 'react'
import { Button, Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import Notification from './Notification'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import { useHistory } from 'react-router-dom'

const Header = () => {
  const user = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  const history = useHistory()

  // Logout event handler
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
    history.push('/')
  }

  const margin = {
    marginLeft: 5,
    marginRight: 5,
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <LinkContainer className="text-info" to='/'>
            <Nav.Link>Blog App</Nav.Link>
          </LinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer style={margin} to='/'>
              <Nav.Link>Blogs</Nav.Link>
            </LinkContainer>
            <LinkContainer style={margin} to='/users'>
              <Nav.Link>Users</Nav.Link>
            </LinkContainer>
            <Navbar.Text style={margin} className="text-info">{user.name} logged in</Navbar.Text>
            <Button variant="outline-info" type="submit" onClick={handleLogout}>logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Notification />
    </div>
  )
}

export default Header