import { useRef } from 'react';

const Chart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  return <svg width={1064} height={480} id="barchart" ref={svgRef} />;
};

export default Chart;
