import { ReactNode, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { COLORS } from "@/src/lib/theme";

interface Props {
  value: number;
  onChange: (value: number) => void;
  children: ReactNode[];
}

export function TripTabs({ value, onChange, children }: Props) {
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            fontWeight: 600,
          },
          "& .Mui-selected": {
            color: COLORS.SEA_TEAL,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: COLORS.SEA_TEAL,
          },
        }}
      >
        <Tab label="タイムライン" />
        <Tab label="予約チェック" />
      </Tabs>
      {children[value]}
    </Box>
  );
}
