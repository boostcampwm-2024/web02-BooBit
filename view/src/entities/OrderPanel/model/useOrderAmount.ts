import { useState } from 'react';
import formatPrice from '../../../shared/model/formatPrice';

interface UseOrderAmountProps {
  tradePrice: string;
}

const useOrderAmount = ({ tradePrice }: UseOrderAmountProps) => {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const updatePriceWithAmount = (value: number) => {
    if (isNaN(value)) {
      setPrice('');
      return;
    }
    const tradePriceToNum = Number(tradePrice.replace(/,/g, ''));

    const result = formatPrice(Math.floor(value * tradePriceToNum));
    setPrice(result);
  };

  const updateAmountWithPrice = (value: number) => {
    if (isNaN(value)) {
      setAmount('');
      return;
    }
    const tradePriceToNum = Number(tradePrice.replace(/,/g, ''));

    const result = formatPrice((value / tradePriceToNum).toFixed(6));
    setAmount(result);
  };

  const reset = () => {
    setAmount('');
    setPrice('');
  };

  return {
    amount,
    setAmount,
    price,
    setPrice,
    updatePriceWithAmount,
    updateAmountWithPrice,
    reset,
  };
};

export default useOrderAmount;
