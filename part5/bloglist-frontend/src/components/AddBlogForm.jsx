import { useState } from 'react'

const AddBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        const newBlog = {
            title,
            author,
            url
        }
        
        createBlog(newBlog)
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input 
                        type="text"
                        name="Title"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)} 
                    />
                </div>
                <div>
                    author:
                    <input 
                        type="text"
                        name="Author"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)} 
                    />
                </div>
                <div>
                    url:
                    <input 
                        type="text"
                        name="Url"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)} 
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AddBlogForm

