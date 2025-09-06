import React from 'react';
import { motion } from 'framer-motion';
import { useInputAnimations } from '../../hooks/useAnimations';
import Input from './Input';

export default function AnimatedInput({ 
  variant = 'left', 
  delay = 0.1, 
  children, 
  ...props 
}) {
  const { 
    inputVariants, 
    inputVariantsRight, 
    inputVariantsCenter, 
    buttonVariants 
  } = useInputAnimations();

  let selectedVariants;
  switch (variant) {
    case 'right':
      selectedVariants = { ...inputVariantsRight, hidden: { ...inputVariantsRight.hidden, transition: { ...inputVariantsRight.hidden.transition, delay } } };
      break;
    case 'center':
      selectedVariants = { ...inputVariantsCenter, hidden: { ...inputVariantsCenter.hidden, transition: { ...inputVariantsCenter.hidden.transition, delay } } };
      break;
    case 'button':
      selectedVariants = { ...buttonVariants, hidden: { ...buttonVariants.hidden, transition: { ...buttonVariants.hidden.transition, delay } } };
      break;
    default:
      selectedVariants = { ...inputVariants, hidden: { ...inputVariants.hidden, transition: { ...inputVariants.hidden.transition, delay } } };
  }

  return (
    <motion.div
      variants={selectedVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileFocus="focus"
      whileTap={variant === 'button' ? "tap" : undefined}
    >
      {children || <Input {...props} />}
    </motion.div>
  );
}
