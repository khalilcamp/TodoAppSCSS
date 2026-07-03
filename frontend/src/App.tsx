import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Topbar } from "./components/TopBar/Topbar";
import { Footer } from "./components/Footer/Footer";
import { TaskForm } from "./components/TaskForm/TaskForm";
import { TaskBoard } from "./components/TaskBoard/TaskBoard";
import { TaskDrawer } from "./components/TaskDrawer/TaskDrawer";
import { getTasks, createTask, deleteTask, updateTask } from "./api/tasks";
import type { Task, TaskStatus, TaskPriority } from "./api/tasks";
import "./App.scss";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
  }) {
    const newTask = await createTask(data);
    setTasks((prev) => [...prev, newTask]);
    setIsDrawerOpen(false);
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const updated = await updateTask(id, { status });
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    handleStatusChange(taskId, newStatus);
  }

  return (
    <div className="app">
      <Topbar />

      <div className="app__content">
        <div className="app__toolbar">
          <h1>Minhas Tarefas</h1>
          <button className="app__new-task" onClick={() => setIsDrawerOpen(true)}>
            + Nova tarefa
          </button>
        </div>

        <TaskDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <TaskForm onCreate={handleCreate} />
        </TaskDrawer>

        {isLoading && <p className="app__status">Carregando...</p>}
        {loadError && <p className="app__error">{loadError}</p>}
        {!isLoading && !loadError && (
          <DndContext onDragEnd={handleDragEnd}>
            <TaskBoard tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          </DndContext>
        )}
      </div>

      <Footer />
    </div>
  );
}