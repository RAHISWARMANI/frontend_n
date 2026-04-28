import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const AUTH_STORAGE_KEY = 'peerreview_auth';

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveStoredAuth = (auth) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// ============================================================================
// AUTH STORE - Manages user authentication
// ============================================================================
export const useAuthStore = create((set, get) => ({
  currentUser: getStoredAuth()?.currentUser || null,
  token: getStoredAuth()?.token || null,
  users: [],

  login: async (email, password, role) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    if (role && data.user.role !== role) {
      throw new Error('Selected role does not match this account');
    }

    set({ currentUser: data.user, token: data.token });
    saveStoredAuth({ currentUser: data.user, token: data.token });
    return data.user;
  },

  logout: () => {
    set({ currentUser: null, token: null });
    clearStoredAuth();
  },

  getCurrentUser: () => get().currentUser,

  registerUser: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    return data.user;
  },

  getAllUsers: () => get().users,

  getUsersByRole: (role) => {
    return get().users.filter((u) => u.role === role);
  },

  resetPassword: (email) => {
    const user = get().users.find((u) => u.email === email);
    if (!user) {
      return null;
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2).toUpperCase();
    
    // Update user's password
    set((state) => ({
      users: state.users.map((u) =>
        u.email === email ? { ...u, password: tempPassword } : u
      ),
    }));

    return {
      success: true,
      tempPassword,
      userName: user.name,
    };
  },
}));

// ============================================================================
// ASSIGNMENT STORE - Manages teacher assignments
// ============================================================================
export const useAssignmentStore = create((set, get) => ({
  assignments: [],

  loadAssignments: async () => {
    try {
      const response = await fetch(`${API_BASE}/assignments`);
      const data = await response.json();
      if (response.ok && data.success) {
        set({ assignments: data.assignments });
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  },

  createAssignment: async (assignment) => {
    const { token } = useAuthStore.getState();
    const response = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assignment),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create assignment');
    }

    await get().loadAssignments();
    return data.assignment;
  },

  updateAssignment: (id, updates) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  },

  getAssignments: () => get().assignments,

  getAssignmentById: (id) => {
    return get().assignments.find((a) => a.id === id);
  },

  deleteAssignment: async (id) => {
    const { token } = useAuthStore.getState();
    const response = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete assignment');
    }

    await get().loadAssignments();
  },
}));

// ============================================================================
// PROJECT STORE - Manages student projects and collaboration
// ============================================================================
export const useProjectStore = create((set, get) => ({
  projects: [
    {
      id: 'project1',
      title: 'Beautiful Store Website',
      description: 'E-commerce website for an online store with shopping cart functionality.',
      assignmentId: 'assignment1',
      members: ['student1', 'student2'],
      status: 'in-progress',
      progress: 65,
      files: [
        {
          id: 'file1',
          name: 'index.html',
          uploadedBy: 'student1',
          uploadedDate: '2026-02-20',
        },
        {
          id: 'file2',
          name: 'styles.css',
          uploadedBy: 'student2',
          uploadedDate: '2026-02-22',
        },
        {
          id: 'file3',
          name: 'script.js',
          uploadedBy: 'student1',
          uploadedDate: '2026-02-25',
        },
      ],
      createdDate: '2026-02-12',
      lastUpdated: '2026-02-25',
    },
    {
      id: 'project2',
      title: 'Tech Blog Platform',
      description: 'Blogging platform with articles, comments, and user authentication.',
      assignmentId: 'assignment1',
      members: ['student3'],
      status: 'planning',
      progress: 20,
      files: [
        {
          id: 'file4',
          name: 'requirements.md',
          uploadedBy: 'student3',
          uploadedDate: '2026-02-18',
        },
      ],
      createdDate: '2026-02-15',
      lastUpdated: '2026-02-18',
    },
  ],

  loadProjectFiles: async () => {
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        return;
      }

      const dbFilesByProject = data.files.reduce((acc, file) => {
        if (!acc[file.projectId]) {
          acc[file.projectId] = [];
        }
        acc[file.projectId].push(file);
        return acc;
      }, {});

      set((state) => ({
        projects: state.projects.map((project) => {
          const baseFiles = project.files || [];
          const dbFiles = dbFilesByProject[project.id] || [];
          const mergedMap = new Map();

          [...baseFiles, ...dbFiles].forEach((file) => {
            mergedMap.set(file.id, file);
          });

          return {
            ...project,
            files: [...mergedMap.values()],
          };
        }),
      }));
    } catch (error) {
      console.error('Failed to load project files:', error);
    }
  },

  createProject: (project) => {
    const newProject = {
      ...project,
      id: `project${Date.now()}`,
      files: [],
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
    return newProject;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      ),
    }));
  },

  getProjectsByAssignment: (assignmentId) => {
    return get().projects.filter((p) => p.assignmentId === assignmentId);
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },

  addFileToProject: async (projectId, file) => {
    const response = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...file,
        projectId,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload file');
    }

    const savedFile = data.file;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: [...p.files.filter((existing) => existing.id !== savedFile.id), savedFile],
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      ),
    }));

    return savedFile;
  },

  removeFileFromProject: (projectId, fileId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: p.files.filter((f) => f.id !== fileId),
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      ),
    }));
  },
}));

// ============================================================================
// REVIEW STORE - Manages peer reviews and feedback
// ============================================================================
export const useReviewStore = create((set, get) => ({
  reviews: [], // Start empty, will load from API

  // Load reviews from API
  loadReviews: async () => {
    try {
      const response = await fetch(`${API_BASE}/reviews`);
      if (response.ok) {
        const reviews = await response.json();
        set({ reviews });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to load reviews:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  },

  submitReview: async (review) => {
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        await get().loadReviews();
        return body.review;
      } else {
        throw new Error(body.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  updateReview: (id, updates) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  getReviewsForProject: (projectId) => {
    return get().reviews.filter((r) => r.projectId === projectId);
  },

  getReviewsByUser: (userId) => {
    return get().reviews.filter((r) => r.reviewedBy === userId);
  },

  getAverageScoresForProject: (projectId) => {
    const projectReviews = get().getReviewsForProject(projectId);
    if (projectReviews.length === 0) {
      return { design: 0, functionality: 0, documentation: 0, collaboration: 0 };
    }

    const totals = { design: 0, functionality: 0, documentation: 0, collaboration: 0 };
    projectReviews.forEach((review) => {
      Object.keys(review.scores).forEach((criterion) => {
        totals[criterion] += review.scores[criterion];
      });
    });

    const averages = {};
    Object.keys(totals).forEach((criterion) => {
      averages[criterion] = Math.round(
        totals[criterion] / projectReviews.length
      );
    });

    return averages;
  },

  deleteReview: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload reviews after deletion
        await get().loadReviews();
        return true;
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
}));

// ============================================================================
// FEEDBACK STORE - Manages teacher feedback on assignments and projects
// ============================================================================
export const useFeedbackStore = create((set, get) => ({
  feedbacks: [],

  // Load feedbacks from API
  loadFeedbacks: async () => {
    try {
      const response = await fetch(`${API_BASE}/feedbacks`);
      if (response.ok) {
        const feedbacks = await response.json();
        set({ feedbacks });
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    }
  },

  submitFeedback: async (feedback) => {
    try {
      const response = await fetch(`${API_BASE}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        const result = await response.json();
        // Reload feedbacks after submitting
        await get().loadFeedbacks();
        return result.feedback;
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  updateFeedback: (id, updates) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  },

  getFeedbackForProject: (projectId) => {
    return get().feedbacks.filter((f) => f.projectId === projectId);
  },

  getFeedbackForAssignment: (assignmentId) => {
    return get().feedbacks.filter((f) => f.assignmentId === assignmentId);
  },

  getFeedbackByProjectAndTeacher: (projectId, teacherId) => {
    return get().feedbacks.find(
      (f) => f.projectId === projectId && f.providedBy === teacherId
    );
  },

  getFeedbacksProvidedByTeacher: (teacherId) => {
    return get().feedbacks.filter((f) => f.providedBy === teacherId);
  },

  deleteFeedback: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/feedbacks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload feedbacks after deletion
        await get().loadFeedbacks();
        return true;
      } else {
        throw new Error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  },
}));
