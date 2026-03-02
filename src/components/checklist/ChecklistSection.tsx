import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ChecklistItemCard } from "./ChecklistItem";
import { ChecklistItem, Member } from "@/src/lib/types";
import { COLORS } from "@/src/lib/theme";

interface Props {
  items: ChecklistItem[];
  loading: boolean;
  members: Member[];
  onAdd: (item: Omit<ChecklistItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ChecklistItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ChecklistSection({ items, loading, members, onAdd, onUpdate, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const done = items.filter((i) => i.isChecked).length;
  const total = items.length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const handleAdd = async () => {
    if (!newText) return;
    await onAdd({
      text: newText,
      detail: newDetail,
      isChecked: false,
      assignee: "",
      sortOrder: total + 1,
    });
    setNewText("");
    setNewDetail("");
    setAdding(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontFamily: '"Playfair Display", serif' }}>
        予約チェックリスト
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.08)",
            "& .MuiLinearProgress-bar": {
              bgcolor: COLORS.SEA_TEAL,
              borderRadius: 4,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ fontFamily: '"JetBrains Mono", monospace', minWidth: 40 }}
        >
          {done}/{total}
        </Typography>
      </Box>

      {items.map((item) => (
        <ChecklistItemCard
          key={item.id}
          item={item}
          members={members}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {adding ? (
        <Card sx={{ p: 2, mb: 1 }}>
          <TextField
            label="項目名"
            fullWidth
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="詳細"
            fullWidth
            value={newDetail}
            onChange={(e) => setNewDetail(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => setAdding(false)}>
              キャンセル
            </Button>
            <Button size="small" variant="contained" onClick={handleAdd}>
              追加
            </Button>
          </Box>
        </Card>
      ) : (
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setAdding(true)}
          sx={{ borderStyle: "dashed" }}
          variant="outlined"
        >
          項目を追加
        </Button>
      )}
    </Box>
  );
}
