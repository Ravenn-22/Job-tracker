import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout.jsx";
import api from "../api/axios.js";
import "./Events.css";
import emptyEvents from "../assets/empty-events.svg";
import PageLoader from "../components/shared/PageLoader.jsx";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/applications");
        const allEvents = [];

        data.forEach((app) => {
          if (app.followUpDate) {
            allEvents.push({
              id: `followup-${app._id}`,
              type: "followup",
              title: `Follow up with ${app.company}`,
              subtitle: app.role,
              date: new Date(app.followUpDate),
              appId: app._id,
              company: app.company,
            });
          }

          app.interviews.forEach((interview) => {
            if (interview.date) {
              allEvents.push({
                id: `interview-${interview._id}`,
                type: "interview",
                title: `${interview.round} — ${app.company}`,
                subtitle: app.role,
                date: new Date(interview.date),
                appId: app._id,
                company: app.company,
                outcome: interview.outcome,
                interviewer: interview.interviewerName,
              });
            }
          });
        });

        allEvents.sort((a, b) => a.date - b.date);
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const filtered = events.filter((e) => {
    if (filter === "upcoming") return e.date >= now;
    if (filter === "past") return e.date < now;
    return true;
  });

  const groupByDate = (events) => {
    const groups = {};
    events.forEach((event) => {
      const key = event.date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    return groups;
  };

  const grouped = groupByDate(filtered);

  const isToday = (date) => {
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  const getDateLabel = (dateStr, events) => {
    const date = events[0].date;
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return dateStr;
  };

  return (
    <Layout>
      <div className="events-page">
        <div className="events-header">
          <h1 className="events-title">Events</h1>
          <div className="events-filter">
            {["upcoming", "past", "all"].map((f) => (
              <button
                key={f}
                className={`events-filter-btn ${filter === f ? "events-filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <PageLoader label="Loading events..." inline />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <img
              src={emptyEvents}
              alt="No events"
              className="empty-state-img"
            />
            <h3 className="empty-state-title">No {filter} events</h3>
            <p className="empty-state-desc">
              Add follow-up dates and interview rounds to your applications to
              see them here.
            </p>
          </div>
        ) : (
          <div className="events-list">
            {Object.entries(grouped).map(([dateStr, dayEvents]) => (
              <div key={dateStr} className="events-group">
                <div className="events-group-header">
                  <span className="events-group-date">
                    {getDateLabel(dateStr, dayEvents)}
                  </span>
                  <span className="events-group-count">
                    {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="events-group-list">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`event-card event-card--${event.type}`}
                      onClick={() => navigate(`/applications/${event.appId}`)}
                    >
                      <div className="event-card-icon">
                        {event.type === "interview" ? "◎" : "◷"}
                      </div>
                      <div className="event-card-content">
                        <h4 className="event-card-title">{event.title}</h4>
                        <p className="event-card-subtitle">{event.subtitle}</p>
                        {event.interviewer && (
                          <p className="event-card-meta">
                            with {event.interviewer}
                          </p>
                        )}
                      </div>
                      <div className="event-card-right">
                        <span
                          className={`event-card-type event-card-type--${event.type}`}
                        >
                          {event.type === "interview"
                            ? "Interview"
                            : "Follow-up"}
                        </span>
                        {event.outcome && (
                          <span
                            className="event-card-outcome"
                            style={{
                              color:
                                event.outcome === "Passed"
                                  ? "#10B981"
                                  : event.outcome === "Failed"
                                    ? "#EF4444"
                                    : "#F59E0B",
                            }}
                          >
                            {event.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
