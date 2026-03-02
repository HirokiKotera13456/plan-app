import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { COLORS } from "@/src/lib/theme";
import { Trip } from "@/src/lib/types";

export default function InvitePage() {
  const router = useRouter();
  const { code } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code || typeof code !== "string") return;

    const findTrip = async () => {
      setLoading(true);
      const ref = collection(db, "trips");
      const q = query(ref, where("inviteCode", "==", code));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setError("招待リンクが無効です");
      } else {
        setTrip({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Trip);
      }
      setLoading(false);
    };

    findTrip();
  }, [code]);

  const handleJoin = async () => {
    if (!user || !trip) return;

    if (trip.memberIds.includes(user.uid)) {
      router.push(`/trip/${trip.id}`);
      return;
    }

    setJoining(true);
    try {
      await updateDoc(doc(db, "trips", trip.id), {
        memberIds: arrayUnion(user.uid),
        updatedAt: Timestamp.now(),
      });
      await setDoc(doc(db, "trips", trip.id, "members", user.uid), {
        displayName: user.email?.split("@")[0] || "",
        role: "member",
        joinedAt: Timestamp.now(),
      });
      router.push(`/trip/${trip.id}`);
    } catch {
      setError("参加に失敗しました");
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${COLORS.DEEP_NAVY} 0%, ${COLORS.SEA_TEAL} 100%)`,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}
            >
              Sea Trip Planner
            </Typography>
            <Typography sx={{ mb: 3 }}>
              トリップに参加するにはログインが必要です
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push(`/login?redirect=/invite/${code}`)}
              sx={{
                bgcolor: COLORS.DEEP_NAVY,
                "&:hover": { bgcolor: COLORS.SEA_TEAL },
              }}
            >
              ログインして参加
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xs" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button onClick={() => router.push("/")}>トップに戻る</Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${COLORS.DEEP_NAVY} 0%, ${COLORS.SEA_TEAL} 100%)`,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 1,
              fontFamily: '"Playfair Display", serif',
              color: COLORS.DEEP_NAVY,
            }}
          >
            トリップに招待されました
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, color: COLORS.SEA_TEAL }}>
            {trip?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            旅行日: {trip?.tripDate}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoin}
            disabled={joining}
            sx={{
              py: 1.5,
              bgcolor: COLORS.SEA_TEAL,
              "&:hover": { bgcolor: COLORS.DEEP_NAVY },
            }}
          >
            {joining ? (
              <CircularProgress size={24} color="inherit" />
            ) : trip?.memberIds.includes(user.uid) ? (
              "トリップを開く"
            ) : (
              "参加する"
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
