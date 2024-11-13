import { IsInt, IsString, IsPositive, IsIn } from 'class-validator';

export class OrderLimitResponseDto {
  @IsInt()
  @IsPositive()
  historyId: number;

  @IsString()
  @IsIn(['pending', 'filled', 'partially_filled', 'canceled'])
  status: string;

  @IsString()
  timestamp: string;
}
