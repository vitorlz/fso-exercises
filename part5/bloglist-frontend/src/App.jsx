import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', isError: false })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setNotification(
        {
          message: 'Wrong password or username',
          isError: true
        }
      )
      setTimeout(() => {
        setNotification(
          {
            message: '',
            isError: false
          }
        )
      }, 5000)
    }
  }

  const handleOnLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    setNotification(
      {
        message: 'Logout successful',
        isError: false
      }
    )
    setTimeout(() => {
      setNotification(
        {
          message: '',
          isError: false
        }
      )
    }, 5000)
  }

  const addBlog = async (newBlog) => {
    try {
      const result = await blogService.create(newBlog)
      const updatedBlogs = blogs.concat(result)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs => blogs = updatedBlogs)
      if(result) {
        setNotification(
          {
            message: `${newBlog.title} by ${newBlog.author} was added`,
            isError: false
          }
        )
        setTimeout(() => {
          setNotification(
            {
              message: '',
              isError: false
            }
          )
        }, 5000)
      }
    } catch (error) {
      console.log(error)
      setNotification(
        {
          message: 'Error adding blog',
          isError: true
        }
      )
      setTimeout(() => {
        setNotification(
          {
            message: '',
            isError: false
          }
        )
      }, 5000)
    }
  }

  const handleOnLike = async (blog) => {
    const currentBlogs = blogs
    const blogToBeUpdated = blogs.find(b => b.id === blog.id)
    const index = blogs.indexOf(blogToBeUpdated)

    currentBlogs[index] = { ...blogToBeUpdated, likes: blogToBeUpdated.likes + 1 }

    const updatedBlog = { ...currentBlogs[index], user: blog.user.id }

    await blogService.update(blog.id, updatedBlog)
    setBlogs([...currentBlogs])
  }

  const handleOnDelete = async (blog) => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  return (
    <div>
      { user === null ?
        <div>
          <h2>log into application</h2>
          <Notification notification={notification} />
          <LoginForm
            username={username}
            setUsername={setUsername}
            setPassword={setPassword}
            password={password}
            onSubmit={handleLogin}
          />
        </div> :
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <div>
            {user.name} logged in
            <button onClick={handleOnLogout}>logout</button>
          </div>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <AddBlogForm
              createBlog={addBlog}
            />
          </Togglable>
          <BlogList
            blogs={[...blogs].sort((a, b) => b.likes - a.likes)}
            user={user}
            handleOnLike={handleOnLike}
            handleOnDelete={handleOnDelete}
          />
        </div>
      }
    </div>
  )
}

export default App