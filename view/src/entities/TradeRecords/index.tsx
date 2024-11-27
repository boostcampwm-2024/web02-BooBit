import formatDate from '../../shared/model/formatDate';
import { RecordType } from '../../shared/types/RecordType';
import TradeRecordsRow from './UI/TradeRecordRow';
import TradeRecordsCell from './UI/TradeRecordsCell';

interface TradeRecordsProps {
  tradeRecords: RecordType[] | undefined;
}

const TradeRecords: React.FC<TradeRecordsProps> = ({ tradeRecords }) => {
  return (
    <table className="w-full h-[30rem] mb-12 border-[1px] bg-surface-default border-border-default text-text-light">
      <thead>
        <TradeRecordsRow>
          <td colSpan={4} className="text-display-bold-20">
            체결
          </td>
        </TradeRecordsRow>
        <TradeRecordsRow flex styles="bg-surface-hover-light">
          <TradeRecordsCell start>체결시간</TradeRecordsCell>
          <TradeRecordsCell>체결가격(KRW)</TradeRecordsCell>
          <TradeRecordsCell>체결량(BTC)</TradeRecordsCell>
          <TradeRecordsCell end>체결금액(KRW)</TradeRecordsCell>
        </TradeRecordsRow>
      </thead>
      <tbody className="block max-h-[25rem] overflow-y-auto">
        {tradeRecords &&
          tradeRecords.length !== 0 &&
          tradeRecords.map((r) => (
            <TradeRecordsRow
              key={r.amount + '.' + r.date}
              flex
              styles="even:bg-surface-hover-light"
            >
              <TradeRecordsCell start>
                <span>{formatDate(r.date).slice(5, 10)}</span>
                <span className="ml-[0.5rem] text-text-dark">{formatDate(r.date).slice(11)}</span>
              </TradeRecordsCell>
              <TradeRecordsCell>{r.price.toLocaleString()}</TradeRecordsCell>
              <TradeRecordsCell
                styles={r.gradient === 'POSITIVE' ? 'text-positive' : 'text-negative'}
              >
                {r.amount}
              </TradeRecordsCell>
              <TradeRecordsCell end>{r.tradePrice.toLocaleString()}</TradeRecordsCell>
            </TradeRecordsRow>
          ))}
      </tbody>
    </table>
  );
};

export default TradeRecords;
