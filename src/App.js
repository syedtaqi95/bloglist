import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import BlogList from './components/BlogList'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { setLoggedInUser } from './reducers/loginReducer'
import { updateUsers } from './reducers/userReducer'

const App = () => {
  // Redux store
  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.user.loggedInUser)

  // Get blogs on page render
  useEffect(() => dispatch(initBlogs()), [])

  // Get users on page render
  useEffect(() => dispatch(updateUsers()), [])

  // Get loggedinUser from localStorage on page render
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const parsedUser = JSON.parse(loggedInUserJSON)
      dispatch(setLoggedInUser(parsedUser))
    }
  }, [])

  return (
    <div className="container bg-light">
      { loggedInUser === null ?
        <LoginPage /> :
        <div>
          <Header />
          <Switch>
            <Route path='/users/:id'>
              <User />
            </Route>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/blogs/:id'>
              <Blog />
            </Route>
            <Route path='/'>
              <BlogList />
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App