import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { CurrencyCode } from '@app/common';

export class OrderLimitRequestDto {
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  coinCode: string;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
