import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form submission works as expected', () => {
    const newBlog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'www.test-url.com',
      likes: 42,
      user: {
        name: 'Test Username',
      },
    }
    const mockAddBlog = jest.fn()

    const component = render(
      <BlogForm addBlog={mockAddBlog} />
    )

    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: { value: newBlog.title }
    })
    fireEvent.change(author, {
      target: { value: newBlog.author }
    })
    fireEvent.change(url, {
      target: { value: newBlog.url }
    })
    fireEvent.submit(form)

    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog.mock.calls[0][0].title).toBe(newBlog.title)
    expect(mockAddBlog.mock.calls[0][0].author).toBe(newBlog.author)
    expect(mockAddBlog.mock.calls[0][0].url).toBe(newBlog.url)

  })
})