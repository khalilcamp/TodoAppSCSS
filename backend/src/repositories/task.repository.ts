import { eq} from "drizzle-orm";
import { db } from "../database/client";
import { tasks } from "../schemas/task.schema";


export async function findAllTasks() {
    return await db.select().from(tasks);
}

export async function findTaskById(id: number) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
}

export async function createTask(data: {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}) {
  const [newTask] = await db
    .insert(tasks)
    .values({
      title: data.title,
      description: data.description,
      priority: data.priority ?? "medium",
      dueDate: data.dueDate,
    })
    .returning();

  return newTask;
}

export async function deleteTaskById(id: number) {
    const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return deletedTask;
}

export async function updateTask(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    dueDate: Date | null;
  }>
) {
  const [updated] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();

  return updated;
}