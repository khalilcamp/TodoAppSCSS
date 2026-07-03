import { useState } from "react";
import type { FormEvent } from "react";
import type { TaskPriority } from "../../api/tasks";
import "./TaskForm.scss";

interface TaskFormProps {
  onCreate: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
  }) => Promise<void>;
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tarefa");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="task-form__row">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">Baixa prioridade</option>
          <option value="medium">Média prioridade</option>
          <option value="high">Alta prioridade</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {error && <p className="task-form__error">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Adicionar tarefa"}
      </button>
    </form>
  );
}