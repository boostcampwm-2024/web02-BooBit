import readline from 'readline';
import { ActionType, BotConfig } from '../boobit/bot.config';

export async function getConfig() {
  const program = new ConfigSettingCLI();
  return await program.getConfig();
}

class ConfigSettingCLI {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  async getConfig() {
    const config = new BotConfig();
    console.log('봇 설정을 시작합니다. 각 항목을 입력해주세요:');

    try {
      // getPriceInterval 입력
      const getPriceIntervalStr = await this.question('가격 조회 간격(ms) [기본값: 1000]: ');
      if (getPriceIntervalStr.trim()) {
        config.getPriceInterval = validateNumber(getPriceIntervalStr, 1000, 1000 * 60 * 60);
      }

      // actionInterval 입력
      const actionIntervalStr = await this.question('액션 실행 간격(ms) [기본값: 300]: ');
      if (actionIntervalStr.trim()) {
        config.actionInterval = validateNumber(actionIntervalStr, 100, 1000 * 60 * 60);
      }

      // actionType 입력
      const actionTypeStr = await this.question('액션 타입(buy/sell/all) [기본값: all]: ');
      if (actionTypeStr.trim()) {
        config.actionType = validateActionType(actionTypeStr);
      }

      // minPercent 입력
      const minPercentStr = await this.question('최소 퍼센트(%) [기본값: 0.5]: ');
      if (minPercentStr.trim()) {
        config.minPercent = validateNumber(minPercentStr, 0.1, 5);
      }

      // maxPercent 입력
      const maxPercentStr = await this.question('최대 퍼센트(%) [기본값: 0.5]: ');
      if (maxPercentStr.trim()) {
        config.maxPercent = validateNumber(maxPercentStr, 0.1, 5);
      }

      // minAmount 입력
      const minAmountStr = await this.question('최소 수량 [기본값: 0.001]: ');
      if (minAmountStr.trim()) {
        config.minAmount = validateNumber(minAmountStr, 0.001, 0.5);
      }

      // maxAmount 입력
      const maxAmountStr = await this.question('최대 수량 [기본값: 1]: ');
      if (maxAmountStr.trim()) {
        config.maxAmount = validateNumber(maxAmountStr, config.minAmount, 1);
      }

      // count 입력
      const countStr = await this.question('최대 반복 횟수 [기본값: 100]: ');
      if (countStr.trim()) {
        config.count = validateNumber(countStr, -1, Infinity);
      }
    } catch (error) {
      console.error('오류가 발생했습니다:', (error as Error).message);
    } finally {
      this.rl.close();
    }
    return config;
  }
}
function validateNumber(value: string = '', min: number = 0, max: number = 0): number {
  const num = parseFloat(value);
  if (isNaN(num) || num < min) {
    throw new Error(`유효하지 않은 숫자입니다. ${min} 이상 ${max} 이하의 숫자를 입력해주세요.`);
  }
  return num;
}

function validateActionType(value: string = ''): ActionType {
  const type = value.toLowerCase();
  if (!Object.values(ActionType).includes(type as ActionType)) {
    throw new Error('유효하지 않은 액션 타입입니다. buy, sell, all 중 하나를 입력해주세요.');
  }
  return type as ActionType;
}
