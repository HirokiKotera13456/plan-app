import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { COLORS } from "@/src/lib/theme";
import { Trip } from "@/src/lib/types";

interface Props {
  trip: Trip;
  onUpdate: (updates: Partial<Trip>) => Promise<void>;
  checklistProgress: { done: number; total: number };
}

export function TripHeader({ trip, onUpdate, checklistProgress }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(trip.name);
  const [tripDate, setTripDate] = useState(trip.tripDate);

  const daysUntil = Math.ceil(
    (new Date(trip.tripDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handleSave = async () => {
    await onUpdate({ name, tripDate });
    setEditing(false);
  };

  return (
    <Box
      sx={{
        bgcolor: COLORS.DEEP_NAVY,
        color: "#fff",
        p: 3,
        borderRadius: { xs: 0, sm: 2 },
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {editing ? (
          <>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
              }}
            />
            <IconButton onClick={handleSave} sx={{ color: COLORS.DISNEY_GOLD }}>
              <CheckIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{ flex: 1, fontFamily: '"Playfair Display", serif' }}
            >
              {trip.name}
            </Typography>
            <IconButton onClick={() => setEditing(true)} sx={{ color: "rgba(255,255,255,0.7)" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {editing ? (
          <TextField
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            size="small"
            sx={{
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {trip.tripDate}
          </Typography>
        )}

        <Chip
          label={
            daysUntil > 0
              ? `あと ${daysUntil} 日`
              : daysUntil === 0
              ? "今日！"
              : `${Math.abs(daysUntil)} 日前`
          }
          sx={{
            bgcolor: COLORS.DISNEY_GOLD,
            color: COLORS.DEEP_NAVY,
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
          }}
        />

        <Chip
          label={`予約 ${checklistProgress.done}/${checklistProgress.total}`}
          variant="outlined"
          sx={{
            borderColor: "rgba(255,255,255,0.3)",
            color: "#fff",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        />
      </Box>
    </Box>
  );
}
