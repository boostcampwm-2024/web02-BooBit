import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import addText from './lib/addText';
import { CandleData } from './model/candleDataType';
import { createXAxisScale } from './lib/createXAxisScale';
import { createYAxisScale } from './lib/createYAxisScale';
import { createBarAxisScale } from './lib/createBarYAsixScale';
import { ChartTimeScaleType } from '../../shared/types/ChartTimeScaleType';

interface CandleChartProps {
  data: CandleData[];
  scaleType: ChartTimeScaleType;
}

const Chart: React.FC<CandleChartProps> = ({ data, scaleType }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [marketValues, setMarketValues] = useState<CandleData>();

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 90, bottom: 50, left: 40 };
    const width = 1076 - margin.left - margin.right;
    const height = 460 - margin.top - margin.bottom;
    const volumeHeight = 80;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    // Setup main group for chart
    const mainGroup = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background-color', '#1E1E2F')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const { xScale, tickValues, tickFormat } = createXAxisScale(
      data,
      width,
      scaleType
    );
    const { yScale } = createYAxisScale(data, height, volumeHeight);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat(tickFormat);
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + height})`)
      .call(xAxis);

    const yAxis = d3.axisRight(yScale).ticks(5);
    svg
      .append('g')
      .attr('transform', `translate(${margin.left + width}, ${margin.top})`)
      .call(yAxis);

    // Candlestick lines
    mainGroup
      .selectAll('.line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => xScale(d.date.toISOString())! + xScale.bandwidth() / 2)
      .attr('x2', (d) => xScale(d.date.toISOString())! + xScale.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.high))
      .attr('y2', (d) => yScale(d.low))
      .attr('stroke', '#E0E0E0')
      .attr('stroke-width', 1);

    // Candlestick rectangles
    mainGroup
      .append('g')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.date.toISOString())!)
      .attr('y', (d) => yScale(Math.max(d.open, d.close)))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'))
      .on('mouseover', (e, d) => {
        e.preventDefault();
        setMarketValues(d);
      });

    // Divider line
    mainGroup
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height - volumeHeight)
      .attr('y2', height - volumeHeight)
      .attr('stroke', '#A0A0A0')
      .attr('stroke-width', 0.4);

    // Volume chart
    const { yScale: yVolumeScale } = createBarAxisScale(data, volumeHeight);

    const yVolumeAxis = d3.axisRight(yVolumeScale).ticks(3);
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left + width}, ${margin.top + height - volumeHeight})`
      )
      .call(yVolumeAxis);

    mainGroup
      .append('g')
      .selectAll('.volume-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.date.toISOString())!)
      .attr('y', (d) => height - volumeHeight + yVolumeScale(d.volume))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => volumeHeight - yVolumeScale(d.volume))
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'))
      .on('mouseover', (e, d) => {
        e.preventDefault();
        setMarketValues(d);
      });
  }, [data, scaleType]);

  useEffect(() => {
    if (!marketValues) return;
    d3.select(svgRef.current).selectAll('.market-text').remove();

    const mainGroup = d3.select(svgRef.current).select('g');
    addText(mainGroup, 10, [
      `시가: ${marketValues.open}`,
      `종가: ${marketValues.close}`,
      `PRICE: ${marketValues.open}`,
    ]);
    addText(mainGroup, 22, [
      `고가: ${marketValues.high}`,
      `저가: ${marketValues.low}`,
      `VOL: ${marketValues.volume}`,
    ]);
  }, [marketValues]);

  return <svg className="border-[1px] border-border-default" ref={svgRef} />;
};

export default Chart;
