import userService from '../services/users'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'UPDATE_USERS':
    return action.data
  default:
    return state
  }
}

export const updateUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'UPDATE_USERS',
      data: users
    })
  }
}

export default reducer