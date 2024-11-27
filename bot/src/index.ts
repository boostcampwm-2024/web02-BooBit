import { TradingBot } from './boobit/boobit.bot';
import { CurrencyCode } from './boobit/currency.code';
import { OrderLimitRequestDto } from './boobit/order.limit.request.dto';
import { getConfig } from './utils/config.setting.client';
import { getBoobitPrice, getUpbitPrice } from './upbit/upbit.index';
import { ActionType, BotConfig } from './boobit/bot.config';
import { getArgs } from './utils/config.setting.argv';
let upbitPrice: number = -1;
let boobitPrice: number = -1;
let count = 0;
const trader = new TradingBot();
const intervalList: NodeJS.Timeout[] = [];

async function main() {
  const config = await setConfig(await getArgs());
  console.log(config);

  await trader.initialize();

  start(config);
}

function registerGetPrice(config: BotConfig) {
  return setInterval(async () => {
    try {
      if (config.actionType === ActionType.AUTO) {
        [boobitPrice, upbitPrice] = await Promise.all([getBoobitPrice(), getUpbitPrice()]);
      } else {
        upbitPrice = await getUpbitPrice();
      }
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
      config.generateRandomPrice(upbitPrice),
    );
    try {
      const type =
        config.actionType === ActionType.AUTO
          ? boobitPrice <= upbitPrice
            ? ActionType.BUY
            : ActionType.SELL
          : config.getActionType();
      if (config.actionType === ActionType.AUTO) {
        if (boobitPrice <= upbitPrice) await trader.placeBuyOrder(orderRequest);
        else await trader.placeSellOrder(orderRequest);
      } else {
        if (type === ActionType.BUY) await trader.placeBuyOrder(orderRequest);
        else await trader.placeSellOrder(orderRequest);
      }
      if (count++ >= config.count && !(config.count < 0)) {
        await trader.logout();
        intervalList.forEach((interval) => clearInterval(interval));
      } else {
        console.log(`[${count}] [${type}] ${orderRequest}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`[${error.name}] ${error.message}`);
        intervalList.forEach((interval) => clearInterval(interval));
      }
    }
  }, config.actionInterval);
}

function start(config: BotConfig) {
  intervalList.push(registerGetPrice(config));

  const id = setInterval(() => {
    if (upbitPrice > 0) {
      intervalList.push(registerOrder(config));
      clearInterval(id);
    }
  }, 500);
}

async function setConfig(argv: any) {
  return argv.client
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
}

main();
