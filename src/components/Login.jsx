import { useState } from 'react';
import { useAuthStore } from '../store';
import './Login.css';

export default function Login() {
  const [currentPage, setCurrentPage] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const { users, login, registerUser } = useAuthStore();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('login');
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === selectedRole
    );

    if (user) {
      login(user.email);
      setSuccessMessage(`Welcome, ${user.name}!`);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      setError('Email already registered');
      return;
    }

    const newUser = registerUser({
      name: fullName,
      email,
      password,
      role: selectedRole,
    });

    if (newUser) {
      setSuccessMessage('Account created successfully! You can now login.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setTimeout(() => setCurrentPage('login'), 2000);
    }
  };

  const handleBackToRoles = () => {
    setCurrentPage('role-select');
    setSelectedRole(null);
    setError('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
  };

  // Role Select Page
  if (currentPage === 'role-select') {
    return (
      <div className={`login-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="login-card">
          <h1>📚 Peer Review Platform</h1>
          <p className="subtitle">Collaborative Learning for Students</p>

          <div className="login-section">
            <h2>Select Your Role</h2>
            <p className="role-description">Choose your role to proceed</p>
            <div className="role-selection">
              <button
                className="role-option teacher-role"
                onClick={() => handleRoleSelect('teacher')}
              >
                <div className="role-icon">👨‍🏫</div>
                <div className="role-title">Teacher</div>
                <div className="role-subtitle">
                  Manage assignments
                </div>
              </button>

              <button
                className="role-option student-role"
                onClick={() => handleRoleSelect('student')}
              >
                <div className="role-icon">👨‍🎓</div>
                <div className="role-title">Student</div>
                <div className="role-subtitle">
                  Collaborate & review
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register Page
  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div className="login-card">
        <button className="back-button" onClick={handleBackToRoles}>
          ← Back
        </button>

        <div className="role-indicator">
          <span className="role-icon">
            {selectedRole === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
          </span>
          <span className="role-name">
            {selectedRole === 'teacher' ? 'Teacher' : 'Student'} Portal
          </span>
        </div>

        {currentPage === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@school.edu"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>

            <div className="form-divider">or</div>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setCurrentPage('register')}
            >
              Create Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Create Account</h2>
            <p className="form-subtitle">
              Register as a {selectedRole === 'teacher' ? 'Teacher' : 'Student'}
            </p>

            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@school.edu"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
              <p className="field-hint">At least 6 characters</p>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Account
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setCurrentPage('login')}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
