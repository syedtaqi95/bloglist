import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updatedObject => {
  const blogUrl = `${baseUrl}/${updatedObject.id}`
  const response = await axios.put(blogUrl, updatedObject)
  return response.data
}

const remove = async blogToDelete => {
  const blogUrl = `${baseUrl}/${blogToDelete.id}`
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(blogUrl, config)
  return response.data
}

const comment = async (content, blogId) => {
  const commentUrl = `${baseUrl}/${blogId}/comments`
  const response = await axios.post(commentUrl, { comment: content })
  return response.data
}

const blogService = { getAll, setToken, create, update, remove, comment }

export default blogService