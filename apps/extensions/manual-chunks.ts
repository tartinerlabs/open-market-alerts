export const manualChunks = (id: string) => {
  if (!id.includes("node_modules")) return;
  if (id.includes("recharts") || id.includes("/d3-")) return "charts";
  if (id.includes("@heroui-pro")) return "heroui-pro";
  if (id.includes("@heroui")) return "heroui";
  if (
    id.includes("/react/") ||
    id.includes("/react-dom/") ||
    id.includes("react-router") ||
    id.includes("react-aria")
  )
    return "react-vendor";
  if (id.includes("@tanstack")) return "tanstack";
  if (id.includes("/motion/") || id.includes("framer-motion")) {
    return "motion";
  }
  return "vendor";
};
