import { motion } from "motion/react";

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stepVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

interface StepItemProps {
  stepNumber: number;
  title: string;
  description: string;
}

export const StepItem = ({ stepNumber, title, description }: StepItemProps) => {
  return (
    <motion.div
      className="text-center"
      variants={staggerItem}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground"
        variants={stepVariants}
        whileHover={{ scale: 1.1, backgroundColor: "#475569" }}
      >
        <span className="text-2xl font-bold">{stepNumber}</span>
      </motion.div>
      <h4 className="mb-3 text-xl font-semibold text-foreground">{title}</h4>
      <p className="text-muted">{description}</p>
    </motion.div>
  );
};
