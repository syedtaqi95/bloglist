import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'www.test-url.com',
    likes: 42,
    user: {
      name: 'Test Username',
    },
  }

  test('renders only the title and author by default', () => {
    const component = render(
      <Blog blog={blog} />
    )

    const div = component.container.querySelector('div')
    expect(div).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(`${blog.likes}`)
  })

  test('renders the url and likes, when the \'view\' button is clicked', () => {
    const component = render(
      <Blog blog={blog} />
    )

    const viewButton = component.container.querySelector('.viewButton')
    fireEvent.click(viewButton)

    const urlDiv = component.container.querySelector('.urlDiv')
    expect(urlDiv).toHaveTextContent(blog.url)

    const likesDiv = component.container.querySelector('.likesDiv')
    expect(likesDiv).toHaveTextContent(`${blog.likes}`)
  })

  test('if the like button is clicked twice, the event handler is called twice', () => {
    const mockLikesHandler = jest.fn()
    const component = render(
      <Blog blog={blog} handleLikes={mockLikesHandler} />
    )
    const viewButton = component.container.querySelector('.viewButton')
    fireEvent.click(viewButton)

    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockLikesHandler.mock.calls).toHaveLength(2)
  })
})