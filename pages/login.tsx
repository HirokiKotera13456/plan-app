import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/src/hooks/useAuth";
import { COLORS } from "@/src/lib/theme";

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup, user } = useAuth();
  const router = useRouter();

  const redirect = typeof router.query.redirect === "string" ? router.query.redirect : "/";

  if (user) {
    router.replace(redirect);
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

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
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: COLORS.DEEP_NAVY,
              mb: 1,
            }}
          >
            Sea Trip Planner
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: COLORS.SEA_TEAL, mb: 3 }}
          >
            ディズニーシー旅行プランナー
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              setError("");
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="ログイン" />
            <Tab label="新規登録" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="メールアドレス"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="パスワード"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                py: 1.5,
                bgcolor: COLORS.DEEP_NAVY,
                "&:hover": { bgcolor: COLORS.SEA_TEAL },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : tab === 0 ? (
                "ログイン"
              ) : (
                "新規登録"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
