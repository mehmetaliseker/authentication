import React from 'react';
import { motion } from 'framer-motion';
import { useFormAnimations } from './hooks/useAnimations';

export default function AnimatedForm({ children, className = "" }) {
  const { containerVariants, headerVariants, fieldsVariants, footerVariants } = useFormAnimations();

  return (
    <motion.div 
      className={`bg-white/40 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 w-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div className="flex flex-col gap-4">
        {React.Children.map(children, (child, index) => {
          if (index === 0) {
            return (
              <motion.div key={index} variants={headerVariants}>
                {child}
              </motion.div>
            );
          } else if (index === children.length - 1) {
            return (
              <motion.div key={index} variants={footerVariants}>
                {child}
              </motion.div>
            );
          } else {
            return (
              <motion.div key={index} variants={fieldsVariants}>
                {child}
              </motion.div>
            );
          }
        })}
      </motion.div>
    </motion.div>
  );
}
