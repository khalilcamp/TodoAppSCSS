import type { Task, TaskStatus } from "../../api/tasks";
import { TaskItem } from "../TaskItem/TaskItem";
import "./TaskList.scss";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export function TaskList({ tasks, onDelete, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">Nenhuma tarefa ainda. Crie a primeira acima!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </ul>
  );
}