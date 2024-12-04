import { CandleData } from '../model/candleDataType';
import * as d3 from 'd3';
import addText from './addText';
import formatPrice from '../../../shared/model/formatPrice';

const updateMarketText = (
  group: d3.Selection<d3.BaseType, unknown, null, undefined>,
  data: CandleData
) => {
  group.selectAll('.market-text').remove(); // 기존 텍스트 제거

  // 텍스트 추가
  addText(group, 10, [
    `시가: ${formatPrice(data.open)}`,
    `종가: ${formatPrice(data.close)}`,
    `PRICE: ${formatPrice(data.open)}`,
  ]);
  addText(group, 22, [
    `고가: ${formatPrice(data.high)}`,
    `저가: ${formatPrice(data.low)}`,
    `VOL: ${formatPrice(data.volume)}`,
  ]);
  addText(group, 34, [`시간: ${new Date(data.date).toLocaleString()}`]);
};
export default updateMarketText;
