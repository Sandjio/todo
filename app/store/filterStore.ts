import { create } from "zustand";
import type { UrgencyLevel } from "../types/todoist";

interface FilterState {
  searchQuery: string;
  priority: UrgencyLevel | "ALL";
  projectId: string | undefined;
  cursor: string | undefined;
  setSearch: (q: string) => void;
  setPriority: (p: UrgencyLevel | "ALL") => void;
  setProjectId: (id: string | undefined) => void;
  setCursor: (cursor: string | undefined) => void;
  reset: () => void;
}

const initial = {
  searchQuery: "",
  priority: "ALL" as const,
  projectId: undefined,
  cursor: undefined,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setSearch: (searchQuery) => set({ searchQuery }),
  setPriority: (priority) => set({ priority }),
  setProjectId: (projectId) => set({ projectId, cursor: undefined }),
  setCursor: (cursor) => set({ cursor }),
  reset: () => set(initial),
}));
