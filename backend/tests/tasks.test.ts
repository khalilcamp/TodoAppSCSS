import request from "supertest";
import { app } from "../src/app";

describe("Tasks API", () => {
  it("deve criar uma nova tarefa", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Tarefa de teste", description: "Criada pelo Jest" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Tarefa de teste",
      description: "Criada pelo Jest",
      completed: false,
    });
    expect(response.body.id).toBeDefined();
  });

  it("não deve criar tarefa sem título", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ description: "Sem título" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("deve listar as tarefas criadas", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("deve deletar uma tarefa existente", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Tarefa pra deletar" });

    const idToDelete = created.body.id;

    const response = await request(app).delete(`/tasks/${idToDelete}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(idToDelete);
  });

  it("deve retornar 404 ao deletar tarefa inexistente", async () => {
    const response = await request(app).delete("/tasks/999999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });
});