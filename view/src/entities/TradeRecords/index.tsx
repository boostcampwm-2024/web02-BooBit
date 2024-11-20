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
    <table className="w-full h-[30rem]  mb-12 border-[1px] bg-surface-default border-border-default text-text-light">
      <thead>
        <tr className="w-full h-[2.5rem] ">
          <td colSpan={4} className="text-center text-display-bold-20">
            체결
          </td>
        </tr>
        <tr className="h-[2.5rem] flex justify-between items-center px-[2rem] bg-surface-hover-light text-center">
          <td className="w-[12rem] text-start">체결시간</td>
          <td className="w-[15rem]">체결가격(KRW)</td>
          <td className="w-[15rem]">체결량(BTC)</td>
          <td className="w-[15rem] text-end">체결금액(KRW)</td>
        </tr>
      </thead>
      <tbody className="block max-h-[25rem] overflow-y-auto">
        {tradeRecords.map((r) => (
          <tr
            key={r.amount + '.' + r.date}
            className="h-[2.5rem] flex justify-between items-center px-[2rem] even:bg-surface-hover-light text-center "
          >
            <td className="w-[12rem] text-start">
              <span>{r.date.slice(0, 4)}</span>
              <span className="text-text-dark">{r.date.slice(5)}</span>
            </td>
            <td className="w-[15rem]">{r.price.toLocaleString()}</td>
            <td
              className={`w-[15rem] ${r.gradient === 'POSITIVE' ? 'text-positive' : 'text-negative'}`}
            >
              {r.amount}
            </td>
            <td className="w-[15rem] text-end">{r.tradePrice.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TradeRecords;
