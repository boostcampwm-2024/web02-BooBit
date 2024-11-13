import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface CandleData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleChartProps {
  data: CandleData[];
}

const Chart: React.FC<CandleChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

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

    // X and Y axis scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.date.toISOString()))
      .range([0, width])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low)!;
    const yMax = d3.max(data, (d) => d.high)!;
    const paddingRatio = 0.0;

    const yScale = d3
      .scaleLinear()
      .domain([yMin - (yMax - yMin) * paddingRatio, yMax + (yMax - yMin) * paddingRatio])
      .nice()
      .range([height - volumeHeight, 0]);

    // Axes
    const xAxisG = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + height})`);
    const yAxisG = svg
      .append('g')
      .attr('transform', `translate(${margin.left + width}, ${margin.top})`);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(
        data
          .map((d) => {
            return d.date.getDate() === 1 || d.date.getDate() === 16 ? d.date.toISOString() : null;
          })
          .filter((d) => d !== null)
      )
      .tickFormat((d) => {
        const date = new Date(d as string);
        const day = date.getDate();
        return day === 1 ? d3.timeFormat('%b')(date) : '16';
      });

    const yAxis = d3.axisRight(yScale).ticks(5);
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

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
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'));

    // Divider line
    mainGroup
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height - volumeHeight)
      .attr('y2', height - volumeHeight)
      .attr('stroke', '#A0A0A0')
      .attr('stroke-width', 0.5);

    // Volume chart
    const volumeMax = d3.max(data, (d) => d.volume)!;
    const yVolumeScale = d3
      .scaleLinear()
      .domain([0, volumeMax * 1.2])
      .range([volumeHeight, 0]);

    const yVolumeAxisG = svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left + width}, ${margin.top + height - volumeHeight})`
      );

    const yVolumeAxis = d3.axisRight(yVolumeScale).ticks(3);
    yVolumeAxisG.call(yVolumeAxis);

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
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'));
  }, [data]);

  return <svg ref={svgRef} />;
};

export default Chart;
