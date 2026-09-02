import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const PageTransition = ({ children, className = '' }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
