import React, { useEffect, useState } from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';
import Tab from '../../shared/UI/Tab';
import TransactionForm from './UI/TransactionForm';

import useDeposit from './model/useDeposit';
import { AssetType } from './model/AssetType';
import useWithdraw from './model/useWithdraw';

import CATEGORY from './consts/category';
import TransactionLogs from './UI/TransactionLogs';

const MyAssetInfo: React.FC<AssetType> = ({ currencyCode, amount }) => {
  const [selectedCate, setSelectedCate] = useState('내역');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState(false);
  const { mutate: deposit } = useDeposit();
  const { mutate: withdraw } = useWithdraw();

  const handleDeposit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const amount = Number(depositAmount.replace(/,/g, ''));
    if (amount === 0) return;
    setDepositAmount('');
    deposit({ currencyCode, amount });
  };

  const handleWithdraw = () => {
    const withdrawAmountToNum = Number(withdrawAmount.replace(/,/g, ''));
    if (withdrawAmountToNum === 0) return;
    if (withdrawAmountToNum > amount) {
      setWithdrawError(true);
      return;
    }
    setWithdrawError(false);
    setWithdrawAmount('');
    withdraw({ currencyCode, amount: withdrawAmountToNum });
  };

  useEffect(() => {
    setWithdrawAmount('');
    setDepositAmount('');
    setWithdrawError(false);
  }, [currencyCode, selectedCate]);

  return (
    <BoxContainer>
      <Title currency_code={currencyCode} amount={amount} />
      <Tab selectedCate={selectedCate} setSelectedCate={setSelectedCate} categories={CATEGORY} />
      {selectedCate === '내역' && <TransactionLogs currencyCode={currencyCode} />}
      {selectedCate === '입금' && (
        <TransactionForm
          currencyCode={currencyCode}
          type="입금"
          handleSubmit={handleDeposit}
          amount={depositAmount}
          setAmount={setDepositAmount}
        />
      )}
      {selectedCate === '출금' && (
        <TransactionForm
          currencyCode={currencyCode}
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
