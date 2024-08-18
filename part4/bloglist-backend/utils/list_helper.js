const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    
    if(blogs.length === 0){
        return null
    } else {
        const likesArray = blogs.map(blog => blog.likes)
        const mostLiked = Math.max(...likesArray)
        const favorite = blogs.find(blog => blog.likes === mostLiked)

        return {
            title: favorite.title,
            author: favorite.author,
            likes: favorite.likes
        }
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    } 
    
    const authors = blogs.map(blog => blog.author)
    const blogsPerAuthor = lodash.countBy(authors)
    const max = Math.max(...Object.values(blogsPerAuthor))
    const result = lodash.toPairs(blogsPerAuthor)
        .map(pair => {
            return { author: pair[0], blogs: pair[1]}
        })
        .find(author => author.blogs === max)

    return result  
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return null
    }

    let authorsArray = []
    let max = 0

    const uniqueAuthors = lodash.uniq(blogs.map(blog => blog.author))

    uniqueAuthors.forEach(author => {
        const filteredByAuthor = blogs.filter(blog => blog.author === author)

        const likesSum = filteredByAuthor.reduce( (sum, blog) => {
            return sum + Number(blog.likes)
        }, 0)

        max = likesSum > max ? likesSum : max

        authorsArray.push({ author: author, likes: likesSum})
    })

    const result = authorsArray.find(author => author.likes === max)

    console.log(result)

    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}

