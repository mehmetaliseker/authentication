import { motion } from 'framer-motion';

// Form animasyonları
export const useFormAnimations = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    hover: { scale: 1.02 }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.6, delay: 0.1 }
    }
  };

  const fieldsVariants = {
    hidden: { opacity: 0, y: 20, rotateX: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, delay: 0.3 }
    }
  };

  return {
    containerVariants,
    headerVariants,
    fieldsVariants,
    footerVariants
  };
};

// Input animasyonları
export const useInputAnimations = () => {
  const inputVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.1,
        type: "spring",
        stiffness: 100
      }
    },
    hover: { scale: 1.02, x: 5 },
    focus: { scale: 1.05 }
  };

  const inputVariantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    },
    hover: { scale: 1.02, x: -5 },
    focus: { scale: 1.05 }
  };

  const inputVariantsCenter = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.3,
        type: "spring",
        stiffness: 80
      }
    },
    hover: { scale: 1.05, y: -2 },
    focus: { scale: 1.08 }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        type: "spring",
        stiffness: 80
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    tap: { scale: 0.95 }
  };

  return {
    inputVariants,
    inputVariantsRight,
    inputVariantsCenter,
    buttonVariants
  };
};

// Sayfa animasyonları
export const usePageAnimations = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1 }
    }
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, delay: 0.2 }
    }
  };

  const formContainerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, delay: 0.4 }
    }
  };

  return {
    pageVariants,
    contentVariants,
    formContainerVariants
  };
};

// Background animasyonları
export const useBackgroundAnimations = () => {
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 2 }
    }
  };

  const circleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const circleVariants2 = {
    animate: {
      scale: [1.2, 1, 1.2],
      rotate: [360, 180, 0],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const circleVariants3 = {
    animate: {
      scale: [1, 1.3, 1],
      rotate: [0, -180, -360],
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return {
    backgroundVariants,
    circleVariants,
    circleVariants2,
    circleVariants3
  };
};
