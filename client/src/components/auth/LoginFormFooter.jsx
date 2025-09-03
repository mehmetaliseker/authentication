import React from 'react';
import Button from '../shared/Button';
import Message from '../shared/Message';

export default function LoginFormFooter({ onForgotPassword, message }) {
  return (
    <>
      <Button
        onClick={onForgotPassword}
        variant="link"
        className="text-center"
      >
        Şifremi unuttum
      </Button>

      <Message message={message} />
    </>
  );
}
