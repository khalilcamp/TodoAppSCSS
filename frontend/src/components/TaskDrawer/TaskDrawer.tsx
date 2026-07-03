import type { ReactNode } from "react";
import "./TaskDrawer.scss";

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function TaskDrawer({ isOpen, onClose, children }: TaskDrawerProps) {
  return (
    <>
      <div className={`task-drawer__overlay ${isOpen ? "task-drawer__overlay--visible" : ""}`} onClick={onClose} />
      <aside className={`task-drawer ${isOpen ? "task-drawer--open" : ""}`}>
        <div className="task-drawer__header">
          <h2>Nova tarefa</h2>
          <button className="task-drawer__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="task-drawer__content">{children}</div>
      </aside>
    </>
  );
}