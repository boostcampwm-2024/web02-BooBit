import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tab from '../../shared/UI/Tab';
import SectionBlock from './UI/SectionBlock';
import InputNumber from './UI/InputNumber';
import Button from './UI/Button';

import CATEGORY from './const/orderCategory';
import { useAuth } from '../../shared/store/auth/authContext';
import { useAuthActions } from '../../shared/store/auth/authActions';
import useOrderAmount from './model/useOrderAmount';
import useGetAssets from '../../shared/model/useGetAssets';
import usePostBuy from './model/usePostBuy';

interface OrderPanelProps {
  tradePrice: string;
  setTradePrice: React.Dispatch<React.SetStateAction<string>>;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ tradePrice, setTradePrice }) => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [myAsset, setMyAsset] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState('매수');
  const [coinCode, setCoinCode] = useState('KRW');
  const { data } = useGetAssets();
  const { login } = useAuthActions();
  const {
    amount,
    setAmount,
    price,
    setPrice,
    updatePriceWithAmount,
    updateAmountWithPrice,
    reset,
  } = useOrderAmount({ tradePrice });
  const { mutate: orderBuy } = usePostBuy();

  useEffect(() => {
    setCoinCode(selectedOrder === '매수' ? 'KRW' : 'BTC');
    reset();

    if (data) {
      login();
      if (selectedOrder === '매수') {
        setMyAsset(data[1] ? data[1].amount : 0);
      } else {
        setMyAsset(data[0] ? data[0].amount : 0);
      }
    }
  }, [data, selectedOrder]);

  const handleSubClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (!authState.isAuthenticated) navigate('/signup');
    else reset();
  };

  const handleMainClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (!authState.isAuthenticated) {
      navigate('/signin');
      return;
    }

    const requestParam = { coinCode: selectedOrder, amount: Number(amount), price: Number(price) };
    if (selectedOrder === '매수') orderBuy(requestParam);

    reset();
  };

  const getButtonStyle = (): string => {
    if (!authState.isAuthenticated) {
      return 'bg-surface-alt';
    }
    return selectedOrder === '매수' ? 'bg-positive' : 'bg-negative';
  };

  return (
    <div className="w-[35rem] h-[24rem] border-[1px] bg-surface-default border-border-default">
      <Tab
        selectedCate={selectedOrder}
        setSelectedCate={setSelectedOrder}
        categories={CATEGORY}
        width="w-1/2"
      />
      <div className="pt-8 px-10">
        <SectionBlock title="주문 가능">
          <div className="text-display-bold-16 mr-2">{authState.isAuthenticated ? myAsset : 0}</div>
          <div className="available-medium-12 text-text-dark">{coinCode}</div>
        </SectionBlock>
        <SectionBlock title={`${selectedOrder} 가격`} subtitle="KRW">
          <InputNumber amount={tradePrice} setAmount={setTradePrice} />
        </SectionBlock>
        <SectionBlock title="주문 수량" subtitle="BTC">
          <InputNumber
            amount={amount}
            setAmount={setAmount}
            updateRelatedValues={updatePriceWithAmount}
          />
        </SectionBlock>
        <SectionBlock title="주문 총액" subtitle="KRW">
          <InputNumber
            amount={price}
            setAmount={setPrice}
            updateRelatedValues={updateAmountWithPrice}
          />
        </SectionBlock>

        <div className="w-[100%] flex mt-3 text-display-bold-18 justify-between">
          <Button
            label={authState.isAuthenticated ? '초기화' : '회원가입'}
            styles={`basis-44 bg-surface-hover-light`}
            onClick={handleSubClick}
          />
          <Button
            label={authState.isAuthenticated ? selectedOrder : '로그인'}
            styles={`basis-72 ${getButtonStyle()}`}
            onClick={handleMainClick}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
