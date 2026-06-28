import { useState, useEffect, useRef } from "react";
import Layout from "../components/shared/Layout.jsx";
import api from "../api/axios.js";
import "./Resumes.css";
import emptyResumes from "../assets/empty-resumes.svg";
import PageLoader from "../components/shared/PageLoader.jsx";

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resumes");
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setResumeName(file.name.replace(".pdf", ""));
    setShowNameInput(true);
  };

  const handleUpload = async () => {
    if (!pendingFile || !resumeName.trim()) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", pendingFile);
      formData.append("name", resumeName.trim());

      const { data } = await api.post("/resumes", formData);

      setResumes((prev) => [data, ...prev]);
      setShowNameInput(false);
      setPendingFile(null);
      setResumeName("");
      fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (id) => {
    if (!editingName.trim()) return;
    try {
      const { data } = await api.put(`/resumes/${id}`, { name: editingName });
      setResumes((prev) => prev.map((r) => (r._id === id ? data : r)));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  return (
    <Layout>
      <div className="resumes-page">
        <div className="resumes-header">
          <h1 className="resumes-title">Resumes</h1>
          <button
            className="resumes-upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            + Upload Resume
          </button>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {showNameInput && (
          <div className="resumes-name-prompt">
            <p className="resumes-name-label">Name this resume</p>
            <div className="resumes-name-row">
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g. Frontend Resume"
                className="resumes-name-input"
              />
              <button
                className="resumes-name-confirm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                className="resumes-name-cancel"
                onClick={() => {
                  setShowNameInput(false);
                  setPendingFile(null);
                  setResumeName("");
                  fileInputRef.current.value = "";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
         <PageLoader label="Loading resumes..." inline/>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <img
              src={emptyResumes}
              alt="No resumes"
              className="empty-state-img"
            />
            <h3 className="empty-state-title">No resumes uploaded yet</h3>
            <p className="empty-state-desc">
              Upload your first resume to get started.
            </p>
            <button
              className="resumes-upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              + Upload Resume
            </button>
          </div>
        ) : (
          <div className="resumes-list">
            {resumes.map((resume) => (
              <div key={resume._id} className="resume-card">
                <div className="resume-card-icon">PDF</div>

                <div className="resume-card-info">
                  {editingId === resume._id ? (
                    <div className="resume-edit-row">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="resume-edit-input"
                        autoFocus
                      />
                      <button
                        className="resume-edit-save"
                        onClick={() => handleRename(resume._id)}
                      >
                        Save
                      </button>
                      <button
                        className="resume-edit-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <h4 className="resume-card-name">{resume.name}</h4>
                  )}
                  <p className="resume-card-meta">
                    {formatSize(resume.size)} ·{" "}
                    {new Date(resume.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="resume-card-actions">
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="resume-action-btn"
                  >
                    Download
                  </a>
                  <button
                    className="resume-action-btn"
                    onClick={() => {
                      setEditingId(resume._id);
                      setEditingName(resume.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="resume-action-btn resume-action-btn--delete"
                    onClick={() => handleDelete(resume._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Resumes;
