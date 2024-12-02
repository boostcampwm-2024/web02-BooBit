import { IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CandleDataDto {
  constructor(data: Partial<CandleDataDto>) {
    Object.assign(this, data);
  }
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  open: number;

  @IsNumber()
  close: number;

  @IsNumber()
  high: number;

  @IsNumber()
  low: number;

  @IsNumber()
  volume: number;

  toString(): string {
    return `date: ${this.date}, open: ${this.open}, close: ${this.close}, high: ${this.high}, low: ${this.low}, volume: ${this.volume}`;
  }
}
