import up from '../../../shared/images/up.svg';
import down from '../../../shared/images/down.svg';

interface TitleProps {
  currentPrice: { price: number; priceChangeAmount: number; priceChangeRate: number };
}

const Title: React.FC<TitleProps> = ({ currentPrice }) => {
  return (
    <div className="w-full h-[5.5rem] flex justify-between items-center px-[2.5rem]">
      <div className="text-display-bold-32">비트코인</div>
      <div
        className={`text-available-medium-14 ${currentPrice.priceChangeAmount > 0 ? 'text-positive' : 'text-negative'}`}
      >
        <div className="h-[2.25rem]">
          <span className="text-display-bold-28">{currentPrice.price.toLocaleString()}</span>
          KRW
        </div>
        <div className="flex">
          {currentPrice.priceChangeRate}%
          <img
            src={`${currentPrice.priceChangeAmount > 0 ? up : down}`}
            alt="mark"
            height={14}
            width={14}
            style={{ marginLeft: '0.5rem' }}
          />
          {currentPrice.priceChangeAmount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Title;
