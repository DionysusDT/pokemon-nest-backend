import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginCreateDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
