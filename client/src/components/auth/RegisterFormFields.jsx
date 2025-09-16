import React from 'react';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function RegisterFormFields({ 
  formData, 
  handleChange, 
  isLoading, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, x: -50, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: 5, rotateY: 5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="text"
          name="first_name"
          placeholder="Ad"
          value={formData.first_name}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="given-name"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50, rotateY: 15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: -5, rotateY: -5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="text"
          name="last_name"
          placeholder="Soyad"
          value={formData.last_name}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="family-name"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.3,
          type: "spring",
          stiffness: 80
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileFocus={{ scale: 1.08 }}
      >
        <Input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="email"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.4,
          type: "spring",
          stiffness: 80
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileFocus={{ scale: 1.08 }}
      >
        <Input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50, rotateX: -15 }}
        animate={{ opacity: 1, x: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.5,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: 5, rotateX: 5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="date"
          name="birth_date"
          placeholder="Doğum Tarihi"
          value={formData.birth_date}
          onChange={handleChange}
          disabled={isLoading}
          autoComplete="bday"
          max={new Date().toISOString().split('T')[0]}
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50, rotateX: 15 }}
        animate={{ opacity: 1, x: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.6,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.02, x: -5, rotateX: -5 }}
        whileFocus={{ scale: 1.05 }}
      >
        <Input
          type="text"
          name="country"
          placeholder="Yaşadığınız Ülke"
          value={formData.country}
          onChange={handleChange}
          disabled={isLoading}
          autoComplete="country"
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.7,
          type: "spring",
          stiffness: 60
        }}
        whileHover={{ 
          scale: 1.08,
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
          y: -5
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          type="submit"
          variant="register"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <motion.span
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Kayıt Oluşturuluyor...
            </motion.span>
          ) : 'Kayıt Ol'}
        </Button>
      </motion.div>
    </form>
  );
}
