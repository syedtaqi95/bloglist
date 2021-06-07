Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedInUser', JSON.stringify(body))
    cy.visit('http://localhost:3001')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
    }
  })
  cy.visit('http://localhost:3001')
})

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'root',
      password: 'secret',
      name: 'Superuser'
    })
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')
    })

    it('fails with incorrect credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('incorrect')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('not.contain', 'Superuser logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'secret' })
    })

    it('a new blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog Title')
      cy.get('#author').type('Blog author')
      cy.get('#url').type('www.blog-url.com/this-is-a-blog')
      cy.get('#create-button').click()

      cy.contains('Blog Title Blog author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Test Blog Title',
          author: 'Firstname Lastname',
          url: 'www.some-url.com',
        })
      })

      it('it can be liked', function () {
        cy.get('.viewButton').click()
        cy.get('.likeButton').click()
        cy.get('.likesDiv').should('contain', 'likes 1')
      })

      it('it can be deleted', function () {
        cy.get('.viewButton').click()
        cy.get('.removeButton').click()
        cy.get('html')
          .should('not.contain', 'Test Blog Title Firstname Lastname')
      })
    })

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Blog 1',
          author: 'First Author',
          url: 'www.some-url-1.com',
          likes: 11,
        })
        cy.createBlog({
          title: 'Blog 2',
          author: 'Second Author',
          url: 'www.some-url-2.com',
          likes: 12,
        })
        cy.createBlog({
          title: 'Blog 3',
          author: 'Third Author',
          url: 'www.some-url-3.com',
          likes: 13,
        })
      })

      it('blogs are displayed', function () {
        cy.contains('Blog 1')
        cy.contains('Blog 2')
        cy.contains('Blog 3')
      })

      it('blogs are ordered by likes', function () {
        // Expand the blogs to display the likes
        cy.get('.blogSummaryView > button')
          .click({ multiple: true })

        cy.get('.blogDetailedView > .likesDiv')
          .then((items) => {
            const unsortedLikes = items
              .map((i, el) => parseInt(el.innerText.substring(6, 8)))
              .toArray()
            const sortedLikes = [...unsortedLikes].sort().reverse()

            expect(unsortedLikes).to.deep.equal(sortedLikes)
          })
      })

    })
  })

})