interface TitleProps {
  currentPrice?: number;
}

const Title: React.FC<TitleProps> = ({ currentPrice }) => {
  return (
    <div className="w-full h-[5.5rem] flex justify-between items-center px-[2.5rem]">
      <div className="text-display-bold-32">비트코인</div>
      <div className={`text-available-medium-14 text-positive h-[2.25rem]`}>
        <span className="text-display-bold-28">
          {currentPrice ? currentPrice.toLocaleString() : ''}
        </span>
        KRW
      </div>
    </div>
  );
};

export default Title;
