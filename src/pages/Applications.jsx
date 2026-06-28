import { useState, useEffect } from "react";
import Layout from "../components/shared/Layout.jsx";
import KanbanBoard from "../components/applications/KanbanBoard.jsx";
import ApplicationModal from "../components/applications/ApplicationModal.jsx";
import api from "../api/axios.js";
import "./Applications.css";
import emptyApplications from "../assets/empty-applications.svg";
import confetti from "canvas-confetti";
import PageLoader from "../components/shared/PageLoader.jsx";

const STATUSES = [
  "All",
  "Wishlist",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/applications");
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreate = () => {
    setEditingApp(null);
    setShowModal(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
  try {
    const { data } = await api.put(`/applications/${id}`, { status });
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? data : app))
    );

    if (status === "Offer") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"],
      });
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleSave = (savedApp, isEdit) => {
    if (isEdit) {
      setApplications((prev) =>
        prev.map((app) => (app._id === savedApp._id ? savedApp : app)),
      );
    } else {
      setApplications((prev) => [savedApp, ...prev]);
    }
    setShowModal(false);
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const exportToCSV = (applications) => {
    const headers = [
      "Company",
      "Role",
      "Status",
      "Min Salary",
      "Max Salary",
      "Job URL",
      "Follow-up Date",
      "Deadline",
      "Notes",
      "Applied On",
    ];

    const rows = applications.map((app) => [
      app.company,
      app.role,
      app.status,
      app.salaryRange?.min || "",
      app.salaryRange?.max || "",
      app.jobUrl || "",
      app.followUpDate
        ? new Date(app.followUpDate).toLocaleDateString("en-US")
        : "",
      app.deadline ? new Date(app.deadline).toLocaleDateString("en-US") : "",
      app.notes || "",
      new Date(app.createdAt).toLocaleDateString("en-US"),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-applications-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="applications-page">
        <div className="applications-header">
          <h1 className="applications-title">Applications</h1>
          <div className="applications-header-actions">
            <button
              className="applications-export-btn"
              onClick={() => exportToCSV(applications)}
              disabled={applications.length === 0}
            >
              Export CSV
            </button>
            <button className="applications-cta" onClick={handleCreate}>
              + New Application
            </button>
          </div>
        </div>

        <div className="applications-toolbar">
          <input
            type="text"
            className="applications-search"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="applications-filters">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`applications-filter-btn ${statusFilter === s ? "applications-filter-btn--active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      {loading ? (
 <PageLoader label="Loading applications..." inline/>
) : filtered.length === 0 && applications.length === 0 ? (
  <div className="empty-state">
    <img src={emptyApplications} alt="No applications" className="empty-state-img" />
    <h3 className="empty-state-title">No applications yet</h3>
    <p className="empty-state-desc">Start tracking your job search by adding your first application.</p>
    <button className="applications-cta" onClick={handleCreate}>
      + Add Application
    </button>
  </div>
) : (
  <KanbanBoard
    applications={filtered}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onStatusChange={handleStatusChange}
  />
)}

        {showModal && (
          <ApplicationModal
            app={editingApp}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </Layout>
  );
};

export default Applications;
