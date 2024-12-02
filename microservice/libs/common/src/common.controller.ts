import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export class CommonController {
  @Get()
  async get() {
    return;
  }
}
