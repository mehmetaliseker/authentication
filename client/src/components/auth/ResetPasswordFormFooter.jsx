import React from 'react';
import Button from '../shared/Button';
import Message from '../shared/Message';

export default function ResetPasswordFormFooter({ onBack, message }) {
  return (
    <>
      <Button
        onClick={onBack}
        variant="link"
        className="text-center"
      >
        Geri Dön
      </Button>

      <Message message={message} />
    </>
  );
}
