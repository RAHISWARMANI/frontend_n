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
  const [forgotPasswordResult, setForgotPasswordResult] = useState(null);

  const { login, registerUser, resetPassword } = useAuthStore();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('login');
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = await login(email, password, selectedRole);
      setSuccessMessage(`Welcome, ${user.name}!`);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  const handleRegister = async (e) => {
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

    try {
      await registerUser({
        name: fullName,
        email,
        password,
        role: selectedRole,
      });

      setSuccessMessage('Account created successfully! You can now login.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setTimeout(() => setCurrentPage('login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
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

  const handleForgotPasswordClick = () => {
    setCurrentPage('forgot-password');
    setEmail('');
    setError('');
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const result = resetPassword(email);
    
    if (result) {
      setForgotPasswordResult(result);
      setCurrentPage('forgot-password-result');
    } else {
      setError('Email not found. Please check and try again.');
    }
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

            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password?
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
        ) : currentPage === 'forgot-password' ? (
          <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
            <h2>Forgot Password</h2>
            <p className="form-subtitle">Enter your email to reset your password</p>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@school.edu"
                autoFocus
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Reset Link
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setCurrentPage('login')}
            >
              Back to Login
            </button>
          </form>
        ) : currentPage === 'forgot-password-result' ? (
          <div className="auth-form password-reset-result">
            <h2>✅ Password Reset Successful</h2>

            <div className="reset-message">
              <p>
                <strong>Hi, {forgotPasswordResult.userName}!</strong>
              </p>
              <p>Your password has been reset. Use the temporary password below to login:</p>
              
              <div className="temp-password-box">
                <p className="temp-password-label">Temporary Password:</p>
                <p className="temp-password-value">{forgotPasswordResult.tempPassword}</p>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(forgotPasswordResult.tempPassword);
                    alert('Password copied to clipboard!');
                  }}
                >
                  📋 Copy Password
                </button>
              </div>

              <div className="reset-instructions">
                <h3>Next Steps:</h3>
                <ol>
                  <li>Copy the temporary password above</li>
                  <li>Click "Back to Login" button below</li>
                  <li>Login with your email and the temporary password</li>
                  <li>You can change your password in settings after login</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                setCurrentPage('login');
                setEmail('');
                setPassword('');
                setForgotPasswordResult(null);
              }}
            >
              Back to Login
            </button>
          </div>
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
