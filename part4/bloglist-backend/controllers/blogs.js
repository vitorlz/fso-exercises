const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  if(!Object.keys(request.body).includes('likes')){
    request.body.likes = 0
  } 
  
  if (!Object.keys(request.body).includes('title') || !Object.keys(request.body).includes('url')) {
    response.status(400).end()
  } else {
    const blog = new Blog(request.body)
    const result = await blog.save()
      
    response.status(201).json(result)
  } 
})

module.exports = blogsRouter