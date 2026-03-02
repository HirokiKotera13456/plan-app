import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Cost } from "@/src/lib/types";
import { COLORS } from "@/src/lib/theme";

interface Props {
  items: Cost[];
  loading: boolean;
  onAdd: (item: Omit<Cost, "id" | "createdAt">) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Cost>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatYen(n: number) {
  return `¥${n.toLocaleString()}`;
}

export function CostSummary({ items, loading, onAdd, onUpdate, onDelete }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    amountMin: "",
    amountMax: "",
  });

  const totalMin = items.reduce((sum, i) => sum + i.amountMin, 0);
  const totalMax = items.reduce(
    (sum, i) => sum + (i.amountMax ?? i.amountMin),
    0
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ label: "", amountMin: "", amountMax: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (cost: Cost) => {
    setEditingId(cost.id);
    setForm({
      label: cost.label,
      amountMin: String(cost.amountMin),
      amountMax: cost.amountMax != null ? String(cost.amountMax) : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const data = {
      label: form.label,
      amountMin: Number(form.amountMin) || 0,
      amountMax: form.amountMax ? Number(form.amountMax) : null,
    };
    if (editingId) {
      await onUpdate(editingId, data);
    } else {
      await onAdd({
        ...data,
        sortOrder: items.length + 1,
      });
    }
    setDialogOpen(false);
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
      <Typography variant="h6" sx={{ mb: 1.5, fontFamily: '"Playfair Display", serif' }}>
        費用サマリー
      </Typography>

      {items.map((cost) => (
        <Card key={cost.id} sx={{ mb: 1, p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
              {cost.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {cost.amountMax != null
                ? `${formatYen(cost.amountMin)}〜${formatYen(cost.amountMax)}`
                : formatYen(cost.amountMin)}
            </Typography>
            <IconButton size="small" onClick={() => handleOpenEdit(cost)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(cost.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ))}

      <Card
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: COLORS.DEEP_NAVY,
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ flex: 1, fontWeight: 700 }}>
            合計（税込概算）
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              color: COLORS.DISNEY_GOLD,
            }}
          >
            {totalMin === totalMax
              ? formatYen(totalMin)
              : `${formatYen(totalMin)}〜${formatYen(totalMax)}`}
          </Typography>
        </Box>
      </Card>

      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        sx={{ borderStyle: "dashed" }}
        variant="outlined"
      >
        費用項目を追加
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingId ? "費用編集" : "費用追加"}</DialogTitle>
        <DialogContent>
          <TextField
            label="項目名"
            fullWidth
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            size="small"
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="最低金額"
            type="number"
            fullWidth
            value={form.amountMin}
            onChange={(e) => setForm({ ...form, amountMin: e.target.value })}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="最高金額（空欄なら固定額）"
            type="number"
            fullWidth
            value={form.amountMax}
            onChange={(e) => setForm({ ...form, amountMax: e.target.value })}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
