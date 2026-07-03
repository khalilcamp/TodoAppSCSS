import { Router } from "express";
import { listTasks, addTask, removeTask, updateTask } from "../services/task.service";

export const taskRoutes = Router();

taskRoutes.get("/tasks", async (req, res) => {
  const tasks = await listTasks();
  res.json(tasks);
});

taskRoutes.post("/tasks", async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await addTask({ title, description, priority, dueDate });
  res.status(201).json(task);
});

taskRoutes.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, status, priority, dueDate } = req.body;
  const task = await updateTask(id, { title, description, status, priority, dueDate });
  res.json(task);
});

taskRoutes.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await removeTask(id);
  res.json(deleted);
});