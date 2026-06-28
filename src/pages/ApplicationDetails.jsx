import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout.jsx";
import InterviewCard from "../components/interviews/InterviewCard.jsx";
import InterviewModal from "../components/interviews/InterviewModal.jsx";
import api from "../api/axios.js";
import NotesTimeline from "../components/applications/NotesTimeline.jsx";
import "./ApplicationDetail.css";
import PageLoader from "../components/shared/PageLoader.jsx";

const STATUS_COLORS = {
  Wishlist: "#8B5CF6",
  Applied: "#2563EB",
  Interview: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#EF4444",
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const fetchApp = async () => {
    try {
      const { data } = await api.get(`/applications/${id}`);
      setApp(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  const handleAddInterview = () => {
    setEditingInterview(null);
    setShowModal(true);
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview);
    setShowModal(true);
  };

  const handleDeleteInterview = async (interviewId) => {
    try {
      const { data } = await api.delete(
        `/applications/${id}/interviews/${interviewId}`,
      );
      setApp(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveInterview = (updatedApp) => {
    setApp(updatedApp);
    setShowModal(false);
  };
  const handleUpdateNotes = (updatedApp) => {
    setApp(updatedApp);
  };

  if (loading) {
    return (
      <Layout>
        <PageLoader label="Loading application..." inline />
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <p className="detail-loading">Application not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-page">
        <button
          className="detail-back"
          onClick={() => navigate("/applications")}
        >
          ← Back to Applications
        </button>

        <div className="detail-header">
          <div>
            <h1 className="detail-company">{app.company}</h1>
            <p className="detail-role">{app.role}</p>
          </div>
          <span
            className="detail-status"
            style={{ background: STATUS_COLORS[app.status] }}
          >
            {app.status}
          </span>
        </div>

        <div className="detail-grid-single">
          <div className="detail-card">
            <h3 className="detail-card-title">Details</h3>
            {app.jobDescription && (
              <div className="detail-card detail-card--full">
                <h3 className="detail-card-title">Job Description</h3>
                <p className="detail-jd">{app.jobDescription}</p>
              </div>
            )}
            <div className="detail-fields">
              {app.jobUrl && (
                <div className="detail-field">
                  <span className="detail-field-label">Job URL</span>
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="detail-field-link"
                  >
                    View Posting →
                  </a>
                </div>
              )}
              {app.salaryRange?.min && (
                <div className="detail-field">
                  <span className="detail-field-label">Salary Range</span>
                  <span className="detail-field-value">
                    ${app.salaryRange.min.toLocaleString()} — $
                    {app.salaryRange.max.toLocaleString()}
                  </span>
                </div>
              )}
              {app.followUpDate && (
                <div className="detail-field">
                  <span className="detail-field-label">Follow-up Date</span>
                  <span className="detail-field-value">
                    {new Date(app.followUpDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="detail-field">
                <span className="detail-field-label">Applied On</span>
                <span className="detail-field-value">
                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {app.notes && (
            <div className="detail-card">
              <h3 className="detail-card-title">Notes</h3>
              <NotesTimeline
                appId={app._id}
                notes={app.notesList}
                onUpdate={handleUpdateNotes}
              />
            </div>
          )}
        </div>

        <div className="detail-interviews">
          <div className="detail-interviews-header">
            <h3 className="detail-card-title">Interview Rounds</h3>
            <button className="detail-add-btn" onClick={handleAddInterview}>
              + Add Round
            </button>
          </div>

          {app.interviews.length === 0 ? (
            <p className="detail-empty">No interview rounds added yet.</p>
          ) : (
            <div className="detail-interviews-list">
              {app.interviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  onEdit={handleEditInterview}
                  onDelete={handleDeleteInterview}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <InterviewModal
          appId={id}
          interview={editingInterview}
          onClose={() => setShowModal(false)}
          onSave={handleSaveInterview}
        />
      )}
    </Layout>
  );
};

export default ApplicationDetail;
