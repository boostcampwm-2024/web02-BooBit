import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Query,
  Param,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { GetTransactionsDto } from './dto/get.transactions.request.dto';
import { AuthenticatedGuard } from '@app/session/guard/authenticated.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from '@app/grpc/order.interface';
import { AccountService } from '@app/grpc/account.interface';
import { TradeResponseDto } from '@app/grpc/dto/trade.reponse.dto';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';
import { AvailableBalanceResponseDto } from './dto/available.balance.response.dto';
import { TradeRequestListDto } from '@app/grpc/dto/trade.request.list.dto';

@Controller('api/users')
export class BalanceController implements OrderService, AccountService {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/orderHistory')
  @UseGuards(AuthenticatedGuard)
  async getOrdersHistory(@Request() req, @Query('id') lastId?: number) {
    const userId = req.user.userId;
    return await this.balanceService.getOrdersHistory(userId, lastId);
  }

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

  @Get('/transactions')
  @UseGuards(AuthenticatedGuard)
  async getTransactions(@Query() getTransactionsDto: GetTransactionsDto, @Request() req) {
    const userId = req.user.userId;
    return await this.balanceService.getTransactions(userId, getTransactionsDto);
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

  @GrpcMethod('TradeService', 'SettleTransaction')
  async settleTransaction(tradeRequests: TradeRequestListDto): Promise<TradeResponseDto> {
    return await this.balanceService.settleTransaction(tradeRequests);
  }

  @GrpcMethod('TradeService', 'CancelOrder')
  async cancelOrder(cancelRequest: TradeCancelRequestDto): Promise<TradeResponseDto> {
    return await this.balanceService.cancelOrder(cancelRequest);
  }

  @Get('available/:currencyCode')
  @UseGuards(AuthenticatedGuard)
  async getAvailableBalance(
    @Param('currencyCode') currencyCode: string,
    @Request() req,
  ): Promise<AvailableBalanceResponseDto> {
    const userId = req.user.userId;
    return this.balanceService.getAvailableBalance(userId, currencyCode);
  }
}
