import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "4xl" | "6xl";
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const Section = ({
  children,
  className = "bg-surface py-16",
  maxWidth = "6xl",
}: SectionProps) => {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-6">
        <div className={`mx-auto max-w-${maxWidth}`}>{children}</div>
      </div>
    </motion.section>
  );
};
