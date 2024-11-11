import { ChangeEvent } from 'react';
import SubmitButton from '../../../shared/UI/SubmitButton';

interface TransactionFormProps {
  type: string;
  amount: string;
  handleSubmit: () => void;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  isError?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  amount,
  handleSubmit,
  setAmount,
  isError = false,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      return;
    }

    setAmount(value);
  };

  return (
    <div className="w-[100%] h-[17rem] px-[3vw] py-[1.5rem] text-text-dark text-available-midium-16">
      <div className="w-[100%] flex justify-between pb-[1rem]">
        <div>실명 계좌</div>
        <div className="text-text-light">10001212**** 케이뱅크</div>
      </div>
      {type} 금액
      <input
        type="text"
        className="w-[100%] h-[3rem] my-1 px-[1rem] rounded-[5px] border-[1px] border-border-default text-available-medium-16 text-text-light text-right bg-surface-default"
        value={amount}
        onChange={handleChange}
      />
      {isError && (
        <label className="text-negative text-available-medium-14">
          출금 가능 금액을 초과했습니다. 보유 금액을 확인해주세요.
        </label>
      )}
      <SubmitButton
        height="h-[3.5rem]"
        content={`${type} 신청`}
        onClick={handleSubmit}
      ></SubmitButton>
    </div>
  );
};

export default TransactionForm;
