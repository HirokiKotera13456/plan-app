import { useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TimelineItem } from "@/src/lib/types";
import { CATEGORY_COLORS } from "@/src/lib/constants";

interface Props {
  item: TimelineItem;
  onUpdate: (id: string, updates: Partial<TimelineItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TimelineCard({ item, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    timeStart: item.timeStart,
    timeEnd: item.timeEnd,
    title: item.title,
    subtitle: item.subtitle,
    icon: item.icon,
    category: item.category,
    note: item.note,
  });

  const colors = CATEGORY_COLORS[item.category];

  const handleSave = async () => {
    await onUpdate(item.id, form);
    setEditing(false);
  };

  const handleToggleDone = () => {
    onUpdate(item.id, { isDone: !item.isDone });
  };

  if (editing) {
    return (
      <Card
        sx={{
          p: 2,
          mb: 1.5,
          borderLeft: `4px solid ${colors.border}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            label="開始"
            type="time"
            value={form.timeStart}
            onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
            size="small"
            sx={{ width: 130 }}
          />
          <TextField
            label="終了"
            type="time"
            value={form.timeEnd}
            onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
            size="small"
            sx={{ width: 130 }}
          />
        </Box>
        <TextField
          label="アイコン"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          size="small"
          sx={{ width: 80, mb: 1, mr: 1 }}
        />
        <Select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as TimelineItem["category"] })
          }
          size="small"
          sx={{ width: 120, mb: 1 }}
        >
          <MenuItem value="transport">移動</MenuItem>
          <MenuItem value="attraction">遊び</MenuItem>
          <MenuItem value="meal">食事</MenuItem>
        </Select>
        <TextField
          label="タイトル"
          fullWidth
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          label="サブタイトル"
          fullWidth
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          label="メモ"
          fullWidth
          multiline
          rows={2}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
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
    <Card
      sx={{
        mb: 1.5,
        borderLeft: `4px solid ${colors.border}`,
        opacity: item.isDone ? 0.6 : 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1.5, gap: 1 }}>
        <Checkbox
          checked={item.isDone}
          onChange={handleToggleDone}
          size="small"
          sx={{ p: 0.5 }}
        />

        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.75rem",
            color: colors.text,
            minWidth: 90,
          }}
        >
          {item.timeStart}–{item.timeEnd}
        </Typography>

        <Typography sx={{ fontSize: "1.2rem", minWidth: 28, textAlign: "center" }}>
          {item.icon}
        </Typography>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textDecoration: item.isDone ? "line-through" : "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {item.subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {item.note && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => setEditing(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(item.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {item.note}
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
