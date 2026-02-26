# API Integration Guide

This document outlines how to integrate the Peer Review Platform with a backend API.

## Current Architecture

The application currently uses **Zustand** for client-side state management with in-memory data storage. To add backend support, follow this guide.

## Backend API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
- Request: { email: string, password: string }
- Response: { user: User, token: string }

POST /api/auth/logout
- Response: { success: boolean }

GET /api/auth/me
- Headers: { Authorization: "Bearer {token}" }
- Response: { user: User }
```

### Assignment Endpoints (Teacher Only)

```
GET /api/assignments
- Headers: { Authorization: "Bearer {token}" }
- Response: { assignments: Assignment[] }

POST /api/assignments
- Headers: { Authorization: "Bearer {token}" }
- Body: { title, description, dueDate, rubric }
- Response: { assignment: Assignment }

GET /api/assignments/:id
- Headers: { Authorization: "Bearer {token}" }
- Response: { assignment: Assignment }

PUT /api/assignments/:id
- Headers: { Authorization: "Bearer {token}" }
- Body: { title?, description?, dueDate?, status? }
- Response: { assignment: Assignment }

DELETE /api/assignments/:id
- Headers: { Authorization: "Bearer {token}" }
- Response: { success: boolean }
```

### Project Endpoints

```
GET /api/projects
- Headers: { Authorization: "Bearer {token}" }
- Response: { projects: Project[] }

POST /api/projects
- Headers: { Authorization: "Bearer {token}" }
- Body: { title, description, assignmentId, members }
- Response: { project: Project }

GET /api/projects/:id
- Headers: { Authorization: "Bearer {token}" }
- Response: { project: Project }

PUT /api/projects/:id
- Headers: { Authorization: "Bearer {token}" }
- Body: { title?, description?, progress?, status? }
- Response: { project: Project }

GET /api/projects/assignment/:assignmentId
- Headers: { Authorization: "Bearer {token}" }
- Response: { projects: Project[] }
```

### File Endpoints

```
POST /api/projects/:projectId/files
- Headers: { Authorization: "Bearer {token}", Content-Type: multipart/form-data }
- Body: FormData with file
- Response: { file: File }

DELETE /api/projects/:projectId/files/:fileId
- Headers: { Authorization: "Bearer {token}" }
- Response: { success: boolean }
```

### Review Endpoints

```
GET /api/reviews
- Headers: { Authorization: "Bearer {token}" }
- Response: { reviews: Review[] }

POST /api/reviews
- Headers: { Authorization: "Bearer {token}" }
- Body: { projectId, scores, feedback }
- Response: { review: Review }

GET /api/reviews/project/:projectId
- Headers: { Authorization: "Bearer {token}" }
- Response: { reviews: Review[] }

GET /api/reviews/user/:userId
- Headers: { Authorization: "Bearer {token}" }
- Response: { reviews: Review[] }

PUT /api/reviews/:id
- Headers: { Authorization: "Bearer {token}" }
- Body: { scores?, feedback? }
- Response: { review: Review }

DELETE /api/reviews/:id
- Headers: { Authorization: "Bearer {token}" }
- Response: { success: boolean }
```

## Integration Steps

### 1. Create API Service Layer

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data.user;
  },

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  // Assignment endpoints
  async getAssignments() {
    return this.request('/assignments');
  },

  async createAssignment(assignment) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  // Project endpoints
  async getProjects() {
    return this.request('/projects');
  },

  async createProject(project) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  // Review endpoints
  async submitReview(review) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  async getReviewsForProject(projectId) {
    return this.request(`/reviews/project/${projectId}`);
  },
};
```

### 2. Update Zustand Stores

Modify stores to use API:

```javascript
export const useAuthStore = create((set) => ({
  // ...existing state...
  
  login: async (email, password) => {
    try {
      const user = await api.login(email, password);
      set({ currentUser: user });
    } catch (error) {
      console.error('Login failed:', error);
    }
  },

  logout: async () => {
    await api.logout();
    set({ currentUser: null });
  },
}));
```

### 3. Set Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

### 4. Error Handling

Add error boundary and global error handling:

```javascript
export const useErrorStore = create((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('teacher', 'student') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assignments Table

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  createdBy UUID NOT NULL REFERENCES users(id),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dueDate TIMESTAMP,
  status ENUM('draft', 'active', 'closed') DEFAULT 'active',
  rubric JSON,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignmentId UUID NOT NULL REFERENCES assignments(id),
  status ENUM('planning', 'in-progress', 'submitted', 'completed') DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Project Members Table

```sql
CREATE TABLE project_members (
  projectId UUID NOT NULL REFERENCES projects(id),
  userId UUID NOT NULL REFERENCES users(id),
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (projectId, userId)
);
```

### Files Table

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(512),
  uploadedBy UUID NOT NULL REFERENCES users(id),
  uploadedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fileSize INTEGER
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES projects(id),
  reviewedBy UUID NOT NULL REFERENCES users(id),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scores JSON,
  feedback TEXT,
  status ENUM('draft', 'submitted') DEFAULT 'draft',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Recommended Backend Stack

- **Node.js/Express** or **Python/Flask**
- **PostgreSQL** for database
- **JWT** for authentication
- **Multer** (Node) or similar for file uploads
- **CORS** middleware for cross-origin requests

## Testing API Integration

### 1. Mock API Responses

```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

const API_URL = 'http://localhost:3000/api';

export const handlers = [
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: '1', name: 'John', email: 'john@test.com' },
        token: 'mock-token',
      })
    );
  }),
];
```

### 2. Using Mock Service Worker

```javascript
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: Store JWT in httpOnly cookies when possible
3. **CORS**: Configure proper CORS policies
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Implement rate limiting on backend
6. **Authentication**: Verify JWT tokens on every request
7. **Authorization**: Implement role-based access control (RBAC)
8. **File Upload**: Validate file types and sizes

## Deployment

See DEPLOYMENT.md for cloud deployment options.
