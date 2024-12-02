import { ChangeEvent } from 'react';

interface InputNumberProps {
  coinCode: string;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  updateRelatedValues?: (value: number) => void;
}

const InputNumber: React.FC<InputNumberProps> = ({
  coinCode,
  amount,
  setAmount,
  updateRelatedValues,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');

    const [intPart, decimalPart] = value.split('.');

    if (
      isNaN(Number(value)) ||
      (coinCode === 'KRW' && value.includes('.')) ||
      (decimalPart && decimalPart.length === 7)
    ) {
      return;
    }

    if (updateRelatedValues) {
      updateRelatedValues(parseFloat(value));
    }

    const newValue =
      Number(intPart).toLocaleString() + (decimalPart !== undefined ? `.${decimalPart}` : '');

    setAmount(newValue);
  };

  return (
    <input
      type="text"
      className="w-[14vw] h-[2.5rem] px-[1rem] rounded border-[1px] border-border-default text-right bg-surface-default"
      value={amount}
      onChange={handleChange}
    />
  );
};

export default InputNumber;
