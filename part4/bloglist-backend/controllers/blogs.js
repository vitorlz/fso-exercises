const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  const user = request.user

  if (!Object.keys(request.body).includes('likes')){
    request.body.likes = 0
  } 

  const blog = new Blog({...request.body, user: user._id})

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
    
  response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  
  const user = request.user

  const toBeDeleted = await Blog.findById(request.params.id)

  if(!toBeDeleted) {
    return response.status(400).send({ error: 'id does not exist'})
  }

  if (!(user._id.toString() === toBeDeleted.user.toString())){
    return response.status(401).json({ error: 'invalid token: you cannot delete a blog post that is not yours' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== toBeDeleted._id.toString())

  await Blog.findByIdAndDelete(request.params.id)
  await user.save()

  response.send(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  
  const toBeUpdated = await Blog.findById(request.params.id)

  if(!toBeUpdated) {
    return response.status(400).send({ error: 'id does not exist' })
  }

  if(!Object.keys(request.body).includes('likes')){
    request.body.likes = 0
  }
  
  updatedNote = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
  response.json(updatedNote)
})

module.exports = blogsRouter