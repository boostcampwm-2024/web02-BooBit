import tradeHistory from './const/mockData.ts';
import TableCell from '../../shared/UI/TableCell.tsx';
import TableRow from '../../shared/UI/TableRow.tsx';

const columnData = [
  { content: '체결시간', width: 'w-[6rem]' },
  { content: '코인', width: 'w-[3rem]' },
  { content: '종류', width: 'w-[3rem]' },
  { content: '거래수량', width: 'w-[10rem]' },
  { content: '거래단가', width: 'w-[10rem]' },
  { content: '거래금액', width: 'w-[10rem]' },
  { content: '주문시간', width: 'w-[6rem]' },
];

const MyTradeHistory = () => {
  return (
    <div className="text-text-light text-available-medium-14">
      <div className="text-available-medium-18 mb-[0.5rem]">거래내역</div>
      <table className="w-full h-[22rem] mb-12 border-[1px] bg-surface-default border-border-default text-text-light">
        <TableRow height="h-[2rem]" styles="bg-surface-hover-light pr-[10px]">
          {columnData.map((c) => (
            <TableCell width={c.width}>{c.content}</TableCell>
          ))}
        </TableRow>
        <tbody className="block h-[20rem] overflow-y-auto">
          {tradeHistory.map((t) => (
            <TableRow
              key={t.tradeTimestamp}
              height="h-[3rem]"
              styles="border-border-default border-b-[1px]"
            >
              <TableCell width={columnData[0].width}>
                <span>{t.tradeTimestamp.slice(0, 10).replace(/-/g, '.')}</span>
                <div className="mt-[-6px]">{t.tradeTimestamp.slice(11, 19)}</div>
              </TableCell>
              <TableCell width={columnData[1].width}>{t.coin_code}</TableCell>
              <TableCell
                width={columnData[2].width}
                styles={t.type === 'BUY' ? 'text-positive' : 'text-negative'}
              >
                {t.type === 'BUY' ? '매수' : '매도'}
              </TableCell>
              <TableCell width={columnData[3].width}>{t.amount.toLocaleString()}</TableCell>
              <TableCell width={columnData[4].width}>{t.price.toLocaleString()}</TableCell>
              <TableCell width={columnData[5].width}>{t.tradePrice.toLocaleString()}</TableCell>
              <TableCell width={columnData[6].width}>
                <span>{t.orderTimestamp.slice(0, 10).replace(/-/g, '.')}</span>
                <div className="mt-[-6px]">{t.orderTimestamp.slice(11, 19)}</div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTradeHistory;
