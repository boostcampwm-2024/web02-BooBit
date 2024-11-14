import React, { useEffect, useState } from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';
import Tab from './UI/Tab';
import TransactionForm from './UI/TransactionForm';
import assetHistory from './consts/historyMockData';
import TransactionLogItem from './UI/TransactionLogItem';
import useDeposit from './model/useDeposit';

type MyAssetInfoProps = {
  currency_code: string;
  amount: number;
};

const MyAssetInfo: React.FC<MyAssetInfoProps> = ({ currency_code, amount }) => {
  const [selectedCate, setSelectedCate] = useState('내역');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState(false);
  const { mutate } = useDeposit();

  const handleDeposit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (amount === 0) return;
    mutate({ currencyCode: currency_code, amount });
  };

  const handleWithdraw = () => {
    if (Number(withdrawAmount) === 0) return;
    if (Number(withdrawAmount) > amount) {
      setWithdrawError(true);
      return;
    }
    alert(`{
	"currency_code": ${currency_code},
	"amount": ${withdrawAmount}
}`);
  };

  useEffect(() => {
    setWithdrawAmount('');
    setDepositAmount('');
    setWithdrawError(false);
  }, [selectedCate]);

  return (
    <BoxContainer>
      <Title currency_code={currency_code} amount={amount} />
      <Tab selectedCate={selectedCate} setSelectedCate={setSelectedCate} />
      {selectedCate === '내역' && (
        <ul className="w-[100%] h-[17rem] px-[3vw] overflow-y-auto">
          {assetHistory.transactions.map((log) => (
            <TransactionLogItem key={log.timestamp} log={log} currency_code={currency_code} />
          ))}
        </ul>
      )}
      {selectedCate === '입금' && (
        <TransactionForm
          type="입금"
          handleSubmit={handleDeposit}
          amount={depositAmount}
          setAmount={setDepositAmount}
        />
      )}
      {selectedCate === '출금' && (
        <TransactionForm
          type="출금"
          handleSubmit={handleWithdraw}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          isError={withdrawError}
        />
      )}
    </BoxContainer>
  );
};

export default MyAssetInfo;
