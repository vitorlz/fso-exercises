const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken) {
    return response.status(400).json({ error: 'invalid token' })
  }
  
  const user = await User.findById(decodedToken.id)

  if(!Object.keys(request.body).includes('likes')){
    request.body.likes = 0
  } 

  const blog = new Blog({...request.body, user: user._id})

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
    
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const toBeDeleted = await Blog.findById(request.params.id)

  console.log("user id:", user._id.toString())
  console.log("to be deleted user id:", toBeDeleted.user.toString())

  if(!toBeDeleted) {
    return response.status(400).send({ error: 'id does not exist'})
  }

  if (!(user._id.toString() === toBeDeleted.user.toString())){
    return response.status(401).json({ error: 'invalid token: you cannot delete a blog post that is not yours' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== toBeDeleted._id.toString())
  
  console.log(user.blogs)

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