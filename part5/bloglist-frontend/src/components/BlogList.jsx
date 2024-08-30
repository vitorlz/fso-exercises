import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, handleOnLike, user, handleOnDelete }) => (
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

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  handleOnLike: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func.isRequired,
}

export default BlogList


