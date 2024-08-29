import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({message: '', isError: false})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
  
    try {
      const result = await blogService.create(newBlog)
      const updatedBlogs = blogs.concat(result)
      setBlogs(updatedBlogs)
      setTitle('')
      setAuthor('')
      setUrl('')
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
          <AddBlogForm 
            title={title} 
            author={author} 
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
            addBlog={addBlog}
          />
          <BlogList blogs={blogs} />
        </div>  
      }
    </div>
  )
}

export default App