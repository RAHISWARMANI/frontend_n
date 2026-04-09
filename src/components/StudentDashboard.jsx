import { useState } from 'react';
import { useAssignmentStore, useProjectStore, useAuthStore, useReviewStore, useFeedbackStore } from '../store';
import './StudentDashboard.css';
const [reviews, setReviews] = useState([]);

export default function StudentDashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    design: 0,
    functionality: 0,
    documentation: 0,
    collaboration: 0,
    feedback: '',
  });

  const { assignments } = useAssignmentStore();
  const { projects, addFileToProject } = useProjectStore();
  const { currentUser } = useAuthStore();
  const { reviews: allReviews, submitReview, getReviewsForProject } = useReviewStore();
  const { getFeedbackForProject } = useFeedbackStore();

  const studentProjects = projects.filter((p) => p.members.includes(currentUser?.id));
  const availableProjectsForReview = projects.filter(
    (p) => !p.members.includes(currentUser?.id)
  );

  const handleFileUpload = (e, projectId) => {
    const file = e.target.files?.[0];
    if (file) {
      addFileToProject(projectId, {
        id: Date.now().toString(),
        name: file.name,
        uploadedBy: currentUser.id,
        uploadedDate: new Date().toISOString().split('T')[0],
      });
      e.target.value = '';
    }
  };

  const handleSubmitReview = (e, projectId) => {
    e.preventDefault();
    console.log("Project ID:", projectId);
  console.log("Submit function working");
    if (reviewData.feedback.trim() && reviewData.design >= 0 && reviewData.functionality >= 0 && reviewData.documentation >= 0 && reviewData.collaboration >= 0) {
      submitReview({
        projectId,
        reviewedBy: currentUser.id,
        createdDate: new Date().toISOString().split('T')[0],
        scores: {
          design: parseInt(reviewData.design),
          functionality: parseInt(reviewData.functionality),
          documentation: parseInt(reviewData.documentation),
          collaboration: parseInt(reviewData.collaboration),
        },
        feedback: reviewData.feedback,
        status: 'submitted',
      });
      setReviewData({
        design: 0,
        functionality: 0,
        documentation: 0,
        collaboration: 0,
        feedback: '',
      });
      setShowReviewForm(false);
      setSelectedProject(projectId);
    } else {
      alert('Please fill in all required fields, including feedback and all scores.');
    }
  };

  const getAssignmentTitle = (assignmentId) => {
    return assignments.find((a) => a.id === assignmentId)?.title || 'Unknown Assignment';
  };

  const getProjectReviews = (projectId) => {
    return getReviewsForProject(projectId);
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  const getAverageScore = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => {
      return sum + (r.scores.design + r.scores.functionality + r.scores.documentation + r.scores.collaboration);
    }, 0);
    return Math.round(total / (reviews.length * 4));
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>👨‍🎓 Student Dashboard</h1>
          <p>Welcome, {currentUser?.name}</p>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="left-panel">
          <section className="my-projects">
            <h2>My Projects</h2>
            {studentProjects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Wait for assignments to be created.</p>
              </div>
            ) : (
              <div className="projects-list">
                {studentProjects.map((project) => {
                  const projectReviews = getProjectReviews(project.id);
                  const projectFeedback = getFeedbackForProject(project.id);
                  const avgScore = getAverageScore(projectReviews);
                  return (
                    <div key={project.id} className="project-card">
                      <div className="project-header">
                        <div>
                          <h3>{project.title}</h3>
                          <p className="assignment-ref">
                            {getAssignmentTitle(project.assignmentId)}
                          </p>
                        </div>
                        <span className="project-status">{project.status}</span>
                      </div>

                      <p className="project-desc">{project.description}</p>

                      <div className="project-stats">
                        <div className="stat">
                          <span className="label">Team Size:</span>
                          <span className="value">{project.members.length}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Progress:</span>
                          <span className="value">{project.progress}%</span>
                        </div>
                        {projectReviews.length > 0 && (
                          <div className="stat">
                            <span className="label">Avg Score:</span>
                            <span className="value score">{avgScore}/25</span>
                          </div>
                        )}
                      </div>

                      <div className="project-progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>

                      <div className="project-files">
                        <h4>📁 Files ({project.files.length})</h4>
                        <ul>
                          {project.files.map((file) => (
                            <li key={file.id}>{file.name}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="project-actions">
                        <label className="upload-btn">
                          📤 Upload File
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, project.id)}
                            hidden
                          />
                        </label>
                        <button
                          className="review-btn"
                          onClick={() => setSelectedProject(project.id)}
                        >
                          👁️ View Reviews
                        </button>
                      </div>

                      {projectFeedback.length > 0 && (
                        <div className="teacher-feedback-section">
                          <h4>📊 Teacher Feedback</h4>
                          {projectFeedback.map((feedback) => (
                            <div key={feedback.id} className="feedback-card">
                              <div className="feedback-header-row">
                                <div className="grade-display">
                                  <span className="grade-letter">{feedback.grade}</span>
                                  <span className="grade-score">{feedback.score}/100</span>
                                </div>
                                <span className="feedback-date">{feedback.createdDate}</span>
                              </div>
                              
                              <div className="feedback-comments">
                                <p>{feedback.comments}</p>
                              </div>

                              {feedback.strengths.length > 0 && (
                                <div className="feedback-subsection">
                                  <h5>✅ Strengths</h5>
                                  <ul className="strengths-list">
                                    {feedback.strengths.map((strength, idx) => (
                                      <li key={idx}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {feedback.areasForImprovement.length > 0 && (
                                <div className="feedback-subsection">
                                  <h5>🎯 Areas for Improvement</h5>
                                  <ul className="improvements-list">
                                    {feedback.areasForImprovement.map((area, idx) => (
                                      <li key={idx}>{area}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {projectReviews.length > 0 && (
                        <div className="reviews-summary">
                          <h4>Recent Feedback</h4>
                          {projectReviews.slice(-2).map((review) => (
                            <div key={review.id} className="review-snippet">
                              <p>{review.feedback}</p>
                              <small>{review.createdDate}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="right-panel">
          <section className="peer-review">
            <h2>Peer Review</h2>
            {availableProjectsForReview.length === 0 ? (
              <div className="empty-state">
                <p>No projects available for review.</p>
              </div>
            ) : (
              <div className="projects-to-review">
                {availableProjectsForReview.map((project) => (
                  <div key={project.id} className="review-project-card">
                    <div className="project-info">
                      <h4>{project.title}</h4>
                      <p>{getAssignmentTitle(project.assignmentId)}</p>
                      <div className="team-members">
                        {project.members.length} team members
                      </div>
                    </div>
                    <button
                      className="start-review-btn"
                      onClick={() => {
                        setSelectedProject(project.id);
                        setShowReviewForm(true);
                      }}
                    >
                      Start Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {showReviewForm && selectedProject && (
            <div className="review-form-overlay">
              <div className="review-form-modal">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowReviewForm(false);
                    setSelectedProject(null);
                  }}
                >
                  ✕
                </button>
                <h2>Provide Peer Review</h2>
                <p>
                  Project: {selectedProjectData?.title}
                </p>

                <form onSubmit={(e) => {
  console.log("Form Submitted");
  handleSubmitReview(e, selectedProject);
}}>
                  <div className="score-section">
                    <h3>Score Criteria (out of 25)</h3>
                    {[
                      'design',
                      'functionality',
                      'documentation',
                      'collaboration',
                    ].map((criterion) => (
                      <div key={criterion} className="score-input">
                        <label>{criterion.charAt(0).toUpperCase() + criterion.slice(1)}</label>
                        <div className="score-control">
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={reviewData[criterion]}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                [criterion]: e.target.value,
                              })
                            }
                          />
                          <span className="score-value">
                            {reviewData[criterion]}/25
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="feedback-section">
                    <label>Constructive Feedback</label>
                    <textarea
                      value={reviewData.feedback}
                      onChange={(e) =>
                        setReviewData({ ...reviewData, feedback: e.target.value })
                      }
                      placeholder="Provide specific, constructive feedback to help the team improve..."
                      rows="5"
                    />
                  </div>

                  <button type="submit" className="submit-review-btn">
                    Submit Review
                  </button>
                </form>

                <h3>All Reviews for this Project</h3>
                {getProjectReviews(selectedProject).map((r, index) => (
                  <div key={r.id || index} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
                    <p>Design: {r.scores.design}</p>
                    <p>Functionality: {r.scores.functionality}</p>
                    <p>Documentation: {r.scores.documentation}</p>
                    <p>Collaboration: {r.scores.collaboration}</p>
                    <p>Feedback: {r.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedProject && !showReviewForm && (
        <div className="review-details-overlay">
          <div className="review-details-modal">
            <button
              className="close-btn"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
            <h2>Reviews for: {selectedProjectData?.title}</h2>

            <div className="reviews-list">
              {getProjectReviews(selectedProject).map((review) => (
                <div key={review.id} className="review-detail-card">
                  <div className="review-header">
                    <h3>Review by Peer</h3>
                    <span className="review-date">{review.createdDate}</span>
                  </div>

                  <div className="scores-display">
                    {Object.entries(review.scores).map(([criterion, score]) => (
                      <div key={criterion} className="score-display">
                        <span className="criterion">
                          {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                        </span>
                        <span className="score-bar">
                          <span
                            className="score-fill"
                            style={{ width: `${(score / 25) * 100}%` }}
                          ></span>
                        </span>
                        <span className="score-number">{score}/25</span>
                      </div>
                    ))}
                  </div>

                  <div className="feedback-display">
                    <h4>Feedback</h4>
                    <p>{review.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
