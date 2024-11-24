interface TitleProps {
  currentPrice?: number;
  hasIncreased: boolean;
}

const Title: React.FC<TitleProps> = ({ currentPrice, hasIncreased }) => {
  return (
    <div className="w-full h-[5.5rem] flex justify-between items-center px-[2.5rem]">
      <div className="text-display-bold-32">비트코인</div>
      <div
        className={`text-available-medium-14 h-[2.25rem] ${hasIncreased ? 'text-positive' : 'text-negative'} `}
      >
        <span className="text-display-bold-28">
          {currentPrice ? currentPrice.toLocaleString() : ''}
        </span>
        KRW
      </div>
    </div>
  );
};

export default Title;
