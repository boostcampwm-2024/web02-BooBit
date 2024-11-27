import { CandleData } from '../model/candleDataType';
import * as d3 from 'd3';
import addText from './addText';

const updateMarketText = (
  group: d3.Selection<d3.BaseType, unknown, null, undefined>,
  data: CandleData
) => {
  group.selectAll('.market-text').remove(); // 기존 텍스트 제거

  // 텍스트 추가
  addText(group, 10, [`시가: ${data.open}`, `종가: ${data.close}`, `PRICE: ${data.open}`]);
  addText(group, 22, [`고가: ${data.high}`, `저가: ${data.low}`, `VOL: ${data.volume}`]);
  addText(group, 34, [`시간: ${data.date.slice(0, -5).replace(/[T]/, ' ')}`]);
};
export default updateMarketText;
