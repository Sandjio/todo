import { useState, useEffect } from "react";
import { Box, TextField, Chip, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterStore } from "../../store/filterStore";
import { useDebounce } from "../../hooks/useDebounce";
import type { UrgencyLevel } from "../../types/todoist";

const PRIORITY_OPTIONS: Array<UrgencyLevel | "ALL"> = [
  "ALL",
  "LOW",
  "MED",
  "HIGH",
];

export const FilterBar = () => {
  const { searchQuery, priority, setSearch, setPriority, reset } =
    useFilterStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const hasActiveFilters = searchQuery !== "" || priority !== "ALL";

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}
    >
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 240 }}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        {PRIORITY_OPTIONS.map((level) => (
          <Chip
            key={level}
            label={level}
            clickable
            onClick={() => setPriority(level)}
            variant={priority === level ? "filled" : "outlined"}
            color={priority === level ? "primary" : "default"}
            size="small"
          />
        ))}
      </Box>

      {hasActiveFilters && (
        <Button size="small" onClick={reset} variant="text" color="secondary">
          Clear
        </Button>
      )}
    </Box>
  );
};
