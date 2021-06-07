const initialState = {
  message: null,
  messageType: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.messageObject
  case 'CLEAR_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

let timeoutId

export const setNotification = (message, messageType, time = 5) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      messageObject: {
        message,
        messageType
      }
    })
    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => dispatch(clearNotification()),
      time * 1000
    )
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

export default reducer