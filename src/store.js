import { create } from 'zustand';

// ============================================================================
// AUTH STORE - Manages user authentication
// ============================================================================
export const useAuthStore = create((set, get) => ({
  currentUser: null,
  users: [
    {
      id: 'teacher1',
      name: 'John Teacher',
      email: 'teacher@school.edu',
      password: 'password123',
      role: 'teacher',
    },
    {
      id: 'student1',
      name: 'Alice Student',
      email: 'alice@school.edu',
      password: 'password123',
      role: 'student',
    },
    {
      id: 'student2',
      name: 'Bob Student',
      email: 'bob@school.edu',
      password: 'password123',
      role: 'student',
    },
    {
      id: 'student3',
      name: 'Carol Student',
      email: 'carol@school.edu',
      password: 'password123',
      role: 'student',
    },
  ],

  login: (email) => {
    const user = get().users.find((u) => u.email === email);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      set({ currentUser: userWithoutPassword });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  getCurrentUser: () => get().currentUser,

  registerUser: (userData) => {
    const { name, email, password, role } = userData;
    
    // Check if user already exists
    if (get().users.find((u) => u.email === email)) {
      return null;
    }

    const newUser = {
      id: `${role}${Date.now()}`,
      name,
      email,
      password,
      role,
    };

    set((state) => ({
      users: [...state.users, newUser],
    }));

    return newUser;
  },

  getAllUsers: () => get().users,

  getUsersByRole: (role) => {
    return get().users.filter((u) => u.role === role);
  },
}));

// ============================================================================
// ASSIGNMENT STORE - Manages teacher assignments
// ============================================================================
export const useAssignmentStore = create((set, get) => ({
  assignments: [
    {
      id: 'assignment1',
      title: 'Web Design Project',
      description: 'Create a responsive website for a local business with modern design principles.',
      createdBy: 'teacher1',
      createdDate: '2026-02-10',
      dueDate: '2026-03-15',
      status: 'active',
      rubric: {
        design: 25,
        functionality: 25,
        documentation: 25,
        collaboration: 25,
      },
    },
  ],

  createAssignment: (assignment) => {
    const newAssignment = {
      ...assignment,
      id: `assignment${Date.now()}`,
    };
    set((state) => ({
      assignments: [...state.assignments, newAssignment],
    }));
    return newAssignment;
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

  addFileToProject: (projectId, file) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: [...p.files, file],
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      ),
    }));
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
  reviews: [
    {
      id: 'review1',
      projectId: 'project1',
      reviewedBy: 'student3',
      createdDate: '2026-02-24',
      scores: {
        design: 20,
        functionality: 18,
        documentation: 15,
        collaboration: 22,
      },
      feedback:
        'Great website design with good layout and color scheme. The functionality is mostly complete but there are some bugs in the shopping cart. Documentation could be more detailed with comments in code.',
      status: 'submitted',
    },
    {
      id: 'review2',
      projectId: 'project1',
      reviewedBy: 'student2',
      createdDate: '2026-02-25',
      scores: {
        design: 22,
        functionality: 21,
        documentation: 18,
        collaboration: 23,
      },
      feedback:
        'Excellent responsive design that works on mobile devices. The functionality is solid with good user experience. Team collaboration seems strong based on code organization.',
      status: 'submitted',
    },
  ],

  submitReview: (review) => {
    const newReview = {
      ...review,
      id: `review${Date.now()}`,
    };
    set((state) => ({
      reviews: [...state.reviews, newReview],
    }));
    return newReview;
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

  deleteReview: (id) => {
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id),
    }));
  },
}));

// ============================================================================
// FEEDBACK STORE - Manages teacher feedback on assignments and projects
// ============================================================================
export const useFeedbackStore = create((set, get) => ({
  feedbacks: [
    {
      id: 'feedback1',
      projectId: 'project1',
      assignmentId: 'assignment1',
      providedBy: 'teacher1',
      createdDate: '2026-02-26',
      grade: 'A',
      score: 85,
      comments: 'Excellent work on the overall design and implementation. The website is responsive and user-friendly. Consider adding more interactive features in future projects.',
      strengths: [
        'Clean and modern design',
        'Good responsive layout',
        'Well-organized code structure',
      ],
      areasForImprovement: [
        'Add form validation',
        'Improve database optimization',
        'Include more unit tests',
      ],
      status: 'submitted',
    },
  ],

  submitFeedback: (feedback) => {
    const newFeedback = {
      ...feedback,
      id: `feedback${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
    };
    set((state) => ({
      feedbacks: [...state.feedbacks, newFeedback],
    }));
    return newFeedback;
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

  deleteFeedback: (id) => {
    set((state) => ({
      feedbacks: state.feedbacks.filter((f) => f.id !== id),
    }));
  },
}));
