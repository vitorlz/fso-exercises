const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if(!user || !passwordCorrect){
        return response.status(401).json({ error: 'invalid password or username' })
    }

    const userForToken = {
        username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    
    response.status(200).send({ token, username, name: user.name, id: user._id })
})

module.exports = loginRouter