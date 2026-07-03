import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../../api/tasks";
import { TaskItem } from "../TaskItem/TaskItem";
import "./TaskBoard.scss";

interface TaskBoardProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "A fazer" },
  { status: "in_progress", label: "Em progresso" },
  { status: "done", label: "Concluído" },
];

function TaskColumn({
  status,
  label,
  tasks,
  onDelete,
  onStatusChange,
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`task-board__column ${isOver ? "task-board__column--over" : ""}`}
    >
      <h2 className="task-board__column-title">
        {label} <span className="task-board__count">{tasks.length}</span>
      </h2>

      <div className="task-board__column-body">
        {tasks.length === 0 && <p className="task-board__empty">Nenhuma tarefa aqui</p>}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}

export function TaskBoard({ tasks, onDelete, onStatusChange }: TaskBoardProps) {
  return (
    <div className="task-board">
      {COLUMNS.map((column) => (
        <TaskColumn
          key={column.status}
          status={column.status}
          label={column.label}
          tasks={tasks.filter((task) => task.status === column.status)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}