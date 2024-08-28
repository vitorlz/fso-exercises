import Blog from './Blog'

const BlogList = ({ blogs }) => (
    <div>
        <br />
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
    </div>
)

export default BlogList
     
    
