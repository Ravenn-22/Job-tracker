import { useState } from "react";
import api from "../../api/axios.js";
import "../applications/ApplicationModal.css";

const OUTCOMES = ["Pending", "Passed", "Failed"];

const InterviewModal = ({ appId, interview, onClose, onSave }) => {
  const [form, setForm] = useState({
    round: interview?.round || "",
    date: interview?.date
      ? new Date(interview.date).toISOString().split("T")[0]
      : "",
    interviewerName: interview?.interviewerName || "",
    outcome: interview?.outcome || "Pending",
    notes: interview?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let data;
      if (interview) {
        const res = await api.put(
          `/applications/${appId}/interviews/${interview._id}`,
          form
        );
        data = res.data;
      } else {
        const res = await api.post(`/applications/${appId}/interviews`, form);
        data = res.data;
      }
      onSave(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {interview ? "Edit Interview" : "Add Interview Round"}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Round</label>
              <input
                type="text"
                name="round"
                value={form.round}
                onChange={handleChange}
                placeholder="Technical 1"
                required
              />
            </div>
            <div className="modal-field">
              <label>Interviewer Name</label>
              <input
                type="text"
                name="interviewerName"
                value={form.interviewerName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label>Outcome</label>
              <select
                name="outcome"
                value={form.outcome}
                onChange={handleChange}
              >
                {OUTCOMES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="What was covered, how it went..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? "Saving..." : interview ? "Save Changes" : "Add Round"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;