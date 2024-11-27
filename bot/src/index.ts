import { TradingBot } from './boobit/boobit.bot';
import { CurrencyCode } from './boobit/currency.code';
import { OrderLimitRequestDto } from './boobit/order.limit.request.dto';
import { getConfig } from './utils/config.setting.client';
import { getBitcoinPrice } from './upbit/upbit.index';
import { ActionType, BotConfig } from './boobit/bot.config';
import { getArgs } from './utils/config.setting.argv';
let price: number;
let orderRequest: OrderLimitRequestDto;
let count = 0;
const trader = new TradingBot();
const intervalList: NodeJS.Timeout[] = [];
async function main() {
  const argv = await getArgs();
  const config = argv.client
    ? await getConfig()
    : new BotConfig(
        argv.cpi,
        argv.ai,
        argv.at,
        argv.minp,
        argv.maxp,
        argv.mina,
        argv.maxa,
        argv.count,
      );

  price = await getBitcoinPrice();
  orderRequest = new OrderLimitRequestDto(CurrencyCode.BTC, 0.1, price);

  await trader.initialize();

  intervalList.push(registerGetPrice(config));
  intervalList.push(registerOrder(config));
}

function registerGetPrice(config: BotConfig) {
  return setInterval(async () => {
    try {
      price = await getBitcoinPrice();
      orderRequest = new OrderLimitRequestDto(CurrencyCode.BTC, 0.1, price);
    } catch (error) {
      console.error('Error getting price:', error);
    }
  }, config.getPriceInterval);
}

function registerOrder(config: BotConfig) {
  return setInterval(async () => {
    const orderRequest = new OrderLimitRequestDto(
      CurrencyCode.BTC,
      config.generateRandomAmount(),
      config.generateRandomPrice(price),
    );
    try {
      if (config.getActionType() === 'buy') {
        await trader.placeBuyOrder(orderRequest);
      } else {
        await trader.placeSellOrder(orderRequest);
      }
      if (config.count < 0 || count++ >= config.count) {
        await trader.logout();
        intervalList.forEach((interval) => clearInterval(interval));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`[${error.name}] ${error.message}`);
        intervalList.forEach((interval) => clearInterval(interval));
      }
    }
  }, config.actionInterval);
}

main();
