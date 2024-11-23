import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

describe('TradeController', () => {
  let tradeController: TradeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [TradeService],
    }).compile();

    tradeController = app.get<TradeController>(TradeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradeController.getHello()).toBe('Hello World!');
    });
  });
});
