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
  const [message, setMessage] = useState('')

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
      setMessage(`Wrong username or password`)
        setTimeout(() => {
          setMessage('')
      }, 5000)
    }
  }

  const handleOnLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
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
        setMessage(`${newBlog.title} by ${newBlog.author} was added`)
        setTimeout(() => {
          setMessage('')
        }, 5000)
      }
    } catch (error) {
      console.log(error)
      setMessage('Error adding blog')
        setTimeout(() => {
          setMessage('')
      }, 5000)
    }
    
  }

  return (
    <div>
      { user === null ?
        <div> 
          <h2>log into application</h2>
          <Notification message={message} />
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
          <Notification message={message} />
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