# Role-Based Login & Registration Guide

## Overview

The Peer Review Platform now features a complete role-based authentication system with separate login pages for **Teachers** and **Students**, plus a full **registration system** for creating new accounts.

---

## Features Implemented

### 1. Role Selection Page
When you first load the application, you'll see two role options:
- **👨‍🏫 Teacher Portal** - For educators and administrators
- **👨‍🎓 Student Portal** - For students and learners

Click on either role to proceed to the login page.

### 2. Role-Specific Login Pages

#### Teacher Login
- Email: `teacher@school.edu`
- Password: `password123`
- Access to assignment management and collaboration monitoring

#### Student Login
- Email: `alice@school.edu` (or `bob@school.edu`, `carol@school.edu`)
- Password: `password123`
- Access to project collaboration and peer review features

### 3. User Registration

Create new accounts for any role:

**To Register:**
1. Select your role (Teacher or Student)
2. Click "Create New Account"
3. Fill in:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Create Account"
5. You'll be redirected to login

**Validation Rules:**
- ✅ Email must contain @ symbol
- ✅ Password must be at least 6 characters
- ✅ Passwords must match
- ✅ Email cannot already be registered
- ✅ All fields are required

### 4. Demo Credentials Section

Each login page displays demo credentials:

**For Teachers:**
```
Email: teacher@school.edu
Password: password123
```

**For Students:**
```
Email: alice@school.edu
Password: password123

Email: bob@school.edu
Password: password123

Email: carol@school.edu
Password: password123
```

---

## How to Use

### Scenario 1: Login with Demo Account

1. **Open application** → See role selection screen
2. **Click "Teacher"** → Go to teacher login
3. **Enter credentials:**
   - Email: `teacher@school.edu`
   - Password: `password123`
4. **Click Login** → Access teacher dashboard

### Scenario 2: Create New Teacher Account

1. **Click "Teacher"** role
2. **Click "Create New Account"**
3. **Fill in form:**
   - Full Name: `Jane Smith`
   - Email: `jane.smith@school.edu`
   - Password: `mypassword123`
   - Confirm: `mypassword123`
4. **Click "Create Account"**
5. **Success message** appears
6. **Login with new credentials**

### Scenario 3: Create New Student Account

1. **Click "Student"** role
2. **Click "Create New Account"**
3. **Fill in form:**
   - Full Name: `Mike Johnson`
   - Email: `mike.johnson@school.edu`
   - Password: `secure123`
   - Confirm: `secure123`
4. **Click "Create Account"**
5. **Login as the new student**

---

## User Interface Components

### Role Selection Card
```
┌─────────────────────────────────────────┐
│  📚 Peer Review Platform                │
│  Collaborative Learning for Students    │
│                                         │
│     Select Your Role                    │
│  Choose your role to proceed            │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ 👨‍🏫 Teacher │  │ 👨‍🎓 Student │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Login Form
```
┌─────────────────────────────────────────┐
│  ← Back to Roles                        │
│                                         │
│  👨‍🏫 Teacher Portal                      │
│                                         │
│  Login                                  │
│  ┌─────────────────────────────────┐   │
│  │ Email Address                   │   │
│  │ ___________________________      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Password                        │   │
│  │ ___________________________      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ [Login]                         │   │
│  └─────────────────────────────────┘   │
│                 or                      │
│  ┌─────────────────────────────────┐   │
│  │ [Create New Account]            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📝 Demo Credentials                   │
│  Email: teacher@school.edu             │
│  Password: password123                  │
└─────────────────────────────────────────┘
```

### Registration Form
```
┌─────────────────────────────────────────┐
│  👨‍🏫 Teacher Portal                      │
│  Create Account - Register as a Teacher │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Full Name                       │   │
│  │ ___________________________      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Email Address                   │   │
│  │ ___________________________      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Password                        │   │
│  │ ___________________________      │   │
│  │ At least 6 characters           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Confirm Password                │   │
│  │ ___________________________      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ [Create Account]                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Error Messages & Validation

### Login Errors
```
❌ "Please fill in all fields"
   → Enter both email and password

❌ "Invalid email or password for this role"
   → Check your credentials and selected role

❌ "Email is required"
   → Enter your email address
```

### Registration Errors
```
❌ "Please fill in all fields"
   → Complete all form fields

❌ "Passwords do not match"
   → Confirm password must match password

❌ "Password must be at least 6 characters"
   → Use a longer password

❌ "Please enter a valid email"
   → Email must contain @ symbol

❌ "Email already registered"
   → This email is already in use
```

### Success Messages
```
✅ "Account created successfully! You can now login."
   → Registration complete, proceed to login

✅ "Welcome, [Name]!"
   → Successfully logged in
```

---

## Data Flow

### Login Process
```
1. User selects role (Teacher/Student)
   ↓
2. Enter email and password
   ↓
3. System validates credentials
   ↓
4. If valid: Login successful → Dashboard
   If invalid: Show error message
```

### Registration Process
```
1. User selects role
   ↓
2. Click "Create New Account"
   ↓
3. Fill registration form
   ↓
4. System validates all fields
   ↓
5. Check if email exists
   ↓
6. If valid: Create account → Show success → Redirect to login
   If invalid: Show error message
```

---

## Backend Integration (Storage)

### Current Implementation
- Users stored in Zustand state (in-memory)
- Data persists during session
- Resets on page refresh

### For Production
Add persistent storage:

```javascript
// Example: Save to localStorage
localStorage.setItem('users', JSON.stringify(users));

// Example: Save to database
POST /api/auth/register
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "teacher"
}
```

---

## Security Notes

### Current Demo
⚠️ **Passwords stored in plaintext** (demo only)
⚠️ **No encryption** (demo only)
⚠️ **No secure token** (demo only)

### For Production
✅ Hash passwords with bcrypt
✅ Use JWT tokens
✅ Implement HTTPS
✅ Add rate limiting
✅ Use httpOnly cookies
✅ Implement CSRF protection

---

## User State Management

### Zustand Auth Store

**Properties:**
- `currentUser` - Currently logged-in user
- `users` - Array of all registered users

**Methods:**
```javascript
login(email)          // Login user
logout()              // Logout current user
registerUser(data)    // Create new user
getCurrentUser()      // Get current user
getAllUsers()         // Get all users
getUsersByRole(role)  // Get users by role
```

---

## Common Tasks

### Check If User is Logged In
```javascript
const { currentUser } = useAuthStore();
if (!currentUser) {
  // Show login screen
} else {
  // Show dashboard
}
```

### Get All Students
```javascript
const { getUsersByRole } = useAuthStore();
const students = getUsersByRole('student');
```

### Register New User
```javascript
const { registerUser } = useAuthStore();
const newUser = registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'teacher'
});
```

---

## Testing the System

### Test Case 1: Demo Login
1. ✅ Select Teacher
2. ✅ Enter: teacher@school.edu / password123
3. ✅ Should see teacher dashboard

### Test Case 2: Invalid Credentials
1. ✅ Select Student
2. ✅ Enter: wrong@example.com / wrongpass
3. ✅ Should see error message

### Test Case 3: New Registration
1. ✅ Select Student
2. ✅ Click "Create New Account"
3. ✅ Fill form with valid data
4. ✅ Should see success message
5. ✅ Login with new credentials

### Test Case 4: Validation
1. ✅ Try empty form → Error
2. ✅ Try password < 6 chars → Error
3. ✅ Try mismatched passwords → Error
4. ✅ Try invalid email → Error
5. ✅ Try existing email → Error

---

## File Changes

### Modified Files
- **Login.jsx** - New role selection and auth forms
- **Login.css** - Styling for new UI
- **store.js** - Added registerUser() function

### New Features
- ✅ Role selection screen
- ✅ Role-specific login pages
- ✅ User registration form
- ✅ Form validation
- ✅ Error/success messages
- ✅ Demo credentials display

---

## Next Steps

1. **Test the system** using demo credentials
2. **Create test accounts** for different roles
3. **Test validation** with invalid inputs
4. **Verify role-based access** to dashboards
5. **Check localStorage** for persisted data (if added)

---

## Support

**Questions?**
- Check QUICKSTART.md for basic setup
- Review store.js for state management
- See Login.jsx for component logic

**Issues?**
- Clear browser cache
- Check browser console for errors
- Verify credentials are correct
- Ensure role is selected before login

