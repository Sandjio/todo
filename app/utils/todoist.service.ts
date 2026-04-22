import { todoistApi } from "./api";
import type {
  TodoistTask,
  TodoistProject,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedResponse,
} from "../types/todoist";

export async function listTasks(
  params?: { project_id?: string; filter?: string; cursor?: string },
): Promise<PaginatedResponse<TodoistTask>> {
  const { cursor, ...rest } = params ?? {};
  const { data } = await todoistApi.get<PaginatedResponse<TodoistTask>>(
    "/tasks",
    { params: { ...rest, ...(cursor ? { cursor } : {}) } },
  );
  return data;
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
  const { data } =
    await todoistApi.get<PaginatedResponse<TodoistProject>>("/projects");
  return data.results;
}
