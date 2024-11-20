import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthenticatedGuard } from '@app/session/guard/authenticated.guard';
import { OrderLimitRequestDto } from './dto/order.limit.request.dto';
import { TransactionOrderService } from './transaction.order.service';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';

@Controller('api/orders')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionOrderService: TransactionOrderService,
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
    return await this.transactionService.registerBuyOrder(orderRequest, response);
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
    return await this.transactionService.registerSellOrder(orderRequest, response);
  }
}
