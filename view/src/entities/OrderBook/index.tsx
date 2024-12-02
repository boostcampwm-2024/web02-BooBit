import { OrderType } from '../../shared/types/socket/OrderType';
import OrderItem from './UI/OrderItem';

interface OrderBookProps {
  currentPrice?: number;
  hasIncreased: boolean;
  setOrderPrice: React.Dispatch<React.SetStateAction<string>>;
  orderBook?: {
    sell: OrderType[];
    buy: OrderType[];
  };
}

const OrderBook: React.FC<OrderBookProps> = ({
  currentPrice,
  hasIncreased,
  setOrderPrice,
  orderBook,
}) => {
  return (
    <div className="w-[26vw] h-[24rem] relative border-[1px] bg-surface-default border-border-default">
      <div className="w-full text-negative absolute bottom-[212px]">
        {orderBook &&
          orderBook.sell.map((o, i) => {
            return (
              <OrderItem key={i.toString() + o.price} setOrderPrice={setOrderPrice} orderInfo={o} />
            );
          })}
      </div>

      <div
        className={`w-full h-[2.75rem] absolute top-[170px] flex items-center px-[3rem] border-y-[1px] border-border-default text-display-bold-24 ${hasIncreased ? 'text-positive' : 'text-negative'}`}
      >
        {currentPrice && currentPrice.toLocaleString()}
      </div>

      <div className="w-full text-positive absolute top-[214px]">
        {orderBook &&
          orderBook.buy.map((o, i) => {
            return (
              <OrderItem key={i.toString() + o.price} setOrderPrice={setOrderPrice} orderInfo={o} />
            );
          })}
      </div>
    </div>
  );
};

export default OrderBook;
