export interface TodoistDue {
  date: string;
  datetime: string | null;
  string: string;
  timezone: string | null;
  is_recurring: boolean;
}

export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  priority: 1 | 2 | 3 | 4;
  due: TodoistDue | null;
  project_id: string;
  section_id: string | null;
  labels: string[];
  is_completed: boolean;
  created_at: string;
  url: string;
  order: number;
}

export interface TodoistProject {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

export interface CreateTaskPayload {
  content: string;
  description?: string;
  priority?: 1 | 2 | 3 | 4;
  due_string?: string;
  due_date?: string;
  project_id?: string;
  labels?: string[];
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export type UrgencyLevel = "LOW" | "MED" | "HIGH";

export interface PaginatedResponse<T> {
  results: T[];
  next_cursor: string | null;
}
