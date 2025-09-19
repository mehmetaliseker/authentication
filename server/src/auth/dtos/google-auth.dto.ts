import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  idToken: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  photoURL?: string;
}
