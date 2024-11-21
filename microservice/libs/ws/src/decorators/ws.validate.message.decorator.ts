import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const ValidateMessage = createParamDecorator((DtoClass: any, context: ExecutionContext) => {
  const data = context.switchToWs().getData();
  const dtoInstance = plainToInstance(DtoClass, data);
  const errors = validateSync(dtoInstance);
  if (errors.length > 0) {
    throw new BadRequestException('Invalid message format');
  }
  return dtoInstance;
});
