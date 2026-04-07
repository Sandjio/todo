import type { UrgencyLevel } from "../types/todoist";

const URGENCY_TO_PRIORITY: Record<UrgencyLevel, 2 | 3 | 4> = {
  LOW: 2,
  MED: 3,
  HIGH: 4,
};

const PRIORITY_TO_URGENCY: Record<number, UrgencyLevel> = {
  2: "LOW",
  3: "MED",
  4: "HIGH",
};

export function urgencyToPriority(urgency: UrgencyLevel): 1 | 2 | 3 | 4 {
  return URGENCY_TO_PRIORITY[urgency];
}

export function priorityToUrgency(priority: number): UrgencyLevel {
  return PRIORITY_TO_URGENCY[priority] ?? "LOW";
}
