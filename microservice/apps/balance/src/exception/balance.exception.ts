import { CustomException } from './custom.exception';
import { ExceptionType } from './exception.type';

export class BalanceException extends CustomException {
  constructor(exceptionType: ExceptionType) {
    super(exceptionType);
  }
}
