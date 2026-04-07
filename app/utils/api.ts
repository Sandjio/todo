import axios from "axios";

export const todoistApi = axios.create({
  baseURL: "/api/todoist",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TODOIST_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});
