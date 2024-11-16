import { ChartTimeScaleType } from '../../../shared/types/ChartTimeScaleType';
import TimeScaleItem from './TimeScaleItem';

const timeScaleOptions: Array<{
  value: ChartTimeScaleType;
  label: string;
  rightBorder: boolean;
}> = [
  { value: '1s', label: '초', rightBorder: true },
  { value: '1m', label: '1분', rightBorder: false },
  { value: '10m', label: '10분', rightBorder: false },
  { value: '30m', label: '30분', rightBorder: true },
  { value: '1h', label: '시간', rightBorder: true },
  { value: '1d', label: '일', rightBorder: true },
  { value: '1w', label: '주', rightBorder: true },
  { value: '1M', label: '월', rightBorder: false },
];

const TimeScaleSelector: React.FC<{
  selectedTimeScale: ChartTimeScaleType;
  setSelectedTimeScale: React.Dispatch<React.SetStateAction<ChartTimeScaleType>>;
}> = ({ selectedTimeScale, setSelectedTimeScale }) => {
  return (
    <div className="w-[100%] h-[2.625rem] px-[2.5rem] flex items-center bg-surface-alt">
      {timeScaleOptions.map((s) => {
        return (
          <TimeScaleItem
            key={s.value}
            value={s.value}
            label={s.label}
            rightBorder={s.rightBorder}
            selectedTimeScale={selectedTimeScale}
            setSelectedTimeScale={setSelectedTimeScale}
          />
        );
      })}
    </div>
  );
};

export default TimeScaleSelector;
