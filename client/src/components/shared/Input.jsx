import React from 'react';

export default function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  ...props 
}) {
  const baseClasses = 'px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = `${baseClasses} ${disabledClasses} ${className}`;
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className={classes}
      {...props}
    />
  );
}
