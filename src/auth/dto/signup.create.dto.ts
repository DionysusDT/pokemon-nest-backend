import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupCreateDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => String(value).trim())
  full_name: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
