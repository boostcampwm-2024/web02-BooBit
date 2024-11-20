import { OrderType } from '../model/OrderType';

interface OrderItemProps {
  setOrderPrice: React.Dispatch<React.SetStateAction<string>>;
  orderInfo: OrderType;
}

const OrderItem: React.FC<OrderItemProps> = ({ setOrderPrice, orderInfo }) => {
  const { price, priceChangeRate, amount } = orderInfo;
  const handleClick = () => {
    setOrderPrice(price.toLocaleString());
  };
  return (
    <div
      className="h-[2.125rem] flex justify-between items-center cursor-pointer px-[3rem] border-y-[1px] border-border-default"
      onClick={handleClick}
    >
      <div className="flex gap-[2rem] ">
        <div className="text-display-bold-16">{price.toLocaleString()}</div>
        <div>{priceChangeRate}</div>
      </div>
      <div className="text-text-light">{amount}</div>
    </div>
  );
};

export default OrderItem;
