# Authentication Project

Bu proje, modern bir authentication sistemi içeren full-stack uygulamadır.

## Proje Yapısı

- **`server/`** - NestJS backend API (PostgreSQL + TypeORM)
- **`client/`** - React frontend (Vite + Tailwind CSS)

## Kurulum

### Backend (Server)
```bash
cd server
npm install
npm run start:dev
```

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

## Özellikler

- JWT tabanlı authentication
- Kullanıcı kayıt ve giriş
- Şifre sıfırlama
- PostgreSQL veritabanı
- Modern React frontend
- Responsive tasarım

## Teknolojiler

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT
- **Frontend**: React, Vite, Tailwind CSS
- **Veritabanı**: PostgreSQL
- **Authentication**: JWT, bcrypt
