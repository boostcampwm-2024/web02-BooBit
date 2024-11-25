import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthenticatedGuard } from '@app/session/guard/authenticated.guard';
import { OrderLimitRequestDto } from './dto/order.limit.request.dto';
import { TransactionOrderService } from './transaction.order.service';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderType } from '@app/common/enums/order-type.enum';
import { TransactionQueueService } from './transaction.queue.service';

@Controller('api/orders')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionOrderService: TransactionOrderService,
    private readonly transactionQueueService: TransactionQueueService,
  ) {}

  @Post('/limit/buy')
  @UseGuards(AuthenticatedGuard)
  async buyLimitOrder(@Request() req, @Body() buyLimitRequest: OrderLimitRequestDto) {
    const userId = req.user.userId;
    const orderRequest = new OrderRequestDto(
      userId,
      buyLimitRequest.coinCode,
      buyLimitRequest.amount,
      buyLimitRequest.price,
    );
    const response = await this.transactionOrderService.makeBuyOrder(orderRequest);

    await this.transactionService.registerBuyOrder(orderRequest, response);
    return await this.transactionQueueService.addQueue(OrderType.BUY, response.historyId);
  }

  @Post('/limit/sell')
  @UseGuards(AuthenticatedGuard)
  async sellLimitOrder(@Request() req, @Body() sellLimitRequest: OrderLimitRequestDto) {
    const userId = req.user.userId;
    const orderRequest = new OrderRequestDto(
      userId,
      sellLimitRequest.coinCode,
      sellLimitRequest.amount,
      sellLimitRequest.price,
    );
    const response = await this.transactionOrderService.makeSellOrder(orderRequest);

    await this.transactionService.registerSellOrder(orderRequest, response);
    return await this.transactionQueueService.addQueue(OrderType.SELL, response.historyId);
  }

  @Delete('/:historyId')
  @UseGuards(AuthenticatedGuard)
  async cancelOrder(
    @Request() req,
    @Param('historyId') historyId: string,
    @Query('orderType') orderType: OrderType,
  ) {
    const userId = req.user.userId;
    console.log(orderType);
    await this.transactionService.validateOrderOwnership(userId, historyId, orderType);
    return await this.transactionQueueService.addCancelQueue(userId, historyId, orderType);
  }

  @Get('/pending')
  @UseGuards(AuthenticatedGuard)
  async getPending(@Request() req) {
    const userId = req.user.userId;
    return await this.transactionService.getPending(userId);
  }
}
