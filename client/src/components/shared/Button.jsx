import React from 'react';

export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    link: 'text-blue-500 hover:text-blue-700 underline hover:no-underline',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-2 text-base rounded-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
