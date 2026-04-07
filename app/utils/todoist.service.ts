import { todoistApi } from "./api";
import type {
  TodoistTask,
  TodoistProject,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../types/todoist";

interface PaginatedResponse<T> {
  results: T[];
  next_cursor: string | null;
}

export async function listTasks(
  params?: { project_id?: string; filter?: string },
): Promise<TodoistTask[]> {
  const { data } = await todoistApi.get<PaginatedResponse<TodoistTask>>("/tasks", { params });
  return data.results;
}

export async function getTask(taskId: string): Promise<TodoistTask> {
  const { data } = await todoistApi.get<TodoistTask>(`/tasks/${taskId}`);
  return data;
}

export async function createTask(
  payload: CreateTaskPayload,
): Promise<TodoistTask> {
  const { data } = await todoistApi.post<TodoistTask>("/tasks", payload);
  return data;
}

export async function updateTask(
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<TodoistTask> {
  const { data } = await todoistApi.post<TodoistTask>(
    `/tasks/${taskId}`,
    payload,
  );
  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await todoistApi.delete(`/tasks/${taskId}`);
}

export async function listProjects(): Promise<TodoistProject[]> {
  const { data } = await todoistApi.get<PaginatedResponse<TodoistProject>>("/projects");
  return data.results;
}
