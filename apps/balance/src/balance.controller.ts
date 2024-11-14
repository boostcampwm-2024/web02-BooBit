import { Body, Controller, Get, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { AuthenticatedGuard } from '@app/session/guard/authenticated.guard';
@Controller('api/users')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/assets')
  @UseGuards(AuthenticatedGuard)
  async getAssets(@Request() req) {
    const userId = req.user.userId;
    const assets = await this.balanceService.getAssets(userId);
    return { assets };
  }

  @Post('/deposit')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async deposit(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    console.log('deposit');
    const userId = req.user.userId;
    await this.balanceService.deposit(userId, createTransactionDto);
    return;
  }

  @Post('/withdraw')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async withdraw(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    const userId = req.user.userId;
    await this.balanceService.withdraw(userId, createTransactionDto);
    return;
  }
}
