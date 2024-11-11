import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { CurrencyCode, CurrencyCodeName } from '@app/common';

describe('BalanceController', () => {
  let controller: BalanceController;
  let service: BalanceService;

  const mockBalanceService = {
    getAssets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceController,
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
    service = module.get<BalanceService>(BalanceService);
    jest.clearAllMocks();
  });

  describe('자산 목록 조회', () => {
    it('자산 목록 조회에 성공한다.', async () => {
      const mockAssets = [
        {
          currencyCode: CurrencyCode.KRW,
          name: CurrencyCodeName[CurrencyCode.KRW],
          amount: 150,
        },
      ];

      service.getAssets = jest.fn().mockResolvedValue(mockAssets);

      const response = await controller.getAssets();

      expect(response.assets).toEqual(mockAssets);
    });
  });
});
