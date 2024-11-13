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
    const volumnHeight = 80;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    //배경 그리기
    const mainGroup = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background-color', '#1E1E2F')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X축과 Y축 스케일 설정
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date.toISOString()))
      .range([0, width])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low)!;
    const yMax = d3.max(data, (d) => d.high)!;
    // 여백 비율 설정 (예: 5%)
    const paddingRatio = 0.02;
    const y = d3
      .scaleLinear()
      .domain([yMin - (yMax - yMin) * paddingRatio, yMax + (yMax - yMin) * paddingRatio])
      .nice()
      .range([height - volumnHeight, 0]);

    // x축 y축
    const xAxisG = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + height})`);
    const yAxisG = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left + width}, ${margin.top})`);

    const xAxis = d3
      .axisBottom(x)
      .tickValues(
        data
          .map((d) => {
            const date = d.date;
            const day = date.getDate();
            return day === 1 || day === 16 ? date.toISOString() : null;
          })
          .filter((d) => d !== null)
      )
      .tickFormat((d) => {
        const date = new Date(d as string);
        const day = date.getDate();
        return day === 1 ? d3.timeFormat('%b')(date) : '16';
      });

    const yAxis = d3.axisRight(y).ticks(5);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

    // 고점과 저점 선 그리기
    mainGroup
      .selectAll('.line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => x(d.date.toISOString())! + x.bandwidth() / 2)
      .attr('x2', (d) => x(d.date.toISOString())! + x.bandwidth() / 2)
      .attr('y1', (d) => y(d.high))
      .attr('y2', (d) => y(d.low))
      .attr('stroke', '#E0E0E0')
      .attr('stroke-width', 1);

    // rect 그리기
    mainGroup
      .append('g')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.date.toISOString())!)
      .attr('y', (d) => y(Math.max(d.open, d.close)))
      .attr('width', x.bandwidth())
      .attr('height', (d) => Math.abs(y(d.open) - y(d.close)))
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'));

    // # 구분선
    mainGroup
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height - volumnHeight)
      .attr('y2', height - volumnHeight)
      .attr('stroke', '#A0A0A0')
      .attr('stroke-width', 0.5);

    // # 거래량 그래프

    const volumeMax = d3.max(data, (d) => d.volume)!;
    const yVolumn = d3
      .scaleLinear()
      .domain([0, volumeMax + volumeMax * 0.2])
      .range([volumnHeight, 0]);

    const yVolumeAxisG = d3
      .select(svgRef.current)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left + width}, ${margin.top + height - volumnHeight})`
      );

    const yVolumeAxis = d3.axisRight(yVolumn).ticks(3);

    yVolumeAxisG.call(yVolumeAxis);

    mainGroup
      .append('g')
      .selectAll('.volumn-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.date.toISOString())!)
      .attr('y', (d) => height - volumnHeight + yVolumn(d.volume))
      .attr('width', x.bandwidth())
      .attr('height', (d) => volumnHeight - yVolumn(d.volume))
      .attr('fill', (d) => (d.open > d.close ? '#FF5252' : '#00E676'));
  }, [data]);

  return <svg ref={svgRef} />;
};

export default Chart;
