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
import StarIcon from "@mui/icons-material/Star";
import { Hotel } from "@/src/lib/types";
import { COLORS } from "@/src/lib/theme";

interface Props {
  items: Hotel[];
  loading: boolean;
  onAdd: (item: Omit<Hotel, "id" | "createdAt">) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Hotel>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function HotelCompare({ items, loading, onAdd, onUpdate, onDelete }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", note: "", prices: "" });

  const allDates = Array.from(
    new Set(items.flatMap((h) => Object.keys(h.prices)))
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: "", note: "", prices: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (hotel: Hotel) => {
    setEditingId(hotel.id);
    setForm({
      name: hotel.name,
      note: hotel.note,
      prices: Object.entries(hotel.prices)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    });
    setDialogOpen(true);
  };

  const parsePrices = (text: string): Record<string, string> => {
    const result: Record<string, string> = {};
    text.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });
    return result;
  };

  const handleSave = async () => {
    const prices = parsePrices(form.prices);
    if (editingId) {
      await onUpdate(editingId, { name: form.name, note: form.note, prices });
    } else {
      await onAdd({
        name: form.name,
        note: form.note,
        prices,
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
        ホテル比較
      </Typography>

      {items.length > 0 && (
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              "& th, & td": {
                p: 1,
                border: "1px solid rgba(0,0,0,0.12)",
                fontSize: "0.8rem",
              },
              "& th": {
                bgcolor: COLORS.DEEP_NAVY,
                color: "#fff",
                fontWeight: 600,
                whiteSpace: "nowrap",
              },
            }}
          >
            <thead>
              <tr>
                <th>ホテル名</th>
                {allDates.map((d) => (
                  <th key={d}>{d}</th>
                ))}
                <th>メモ</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((hotel) => {
                const isLowest = allDates.some((date) => {
                  const prices = items
                    .map((h) => h.prices[date])
                    .filter(Boolean);
                  if (prices.length < 2) return false;
                  const nums = prices.map((p) =>
                    parseInt(p.replace(/[^0-9]/g, ""), 10)
                  );
                  const hotelNum = parseInt(
                    (hotel.prices[date] || "").replace(/[^0-9]/g, ""),
                    10
                  );
                  return hotelNum === Math.min(...nums);
                });

                return (
                  <tr key={hotel.id}>
                    <td>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {isLowest && (
                          <StarIcon sx={{ fontSize: 16, color: COLORS.DISNEY_GOLD }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {hotel.name}
                        </Typography>
                      </Box>
                    </td>
                    {allDates.map((d) => (
                      <td
                        key={d}
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          whiteSpace: "nowrap",
                        }}
                      >
                        {hotel.prices[d] || "—"}
                      </td>
                    ))}
                    <td>
                      <Typography variant="caption">{hotel.note}</Typography>
                    </td>
                    <td>
                      <Box sx={{ display: "flex" }}>
                        <IconButton size="small" onClick={() => handleOpenEdit(hotel)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(hotel.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}

      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        sx={{ borderStyle: "dashed" }}
        variant="outlined"
      >
        ホテル候補を追加
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "ホテル編集" : "ホテル追加"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ホテル名"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            size="small"
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="料金 (1行ずつ「日付: 料金」形式)"
            fullWidth
            multiline
            rows={3}
            value={form.prices}
            onChange={(e) => setForm({ ...form, prices: e.target.value })}
            size="small"
            placeholder={"4/11(土): ¥35,000前後\n4/20(土): ¥15,000前後"}
            sx={{ mb: 2 }}
          />
          <TextField
            label="メモ"
            fullWidth
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
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
