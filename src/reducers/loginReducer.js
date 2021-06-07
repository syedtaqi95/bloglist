import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotification, clearNotification } from './notificationReducer'

const initialState = {
  username: '',
  password: '',
  loggedInUser: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_USERNAME':
    return { ...state, username: action.data }

  case 'SET_PASSWORD':
    return { ...state, password: action.data }

  case 'SET_LOGGEDINUSER':
    return { ...state, loggedInUser: action.data }

  case 'LOGOUT':
    return initialState

  default:
    return state
  }
}

export const setUsername = (username) => {
  return {
    type: 'SET_USERNAME',
    data: username
  }
}

export const setPassword = (password) => {
  return {
    type: 'SET_PASSWORD',
    data: password
  }
}

export const setLoggedInUser = (user) => {
  // Update localStorage
  window.localStorage.setItem(
    'loggedInUser', JSON.stringify(user)
  )
  blogService.setToken(user.token)
  return {
    type: 'SET_LOGGEDINUSER',
    data: user
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try{
      const user = await loginService.login({
        username, password
      })
      dispatch(setLoggedInUser(user))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
      dispatch(clearNotification())
    } catch (e) {
      console.log(e)
      dispatch(setNotification('wrong username or password', 'danger'))
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    blogService.setToken(null)
    window.localStorage.removeItem('loggedInUser')
    dispatch(setNotification('logged out', 'success'))
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export default reducer