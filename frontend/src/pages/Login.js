import React, { useState } from 'react'
import { useUser } from '../providers/UserProvider';
import { useNavigate } from 'react-router-dom';

function Login() {


    const { user, login, logout, setUser } = useUser();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const navigate = useNavigate('/');
  
    const submitLogin = async (event) => {
      event.preventDefault()
      login(
        event.target.username.value,
        event.target.password.value
      );
      navigate('/library')
    }

    
  return (
    <div
        style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
        }}
    >
        <form onSubmit={submitLogin}>
            <input name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' type='text' /> <br />
            <input name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='text' /> <br />
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login