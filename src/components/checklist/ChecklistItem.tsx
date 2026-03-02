import { useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { ChecklistItem as ChecklistItemType, Member } from "@/src/lib/types";
import { COLORS } from "@/src/lib/theme";

interface Props {
  item: ChecklistItemType;
  members: Member[];
  onUpdate: (id: string, updates: Partial<ChecklistItemType>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ChecklistItemCard({ item, members, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const [detail, setDetail] = useState(item.detail);

  const handleSave = async () => {
    await onUpdate(item.id, { text, detail });
    setEditing(false);
  };

  if (editing) {
    return (
      <Card sx={{ p: 2, mb: 1 }}>
        <TextField
          label="項目名"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          label="詳細"
          fullWidth
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton size="small" onClick={() => setEditing(false)}>
            <Typography variant="caption">キャンセル</Typography>
          </IconButton>
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon />
          </IconButton>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 1, opacity: item.isChecked ? 0.7 : 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 1.5, gap: 1 }}>
        <Checkbox
          checked={item.isChecked}
          onChange={() => onUpdate(item.id, { isChecked: !item.isChecked })}
          size="small"
          sx={{ p: 0.5 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textDecoration: item.isChecked ? "line-through" : "none",
            }}
          >
            {item.text}
          </Typography>
          {item.detail && (
            <Typography variant="caption" color="text.secondary">
              {item.detail}
            </Typography>
          )}
        </Box>
        <Select
          value={item.assignee || ""}
          onChange={(e) => onUpdate(item.id, { assignee: e.target.value })}
          size="small"
          displayEmpty
          sx={{
            minWidth: 80,
            fontSize: "0.75rem",
            "& .MuiSelect-select": { py: 0.5 },
          }}
        >
          <MenuItem value="">
            <em>未割当</em>
          </MenuItem>
          {members.map((m) => (
            <MenuItem key={m.id} value={m.displayName || m.id}>
              {m.displayName || m.id}
            </MenuItem>
          ))}
        </Select>
        <IconButton size="small" onClick={() => setEditing(true)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(item.id)} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
