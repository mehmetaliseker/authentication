# Authentication Server

Bu proje NestJS kullanarak geliştirilmiş bir authentication server'ıdır.

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js (v18 veya üzeri)
- Docker ve Docker Compose
- PostgreSQL (Docker ile otomatik kurulum)

### 2. Docker ile PostgreSQL Başlatma
```bash
# PostgreSQL container'ını başlat
docker-compose up -d

# Container durumunu kontrol et
docker ps

# Logları kontrol et
docker logs nestdeneme_postgres
```

### 3. Bağımlılıkları Yükleme
```bash
npm install
```

### 4. Environment Variables
`.env` dosyası oluşturun (opsiyonel):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestdeneme
PORT=3001
```

### 5. Server'ı Başlatma
```bash
# Development modunda
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/forgot-password` - Şifre sıfırlama

### Request/Response Örnekleri

#### Register
```json
POST /auth/register
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
```

## 🗄️ Database

### Tablolar
- `users` - Kullanıcı bilgileri
- `password_resets` - Şifre sıfırlama token'ları
- `migrations` - Migration takibi

### Database Bağlantı Testi
```bash
node test-db-connection.js
```

## 🔒 Güvenlik Özellikleri

- **Password Hashing**: bcrypt ile şifre hash'leme
- **Account Locking**: Başarısız login denemeleri için hesap kilitleme
- **Input Validation**: DTO validation ile giriş kontrolü
- **CORS Protection**: Frontend origin kontrolü
- **Rate Limiting**: API rate limiting (gelecekte eklenecek)

## 📝 Migration Sistemi

### Migration Çalıştırma
```bash
# Tüm migration'ları çalıştır
npm run migrate:run

# Son migration'ı geri al
npm run migrate:rollback
```

### Manuel Migration
```bash
npx ts-node src/database/run-migrations.ts run
npx ts-node src/database/run-migrations.ts rollback
```

## 🐛 Troubleshooting

### Database Bağlantı Hatası
1. Docker container'ının çalıştığından emin olun
2. Port 5432'nin açık olduğunu kontrol edin
3. Database credentials'ları kontrol edin

### CORS Hatası
1. Frontend URL'inin doğru olduğundan emin olun
2. Server'ın CORS ayarlarını kontrol edin

### Port Çakışması
1. Port 3001'in kullanılabilir olduğundan emin olun
2. `.env` dosyasında farklı port belirtin

## 📊 Monitoring

### Loglar
- Console'da detaylı loglar
- Database query logları
- Authentication işlem logları

### Health Check
```bash
curl http://localhost:3001/health
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
```

### Build ve Deploy
```bash
npm run build
npm run start:prod
```

## 📚 Dependencies

### Production
- `@nestjs/common` - NestJS core
- `@nestjs/typeorm` - TypeORM integration
- `pg` - PostgreSQL driver
- `bcrypt` - Password hashing
- `class-validator` - Input validation

### Development
- `dotenv` - Environment variables
- `ts-node` - TypeScript execution

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
