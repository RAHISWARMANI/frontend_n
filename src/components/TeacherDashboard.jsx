import { useState } from 'react';
import { useAssignmentStore, useProjectStore, useAuthStore, useFeedbackStore } from '../store';
import AssignmentFeedback from './AssignmentFeedback';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState(null);
  const [selectedAssignmentForFeedback, setSelectedAssignmentForFeedback] = useState(null);
  const handleViewDetails = (id) => {
  console.log("Clicked ID:", id); // debug
  setSelectedAssignmentForFeedback(id); // you already have this state
};
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const { assignments, createAssignment } = useAssignmentStore();
  const { projects } = useProjectStore();
  const { currentUser } = useAuthStore();
  const { getFeedbackForProject } = useFeedbackStore();

  const teacherAssignments = assignments.filter((a) => a.createdBy === currentUser?.id);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.dueDate) {
      createAssignment({
        ...formData,
        createdBy: currentUser.id,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active',
        rubric: {
          design: 25,
          functionality: 25,
          documentation: 25,
          collaboration: 25,
        },
      });
      setFormData({ title: '', description: '', dueDate: '' });
      setShowCreateForm(false);
    }
  };

  const getAssignmentStats = (assignmentId) => {
    const assignmentProjects = projects.filter((p) => p.assignmentId === assignmentId);
    return {
      totalProjects: assignmentProjects.length,
      avgProgress:
        assignmentProjects.length > 0
          ? Math.round(
              assignmentProjects.reduce((sum, p) => sum + p.progress, 0) /
                assignmentProjects.length
            )
          : 0,
    };
  };

  const handleProvideFeedback = (projectId, assignmentId) => {
    setSelectedProjectForFeedback(projectId);
    setSelectedAssignmentForFeedback(assignmentId);
  };

  const getAssignmentProjects = (assignmentId) => {
    return projects.filter((p) => p.assignmentId === assignmentId);
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>👨‍🏫 Teacher Dashboard</h1>
          <p>Welcome, {currentUser?.name}</p>
        </div>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancel' : '+ New Assignment'}
        </button>
      </header>

      {showCreateForm && (
        <div className="create-form-section">
          <form onSubmit={handleCreateAssignment} className="create-form">
            <h2>Create New Assignment</h2>

            <div className="form-group">
              <label>Assignment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Mobile App Design Project"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the assignment requirements and objectives"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Assignment
            </button>
          </form>
        </div>
      )}

      <div className="assignments-section">
        <h2>Active Assignments</h2>

        {teacherAssignments.length === 0 ? (
          <div className="empty-state">
            <p>No assignments created yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {teacherAssignments.map((assignment) => {
              const stats = getAssignmentStats(assignment.id);
              const assignmentProjects = getAssignmentProjects(assignment.id);
              return (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-header">
                    <h3>{assignment.title}</h3>
                    <span className="status-badge">{assignment.status}</span>
                  </div>

                  <p className="description">{assignment.description}</p>

                  <div className="assignment-meta">
                    <div className="meta-item">
                      <span className="label">Due Date:</span>
                      <span className="value">{assignment.dueDate}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Projects:</span>
                      <span className="value">{stats.totalProjects}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Avg Progress:</span>
                      <span className="value">{stats.avgProgress}%</span>
                    </div>
                  </div>

                  <div className="rubric-preview">
                    <h4>Grading Rubric:</h4>
                    <div className="rubric-items">
                      {Object.entries(assignment.rubric).map(([criterion, points]) => (
                        <div key={criterion} className="rubric-item">
                          <span>{criterion}</span>
                          <span className="points">{points}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

  <button 
  className="view-btn"
  onClick={() => handleViewDetails(assignment.id)}
>
  View Details →
</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="monitoring-section">
        <h2>📊 Grade Student Projects</h2>
        <div className="monitoring-card">
          <h3>Projects Awaiting Feedback</h3>
          <div className="activity-list">
            {projects.length === 0 ? (
              <div className="empty-state-small">No projects available</div>
            ) : (
              projects.map((project) => {
                const hasFeedback = getFeedbackForProject(project.id).length > 0;
                return (
                  <div key={project.id} className="activity-item">
                    <div className="activity-main">
                      <strong>{project.title}</strong>
                      <span className={`activity-status ${hasFeedback ? 'graded' : 'pending'}`}>
                        {hasFeedback ? '✓ Graded' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="activity-detail">
                      <span>{project.members.length} members</span>
                      <span className="progress-bar">
                        <span
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        ></span>
                      </span>
                      <span>{project.progress}%</span>
                    </div>
                    <button
                      className="feedback-btn"
                      onClick={() => handleProvideFeedback(project.id, project.assignmentId)}
                    >
                      {hasFeedback ? '✏️ Edit Feedback' : '📝 Add Feedback'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selectedProjectForFeedback && (
        <AssignmentFeedback
          projectId={selectedProjectForFeedback}
          assignmentId={selectedAssignmentForFeedback}
          onClose={() => {
            setSelectedProjectForFeedback(null);
            setSelectedAssignmentForFeedback(null);
          }}
        />
      )}
    </div>
  );
}
