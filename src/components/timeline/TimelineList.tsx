import { Box, CircularProgress, Typography } from "@mui/material";
import { TimelineCard } from "./TimelineCard";
import { AddTimelineItem } from "./AddTimelineItem";
import { TimelineItem } from "@/src/lib/types";

interface Props {
  items: TimelineItem[];
  loading: boolean;
  userId: string;
  onAdd: (item: Omit<TimelineItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (id: string, updates: Partial<TimelineItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TimelineList({ items, loading, userId, onAdd, onUpdate, onDelete }: Props) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
        {items.length} 件のスケジュール
      </Typography>

      {items.map((item) => (
        <TimelineCard
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      <AddTimelineItem
        nextSortOrder={items.length > 0 ? items[items.length - 1].sortOrder + 1 : 1}
        userId={userId}
        onAdd={onAdd}
      />
    </Box>
  );
}
