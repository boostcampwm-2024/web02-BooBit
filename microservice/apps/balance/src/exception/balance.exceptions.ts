import { HttpStatus } from '@nestjs/common';
import { ExceptionType } from './exception.type';

export const BALANCE_EXCEPTIONS: Record<string, ExceptionType> = {
  USER_ASSETS_NOT_FOUND: {
    name: 'UserAssetsNotFoundException',
    status: HttpStatus.NOT_FOUND,
    message: '사용자의 자산을 찾을 수 없습니다.',
  },
  INVALID_DEPOSIT_AMOUNT: {
    name: 'InvalidDepositAmountException',
    status: HttpStatus.BAD_REQUEST,
    message: '음수 값을 입금할 수 없습니다.',
  },
  INVALID_WITHDRAWAL_AMOUNT: {
    name: 'InvalidWithdrawalAmountException',
    status: HttpStatus.BAD_REQUEST,
    message: '음수 값을 출금할 수 없습니다.',
  },
};
