const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper.js')

test('dummy returns one', () => {
    const blog = []

    const result = listHelper.dummy(blog)
    assert.strictEqual(result, 1)
})

const listWithOneBlog = [
  {
      _id: "66bfef4a3ec639e52df2d084",
      title: "Cooking Blog",
      author: "Bob",
      url: "cookingblog.com",
      likes: 4,
      __v: 0
  }     
]

const biggerList = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 28,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 12,
    __v: 0
  }  
]

const tiedList = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 3,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 12,
    __v: 0
  }  
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    
    assert.strictEqual(result, 0)
  })

  test('of a list containing a single blog is the same as the likes of the blog in the list', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 4)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)

    assert.strictEqual(result, 69)
  })
})

describe('favorite blog', () => {
  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })
  
  test('is the most liked one in a large list', () => {
    const result = listHelper.favoriteBlog(biggerList)

    const favorite = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 28
    }
      
    assert.deepStrictEqual(result, favorite)
  })

  test('of a list containing a single blog is the blog in the list', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)

    const favorite =    {
        title: "Cooking Blog",
        author: "Bob",
        likes: 4,
    }  
    
    assert.deepStrictEqual(result, favorite)
  })

  test('is the first most liked blog in the list when there is a tie', () => {
    const result = listHelper.favoriteBlog(tiedList)

    const favorite1 = {
        title: tiedList[3].title,
        author: tiedList[3].author,
        likes: tiedList[3].likes
    }

    assert.deepStrictEqual(result, favorite1)
  })
}) 

describe('most blogs', () => {
  test('returns author with most blogs in a large list', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(biggerList), { author: 'Robert C. Martin', blogs: 3 })
  })

  test('in a list with a single author returns the author in the list', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {  author: 'Bob', blogs: 1 })
  })

  test('returns null when given an empty list', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns any of the top bloggers when there is a tie', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(tiedList), { author: "Edsger W. Dijkstra", blogs:  3 })
  })
})

describe('Most likes', () => {
  test('returns author with most likes overall in a large list', () => {
    assert.deepStrictEqual(listHelper.mostLikes(biggerList), { author: 'Edsger W. Dijkstra', likes: 40 })
  })
  
  test('in a list with a single author returns the author in the list', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), { author: 'Bob', likes: 4 })
  })
 
  test('returns null when given an empty list', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })
  
  test('returns any of the top bloggers when there is a tie', () => {
    assert.deepStrictEqual(listHelper.mostLikes(tiedList), { author: "Edsger W. Dijkstra", likes: 22 })
  })
}) 