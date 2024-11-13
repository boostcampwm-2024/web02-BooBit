import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { CurrencyCode } from '@app/common';

export class OrderLimitRequestDto {
  @Expose({ name: 'coin_code' })
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
