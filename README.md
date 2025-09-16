# Authentication Project

Bu proje, modern bir authentication sistemi içeren full-stack uygulamadır.

## Proje Yapısı

- **`server/`** - NestJS backend API (PostgreSQL)
- **`client/`** - React frontend (Vite + Tailwind CSS)

## Kurulum

### Backend (Server)
```bash
cd server
npm install

# Environment variables'ları ayarlayın
cp ENV_SETUP.md .env  # ENV_SETUP.md dosyasındaki rehberi takip edin

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
- **Google Search API entegrasyonu** - Dashboard'da arama motoru
- Todo yönetim sistemi

## Teknolojiler

- **Backend**: NestJS, PostgreSQL, JWT, Google Search API
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Veritabanı**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Search**: Google Custom Search API

## Google Search API Kurulumu

Google Search API'yi kullanabilmek için `server/ENV_SETUP.md` dosyasındaki rehberi takip edin ve gerekli environment variable'ları ayarlayın.
