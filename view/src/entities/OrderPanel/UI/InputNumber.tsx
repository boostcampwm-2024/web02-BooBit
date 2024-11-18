import { ChangeEvent } from 'react';

interface InputNumberProps {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  updateRelatedValues?: (value: number) => void;
}

const InputNumber: React.FC<InputNumberProps> = ({
  amount,
  setAmount,
  updateRelatedValues,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/,/g, ''));

    if (isNaN(value)) return;

    if (updateRelatedValues) {
      updateRelatedValues(value);
    }

    setAmount(value.toLocaleString());
  };

  return (
    <input
      type="text"
      className="w-[100%] h-[2.75rem] px-[1rem] rounded border-[1px] border-border-default text-right bg-surface-default"
      value={amount}
      onChange={handleChange}
    />
  );
};

export default InputNumber;
