import React from 'react';

const Title: React.FC<{
  currency_code: string;
  amount: number;
}> = ({ currency_code, amount }) => {
  return (
    <div className="mx-9 my-5 text-display-bold-20">
      {currency_code}
      <div className="w-[19vw] flex justify-between mt-2 text-available-medium-16">
        <div>총 소유</div>
        <div className="flex">
          <div className="flex text-display-bold-16 mr-2">{amount.toLocaleString()} </div>
          <div>{currency_code}</div>
        </div>
      </div>
    </div>
  );
};

export default Title;
