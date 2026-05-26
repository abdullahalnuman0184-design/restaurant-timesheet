import React from 'react';

import logo from './images/logo.png';

function WelcomePage() {

  return (

    <div
      style={{
        height: '100vh',
        backgroundColor: '#111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}
    >

      <img
        src={logo}
        alt="Restaurant Logo"
        style={{
          width: '220px',
          marginBottom: '20px',
          borderRadius: '20px',
          boxShadow:
            '0px 0px 25px orange'
        }}
      />

      <h1
        style={{
          color: 'orange',
          fontSize: '48px',
          marginBottom: '10px'
        }}
      >
        Hut Bazaar Restaurant
      </h1>

      <p
        style={{
          marginBottom: '30px',
          fontSize: '18px'
        }}
      >
        Employee Timesheet Management
      </p>

      <div
        style={{
          display: 'flex',
          gap: '20px'
        }}
      >

        <button
          onClick={() =>
            window.location.href = '/login'
          }
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: 'orange',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        <button
          onClick={() =>
            window.location.href = '/signup'
          }
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Employee Signup
        </button>

      </div>

    </div>

  );

}

export default WelcomePage;