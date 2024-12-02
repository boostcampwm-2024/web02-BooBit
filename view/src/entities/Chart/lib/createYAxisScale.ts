import * as d3 from 'd3';
import { CandleData } from '../model/candleDataType';

export const createYAxisScale = (data: CandleData[], height: number, volumeHeight: number) => {
  const yMin = d3.min(data, (d) => d.low)!;
  const yMax = d3.max(data, (d) => d.high)!;
  const paddingRatio = 0.02;

  const yScale = d3
    .scaleLinear()
    .domain([yMin - (yMax - yMin) * paddingRatio, yMax + (yMax - yMin) * paddingRatio])
    .nice()
    .range([height - volumeHeight, 0]);

  return { yScale };
};
