import { AppError } from "../utils/AppError";
import {
  createTask as createTaskRepo,
  findAllTasks,
  findTaskById,
  deleteTaskById,
  updateTask as updateTaskRepo,
} from "../repositories/task.repository";

const VALID_STATUS = ["todo", "in_progress", "done"] as const;
const VALID_PRIORITY = ["low", "medium", "high"] as const;

type Status = (typeof VALID_STATUS)[number];
type Priority = (typeof VALID_PRIORITY)[number];

export async function listTasks() {
  return findAllTasks();
}

export async function getTaskById(id: number) {
  const task = await findTaskById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return task;
}

export async function addTask(data: {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}) {
  const title = data.title?.trim();

  if (!title) {
    throw new AppError("O título é obrigatório", 400);
  }

  const priority = validatePriority(data.priority);
  const dueDate = parseDueDate(data.dueDate);

  return createTaskRepo({
    title,
    description: data.description?.trim() ?? "",
    priority,
    dueDate,
  });
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string | null;
  }
) {
  await getTaskById(id);

  const status = data.status !== undefined ? validateStatus(data.status) : undefined;
  const priority = data.priority !== undefined ? validatePriority(data.priority) : undefined;
  const dueDate = data.dueDate !== undefined ? parseDueDate(data.dueDate ?? undefined) : undefined;

  return updateTaskRepo(id, {
    title: data.title?.trim(),
    description: data.description?.trim(),
    status,
    priority,
    dueDate,
  });
}

export async function removeTask(id: number) {
  const deleted = await deleteTaskById(id);

  if (!deleted) {
    throw new AppError("Tarefa não encontrada", 404);
  }

  return deleted;
}

function validateStatus(value: string): Status {
  if (!VALID_STATUS.includes(value as Status)) {
    throw new AppError(`Status inválido. Use: ${VALID_STATUS.join(", ")}`, 400);
  }
  return value as Status;
}

function validatePriority(value?: string): Priority {
  if (value === undefined) return "medium";
  if (!VALID_PRIORITY.includes(value as Priority)) {
    throw new AppError(`Prioridade inválida. Use: ${VALID_PRIORITY.join(", ")}`, 400);
  }
  return value as Priority;
}

function parseDueDate(value?: string): Date | undefined {
  if (value === undefined) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new AppError("Data de entrega inválida", 400);
  }
  return date;
}