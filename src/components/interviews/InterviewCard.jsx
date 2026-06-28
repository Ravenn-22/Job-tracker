import "./InterviewCard.css";

const OUTCOME_COLORS = {
  Pending: "#F59E0B",
  Passed: "#10B981",
  Failed: "#EF4444",
};

const InterviewCard = ({ interview, onEdit, onDelete }) => {
  return (
    <div className="interview-card">
      <div className="interview-card-header">
        <div>
          <h4 className="interview-card-round">{interview.round}</h4>
          {interview.interviewerName && (
            <p className="interview-card-interviewer">
              with {interview.interviewerName}
            </p>
          )}
        </div>
        <div className="interview-card-right">
          <span
            className="interview-card-outcome"
            style={{ color: OUTCOME_COLORS[interview.outcome] }}
          >
            {interview.outcome}
          </span>
          <div className="interview-card-actions">
            <button
              className="interview-card-btn"
              onClick={() => onEdit(interview)}
            >
              ✎
            </button>
            <button
              className="interview-card-btn interview-card-btn--delete"
              onClick={() => onDelete(interview._id)}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {interview.date && (
        <p className="interview-card-date">
          {new Date(interview.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}

      {interview.notes && (
        <p className="interview-card-notes">{interview.notes}</p>
      )}
    </div>
  );
};

export default InterviewCard;