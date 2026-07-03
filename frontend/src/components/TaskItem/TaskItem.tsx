import { useDraggable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../../api/tasks";
import "./TaskItem.scss";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "A fazer",
  in_progress: "Em progresso",
  done: "Concluído",
};

export function TaskItem({ task, onDelete, onStatusChange }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`task-item task-item--${task.priority} ${isDragging ? "task-item--dragging" : ""}`}
    >
      <div className="task-item__header">
        <strong className="task-item__title">{task.title}</strong>
        <span className={`task-item__badge task-item__badge--${task.priority}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      </div>

      {task.description && <p className="task-item__description">{task.description}</p>}

      <div className="task-item__footer">
        <select
          className="task-item__status"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="todo">{STATUS_LABEL.todo}</option>
          <option value="in_progress">{STATUS_LABEL.in_progress}</option>
          <option value="done">{STATUS_LABEL.done}</option>
        </select>

        {task.dueDate && <span className="task-item__due">{formatTimeRemaining(task.dueDate)}</span>}

        <button
          className="task-item__delete"
          onClick={() => onDelete(task.id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}

function formatTimeRemaining(dueDateIso: string): string {
  const dueDate = new Date(dueDateIso);
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Atrasada há ${Math.abs(diffDays)}d`;
  if (diffDays === 0) return "Vence hoje";
  if (diffDays === 1) return "Vence amanhã";
  return `${diffDays}d restantes`;
}