const { test, describe, beforeEach, after } = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogsObject.map(b => b.save())

    await Promise.all(promiseArray)
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

test('valid blog post is successfully created', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    }
    
    await api  
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map(b => b.title)

    assert(titles.includes(newBlog.title))
    assert(blogsAtEnd.body.length, helper.initialBlogs.length + 1)
})

test('if the likes property is missing from the request it defaults to 0', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }

    const postedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert(Object.keys(postedBlog.body).includes('likes'))
    assert.strictEqual(postedBlog.body.likes, 0)
})

test('400 Bad Request if title is missing from a blog being posted', async () => {
    const newBlog = {
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }

    await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const blogsAtEnd = await api.get('/api/blogs')

    assert(blogsAtEnd.body.length, helper.initialBlogs.length)
})

test('400 Bad Request if url is missing from a blog being posted', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
    }
    
    await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')

    assert(blogsAtEnd.body.length, helper.initialBlogs.length)
})


after(() => {
    mongoose.connection.close()
})