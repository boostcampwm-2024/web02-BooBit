import { IsEmail, IsString, Matches, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32, { message: '비밀번호는 8-32자 사이여야 합니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: '비밀번호는 숫자와 문자를 모두 포함해야 합니다.',
  })
  password: string;

  @IsString()
  name: string;
}
