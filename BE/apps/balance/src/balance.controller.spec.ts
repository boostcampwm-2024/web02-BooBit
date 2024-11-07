import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  let balanceService: BalanceService;

  beforeEach(async () => {
    balanceService = new BalanceService({} as any);
    balanceController = new BalanceController(balanceService);
  });

  describe('자산 목록 조회', () => {
    it('자산 목록 조회에 성공한다.', async () => {
      const mockAssets = [
        {
          currencyCode: 'KRW',
          availableBalance: 100,
          lockedBalance: 50,
          currency: { name: '원화' },
        },
      ];

      balanceService.getAssets = jest.fn().mockResolvedValue(mockAssets);

      const response = await balanceController.getAssets();

      expect(response.assets).toEqual(mockAssets);
      expect(balanceService.getAssets).toHaveBeenCalledWith(1);
    });
  });
});
