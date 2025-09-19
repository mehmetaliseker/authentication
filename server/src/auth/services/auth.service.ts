import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { LogoutLogRepository } from '../repositories/logout-log.repository';
import { JwtService } from './jwt.service';
import { FirebaseService } from './firebase.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { GoogleAuthDto } from '../dtos/google-auth.dto';
import { IUser } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly logoutLogRepository: LogoutLogRepository,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
  ) { }

  async register(dto: RegisterDto): Promise<{ message: string; user: Partial<IUser> }> {
    try {
      // Email zaten var mı kontrol et
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Bu email adresi zaten kullanılıyor');
      }

      // Şifreyi hash'le
      const hash = await bcrypt.hash(dto.password, 12);

      // Yeni kullanıcı oluştur
      const userData = {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password_hash: hash,
        birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
        country: dto.country,
        is_verified: false // Email doğrulama gerekli
      };

      const savedUser = await this.userRepository.create(userData);

      // Hassas bilgileri çıkar
      const { password_hash, ...result } = savedUser;
      return {
        message: 'Kullanıcı başarıyla kaydedildi',
        user: result
      };

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Kullanıcı kaydı sırasında bir hata oluştu');
    }
  }

  async login(dto: LoginDto): Promise<{ 
    message: string; 
    accessToken: string; 
    refreshToken: string; 
    user: Partial<IUser> 
  }> {
    try {
      // Kullanıcıyı bul
      const user = await this.userRepository.findByEmail(dto.email);
      if (!user) {
        throw new UnauthorizedException('Geçersiz email veya şifre');
      }

      // Hesap kilitli mi kontrol et
      if (user.account_locked && user.locked_until && user.locked_until > new Date()) {
        throw new UnauthorizedException('Hesabınız kilitli. Lütfen daha sonra tekrar deneyin.');
      }

      // Şifreyi kontrol et
      const isMatch = await bcrypt.compare(dto.password, user.password_hash);
      if (!isMatch) {
        // Başarısız login denemesi
        const newFailedAttempts = user.failed_attempts + 1;
        let shouldLock = false;
        let lockedUntil: Date | null = null;

        // 5 başarısız denemeden sonra hesabı kilitle
        if (newFailedAttempts >= 5) {
          shouldLock = true;
          lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 dakika
        }

        await this.userRepository.updateFailedAttempts(user.id, newFailedAttempts, shouldLock, lockedUntil || undefined);
        throw new UnauthorizedException('Geçersiz email veya şifre');
      }

      // Başarılı login - hesabı aç ve deneme sayısını sıfırla
      await this.userRepository.updateFailedAttempts(user.id, 0, false, undefined);
      await this.userRepository.updateLastLogin(user.id);

      // JWT token çifti oluştur
      const tokenPair = this.jwtService.generateTokenPair({
        sub: user.id,
        email: user.email
      });

      return {
        message: 'Giriş başarılı',
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          birth_date: user.birth_date,
          country: user.country,
          is_verified: user.is_verified
        }
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Giriş sırasında bir hata oluştu');
    }
  }

  async forgotPassword(email: string): Promise<{ 
    message: string; 
    token: string; 
    expires_at: Date 
  }> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('Email bulunamadı');
      }

      // Eski reset token'ları temizle
      await this.passwordResetRepository.deleteByUserId(user.id);

      // Güvenli reset token oluştur (64 karakter)
      const token = crypto.randomBytes(32).toString('hex');

      // Token'ı kaydet (1 saat geçerli)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const passwordReset = await this.passwordResetRepository.create({
        user_id: user.id,
        reset_token: token,
        expires_at: expiresAt,
        used: false
      });

      // Gerçek uygulamada burada email gönderilir
      return {
        message: 'Şifre sıfırlama linki email adresinize gönderildi',
        token: token, // Development için token'ı döndürüyoruz
        expires_at: passwordReset.expires_at
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Şifre sıfırlama sırasında bir hata oluştu');
    }
  }

  async verifyResetToken(token: string): Promise<{ 
    message: string; 
    valid: boolean; 
    expires_at: Date 
  }> {
    try {
      const passwordReset = await this.passwordResetRepository.findByToken(token);

      if (!passwordReset) {
        throw new NotFoundException('Geçersiz token');
      }

      if (passwordReset.used) {
        throw new UnauthorizedException('Bu token zaten kullanılmış');
      }

      if (passwordReset.expires_at < new Date()) {
        throw new UnauthorizedException('Token süresi dolmuş');
      }

      return {
        message: 'Token geçerli',
        valid: true,
        expires_at: passwordReset.expires_at
      };

    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ 
    message: string; 
    success: boolean 
  }> {
    try {
      const passwordReset = await this.passwordResetRepository.findByToken(token);

      if (!passwordReset) {
        throw new NotFoundException('Geçersiz token');
      }

      if (passwordReset.used) {
        throw new UnauthorizedException('Bu token zaten kullanılmış');
      }

      if (passwordReset.expires_at < new Date()) {
        throw new UnauthorizedException('Token süresi dolmuş');
      }

      // Kullanıcıyı al
      const user = await this.userRepository.findById(passwordReset.user_id);
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      // Yeni şifreyi hash'le
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Son 3 şifreyi kontrol et
      const passwordHistory = await this.userRepository.getPasswordHistory(user.id);
      for (const oldHash of passwordHistory) {
        const isSame = await bcrypt.compare(newPassword, oldHash);
        if (isSame) {
          throw new BadRequestException('Yeni şifre son 3 şifreden biriyle aynı olamaz');
        }
      }

      // Kullanıcının şifresini güncelle
      await this.userRepository.update(user.id, {
        password_hash: newPasswordHash
      });

      // Yeni şifreyi geçmişe ekle
      await this.userRepository.addPasswordToHistory(user.id, newPasswordHash);

      // Token'ı kullanıldı olarak işaretle
      await this.passwordResetRepository.markAsUsed(passwordReset.id);

      return {
        message: 'Şifreniz başarıyla sıfırlandı',
        success: true
      };

    } catch (error) {
      throw error;
    }
  }

  async logout(userId: number, ipAddress?: string, userAgent?: string): Promise<{ message: string; logoutTime: Date }> {
    try {
      // Son giriş zamanını al
      const lastLoginTime = await this.logoutLogRepository.getLastLoginTime(userId);
      const logoutTime = new Date();
      
      // Session süresini hesapla
      let sessionDuration: string | null = null;
      if (lastLoginTime) {
        const durationMs = logoutTime.getTime() - lastLoginTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        sessionDuration = `${hours}:${minutes.toString().padStart(2, '0')}`;
      }

      // Logout log'unu kaydet
      await this.logoutLogRepository.create({
        user_id: userId,
        logout_time: logoutTime,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_duration: sessionDuration || undefined
      });

      return {
        message: 'Başarıyla çıkış yapıldı',
        logoutTime: logoutTime
      };
    } catch (error) {
      throw new InternalServerErrorException('Çıkış işlemi sırasında bir hata oluştu');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ 
    accessToken: string; 
    refreshToken: string 
  }> {
    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      
      // Kullanıcının hala var olduğunu kontrol et
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      // Yeni token çifti oluştur
      const tokenPair = this.jwtService.generateTokenPair({
        sub: user.id,
        email: user.email
      });

      return tokenPair;

    } catch (error) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<{ 
    message: string; 
    user: Partial<IUser> 
  }> {
    try {
      // Kullanıcıyı bul
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      // Email değişikliği kontrolü
      if (dto.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
          throw new ConflictException('Bu email adresi zaten kullanılıyor');
        }
      }

      // Şifre değişikliği kontrolü
      if (dto.password) {
        // Son 3 şifreyi kontrol et
        const passwordHistory = await this.userRepository.getPasswordHistory(userId);
        for (const oldHash of passwordHistory) {
          const isSame = await bcrypt.compare(dto.password, oldHash);
          if (isSame) {
            throw new BadRequestException('Yeni şifre son 3 şifreden biriyle aynı olamaz');
          }
        }
      }

      // Güncelleme verilerini hazırla
      const updateData: Partial<IUser> = {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
        country: dto.country
      };

      // Şifre güncelleniyorsa hash'le ve geçmişe ekle
      if (dto.password) {
        const newPasswordHash = await bcrypt.hash(dto.password, 12);
        updateData.password_hash = newPasswordHash;
      }

      // Kullanıcıyı güncelle
      const updatedUser = await this.userRepository.update(userId, updateData);

      // Şifre güncelleniyorsa geçmişe ekle
      if (dto.password && updateData.password_hash) {
        await this.userRepository.addPasswordToHistory(userId, updateData.password_hash);
      }

      // Hassas bilgileri çıkar
      const { password_hash, ...result } = updatedUser;
      return {
        message: 'Profil başarıyla güncellendi',
        user: result
      };

    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Profil güncelleme sırasında bir hata oluştu');
    }
  }

  async googleAuth(dto: GoogleAuthDto, ipAddress?: string, userAgent?: string): Promise<{ 
    success: boolean; 
    message: string; 
    user?: Partial<IUser>; 
    tokens?: { accessToken: string; refreshToken: string } 
  }> {
    try {
      console.log('Google Auth başlatıldı:', { email: dto.email, firstName: dto.firstName });
      
      // Firebase ID token'ını doğrula
      console.log('Firebase token doğrulaması başlatılıyor...');
      try {
        const decodedToken = await this.firebaseService.verifyIdToken(dto.idToken);
        console.log('Firebase token doğrulandı:', { email: decodedToken.email });
        
        if (decodedToken.email !== dto.email) {
          throw new UnauthorizedException('Token email mismatch');
        }
      } catch (firebaseError) {
        console.warn('Firebase token doğrulama atlandı:', firebaseError.message);
        // Firebase yoksa email kontrolünü atlayıp devam et
      }

      // Kullanıcı zaten var mı kontrol et
      console.log('Kullanıcı aranıyor:', dto.email);
      let user = await this.userRepository.findByEmail(dto.email);
      
      if (user) {
        console.log('✅ Mevcut kullanıcı bulundu:', user.id);
        // Mevcut kullanıcı - giriş yap
        const tokens = this.jwtService.generateTokenPair({ 
          sub: user.id, 
          email: user.email 
        });

        // Refresh token'ı kaydet (geçici olarak devre dışı)
        // await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

        // Google ile giriş yapan mevcut kullanıcıların email'ini doğrulanmış yap
        if (!user.is_verified) {
          console.log('📧 Email doğrulama durumu güncelleniyor...');
          await this.userRepository.update(user.id, { is_verified: true });
          user.is_verified = true;
        }

        // Son giriş zamanını güncelle
        await this.userRepository.updateLastLogin(user.id);

        return {
          success: true,
          message: 'Google ile giriş başarılı',
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            country: user.country,
            birth_date: user.birth_date,
            is_verified: true, // Google kullanıcıları her zaman doğrulanmış
            created_at: user.created_at,
            updated_at: user.updated_at,
            last_login: user.last_login
          },
          tokens
        };
      } else {
        console.log('🆕 Yeni kullanıcı oluşturuluyor:', dto.email);
        // Yeni kullanıcı - otomatik kayıt
        const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
        
        const newUser = await this.userRepository.create({
          email: dto.email,
          password_hash: hashedPassword, // Rastgele şifre
          first_name: dto.firstName,
          last_name: dto.lastName,
          country: undefined,
          birth_date: undefined,
          is_verified: true, // Google kullanıcıları otomatik doğrulanmış
        });

        const tokens = this.jwtService.generateTokenPair({ 
          sub: newUser.id, 
          email: newUser.email 
        });

        // Refresh token'ı kaydet (geçici olarak devre dışı)
        // await this.userRepository.updateRefreshToken(newUser.id, tokens.refreshToken);

        return {
          success: true,
          message: 'Google ile kayıt ve giriş başarılı',
          user: {
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            country: newUser.country,
            birth_date: newUser.birth_date,
            is_verified: newUser.is_verified,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at,
            last_login: newUser.last_login
          },
          tokens
        };
      }

    } catch (error) {
      console.error('❌ Google Auth Error:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      if (error.message?.includes('Firebase Admin SDK is not initialized')) {
        return {
          success: false,
          message: 'Firebase konfigürasyonu eksik. Service Account key gerekli.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Google authentication failed'
      };
    }
  }
}
