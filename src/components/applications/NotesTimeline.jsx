import { useState } from "react";
import api from "../../api/axios.js";
import "./NotesTimeline.css";

const NotesTimeline = ({ appId, notes, onUpdate }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/applications/${appId}/notes`, {
        content,
      });
      onUpdate(data);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const { data } = await api.delete(
        `/applications/${appId}/notes/${noteId}`
      );
      onUpdate(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedNotes = [...(notes || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="notes-timeline">
      <form className="notes-form" onSubmit={handleAdd}>
        <textarea
          className="notes-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note — what happened, next steps, anything relevant..."
          rows={3}
        />
        <button className="notes-submit" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Note"}
        </button>
      </form>

      {sortedNotes.length === 0 ? (
        <p className="notes-empty">No notes yet. Add your first one above.</p>
      ) : (
        <div className="notes-list">
          {sortedNotes.map((note) => (
            <div key={note._id} className="note-item">
              <div className="note-item-dot" />
              <div className="note-item-body">
                <p className="note-item-content">{note.content}</p>
                <div className="note-item-footer">
                  <span className="note-item-date">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    className="note-item-delete"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesTimeline;