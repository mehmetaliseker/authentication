import React from 'react';
import Message from '../shared/Message';

export default function RegisterFormFooter({ message }) {
  return (
    <>
      <Message message={message} />
      
      {message && message.includes('✅') && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          Login sayfasına yönlendiriliyorsunuz...
        </p>
      )}
    </>
  );
}
