const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const saltRounds = 10

    if (password.length < 3) {
        return response.status(400).json({ error: 'validation error, password too short'})
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        username,
        name,
        passwordHash
    }

    const userObject = new User(user)
    const result = await userObject.save()

    response.status(201).json(result)

})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

module.exports = usersRouter
