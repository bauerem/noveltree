import React, { useState } from 'react'
import { Header } from '../components/Header'
import { useUser } from '../providers/UserProvider'

function LandingPage() {

  const { user, logout } = useUser();

  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
        }}
      >
        {
          user == null
          ?
          <div>
            <p>Log in above.</p>
          </div>
          :
          <div>
            <p>You are logged in as {user}.</p>
          </div>
        }
      </div>
    </div>
  )
}

export default LandingPage