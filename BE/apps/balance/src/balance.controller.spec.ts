import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceController', () => {
  let balanceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(balanceController.getHello()).toBe('Hello World!');
    });
  });
});
