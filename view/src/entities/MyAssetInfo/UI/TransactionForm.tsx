import SubmitButton from '../../../shared/UI/SubmitButton';

const TransactionForm: React.FC<{ type: string }> = ({ type }) => {
  return (
    <div className="w-[100%] h-[17rem] px-[3vw] py-[1.5rem] text-text-dark text-available-midium-16">
      <div className="w-[100%] flex justify-between pb-[1rem]">
        <div>실명 계좌</div>
        <div className="text-text-light">10001212**** 케이뱅크</div>
      </div>
      {type} 금액
      <input
        type="text"
        className="w-[100%] h-[3rem] my-2 px-[1rem] rounded-[5px] border-[1px] border-border-default text-available-medium-16 text-text-light text-right bg-surface-default"
      />
      <SubmitButton
        height="h-[3.5rem]"
        content={`${type} 신청`}
        onClick={() => alert(type)}
      ></SubmitButton>
    </div>
  );
};

export default TransactionForm;
