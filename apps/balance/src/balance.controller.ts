import { Body, Controller, Get, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { AuthenticatedGuard } from '@app/session/guard/authenticated.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from '@app/grpc/order.interface';
import { AccountService } from '@app/grpc/account.interface';

@Controller('api/users')
export class BalanceController implements OrderService, AccountService {
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
  }

  @Post('/withdraw')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async withdraw(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    const userId = req.user.userId;
    await this.balanceService.withdraw(userId, createTransactionDto);
  }
  @GrpcMethod('OrderService', 'MakeBuyOrder')
  async makeBuyOrder(orderRequest) {
    return await this.balanceService.makeBuyOrder(orderRequest);
  }

  @GrpcMethod('OrderService', 'MakeSellOrder')
  async makeSellOrder(orderRequest) {
    return await this.balanceService.makeSellOrder(orderRequest);
  }

  @GrpcMethod('AccountService', 'CreateAccount')
  async createAccount(accountRequest) {
    return await this.balanceService.createAccount(accountRequest);
  }
}
