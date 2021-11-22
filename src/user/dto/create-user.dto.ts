import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @MinLength(6)
  username: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  @IsEmail()
  email?: string;
}
