import React from 'react';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function LoginFormFields({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: 5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: -5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.3,
          type: "spring",
          stiffness: 80
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Giriş Yapılıyor...
            </motion.span>
          ) : 'Giriş Yap'}
        </Button>
      </motion.div>
    </form>
  );
}
