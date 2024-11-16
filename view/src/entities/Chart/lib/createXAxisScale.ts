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
    .domain(data.map((d) => d.date.toISOString()))
    .range([0, width])
    .padding(0.3);

  // 틱 값 생성
  const tickValues = data
    .map((d) => {
      const date = d.date;
      switch (scaleType) {
        case '1s':
          return date.getSeconds() % 12 === 0 ? date.toISOString() : null;
        case '1m':
          return date.getMinutes() % 12 === 0 ? date.toISOString() : null;
        case '10m':
          return date.getHours() % 2 === 0 && date.getMinutes() === 0 ? date.toISOString() : null;
        case '30m':
          return date.getHours() % 6 === 0 && date.getMinutes() === 0 ? date.toISOString() : null;
        case '1h':
          return date.getHours() % 12 === 0 ? date.toISOString() : null;
        case '1d':
          return date.getDate() === 1 || date.getDate() === 16 ? date.toISOString() : null;
        case '1w':
          return date.getDate() === 1 ? date.toISOString() : null;
        case '1M':
          return date.getMonth() === 1 ? date.toISOString() : null;
        default:
          return null;
      }
    })
    .filter((d) => d !== null);

  // 틱 포맷 함수
  const tickFormat = (d: string | null) => {
    if (!d) return '';
    const date = new Date(d);
    switch (scaleType) {
      case '1s':
        return d3.timeFormat('%H:%M:%S')(date);
      case '1m':
      case '10m':
        return d3.timeFormat('%H:%M')(date);
      case '30m':
      case '1h': {
        const hour = date.getHours();
        return hour === 0 ? d3.timeFormat('%m/%d')(date) : d3.timeFormat('%H:%M')(date);
      }
      case '1d': {
        const day = date.getDate();
        return day === 1 ? d3.timeFormat('%b')(date) : '16';
      }
      case '1w': {
        const month = date.getMonth();
        return month === 0 ? d3.timeFormat('%Y')(date) : d3.timeFormat('%b')(date);
      }
      case '1M':
        return d3.timeFormat('%Y')(date);
      default:
        return '';
    }
  };

  return { xScale, tickValues, tickFormat };
};
