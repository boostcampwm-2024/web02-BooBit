import { HttpException } from '@nestjs/common';
import { ExceptionType } from './exception.type';

export class CustomException extends HttpException {
  private readonly exceptionName: string;

  constructor(exceptionType: ExceptionType) {
    super(exceptionType.message, exceptionType.status);
    this.exceptionName = exceptionType.name;
  }

  getName() {
    return this.exceptionName;
  }
}
