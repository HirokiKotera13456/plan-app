export const CATEGORY_COLORS = {
  transport: { bg: "#E3F2FD", border: "#1976D2", text: "#1565C0" },
  attraction: { bg: "#FFF3E0", border: "#F57C00", text: "#E65100" },
  meal: { bg: "#FCE4EC", border: "#E8725C", text: "#C62828" },
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  transport: "移動",
  attraction: "遊び",
  meal: "食事",
};
