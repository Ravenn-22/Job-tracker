import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn.jsx";
import ApplicationCard from "./ApplicationCard.jsx";
import "./KanbanBoard.css";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

const KanbanBoard = ({ applications, onEdit, onDelete, onStatusChange }) => {
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = ({ active }) => {
    const app = applications.find((a) => a._id === active.id);
    setActiveApp(app);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveApp(null);
    if (!over) return;

    const draggedApp = applications.find((a) => a._id === active.id);
    const newStatus = over.id;

    if (!STATUSES.includes(newStatus)) return;
    if (draggedApp.status === newStatus) return;

    onStatusChange(active.id, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={applications.filter((a) => a.status === status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp && (
          <ApplicationCard
            app={activeApp}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;