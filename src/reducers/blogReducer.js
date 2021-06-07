import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'
import { updateUsers } from '../reducers/userReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data

  case 'ADD_BLOG':
    return [...state, action.data]

  case 'UPDATE_BLOG': {
    const updatedBlog = action.data
    const id = updatedBlog.id
    return state.map(blog => blog.id === id ? updatedBlog : blog)
  }

  case 'DELETE_BLOG': {
    const deletedBlog = action.data
    return state.filter(blog => blog.id !== deletedBlog.id)
  }

  default:
    return state
  }
}

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type: 'ADD_BLOG',
        data: newBlog
      })
      dispatch(updateUsers())
      dispatch(setNotification(
        `added "${blog.title}" by ${blog.author}`,
        'success'
      ))
    } catch (e) {
      dispatch(setNotification(
        `Failed to add "${blog.title}" by ${blog.author}`,
        'danger'
      ))
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    try {
      const updatedBlog = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1
      }
      const receivedBlog = await blogService.update(updatedBlog)
      dispatch({
        type: 'UPDATE_BLOG',
        data: receivedBlog
      })
    } catch (e) {
      dispatch(setNotification(
        `Failed to like "${blog.title}" by ${blog.author}`,
        'danger'
      ))
    }
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog)
      dispatch({
        type: 'DELETE_BLOG',
        data: blog
      })
      dispatch(updateUsers())
      dispatch(setNotification(
        `Deleted "${blog.title}" by ${blog.author}`,
        'success'
      ))
    } catch (e) {
      dispatch(setNotification(
        `Failed to delete "${blog.title}" by ${blog.author}`,
        'danger'
      ))
    }
  }
}

export const commentOnBlog = (comment, blog) => {
  return async dispatch => {
    try {
      const receivedBlog = await blogService.comment(comment, blog.id)
      dispatch({
        type: 'UPDATE_BLOG',
        data: receivedBlog
      })
    } catch (e) {
      dispatch(setNotification(
        `Failed to comment on ${blog.title}`,
        'danger'
      ))
    }
  }
}

export default reducer