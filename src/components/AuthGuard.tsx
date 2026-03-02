import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/src/hooks/useAuth";

const PUBLIC_PATHS = ["/login", "/invite"];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((path) =>
    router.pathname.startsWith(path)
  );

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/login");
    }
  }, [user, loading, isPublic, router]);

  if (loading) {
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

  if (!user && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
