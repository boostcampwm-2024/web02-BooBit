import { useState } from 'react';

interface UseOrderAmountProps {
  tradePrice: string;
}

const useOrderAmount = ({ tradePrice }: UseOrderAmountProps) => {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const updatePriceWithAmount = (value: number) => {
    const tradePriceToNum = Number(tradePrice.replace(/,/g, ''));

    const result = (value * tradePriceToNum).toLocaleString();
    setPrice(result);
  };

  const updateAmountWithPrice = (value: number) => {
    const tradePriceToNum = Number(tradePrice.replace(/,/g, ''));

    const result = (value / tradePriceToNum).toFixed(6).toLocaleString();
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
