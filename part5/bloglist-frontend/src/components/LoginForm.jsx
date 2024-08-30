import PropTypes from 'prop-types'

const LoginForm = ({ password, username, setUsername, setPassword, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
                username
        <input
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
                password
        <input
          type="password"
          name="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  password: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm
