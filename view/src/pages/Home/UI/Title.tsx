import up from '../../../shared/images/up.svg';
import down from '../../../shared/images/down.svg';
import formatPrice from '../../../shared/model/formatPrice';
import calculateChangeRate from '../../../shared/model/calculateChangeRate';

interface TitleProps {
  currentPrice: number;
  lastDayClose: number;
}

const Title: React.FC<TitleProps> = ({ currentPrice, lastDayClose }) => {
  return (
    <div className="w-full h-[5.5rem] flex justify-between items-center px-[2.5rem]">
      <div className="text-display-bold-32">비트코인</div>
      <div
        className={`text-available-medium-14 h-[3.75rem] ${currentPrice > lastDayClose ? 'text-positive' : 'text-negative'} `}
      >
        <div className="mb-[-6px]">
          <span className="text-display-bold-28">
            {currentPrice ? formatPrice(currentPrice) : ''}
          </span>
          KRW
        </div>

        <div className="flex ml-[2px]">
          {calculateChangeRate(currentPrice, lastDayClose)}
          <img
            src={`${currentPrice > lastDayClose ? up : down}`}
            alt="mark"
            height={14}
            width={14}
            style={{ marginLeft: '0.5rem' }}
          />
          {formatPrice(currentPrice - lastDayClose)}
        </div>
      </div>
    </div>
  );
};

export default Title;
