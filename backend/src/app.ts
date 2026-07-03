import express from "express";
import cors from "cors";
import { taskRoutes } from "./routes/task.routes";
import { errorHandler } from "./middlewares/ErrorHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(taskRoutes);

app.use(errorHandler);