import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ApplicationCard from "./ApplicationCard.jsx";
import "./KanbanColumn.css";

const STATUS_COLORS = {
  Wishlist: "#8B5CF6",
  Applied: "#2563EB",
  Interview: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#EF4444",
};

const KanbanColumn = ({ status, applications, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`kanban-column ${isOver ? "kanban-column--over" : ""}`}>
      <div className="kanban-column-header">
        <div className="kanban-column-label">
          <span
            className="kanban-column-dot"
            style={{ background: STATUS_COLORS[status] }}
          />
          <h3 className="kanban-column-title">{status}</h3>
        </div>
        <span className="kanban-column-count">{applications.length}</span>
      </div>

      <div className="kanban-column-body" ref={setNodeRef}>
        <SortableContext
          items={applications.map((a) => a._id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.length === 0 ? (
            <p className="kanban-column-empty">No applications</p>
          ) : (
            applications.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;