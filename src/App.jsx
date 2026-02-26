import { useState } from 'react'
import { useAuthStore } from './store'
import Login from './components/Login'
import TeacherDashboard from './components/TeacherDashboard'
import StudentDashboard from './components/StudentDashboard'
import './App.css'

function App() {
  const { currentUser, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {!currentUser ? (
        <Login />
      ) : (
        <div className="app-container">
          <nav className="app-navbar">
            <div className="navbar-left">
              <h1 className="app-title">📚 Peer Review Platform</h1>
            </div>
            <div className="navbar-right">
              <div className="user-info">
                <span className="user-role">{currentUser.role}</span>
                <span className="user-name">{currentUser.name}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </nav>

          <main className="main-content">
            {currentUser.role === 'teacher' ? (
              <TeacherDashboard />
            ) : (
              <StudentDashboard />
            )}
          </main>
        </div>
      )}
    </>
  )
}

export default App
