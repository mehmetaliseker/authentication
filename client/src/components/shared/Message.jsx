import React from 'react';

export default function Message({ message, className = '' }) {
  if (!message) return null;
  
  const isSuccess = message.includes('✅');
  const messageClasses = isSuccess ? 'text-green-600' : 'text-red-500';
  
  return (
    <div className={`text-center ${className}`}>
      <p className={`text-sm ${messageClasses} bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md border border-white/30`}>
        {message}
      </p>
    </div>
  );
}
