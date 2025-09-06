import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDateString, IsString, MaxLength, ValidateIf, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'isAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(birthDate: string, args: ValidationArguments) {
    if (!birthDate) return true; // Optional field
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return '18 yaşından küçük kullanıcılar kayıt olamaz';
  }
}

export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  confirmPassword?: string;

  @IsOptional()
  @IsDateString()
  @Validate(IsAdultConstraint)
  birth_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}