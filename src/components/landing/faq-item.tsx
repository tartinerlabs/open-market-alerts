import { motion } from "motion/react";
import type { ReactNode } from "react";

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface FaqItemProps {
  question: string;
  children: ReactNode;
}

export const FaqItem = ({ question, children }: FaqItemProps) => {
  return (
    <motion.div
      className="rounded-lg bg-surface-secondary p-6"
      variants={staggerItem}
      whileHover={{
        y: -2,
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <h4 className="mb-3 text-lg font-semibold text-foreground">{question}</h4>
      <div className="text-muted">{children}</div>
    </motion.div>
  );
};
