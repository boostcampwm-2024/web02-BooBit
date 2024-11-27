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
      const localDate = new Date(d.date);

      const [month, day, hour, minute, second] = [
        localDate.getMonth() + 1,
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds(),
      ];

      switch (scaleType) {
        case '1sec':
          return second % 12 === 0 ? d.date : null;
        case '1min':
          return minute % 12 === 0 ? d.date : null;
        case '10min':
          return hour % 2 === 0 && minute === 0 ? d.date : null;
        case '30min':
          return hour % 6 === 0 && minute === 0 ? d.date : null;
        case '1hour':
          return hour % 12 === 0 ? d.date : null;
        case '1day':
          return day === 1 || day === 16 ? d.date : null;
        case '1week':
          return day === 1 ? d.date : null;
        case '1month':
          return month === 1 ? d.date : null;
        default:
          return null;
      }
    })
    .filter((d) => d !== null);

  // 틱 포맷 함수
  const tickFormat = (d: string | null) => {
    if (!d) return '';
    const localDate = new Date(d);

    switch (scaleType) {
      case '1sec':
        return d3.timeFormat('%H:%M:%S')(localDate);
      case '1min':
      case '10min':
        return d3.timeFormat('%H:%M')(localDate);
      case '30min':
      case '1hour':
        return localDate.getHours() === 0
          ? `${d3.timeFormat('%b')(localDate)} ${d3.timeFormat('%d')(localDate)}`
          : d3.timeFormat('%H:%M')(localDate);
      case '1day':
        return localDate.getDate() === 16 ? '16' : d3.timeFormat('%b')(localDate);
      case '1week':
        return localDate.getMonth() === 0
          ? d3.timeFormat('%Y')(localDate)
          : d3.timeFormat('%b')(localDate);
      case '1month':
        return d3.timeFormat('%Y')(localDate);
      default:
        return '';
    }
  };

  return { xScale, tickValues, tickFormat };
};
