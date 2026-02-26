# Peer Review & Collaboration Platform

A comprehensive web application for students to collaborate on projects, review each other's work, and provide constructive feedback. Built with React and Zustand for state management.

## Features

### 👨‍🏫 Teacher Features
- **Create Assignments**: Set up peer review assignments with custom rubrics
- **Monitor Progress**: Track student collaboration progress in real-time
- **View Rubric**: Define grading criteria for each assignment
- **Activity Tracking**: Monitor project submissions and team progress
- **Assignment Management**: Create, update, and manage active assignments

### 👨‍🎓 Student Features
- **Project Collaboration**: Work together with team members on assignments
- **File Management**: Upload and manage project files
- **Peer Review**: Review other students' work with structured feedback
- **Score Rubric**: Evaluate projects using standardized criteria
  - Design (0-25 points)
  - Functionality (0-25 points)
  - Documentation (0-25 points)
  - Collaboration (0-25 points)
- **Feedback Reception**: View and learn from peer reviews
- **Progress Tracking**: Monitor project completion percentage

## Project Structure

```
src/
├── components/
│   ├── Login.jsx              # User authentication interface
│   ├── Login.css              # Login styling
│   ├── TeacherDashboard.jsx   # Teacher assignment management
│   ├── TeacherDashboard.css   # Teacher dashboard styling
│   ├── StudentDashboard.jsx   # Student collaboration interface
│   └── StudentDashboard.css   # Student dashboard styling
├── store.js                   # Zustand state management
├── App.jsx                    # Main application component
├── App.css                    # Application styling
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

## Technology Stack

- **React 19.2.0**: UI library
- **Zustand 4.4.0**: State management
- **Vite 8.0**: Build tool and dev server
- **CSS3**: Styling with responsive design

## State Management (Zustand)

### useAuthStore
Manages user authentication and current user state.

**State:**
- `currentUser`: Currently logged-in user object
- `users`: Available users for login

**Actions:**
- `login(email)`: Authenticate user by email
- `logout()`: Clear current user
- `getCurrentUser()`: Get current user

### useAssignmentStore
Manages assignment creation and retrieval.

**State:**
- `assignments`: Array of all assignments

**Actions:**
- `createAssignment(assignment)`: Create new assignment
- `updateAssignment(id, updates)`: Update existing assignment
- `getAssignments()`: Get all assignments
- `getAssignmentById(id)`: Get specific assignment

### useProjectStore
Manages student projects and files.

**State:**
- `projects`: Array of all projects

**Actions:**
- `createProject(project)`: Create new project
- `updateProject(id, updates)`: Update project
- `getProjectsByAssignment(assignmentId)`: Get projects for assignment
- `getProjectById(id)`: Get specific project
- `addFileToProject(projectId, file)`: Add file to project

### useReviewStore
Manages peer reviews and feedback.

**State:**
- `reviews`: Array of all reviews

**Actions:**
- `submitReview(review)`: Submit peer review
- `updateReview(id, updates)`: Update review
- `getReviewsForProject(projectId)`: Get reviews for project
- `getReviewsByUser(userId)`: Get reviews by user

## Sample Data

The application comes pre-configured with sample data:

**Users:**
- John Teacher (teacher@school.edu) - Teacher role
- Alice Student (alice@school.edu) - Student role
- Bob Student (bob@school.edu) - Student role
- Carol Student (carol@school.edu) - Student role

**Sample Assignment:**
- "Web Design Project" - Create a responsive website for a local business

**Sample Project:**
- "Beautiful Store Website" - Team project with multiple files

**Sample Review:**
- Feedback on the beautiful store website project

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd project

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running the Application

1. Start the development server: `npm run dev`
2. Open your browser to the provided URL (usually http://localhost:5173)
3. Select a user to login:
   - **Teacher**: John Teacher to manage assignments
   - **Student**: Alice, Bob, or Carol to collaborate and review

## User Workflows

### Teacher Workflow
1. Login as "John Teacher"
2. Click "+ New Assignment" to create an assignment
3. Fill in assignment details (title, description, due date)
4. View active assignments and their progress
5. Monitor student collaboration in the activity section
6. Check project progress percentages and team sizes

### Student Workflow
1. Login as a student (Alice, Bob, or Carol)
2. View your projects in "My Projects" section
3. Upload files to your project using "📤 Upload File"
4. View project progress and team information
5. Navigate to "Peer Review" section to review other teams' work
6. Click "Start Review" to provide feedback
7. Rate projects using the scoring rubric (0-25 per criterion)
8. Add constructive feedback to help teams improve
9. View reviews received on your projects

## Key Components

### Login Component
- Interactive user selection interface
- Role-based authentication (teacher/student)
- Gradient background design

### TeacherDashboard Component
- Create new assignments with custom rubrics
- View all active assignments
- Monitor project progress statistics
- Track recent activity
- Display grading criteria

### StudentDashboard Component
- View assigned projects
- Manage project files
- Track project progress
- Conduct peer reviews with structured feedback
- View received reviews and scores

## Styling & Design

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Responsive Design**: Mobile-friendly layouts
- **Modern UI**: Card-based design with smooth transitions
- **Accessibility**: Clear typography and color contrast

## Features Breakdown

### Collaboration Tools
- Real-time file management
- Team member tracking
- Progress visualization
- Activity monitoring

### Peer Review System
- Structured scoring rubric
- Four evaluation criteria
- Constructive feedback textarea
- Visual score display with progress bars
- Review history and aggregation

### Progress Tracking
- Project completion percentage
- Team size indication
- Average score calculation
- File upload tracking

## Future Enhancements

Potential features to add:
- Real-time chat/messaging between team members
- Comments on specific files
- Revision history for projects
- Email notifications
- Analytics and reporting dashboard
- Backend API integration
- User role customization
- Rubric customization per assignment
- Anonymous peer reviews option
- Group chat functionality

## Notes

- This is a frontend-only implementation using Zustand for state management
- All data is stored in-memory and will reset on page refresh
- To persist data, integrate with a backend database (Firebase, MongoDB, etc.)
- User authentication is simplified for demo purposes

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
