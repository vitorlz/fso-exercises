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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

