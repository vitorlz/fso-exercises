import Blog from './Blog'

const BlogList = ({ blogs, handleOnLike, user, handleOnDelete}) => (
    <div>
        <br />
        {blogs.map(blog =>
        <Blog 
            key={blog.id} 
            blog={blog} 
            user={user}
            handleOnLike={handleOnLike} 
            handleOnDelete={handleOnDelete}
        />
        )}
    </div>
)

export default BlogList
     
    
