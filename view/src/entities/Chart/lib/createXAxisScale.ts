import * as d3 from 'd3';
import { CandleData } from '../model/candleDataType';
import { ChartTimeScaleType } from '../../../shared/types/ChartTimeScaleType';

export const createXAxisScale = (
  data: CandleData[],
  width: number,
  scaleType: ChartTimeScaleType
) => {
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date.toISOString()))
    .range([0, width])
    .padding(0.3);

  const tickValues = data
    .map((d) => {
      if (scaleType === '1s') {
        return d.date.getSeconds() % 10 === 0 ? d.date.toISOString() : null;
      } else if (scaleType === '1d') {
        return d.date.getDate() === 1 || d.date.getDate() === 16 ? d.date.toISOString() : null;
      } else if (scaleType === '1m') {
        return d.date.getMinutes() % 10 === 0 ? d.date.toISOString() : null;
      }
      return null;
    })
    .filter((d) => d !== null);

  const tickFormat = (d: string | null) => {
    if (!d) return '';
    const date = new Date(d);
    if (scaleType === '1s') {
      return d3.timeFormat('%H:%M:%S')(date);
    } else if (scaleType === '1d') {
      const day = date.getDate();
      return day === 1 ? d3.timeFormat('%b')(date) : '16';
    } else if (scaleType === '1m') {
      return d3.timeFormat('%H:%M')(date);
    }
    return '';
  };

  return { xScale, tickValues, tickFormat };
};
