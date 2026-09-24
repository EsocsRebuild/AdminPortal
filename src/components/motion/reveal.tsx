"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
};

/** Fades and lifts its children into place once, on mount. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOutExpo, delay }}
      {...props}
    />
  );
}

/** Children wrapped in <StaggerItem> appear one after another. */
export function Stagger({
  gap = 0.06,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { gap?: number; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...props}
    />
  );
}

export function StaggerItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={item} {...props} />;
}

export function StaggerSection(props: HTMLMotionProps<"section">) {
  return <motion.section variants={item} {...props} />;
}
