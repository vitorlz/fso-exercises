import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, handleOnLike, handleOnDelete}) => {

  const [visible, setVisible] = useState(false)

  const outerStyle = {
    border: '2px solid black',
    padding: '5px',
    margin: '5px',
    fontSize: '16px'
  }

  const userCreatedBlog = user.id === blog.user.id

  const innerStyle = {
    margin: 0,
    display: visible ? '' : 'none'
  }

  return(
    <div style={outerStyle}>
      <div  style={{ marginBottom: 0 }}>
        {blog.title} by {blog.author} 
        <button style={{ marginLeft: '5px' }} onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={innerStyle}>
        {blog.url} 
        <br />
        likes: {blog.likes} 
        <button style={{ marginLeft: '5px' }} onClick={() => handleOnLike(blog)}>
          like
        </button>
        <br />
        {blog.user.name}
        {userCreatedBlog ?
          <div>
            <button onClick={() => handleOnDelete(blog)}>delete</button>
          </div> :
          null
        }
      </div>
    </div> 
  )
}

  


export default Blog