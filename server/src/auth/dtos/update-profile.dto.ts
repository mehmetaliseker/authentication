import { IsString, IsEmail, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(100, { message: 'Ad en fazla 100 karakter olabilir' })
  first_name: string;

  @IsString()
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır' })
  @MaxLength(100, { message: 'Soyad en fazla 100 karakter olabilir' })
  last_name: string;

  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Geçerli bir doğum tarihi giriniz' })
  birth_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Ülke adı en fazla 100 karakter olabilir' })
  country?: string;
}
