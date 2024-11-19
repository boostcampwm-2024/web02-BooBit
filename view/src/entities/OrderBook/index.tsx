import { OrderType } from './model/OrderType';
import OrderItem from './UI/OrderItem';

interface OrderBookProps {
  priceChangeRate: number;
  setOrderPrice: React.Dispatch<React.SetStateAction<string>>;
  orderBook: {
    currentPrice: number;
    sell: OrderType[];
    buy: OrderType[];
  };
}

const OrderBook: React.FC<OrderBookProps> = ({ priceChangeRate, setOrderPrice, orderBook }) => {
  return (
    <div className="w-[31rem] h-[24rem] relative border-[1px] bg-surface-default border-border-default">
      <div className="w-full text-positive absolute bottom-[212px]">
        {orderBook.sell &&
          orderBook.sell.map((o) => {
            return <OrderItem key={o.price} setOrderPrice={setOrderPrice} orderInfo={o} />;
          })}
      </div>

      <div
        className={`w-full h-[2.75rem] absolute top-[170px] flex items-center px-[3rem] border-y-[1px] border-border-default text-display-bold-24 ${priceChangeRate > 0 ? 'text-positive' : 'text-negative'}`}
      >
        {orderBook.currentPrice.toLocaleString()}
      </div>

      <div className="w-full text-negative absolute top-[214px]">
        {orderBook.buy &&
          orderBook.buy.map((o) => {
            return <OrderItem key={o.price} setOrderPrice={setOrderPrice} orderInfo={o} />;
          })}
      </div>
    </div>
  );
};

export default OrderBook;
