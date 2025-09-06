-- Migration: 006_add_birth_date_and_country.sql
-- Description: Users tablosuna doğum tarihi ve ülke alanlarını ekler

-- Doğum tarihi alanını ekle
ALTER TABLE public.users ADD COLUMN birth_date DATE;

-- Ülke alanını ekle
ALTER TABLE public.users ADD COLUMN country VARCHAR(100);