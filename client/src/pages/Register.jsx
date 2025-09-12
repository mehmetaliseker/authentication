import React from 'react';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import ComputerScienceSVG from '../assets/Computer_science_education.svg';

export default function Register() {
  return (
    <div className="min-h-screen flex">
      {/* Sol taraf - SVG ve Mavi Arkaplan */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-full"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 w-[28rem] h-[28rem]"
        >
          <img 
            src={ComputerScienceSVG} 
            alt="Computer Science Education" 
            className="w-full h-full text-white" 
          />
        </motion.div>
      </div>

      {/* Sağ taraf - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <RegisterForm />
        </motion.div>
      </div>
    </div>
  );
}