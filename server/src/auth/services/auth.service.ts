import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordReset } from '../entities/password-reset.entity';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,
  ) { }

  async register(dto: RegisterDto) {
    try {
      // Email zaten var mı kontrol et
      const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existingUser) {
        throw new ConflictException('Bu email adresi zaten kullanılıyor');
      }

      // Şifreyi hash'le
      const hash = await bcrypt.hash(dto.password, 10);

      // Yeni kullanıcı oluştur
      const user = this.userRepo.create({
        ...dto,
        password_hash: hash,
        is_verified: false // Email doğrulama gerekli
      });

      // Kullanıcıyı kaydet
      const savedUser = await this.userRepo.save(user);

      console.log(`✅ Yeni kullanıcı kaydedildi: ${dto.email}`);

      // Hassas bilgileri çıkar
      const { password_hash, ...result } = savedUser;
      return result;

    } catch (error) {
      console.error(`❌ Kullanıcı kaydı hatası: ${error.message}`);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Kullanıcı kaydı sırasında bir hata oluştu');
    }
  }

  async login(dto: LoginDto) {
    try {
      // Kullanıcıyı bul
      const user = await this.userRepo.findOne({ where: { email: dto.email } });
      if (!user) {
        console.log(`❌ Login denemesi: Email bulunamadı - ${dto.email}`);
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
        user.failed_attempts += 1;

        // 5 başarısız denemeden sonra hesabı kilitle
        if (user.failed_attempts >= 5) {
          user.account_locked = true;
          user.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 dakika
          console.log(`🔒 Hesap kilitlendi: ${dto.email}`);
        }

        await this.userRepo.save(user);
        console.log(`❌ Login denemesi: Yanlış şifre - ${dto.email}`);
        throw new UnauthorizedException('Geçersiz email veya şifre');
      }

      // Başarılı login
      user.last_login = new Date();
      user.failed_attempts = 0; // Başarısız deneme sayısını sıfırla
      user.account_locked = false; // Hesabı aç
      user.locked_until = null;

      await this.userRepo.save(user);

      console.log(`✅ Başarılı login: ${dto.email}`);

      return {
        message: 'Giriş başarılı',
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_verified: user.is_verified
        }
      };

    } catch (error) {
      console.error(`❌ Login hatası: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Giriş sırasında bir hata oluştu');
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Email bulunamadı');
      }

      // Eski reset token'ları temizle
      await this.passwordResetRepo.delete({ user: { id: user.id } });

      // Reset token oluştur (32 karakter)
      const token = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Token'ı kaydet
      const passwordReset = this.passwordResetRepo.create({
        user: user,
        reset_token: token,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 saat geçerli
        used: false
      });

      await this.passwordResetRepo.save(passwordReset);

      console.log(`🔑 Şifre sıfırlama token'ı oluşturuldu: ${email}`);

      // Gerçek uygulamada burada email gönderilir
      return {
        message: 'Şifre sıfırlama linki email adresinize gönderildi',
        token: token, // Development için token'ı döndürüyoruz
        expires_at: passwordReset.expires_at
      };

    } catch (error) {
      console.error(`❌ Şifre sıfırlama hatası: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Şifre sıfırlama sırasında bir hata oluştu');
    }
  }

  async verifyResetToken(token: string) {
    try {
      const passwordReset = await this.passwordResetRepo.findOne({
        where: { reset_token: token }
      });

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
      console.error(`❌ Token doğrulama hatası: ${error.message}`);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const passwordReset = await this.passwordResetRepo.findOne({
        where: { reset_token: token },
        relations: ['user']
      });

      if (!passwordReset) {
        throw new NotFoundException('Geçersiz token');
      }

      if (passwordReset.used) {
        throw new UnauthorizedException('Bu token zaten kullanılmış');
      }

      if (passwordReset.expires_at < new Date()) {
        throw new UnauthorizedException('Token süresi dolmuş');
      }

      // Yeni şifreyi hash'le
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Kullanıcının şifresini güncelle
      await this.userRepo.update(passwordReset.user.id, {
        password_hash: newPasswordHash
      });

      // Token'ı kullanıldı olarak işaretle
      await this.passwordResetRepo.update(passwordReset.id, {
        used: true
      });

      console.log(`✅ Şifre başarıyla sıfırlandı: ${passwordReset.user.email}`);

      return {
        message: 'Şifreniz başarıyla sıfırlandı',
        success: true
      };

    } catch (error) {
      console.error(`❌ Şifre sıfırlama hatası: ${error.message}`);
      throw error;
    }
  }
}
