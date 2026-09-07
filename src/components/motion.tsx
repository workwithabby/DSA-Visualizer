"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionH1({ children, ...props }: HTMLMotionProps<"h1">) {
  return <motion.h1 {...props}>{children}</motion.h1>;
}

export function MotionSection({ children, ...props }: HTMLMotionProps<"section">) {
  return <motion.section {...props}>{children}</motion.section>;
}
