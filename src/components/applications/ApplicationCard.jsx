import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import "./ApplicationCard.css";

const ApplicationCard = ({ app, onEdit, onDelete, isDragging }) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: app._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const getDeadlineInfo = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { label: "Deadline passed", urgent: false, passed: true };
    if (diffDays === 0)
      return { label: "Due today", urgent: true, passed: false };
    if (diffDays <= 3)
      return { label: `${diffDays}d left`, urgent: true, passed: false };
    return { label: `${diffDays}d left`, urgent: false, passed: false };
  };

  return (
    <div
      className="app-card"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="app-card-header">
        <h4 className="app-card-company">{app.company}</h4>
        <div className="app-card-actions">
          <button
            className="app-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(app);
            }}
          >
            ✎
          </button>
          <button
            className="app-card-btn app-card-btn--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(app._id);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <p className="app-card-role">{app.role}</p>

      {app.salaryRange?.min && (
        <p className="app-card-salary">
          ${app.salaryRange.min.toLocaleString()} — $
          {app.salaryRange.max.toLocaleString()}
        </p>
      )}
      {app.deadline &&
        (() => {
          const info = getDeadlineInfo(app.deadline);
          return (
            <span
              className={`app-card-deadline ${info.urgent ? "app-card-deadline--urgent" : ""} ${info.passed ? "app-card-deadline--passed" : ""}`}
            >
              ⏰ {info.label}
            </span>
          );
        })()}

      <div className="app-card-footer">
        <span className="app-card-date">
          {new Date(app.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        {app.interviews?.length > 0 && (
          <span className="app-card-interviews">
            {app.interviews.length} interview
            {app.interviews.length > 1 ? "s" : ""}
          </span>
        )}
        <button
          className="app-card-detail-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/applications/${app._id}`);
          }}
        >
          View →
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
