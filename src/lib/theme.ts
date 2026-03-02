import { createTheme } from "@mui/material/styles";

export const COLORS = {
  DEEP_NAVY: "#0A1628",
  DISNEY_GOLD: "#C9A84C",
  SEA_TEAL: "#1A6B7A",
  WARM_SAND: "#F5F0E8",
  CORAL: "#E8725C",
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.DEEP_NAVY,
    },
    secondary: {
      main: COLORS.SEA_TEAL,
    },
    background: {
      default: COLORS.WARM_SAND,
      paper: "#FFFFFF",
    },
    warning: {
      main: COLORS.DISNEY_GOLD,
    },
    error: {
      main: COLORS.CORAL,
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
    },
  },
});

export default theme;
