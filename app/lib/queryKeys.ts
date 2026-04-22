export const queryKeys = {
  tasks: {
    all: () => ["tasks"] as const,
    filtered: (params: {
      projectId?: string;
      filter?: string;
      cursor?: string;
    }) => ["tasks", params] as const,
  },
  task: {
    detail: (taskId: string) => ["tasks", "detail", taskId] as const,
  },
  projects: {
    all: () => ["projects"] as const,
  },
} as const;
