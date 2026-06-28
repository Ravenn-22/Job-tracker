import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingModal from "../components/shared/OnboardingModal.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Layout from "../components/shared/Layout.jsx";
import api from "../api/axios.js";
import "./Dashboard.css";
import PageLoader from "../components/shared/PageLoader.jsx";

const getStatusMessage = (stats, applications) => {
  if (!stats || !applications) return null;

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recentApplications = applications.filter(
    (app) => new Date(app.createdAt) >= sevenDaysAgo,
  );

  const upcomingInterviews = applications.filter((app) =>
    app.interviews?.some(
      (i) => i.outcome === "Pending" && i.date && new Date(i.date) >= today,
    ),
  );

  if (upcomingInterviews.length > 0) {
    return `🗓 You have ${upcomingInterviews.length} upcoming interview${upcomingInterviews.length > 1 ? "s" : ""} this week.`;
  }

  if (recentApplications.length === 0) {
    return `⚡ You haven't applied anywhere in the last 7 days. Keep pushing!`;
  }

  if (stats.byStatus?.Offer > 0) {
    return `🎉 You have ${stats.byStatus.Offer} offer${stats.byStatus.Offer > 1 ? "s" : ""}! Keep going.`;
  }

  return `✅ You've applied to ${recentApplications.length} job${recentApplications.length > 1 ? "s" : ""} in the last 7 days. Great work!`;
};

const getSalaryInsights = (applications) => {
  const withSalary = applications.filter(
    (app) => app.salaryRange?.min && app.salaryRange?.max,
  );

  if (withSalary.length === 0) return null;

  const mins = withSalary.map((a) => a.salaryRange.min);
  const maxes = withSalary.map((a) => a.salaryRange.max);

  const avgMin = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
  const avgMax = Math.round(maxes.reduce((a, b) => a + b, 0) / maxes.length);
  const highestMax = Math.max(...maxes);
  const lowestMin = Math.min(...mins);

  return {
    avgMin,
    avgMax,
    highestMax,
    lowestMin,
    count: withSalary.length,
  };
};

const STATUS_COLORS = {
  Wishlist: "#8B5CF6",
  Applied: "#2563EB",
  Interview: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#EF4444",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get("/applications/stats"),
          api.get("/applications"),
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("georn_onboarded");
  });

  const handleOnboardingClose = () => {
    localStorage.setItem("georn_onboarded", "true");
    setShowOnboarding(false);
  };

  const salaryInsights = getSalaryInsights(applications);

  if (loading) return (
  <Layout>
    <PageLoader label="Loading dashboard..." inline/>
  </Layout>
);

  const pieData = stats
    ? Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <Layout>
      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button
            className="dashboard-cta"
            onClick={() => navigate("/applications")}
          >
            + New Application
          </button>
        </div>
        {getStatusMessage(stats, applications) && (
          <div className="dashboard-status-bar">
            {getStatusMessage(stats, applications)}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Applications</p>
            <h2 className="stat-value">{stats?.total}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Response Rate</p>
            <h2 className="stat-value">{stats?.responseRate}%</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Interviews</p>
            <h2 className="stat-value">{stats?.byStatus?.Interview}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Offers</p>
            <h2 className="stat-value offer">{stats?.byStatus?.Offer}</h2>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Applications per Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.applicationsPerWeek}>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #F1F5F9",
                    fontSize: "0.85rem",
                  }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
                      {value}
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #F1F5F9",
                    fontSize: "0.85rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {salaryInsights && (
          <div className="salary-insights">
            <h3 className="salary-insights-title">Salary Insights</h3>
            <p className="salary-insights-sub">
              Based on {salaryInsights.count} application
              {salaryInsights.count !== 1 ? "s" : ""} with salary data
            </p>
            <div className="salary-grid">
              <div className="salary-card">
                <p className="salary-label">Average Range</p>
                <h4 className="salary-value">
                  ${salaryInsights.avgMin.toLocaleString()} — $
                  {salaryInsights.avgMax.toLocaleString()}
                </h4>
              </div>
              <div className="salary-card">
                <p className="salary-label">Highest Offer</p>
                <h4 className="salary-value salary-value--green">
                  ${salaryInsights.highestMax.toLocaleString()}
                </h4>
              </div>
              <div className="salary-card">
                <p className="salary-label">Lowest Min</p>
                <h4 className="salary-value">
                  ${salaryInsights.lowestMin.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
