import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Collapse,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TimelineItem } from "@/src/lib/types";

interface Props {
  nextSortOrder: number;
  userId: string;
  onAdd: (item: Omit<TimelineItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

export function AddTimelineItem({ nextSortOrder, userId, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    timeStart: "",
    timeEnd: "",
    title: "",
    subtitle: "",
    icon: "📍",
    category: "attraction" as TimelineItem["category"],
    note: "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.timeStart) return;
    await onAdd({
      ...form,
      isDone: false,
      sortOrder: nextSortOrder,
      createdBy: userId,
    });
    setForm({
      timeStart: "",
      timeEnd: "",
      title: "",
      subtitle: "",
      icon: "📍",
      category: "attraction",
      note: "",
    });
    setOpen(false);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Collapse in={open}>
        <Card sx={{ p: 2, mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="開始"
              type="time"
              value={form.timeStart}
              onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
              size="small"
              sx={{ width: 130 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="終了"
              type="time"
              value={form.timeEnd}
              onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
              size="small"
              sx={{ width: 130 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="アイコン"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              size="small"
              sx={{ width: 80 }}
            />
            <Select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as TimelineItem["category"] })
              }
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="transport">移動</MenuItem>
              <MenuItem value="attraction">遊び</MenuItem>
              <MenuItem value="meal">食事</MenuItem>
            </Select>
          </Box>
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
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button size="small" variant="contained" onClick={handleSubmit}>
              追加
            </Button>
          </Box>
        </Card>
      </Collapse>
      {!open && (
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderStyle: "dashed" }}
          variant="outlined"
        >
          予定を追加
        </Button>
      )}
    </Box>
  );
}
