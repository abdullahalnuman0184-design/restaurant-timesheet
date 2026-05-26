import React, { useState } from 'react';

import axios from 'axios';

function Login() {

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const login = async () => {

    try {

      const response = await axios.post(
        'http://localhost:5000/login',
        {
          username,
          password
        }
      );

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'role',
        response.data.role
      );

      if (
        response.data.role === 'manager'
      ) {

        window.location.href =
          '/manager';

      } else {

        window.location.href =
          '/dashboard';

      }

    } catch (err) {

      alert('Invalid Credentials');

    }

  };

  return (

    <div
      style={{
        height: '100vh',
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >

      <div
        style={{
          backgroundColor:
            'rgba(0,0,0,0.80)',
          padding: '50px',
          borderRadius: '20px',
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow:
            '0px 0px 25px orange'
        }}
      >

        <h1
          style={{
            color: 'orange',
            textAlign: 'center',
            marginBottom: '10px',
            fontSize: '42px'
          }}
        >
          Employee Login 
    
        </h1>

        <input
          placeholder="Username"
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            padding: '15px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '18px'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: '15px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '18px'
          }}
        />

        <button
          onClick={login}
          style={{
            padding: '15px',
            backgroundColor: 'orange',
            border: 'none',
            borderRadius: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        <button
          onClick={() =>
            window.location.href =
              '/signup'
          }
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Create Employee Account
        </button>

      </div>

    </div>

  );

}

export default Login;