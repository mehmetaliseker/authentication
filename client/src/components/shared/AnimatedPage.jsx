import React from 'react';
import { motion } from 'framer-motion';
import { usePageAnimations, useBackgroundAnimations } from '../../hooks/useAnimations';

export default function AnimatedPage({ 
  children, 
  backgroundGradient, 
  circles = [], 
  className = "" 
}) {
  const { pageVariants, contentVariants, formContainerVariants } = usePageAnimations();
  const { backgroundVariants, circleVariants, circleVariants2, circleVariants3 } = useBackgroundAnimations();

  return (
    <motion.div 
      className={`h-screen ${backgroundGradient} relative overflow-hidden ${className}`}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        {circles.map((circle, index) => {
          const variants = index === 0 ? circleVariants : index === 1 ? circleVariants2 : circleVariants3;
          return (
            <motion.div
              key={index}
              className={circle.className}
              variants={variants}
              animate="animate"
            />
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex items-center justify-center h-full px-4"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
