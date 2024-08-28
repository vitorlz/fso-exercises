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

export default LoginForm
