import * as d3 from 'd3';

const addText = (
  group: d3.Selection<d3.BaseType, unknown, null, undefined>,
  y: number,
  texts: string[]
): void => {
  const text = group
    .append('text')
    .attr('x', 0)
    .attr('y', y)
    .attr('fill', '#E0E0E0')
    .attr('class', 'market-text')
    .style('font-size', '12px');

  texts.forEach((t, i) => {
    text
      .append('tspan')
      .attr('dx', i === 0 ? '0em' : '1em')
      .text(t);
  });
};

export default addText;
