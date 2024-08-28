const { test, describe, beforeEach, after } = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')


const api = supertest(app)

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        
        const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogsObject.map(b => b.save())
    
        await Promise.all(promiseArray)

        const passwordHash = await bcrypt.hash('test123', 10)

        const userObject = new User (
            {
                username: 'test',
                name: 'Test Name',
                passwordHash
            }
        )

        const savedUser = await userObject.save()

        const blog = new Blog(
            {
                title: "Test Blog",
                author: "test",
                url: "testblog.com",
                likes: 2, 
                user: savedUser._id
            }
        )

        const result = await blog.save()
        savedUser.blogs = savedUser.blogs.concat(result._id)

        await userObject.save()
    })

    test('correct amount of blog posts are returned', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('unique identifier of blog posts is id', async () => {
        const response = await api.get('/api/blogs')
    
        response.body.forEach(b => {
            assert(!Object.keys(b).includes('_id'))
            assert(Object.keys(b).includes('id'))
        })
    })

    describe('saving a blog', () => {
        test('succeeds if the data and token are valid', async () => {
            const loginResponse = await api 
                .post('/api/login')
                .send({ username: 'test', password: 'test123' })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const token = loginResponse.body.token

            const newBlog = {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
            }
            
            await api  
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${token}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await api.get('/api/blogs')
            const titles = blogsAtEnd.body.map(b => b.title)
        
            assert(titles.includes(newBlog.title))
            assert(blogsAtEnd.body.length, helper.initialBlogs.length + 1)
        })
        
        test('succeeds if the likes property is missing and defaults likes to 0', async () => {
            const loginResponse = await api 
                .post('/api/login')
                .send({ username: 'test', password: 'test123' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const token = loginResponse.body.token

            const newBlog = {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            }
        
            const postedBlog = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${token}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await api.get('/api/blogs')
            const titles = blogsAtEnd.body.map(b => b.title)
        
            assert(Object.keys(postedBlog.body).includes('likes'))
            assert.strictEqual(postedBlog.body.likes, 0)
            assert(titles.includes(newBlog.title))
            assert(blogsAtEnd.body.length, helper.initialBlogs.length + 1)
        })
        
        test('sends 400 Bad Request if title is missing', async () => {

            const loginResponse = await api 
                .post('/api/login')
                .send({ username: 'test', password: 'test123' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            const token = loginResponse.body.token

            const newBlog = {
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            }
        
            await api 
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
            
            const blogsAtEnd = await api.get('/api/blogs')
        
            assert(blogsAtEnd.body.length, helper.initialBlogs.length)
        })
        
        test('sends 400 Bad Request if url is missing', async () => { 
            const loginResponse = await api 
                .post('/api/login')
                .send({ username: 'test', password: 'test123' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            const token = loginResponse.body.token

            const newBlog = {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
            }
            
            await api 
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                
            const blogsAtEnd = await api.get('/api/blogs')
        
            assert(blogsAtEnd.body.length, helper.initialBlogs.length)
        })

        test('sends 401 Unauthorized if a valid token is not provided', async () => { 

            const newBlog = {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
            }
            
            await api 
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                
            const blogsAtEnd = await api.get('/api/blogs')
        
            assert(blogsAtEnd.body.length, helper.initialBlogs.length)
        })
    })
    
    describe('deleting a blog', () => {
        test('succeeds when id is valid', async () => {

            const blogsAtStart = await api.get('/api/blogs')
            const validId = blogsAtStart.body[0].id 

            await api
                .delete(`/api/blogs/${validId}`)
                .expect(204)
            
            

            const blogsAtEnd = await api.get('/api/blogs')
            const titlesAtEnd = blogsAtEnd.body.map(b => b.titles)
            
            assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1)
            assert(!titlesAtEnd.includes(blogsAtStart.body[0].title))
        }) 

        test('sends 400 Bad Request when id does not exist', async () => {
            const nonExistingId = '64c93aec692f0b6c15f9bff7'

            await api
                .delete(`/api/blogs/${nonExistingId}`)
                .expect(400)
        }) 
        
        test('sends 400 Bad Request when id is malformatted', async () => {
            const malformattedId = '123'

            await api
                .delete(`/api/blogs/${malformattedId}`)
                .expect(400)
        }) 
    })

    describe('updating a blog', () => {
        test('succeeds when id is valid', async () => {
            const blogsAtStart = await api.get('/api/blogs')
            const validId = blogsAtStart.body[0].id

            const update = {
                title: 'Cooking Blog',
                author: 'Bob',
                url: 'cookingblog.com',
                likes: 5
            }

            const updatedBlog = await api 
                .put(`/api/blogs/${validId}`)
                .send(update)
                .expect(200)

            const blogsAtEnd = await api.get('/api/blogs')
            const titlesAtEnd = blogsAtEnd.body.map(b => b.title)
            
            assert.strictEqual(blogsAtStart.body.length, helper.initialBlogs.length)
            assert(titlesAtEnd.includes(update.title))
        }) 

        test('sends 400 Bad Request when id does not exist', async () => {
            const nonExistingId = '64c93aec692f0b6c15f9bff7'

            const update = {
                title: 'Cooking Blog',
                author: 'Bob',
                url: 'cookingblog.com',
                likes: 5
            }

            await api
                .put(`/api/blogs/${nonExistingId}`)
                .send(update)
                .expect(400)

            const blogsAtEnd = await api.get('/api/blogs')
            const titles = blogsAtEnd.body.map(b => b.title)

            assert(!titles.includes('Cooking Blog'))
        }) 
        
        test('sends 400 Bad Request when id is malformatted', async () => {
            const malformattedId = '123'

            const update = {
                title: 'Cooking Blog',
                author: 'Bob',
                url: 'cookingblog.com',
                likes: 5
            }

            await api
                .put(`/api/blogs/${malformattedId}`)
                .send(update)
                .expect(400)

            const blogsAtEnd = await api.get('/api/blogs')
            const titles = blogsAtEnd.body.map(b => b.title)

            assert(!titles.includes('Cooking Blog'))
        }) 
    })
})

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secretpassword', 10)

        const user = { 
            username: 'root',
            name: 'Big Root',
            passwordHash
        }
        const userObject = new User(user)
        await userObject.save()
    })
    
    test('an user with a fresh username can be created', async () => {
        const usersAtStart = await api.get('/api/users')

        const user = {
            username: 'vitorlz',
            name: 'Vitor',
            password: 'vitor123'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await api.get('/api/users')
        const usernames = usersAtEnd.body.map(u => u.username)

        assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)
        assert(usernames.includes(result.body.username))
    })

    test('400 bad request is returned when creating an user with an username that already exists', async () => {
        const usersAtStart = await api.get('/api/users')

        const user = {
            username: 'root',
            name: 'Vitor',
            password: 'vitor123'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)
      
        const usersAtEnd = await api.get('/api/users')
        const usernames = usersAtEnd.body.map(u => u.username)

        assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        assert(!usernames.includes(result.body.username))
        assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('400 bad request is returned when username has invalid format', async () => {
        const usersAtStart = await api.get('/api/users')

        const user = {
            username: 'aa',
            name: 'Vitor',
            password: 'vitor123'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)
      
        const usersAtEnd = await api.get('/api/users')
        const usernames = usersAtEnd.body.map(u => u.username)

        assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        assert(!usernames.includes(result.body.username))
        assert(result.body.error.includes('validation error'))
    })

    test('400 bad request is returned when password has invalid format', async () => {
        const usersAtStart = await api.get('/api/users')

        const user = {
            username: 'aaaaa',
            name: 'Vitor',
            password: 'aa'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)
      
        const usersAtEnd = await api.get('/api/users')
        const usernames = usersAtEnd.body.map(u => u.username)

        assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        assert(!usernames.includes(result.body.username))
        assert(result.body.error.includes('validation error, password too short'))
    })


})

after(() => {
    mongoose.connection.close()
})