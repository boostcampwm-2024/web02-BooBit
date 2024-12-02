import formatPrice from './formatPrice';

const calculateChangeRate = (currentPrice: number, prevClosePrice: number) => {
  const adjustedPrevClosePrice = prevClosePrice === 0 ? 1 : prevClosePrice;
  const changeRate = ((currentPrice - prevClosePrice) / adjustedPrevClosePrice) * 100;
  return `${formatPrice(Number(changeRate.toFixed(2)))}%`;
};

export default calculateChangeRate;
