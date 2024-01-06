import React, { useState } from 'react'
import { useUser } from '../providers/UserProvider'
import { useNavigate } from 'react-router-dom';

export function Header() {

  const { user, logout } = useUser();

  const navigate = useNavigate();

  return (
    <header className="Header">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '10vh'
        }}
      >
        {
          user === null
          ?
          <button onClick={()=>{navigate('/login')}}>Login</button>
          :
          <button onClick={logout}>Logout</button>
        }
      </div>
    </header>
  );
}