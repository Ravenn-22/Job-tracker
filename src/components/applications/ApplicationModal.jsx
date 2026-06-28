import { useState } from "react";
import api from "../../api/axios.js";
import "./ApplicationModal.css";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

const ApplicationModal = ({ app, onClose, onSave }) => {
  const [form, setForm] = useState({
    company: app?.company || "",
    role: app?.role || "",
    jobUrl: app?.jobUrl || "",
    status: app?.status || "Wishlist",
    notes: app?.notes || "",
    jobDescription: app?.jobDescription || "",
    followUpDate: app?.followUpDate
      ? new Date(app.followUpDate).toISOString().split("T")[0]
      : "",
    deadline: app?.deadline
      ? new Date(app.deadline).toISOString().split("T")[0]
      : "",
    salaryRange: {
      min: app?.salaryRange?.min || "",
      max: app?.salaryRange?.max || "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalaryChange = (e) => {
    setForm({
      ...form,
      salaryRange: { ...form.salaryRange, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let data;
      if (app) {
        const res = await api.put(`/applications/${app._id}`, form);
        data = res.data;
      } else {
        const res = await api.post("/applications", form);
        data = res.data;
      }
      onSave(data, !!app);
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
            {app ? "Edit Application" : "New Application"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Google"
                required
              />
            </div>
            <div className="modal-field">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Frontend Engineer"
                required
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Job URL</label>
              <input
                type="url"
                name="jobUrl"
                value={form.jobUrl}
                onChange={handleChange}
                placeholder="https://careers.google.com"
              />
            </div>
            <div className="modal-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Min Salary</label>
              <input
                type="number"
                name="min"
                value={form.salaryRange.min}
                onChange={handleSalaryChange}
                placeholder="80000"
              />
            </div>
            <div className="modal-field">
              <label>Max Salary</label>
              <input
                type="number"
                name="max"
                value={form.salaryRange.max}
                onChange={handleSalaryChange}
                placeholder="120000"
              />
            </div>
          </div>
          <div className="modal-field">
            <label>Job Description</label>
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              placeholder="Paste the full job description here..."
              rows={5}
            />
          </div>
          <div className="modal-field">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any notes about this application..."
              rows={3}
            />
          </div>
          

          <div className="modal-row">
            <div className="modal-field">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? "Saving..." : app ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
