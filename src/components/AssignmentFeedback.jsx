import { useState, useEffect } from "react";
import { useFeedbackStore, useProjectStore, useAuthStore, useAssignmentStore } from '../store';
import './AssignmentFeedback.css';

export default function AssignmentFeedback({ projectId, assignmentId, onClose }) {
  const [formData, setFormData] = useState({
    grade: 'A',
    score: 85,
    comments: '',
    strengths: '',
    areasForImprovement: '',
  });
  
  const { submitFeedback, getFeedbackForProject, loadFeedbacks, deleteFeedback } = useFeedbackStore();
  const { getProjectById } = useProjectStore();
  const { currentUser } = useAuthStore();
  
  // Load feedbacks when component mounts
  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const projectFeedbacks = getFeedbackForProject(projectId);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (formData.comments && formData.score) {
      const strengthsList = formData.strengths
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const improvementList = formData.areasForImprovement
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      try {
        await submitFeedback({
          projectId,
          assignmentId,
          providedBy: currentUser.id,
          grade: formData.grade,
          score: parseInt(formData.score),
          comments: formData.comments,
          strengths: strengthsList,
          areasForImprovement: improvementList,
        });

        setFormData({
          grade: 'A',
          score: 85,
          comments: '',
          strengths: '',
          areasForImprovement: '',
        });
        
        alert('Feedback submitted successfully!');
      } catch (error) {
        alert('Failed to submit feedback. Please try again.');
      }
    } else {
      alert('Please fill in comments and score');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(feedbackId);
        alert('Feedback deleted successfully');
      } catch (error) {
        alert('Failed to delete feedback');
      }
    }
  };

  const gradeScale = {
    A: { min: 90, max: 100 },
    B: { min: 80, max: 89 },
    C: { min: 70, max: 79 },
    D: { min: 60, max: 69 },
    F: { min: 0, max: 59 },
  };

  const getGradeFromScore = (score) => {
    const numScore = parseInt(score);
    for (const [grade, range] of Object.entries(gradeScale)) {
      if (numScore >= range.min && numScore <= range.max) {
        return grade;
      }
    }
    return 'F';
  };

  const project = getProjectById(projectId);

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="feedback-header">
          <h2>📝 Provide Feedback</h2>
          <p className="project-name">{project?.title}</p>
        </div>

        <form onSubmit={handleSubmitFeedback} className="feedback-form">
          {/* Grade and Score Section */}
          <div className="feedback-section">
            <h3>📊 Grade &amp; Score</h3>

            <div className="grade-score-container">
              <div className="form-group">
                <label>Letter Grade</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="grade-select"
                >
                  <option value="A">A (90-100)</option>
                  <option value="B">B (80-89)</option>
                  <option value="C">C (70-79)</option>
                  <option value="D">D (60-69)</option>
                  <option value="F">F (0-59)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Numerical Score (0-100)</label>
                <div className="score-input-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => {
                      const score = e.target.value;
                      setFormData({
                        ...formData,
                        score,
                        grade: getGradeFromScore(score),
                      });
                    }}
                    className="score-slider"
                  />
                  <span className="score-display">{formData.score}</span>
                </div>
                <div className="grade-indicator">
                  Grade: <strong>{formData.grade}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="feedback-section">
            <h3>💬 Overall Comments</h3>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Provide detailed feedback on the student's work, their approach, and what they accomplished..."
              rows="5"
              className="feedback-textarea"
              required
            />
            <small className="char-count">
              {formData.comments.length} characters
            </small>
          </div>

          {/* Strengths Section */}
          <div className="feedback-section">
            <h3>✅ Strengths</h3>
            <p className="section-hint">List the strengths (one per line)</p>
            <textarea
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              placeholder="Example: Clean code organization, Great user interface design, Good documentation"
              rows="4"
              className="feedback-textarea strengths-textarea"
            />
          </div>

          {/* Areas for Improvement Section */}
          <div className="feedback-section">
            <h3>🎯 Areas for Improvement</h3>
            <p className="section-hint">List areas where the student can improve (one per line)</p>
            <textarea
              value={formData.areasForImprovement}
              onChange={(e) =>
                setFormData({ ...formData, areasForImprovement: e.target.value })
              }
              placeholder="Example: Add input validation, Improve error handling, Include more test cases"
              rows="4"
              className="feedback-textarea improvement-textarea"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-feedback-btn"
            >
              ✅ Submit Feedback
            </button>
          </div>
        </form>

        {/* Display Submitted Feedbacks */}
        {projectFeedbacks.length > 0 && (
          <div className="submitted-feedbacks-section">
            <h3>📋 Submitted Feedbacks</h3>
            {projectFeedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-card-header">
                  <div className="grade-display">
                    <span className="grade-letter">{feedback.grade}</span>
                    <span className="grade-score">{feedback.score}/100</span>
                  </div>
                  <span className="feedback-date">{feedback.createdDate}</span>
                </div>

                <div className="feedback-comments">
                  <p><strong>Comments:</strong> {feedback.comments}</p>
                </div>

                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div className="feedback-subsection">
                    <h5>✅ Strengths</h5>
                    <ul>
                      {feedback.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
                  <div className="feedback-subsection">
                    <h5>🎯 Areas for Improvement</h5>
                    <ul>
                      {feedback.areasForImprovement.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className="delete-feedback-btn"
                  onClick={() => handleDeleteFeedback(feedback.id)}
                >
                  🗑️ Delete Feedback
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}