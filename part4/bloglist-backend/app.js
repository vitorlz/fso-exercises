const express = require('express')
const cors = require('cors')
const app = express()
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => 
        logger.info('Error connecting to MongoDB: ', error.message)
    )

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app