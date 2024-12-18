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
import usePostBuy from './model/usePostBuy';
import { useToast } from '../../shared/store/ToastContext';
import usePostSell from './model/usePostSell';
import useGetAvailableAsset from './model/useGetAvailableAsset';
import formatPrice from '../../shared/model/formatPrice';

interface OrderPanelProps {
  tradePrice: string;
  setTradePrice: React.Dispatch<React.SetStateAction<string>>;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ tradePrice, setTradePrice }) => {
  const { addToast } = useToast();
  const { state: authState } = useAuth();
  const { login } = useAuthActions();
  const navigate = useNavigate();
  const [myAsset, setMyAsset] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState('매수');
  const [coinCode, setCoinCode] = useState('KRW');
  const {
    amount,
    setAmount,
    price,
    setPrice,
    updatePriceWithAmount,
    updateAmountWithPrice,
    reset,
  } = useOrderAmount({ tradePrice });
  const { data, refetch } = useGetAvailableAsset({ currencyCode: coinCode });
  const { mutate: orderBuy } = usePostBuy();
  const { mutate: orderSell } = usePostSell();

  useEffect(() => {
    setCoinCode(selectedOrder === '매수' ? 'KRW' : 'BTC');
    reset();

    if (data) {
      login();
      setMyAsset(data.availableBalance);
    }
  }, [data, selectedOrder]);

  useEffect(() => {
    if (coinCode) {
      refetch();
    }
  }, [coinCode]);

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
    if (Number(amount) === 0 || Number(tradePrice) === 0 || Number(price) === 0) {
      addToast('금액이나 수량이 올바르지 않습니다. 다시 확인해 주세요.', 'error');
      return;
    }

    const requestParam = {
      coinCode: 'BTC',
      amount: Number(amount.replace(/,/g, '')),
      price: Number(tradePrice.replace(/,/g, '')),
    };
    if (selectedOrder === '매수') {
      if (myAsset < Number(price.replace(/,/g, ''))) {
        addToast('주문 금액이 보유 금액을 초과했습니다.', 'error');
        return;
      }
      orderBuy(requestParam);
    } else {
      if (myAsset < requestParam.amount) {
        addToast('주문 수량이 보유 수량을 초과했습니다.', 'error');
        return;
      }
      orderSell(requestParam);
    }

    reset();
  };

  const getButtonStyle = (): string => {
    if (!authState.isAuthenticated) {
      return 'bg-surface-alt';
    }
    return selectedOrder === '매수' ? 'bg-positive' : 'bg-negative';
  };

  return (
    <div className="w-[29vw] h-[24rem] border-[1px] bg-surface-default border-border-default">
      <Tab
        selectedCate={selectedOrder}
        setSelectedCate={setSelectedOrder}
        categories={CATEGORY}
        width="w-1/2"
      />
      <div className="pt-8 px-10">
        <SectionBlock title="주문 가능">
          <div className="text-display-bold-16 mr-2">
            {authState.isAuthenticated ? formatPrice(myAsset) : 0}
          </div>
          <div className="available-medium-12 text-text-dark">{coinCode}</div>
        </SectionBlock>
        <SectionBlock title={`${selectedOrder} 가격`} subtitle="KRW">
          <InputNumber coinCode="KRW" amount={tradePrice} setAmount={setTradePrice} />
        </SectionBlock>
        <SectionBlock title="주문 수량" subtitle="BTC">
          <InputNumber
            coinCode="BTC"
            amount={amount}
            setAmount={setAmount}
            updateRelatedValues={updatePriceWithAmount}
          />
        </SectionBlock>
        <SectionBlock title="주문 총액" subtitle="KRW">
          <InputNumber
            coinCode="KRW"
            amount={price}
            setAmount={setPrice}
            updateRelatedValues={updateAmountWithPrice}
          />
        </SectionBlock>

        <div className="w-[100%] flex mt-3 text-display-bold-18 justify-between">
          <Button
            label={authState.isAuthenticated ? '초기화' : '회원가입'}
            styles={`w-[30%] bg-surface-hover-light`}
            onClick={handleSubClick}
          />
          <Button
            label={authState.isAuthenticated ? selectedOrder : '로그인'}
            styles={`w-[68%] ${getButtonStyle()}`}
            onClick={handleMainClick}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
