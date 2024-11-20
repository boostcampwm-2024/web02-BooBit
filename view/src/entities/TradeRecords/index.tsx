import TradeRecordsRow from './UI/TradeRecordRow';
import TradeRecordsCell from './UI/TradeRecordsCell';

interface Record {
  date: string;
  price: number;
  amount: number;
  tradePrice: number;
  gradient: string;
}

interface TradeRecordsProps {
  tradeRecords: Record[];
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
        {tradeRecords.map((r) => (
          <TradeRecordsRow key={r.amount + '.' + r.date} flex styles="even:bg-surface-hover-light">
            <TradeRecordsCell start>
              <span>{r.date.slice(0, 4)}</span>
              <span className="text-text-dark">{r.date.slice(5)}</span>
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
