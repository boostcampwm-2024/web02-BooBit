import * as d3 from 'd3';
import { CandleData } from '../model/candleDataType';
import { ChartTimeScaleType } from '../../../shared/types/ChartTimeScaleType';

export const createXAxisScale = (
  data: CandleData[],
  width: number,
  scaleType: ChartTimeScaleType
) => {
  // X축 스케일 생성
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, width])
    .padding(0.3);

  // 틱 값 생성
  const tickValues = data
    .map((d) => {
      const date = d.date;
      const [month, day, hour, minute, second] = date.slice(5, -5).split(/[-T:]/).map(Number);
      switch (scaleType) {
        case '1sec':
          return second % 12 === 0 ? date : null;
        case '1min':
          return minute % 12 === 0 ? date : null;
        case '10min':
          return hour % 2 === 0 && minute === 0 ? date : null;
        case '30min':
          return hour % 6 === 0 && minute === 0 ? date : null;
        case '1hour':
          return hour % 12 === 0 ? date : null;
        case '1day':
          return day === 1 || day === 16 ? date : null;
        case '1week':
          return day === 1 ? date : null;
        case '1month':
          return month === 1 ? date : null;
        default:
          return null;
      }
    })
    .filter((d) => d !== null);

  // 틱 포맷 함수
  const tickFormat = (d: string | null) => {
    if (!d) return '';
    const [year, month, day, hour, minute, second] = d.slice(0, -5).split(/[-T:]/);
    switch (scaleType) {
      case '1sec':
        return `${hour}:${minute}:${second}`;
      case '1min':
      case '10min':
        return `${hour}:${minute}`;
      case '30min':
      case '1hour': {
        return hour === '0' ? `${month}/${day}` : `${hour}:${minute}`;
      }
      case '1day': {
        return day === '1' ? `${month}월` : '16';
      }
      case '1week': {
        return month === '1' ? `${year}년` : `${month}월`;
      }
      case '1month':
        return `${year}`;
      default:
        return '';
    }
  };

  return { xScale, tickValues, tickFormat };
};
