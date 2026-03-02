import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/src/hooks/useAuth";
import { useTrips } from "@/src/hooks/useTrip";
import { COLORS } from "@/src/lib/theme";

export default function Home() {
  const { user, logout } = useAuth();
  const { trips, loading, createTrip, deleteTrip } = useTrips(user?.uid);
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tripName, setTripName] = useState("ディズニーシー旅行");
  const [tripDate, setTripDate] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!tripName || !tripDate) return;
    setCreating(true);
    const id = await createTrip(tripName, tripDate);
    setCreating(false);
    setDialogOpen(false);
    if (id) router.push(`/trip/${id}`);
  };

  return (
    <>
      <Head>
        <title>Sea Trip Planner</title>
        <meta name="description" content="ディズニーシー旅行プランナー" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static" sx={{ bgcolor: COLORS.DEEP_NAVY }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Sea Trip Planner
          </Typography>
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          トリップ一覧
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {user?.email} でログイン中
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : trips.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            {trips.map((trip) => {
              const daysUntil = Math.ceil(
                (new Date(trip.tripDate).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <Card
                  key={trip.id}
                  sx={{
                    mb: 1.5,
                    p: 2,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 4 },
                    transition: "box-shadow 0.2s",
                  }}
                  onClick={() => router.push(`/trip/${trip.id}`)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {trip.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trip.tripDate}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        daysUntil > 0
                          ? `あと${daysUntil}日`
                          : daysUntil === 0
                          ? "今日！"
                          : `${Math.abs(daysUntil)}日前`
                      }
                      size="small"
                      sx={{
                        bgcolor: COLORS.DISNEY_GOLD,
                        color: COLORS.DEEP_NAVY,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("このトリップを削除しますか？")) {
                          deleteTrip(trip.id);
                        }
                      }}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              textAlign: "center",
              border: `2px dashed ${COLORS.SEA_TEAL}`,
              mb: 3,
            }}
          >
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              まだトリップがありません
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: COLORS.SEA_TEAL,
            "&:hover": { bgcolor: COLORS.DEEP_NAVY },
            py: 1.5,
          }}
        >
          新しいトリップを作成
        </Button>
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>新しいトリップを作成</DialogTitle>
        <DialogContent>
          <TextField
            label="旅行名"
            fullWidth
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            size="small"
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="旅行日"
            type="date"
            fullWidth
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleCreate} variant="contained" disabled={creating}>
            {creating ? <CircularProgress size={20} /> : "作成"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
