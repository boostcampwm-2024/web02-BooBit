import * as d3 from 'd3';
import { CandleData } from '../model/candleDataType';

export const createBarAxisScale = (data: CandleData[], volumeHeight: number) => {
  const volumeMax = d3.max(data, (d) => d.volume)!;
  const yScale = d3
    .scaleLinear()
    .domain([0, volumeMax * 1.2])
    .range([volumeHeight, 0]);

  return { yScale };
};
