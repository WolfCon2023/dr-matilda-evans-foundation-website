import * as React from "react";
import { motion, type MotionProps } from "framer-motion";

import { cn } from "~/lib/utils";

export function Reveal({
  className,
  children,
  ...props
}: MotionProps & { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}



