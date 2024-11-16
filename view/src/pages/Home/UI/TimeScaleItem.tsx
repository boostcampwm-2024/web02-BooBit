import { ChartTimeScaleType } from '../../../shared/types/ChartTimeScaleType';

type TimeScaleType = {
  value: ChartTimeScaleType;
  label: string;
  rightBorder: boolean;
  selectedTimeScale: ChartTimeScaleType;
  setSelectedTimeScale: React.Dispatch<React.SetStateAction<ChartTimeScaleType>>;
};

const TimeScaleItem: React.FC<TimeScaleType> = ({
  value,
  label,
  rightBorder,
  selectedTimeScale,
  setSelectedTimeScale,
}) => {
  const handelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedTimeScale(value);
  };
  return (
    <button
      className={`w-[3.75rem] h-[1.5rem] ${selectedTimeScale === value ? 'text-display-bold-16' : 'text-available-medium-12'} ${rightBorder ? 'border-r-[1px] border-text-light' : ''}`}
      disabled={selectedTimeScale === value}
      onClick={handelClick}
    >
      {label}
    </button>
  );
};

export default TimeScaleItem;
