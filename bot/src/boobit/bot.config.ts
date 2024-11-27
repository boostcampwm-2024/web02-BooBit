export enum ActionType {
  BUY = 'buy',
  SELL = 'sell',
  ALL = 'all',
}

export class BotConfig {
  constructor(
    public getPriceInterval: number = 1000,
    public actionInterval: number = 300,
    public actionType: string = ActionType.ALL,
    public minPercent: number = 0.5,
    public maxPercent: number = 0.5,
    public minAmount: number = 0.001,
    public maxAmount: number = 1,
    public count: number = 100,
  ) {
    this.getPriceInterval = validateNumber(getPriceInterval, 1000, 1000 * 60 * 60);
    this.actionInterval = validateNumber(actionInterval, 100, 1000 * 60 * 60);
    this.actionType = validateActionType(actionType);
    this.minPercent = validateNumber(minPercent, 0.1, 5);
    this.maxPercent = validateNumber(maxPercent, 0.1, 5);
    this.minAmount = validateNumber(minAmount, 0.001, 0.5);
    this.maxAmount = validateNumber(maxAmount, this.minAmount, 1);
    this.count = count;
  }
  generateRandomAmount(): number {
    return Number((this.minAmount + Math.random() * (this.maxAmount - this.minAmount)).toFixed(3));
  }

  generateRandomPrice(currentPrice: number): number {
    const lowerPercent = -this.minPercent;
    const upperPercent = this.maxPercent;
    const randomPercent = lowerPercent + Math.random() * (upperPercent - lowerPercent);
    const price = Math.floor(currentPrice * (1 + randomPercent / 100));

    return price - (price % 500);
  }
  getActionType(): 'buy' | 'sell' {
    if (this.actionType === ActionType.ALL) {
      return Math.random() < 0.5 ? 'buy' : 'sell';
    }
    return this.actionType as 'buy' | 'sell';
  }
}
function validateNumber(value: number, min: number = 0, max: number = 0): number {
  const num = value;
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
