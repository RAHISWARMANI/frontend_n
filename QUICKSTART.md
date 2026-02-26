# Quick Start Guide

Get up and running with the Peer Review Platform in 5 minutes!

## 1. Installation

```bash
cd project
npm install
```

This installs all required dependencies:
- React 19.2.0
- Zustand 4.4.0 (state management)
- Vite 8.0 (build tool)

## 2. Start Development Server

```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

You should see the login screen with user options.

## 3. Login & Explore

### Option A: Teacher Experience (5 minutes)

1. Click on **"John Teacher"** card
2. You'll see the Teacher Dashboard with:
   - **+ New Assignment** button
   - List of active assignments
   - Collaboration monitoring section

**Try these actions:**
- Click "+ New Assignment"
- Fill in:
  - Title: "Mobile App Project"
  - Description: "Build an iOS app with React Native"
  - Due Date: "2026-04-01"
- Click "Create Assignment"
- See your new assignment appear in the grid

### Option B: Student Experience (5 minutes)

1. Go back to login (Logout button in navbar)
2. Click on **"Alice Student"** card
3. You'll see the Student Dashboard with:
   - **My Projects** section (left)
   - **Peer Review** section (right)

**Try these actions:**

**Submit a File:**
- Find "Beautiful Store Website" project
- Click "📤 Upload File"
- A file input appears
- (Note: Files are tracked but not physically uploaded in demo)

**Review a Peer Project:**
- Scroll to "Peer Review" section
- Click "Start Review" on any project
- A modal opens with:
  - 4 scoring criteria (Design, Functionality, etc.)
  - Slider controls (0-25 per criterion)
  - Feedback textarea
- Fill in scores and feedback
- Click "Submit Review"

**View Reviews Received:**
- Click "👁️ View Reviews" on your project
- See all peer reviews with scores and feedback
- View visual score bars for each criterion

## 4. Switch Users

- Click **"Logout"** in the top right
- Select a different user
- Note how each role sees different information

**Try each user:**
- John Teacher (teacher) → Teacher Dashboard
- Alice Student (student) → Student Dashboard
- Bob Student (student) → Different student perspective
- Carol Student (student) → Another student view

## 5. Explore Sample Data

The platform comes with realistic sample data:

### Assignments
- "Web Design Project" (Responsive website)

### Projects
- "Beautiful Store Website" (2 team members, 65% complete)
- "Tech Blog Platform" (1 team member, 20% complete)

### Reviews
- 2 existing reviews with feedback and scores
- Demonstrates the feedback process

## Common Actions

### As a Teacher:
```
1. Login as John Teacher
2. Create New Assignment
3. View Collaboration Monitoring
4. Check Project Progress
```

### As a Student:
```
1. Login as Alice Student
2. Upload Files to Project
3. Review Peer Work (other projects)
4. View Feedback Received
```

## File Structure

```
src/
├── App.jsx                    # Main app with routing
├── App.css                    # App styling
├── store.js                   # Zustand stores (ALL state)
├── main.jsx                   # Entry point
├── components/
│   ├── Login.jsx             # Login screen
│   ├── TeacherDashboard.jsx  # Teacher interface
│   ├── StudentDashboard.jsx  # Student interface
│   ├── StatCard.jsx          # Reusable stat component
│   └── *.css                 # Component styles
└── assets/
    └── react.svg             # React logo
```

## Understanding the Code

### State Management (src/store.js)

Four Zustand stores manage everything:

**1. Auth Store** - User login/logout
```javascript
useAuthStore()
├── currentUser
├── users
├── login(email)
└── logout()
```

**2. Assignment Store** - Teacher assignments
```javascript
useAssignmentStore()
├── assignments
├── createAssignment()
└── getAssignmentById()
```

**3. Project Store** - Student projects
```javascript
useProjectStore()
├── projects
├── createProject()
├── addFileToProject()
└── getProjectsByAssignment()
```

**4. Review Store** - Peer reviews
```javascript
useReviewStore()
├── reviews
├── submitReview()
└── getReviewsForProject()
```

### Components Structure

**Login.jsx**
- Shows available users
- Handles login action
- Routes based on role

**TeacherDashboard.jsx**
- Create assignments
- View active assignments
- Monitor collaboration
- Display rubric

**StudentDashboard.jsx**
- View my projects
- Upload files
- Browse peer projects
- Submit reviews
- View feedback

## Troubleshooting

### "npm install" fails
```bash
# Clear cache
npm cache clean --force

# Remove lock file
rm package-lock.json

# Try again
npm install
```

### Dev server won't start
```bash
# Check port 5173 is free
# Or use different port:
npm run dev -- --port 3000
```

### Can't see login screen
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Data disappears after refresh
This is expected! The demo stores data in memory only.
To persist data, follow API_INTEGRATION.md to add a backend.

## Next Steps

### Want to understand the code better?
1. Read FEATURES.md for detailed feature list
2. Check store.js for all state management
3. Explore component files for UI implementation

### Want to add a backend?
1. Follow API_INTEGRATION.md
2. Set up Node.js/Express server
3. Connect database (PostgreSQL recommended)
4. Update store.js to call API endpoints

### Want to deploy?
1. Read DEPLOYMENT.md
2. Choose platform (Vercel, Netlify, AWS, etc.)
3. Follow step-by-step instructions
4. Configure environment variables

### Want to customize?
1. Modify colors in CSS files
2. Add new rubric criteria in store.js
3. Extend components for new features
4. Add more sample users and data

## Key Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Logout | Click logout button (top right) |
| Submit form | Enter key or click button |
| Close modal | Esc key or click X button |
| Refresh data | F5 or Ctrl+R |

## Tips & Tricks

1. **Test All Roles**: Login as each user to see different interfaces
2. **Try All Features**: Create assignments, upload files, submit reviews
3. **Check Sample Data**: Explore the pre-loaded realistic examples
4. **Read the Code**: Well-commented code explains implementation
5. **Inspect Styles**: CSS files show responsive design patterns

## Getting Help

### Issues & Questions
1. Check FEATURES.md for what's possible
2. Look at sample data in store.js
3. Review component code for implementation
4. Check API_INTEGRATION.md for backend info

### Common Questions

**Q: Why does my data disappear on refresh?**
A: Demo uses in-memory storage. Add backend for persistence.

**Q: Can I add more users?**
A: Yes, edit the `users` array in store.js

**Q: Can I customize the grading rubric?**
A: Yes, modify the `rubric` object in store.js

**Q: How do I connect to a real database?**
A: Follow API_INTEGRATION.md for detailed steps

## Summary

You now know how to:
- ✅ Start the development server
- ✅ Login as teacher or student
- ✅ Create assignments
- ✅ Upload files
- ✅ Submit peer reviews
- ✅ View feedback
- ✅ Switch between users

**Ready to dive deeper?** Check out FEATURES.md for comprehensive documentation!

