import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout.jsx";
import api from "../api/axios.js";
import "./Interviews.css";
import emptyInterviews from "../assets/empty-interviews.svg";

const OUTCOME_COLORS = {
  Pending: "#F59E0B",
  Passed: "#10B981",
  Failed: "#EF4444",
};

const Interviews = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/applications");
        const interviewApps = data
          .filter((app) => app.status === "Interview")
          .sort((a, b) => {
            const aNext = a.interviews
              .filter((i) => i.outcome === "Pending")
              .sort((x, y) => new Date(x.date) - new Date(y.date))[0];
            const bNext = b.interviews
              .filter((i) => i.outcome === "Pending")
              .sort((x, y) => new Date(x.date) - new Date(y.date))[0];
            if (!aNext) return 1;
            if (!bNext) return -1;
            return new Date(aNext.date) - new Date(bNext.date);
          });
        setApplications(interviewApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getNextInterview = (interviews) => {
    return interviews
      .filter((i) => i.outcome === "Pending")
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  };

  return (
    <Layout>
      <div className="interviews-page">
        <div className="interviews-header">
          <h1 className="interviews-title">Interviews</h1>
          <p className="interviews-subtitle">
            {applications.length} active interview
            {applications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <p className="interviews-loading">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <img
              src={emptyInterviews}
              alt="No interviews"
              className="empty-state-img"
            />
            <h3 className="empty-state-title">No active interviews</h3>
            <p className="empty-state-desc">
              Applications in the Interview stage will appear here.
            </p>
          </div>
        ) : (
          <div className="interviews-list">
            {applications.map((app) => {
              const nextInterview = getNextInterview(app.interviews);
              return (
                <div
                  key={app._id}
                  className="interview-row"
                  onClick={() => navigate(`/applications/${app._id}`)}
                >
                  <div className="interview-row-left">
                    <div className="interview-row-avatar">
                      {app.company[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="interview-row-company">{app.company}</h3>
                      <p className="interview-row-role">{app.role}</p>
                    </div>
                  </div>

                  <div className="interview-row-rounds">
                    {app.interviews.map((interview) => (
                      <span
                        key={interview._id}
                        className="interview-row-round"
                        style={{
                          borderColor: OUTCOME_COLORS[interview.outcome],
                          color: OUTCOME_COLORS[interview.outcome],
                        }}
                      >
                        {interview.round}
                      </span>
                    ))}
                  </div>

                  <div className="interview-row-next">
                    {nextInterview ? (
                      <>
                        <p className="interview-row-next-label">
                          Next Interview
                        </p>
                        <p className="interview-row-next-date">
                          {new Date(nextInterview.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="interview-row-next-round">
                          {nextInterview.round}
                        </p>
                      </>
                    ) : (
                      <p className="interview-row-no-next">
                        No upcoming rounds
                      </p>
                    )}
                  </div>

                  <span className="interview-row-arrow">→</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Interviews;
