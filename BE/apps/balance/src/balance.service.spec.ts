import { BalanceService } from './balance.service';
import { BalanceRepository } from './balance.repository';
import { AssetDto } from './dto/asset.dto';
import { BalanceException } from './exception/balance.exception';
import { BALANCE_EXCEPTIONS } from './exception/balance.exceptions';
import Decimal from 'decimal.js';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let balanceRepository: BalanceRepository;

  beforeEach(async () => {
    balanceRepository = new BalanceRepository({} as any);
    balanceService = new BalanceService(balanceRepository);
  });

  describe('자산 목록 조회', () => {
    it('자산 목록 조회에 성공한다.', async () => {
      const mockAssets = [
        {
          currency_code: 'KRW',
          available_balance: new Decimal(100),
          locked_balance: new Decimal(50),
          currency: { name: '원화' },
        },
        {
          currency_code: 'BTC',
          available_balance: new Decimal(200),
          locked_balance: new Decimal(30),
          currency: { name: '비트코인' },
        },
      ];
      balanceRepository.getAssets = jest.fn().mockResolvedValue(mockAssets);

      const result = await balanceService.getAssets(1);

      expect(result).toEqual([
        new AssetDto('KRW', '원화', new Decimal(100), new Decimal(50)),
        new AssetDto('BTC', '비트코인', new Decimal(200), new Decimal(30)),
      ]);
      expect(balanceRepository.getAssets).toHaveBeenCalledWith(1);
    });

    it('자산 목록이 없으면 BalanceException이 발생한다.', async () => {
      balanceRepository.getAssets = jest.fn().mockResolvedValue([]);

      await expect(balanceService.getAssets(1)).rejects.toThrow(BalanceException);
      await expect(balanceService.getAssets(1)).rejects.toThrow(
        BALANCE_EXCEPTIONS.USER_ASSETS_NOT_FOUND.message,
      );
      expect(balanceRepository.getAssets).toHaveBeenCalledWith(1);
    });
  });
});
