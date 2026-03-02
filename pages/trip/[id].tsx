import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAuth } from "@/src/hooks/useAuth";
import { useTripDetail } from "@/src/hooks/useTrip";
import { useTimeline } from "@/src/hooks/useTimeline";
import { useChecklist } from "@/src/hooks/useChecklist";
import { useHotels } from "@/src/hooks/useHotels";
import { useCosts } from "@/src/hooks/useCosts";
import { useMembers } from "@/src/hooks/useMembers";
import { TripHeader } from "@/src/components/trip/TripHeader";
import { TripTabs } from "@/src/components/trip/TripTabs";
import { TimelineList } from "@/src/components/timeline/TimelineList";
import { ChecklistSection } from "@/src/components/checklist/ChecklistSection";
import { HotelCompare } from "@/src/components/hotel/HotelCompare";
import { CostSummary } from "@/src/components/cost/CostSummary";
import { COLORS } from "@/src/lib/theme";

export default function TripDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const tripId = typeof id === "string" ? id : "";
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const { trip, loading: tripLoading, updateTrip } = useTripDetail(tripId);
  const timeline = useTimeline(tripId);
  const checklist = useChecklist(tripId);
  const hotels = useHotels(tripId);
  const costs = useCosts(tripId);
  const { members } = useMembers(tripId);

  const [copied, setCopied] = useState(false);

  if (!tripId || tripLoading) {
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

  if (!trip) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <Typography>トリップが見つかりません</Typography>
        <Button onClick={() => router.push("/")}>トップに戻る</Button>
      </Container>
    );
  }

  const handleCopyInvite = () => {
    const url = `${window.location.origin}/invite/${trip.inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checklistDone = checklist.items.filter((i) => i.isChecked).length;
  const checklistTotal = checklist.items.length;

  return (
    <>
      <Head>
        <title>{trip.name} - Sea Trip Planner</title>
      </Head>

      <AppBar position="static" sx={{ bgcolor: COLORS.DEEP_NAVY }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push("/")}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
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
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyInvite}
            size="small"
          >
            {copied ? "コピー済み" : "招待リンク"}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <TripHeader
          trip={trip}
          onUpdate={updateTrip}
          checklistProgress={{ done: checklistDone, total: checklistTotal }}
        />

        <TripTabs value={tab} onChange={setTab}>
          {/* タイムラインタブ */}
          <TimelineList
            items={timeline.items}
            loading={timeline.loading}
            userId={user?.uid || ""}
            onAdd={timeline.addItem}
            onUpdate={timeline.updateItem}
            onDelete={timeline.deleteItem}
          />

          {/* 予約チェックタブ */}
          <Box>
            <ChecklistSection
              items={checklist.items}
              loading={checklist.loading}
              members={members}
              onAdd={checklist.addItem}
              onUpdate={checklist.updateItem}
              onDelete={checklist.deleteItem}
            />
            <HotelCompare
              items={hotels.items}
              loading={hotels.loading}
              onAdd={hotels.addItem}
              onUpdate={hotels.updateItem}
              onDelete={hotels.deleteItem}
            />
            <CostSummary
              items={costs.items}
              loading={costs.loading}
              onAdd={costs.addItem}
              onUpdate={costs.updateItem}
              onDelete={costs.deleteItem}
            />
          </Box>
        </TripTabs>
      </Container>
    </>
  );
}
