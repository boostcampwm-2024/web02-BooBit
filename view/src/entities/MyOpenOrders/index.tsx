import openOrders from './const/mockData.ts';
import TableCell from '../../shared/UI/TableCell.tsx';
import TableRow from '../../shared/UI/TableRow.tsx';

const columnData = [
  { content: '시간', width: 'w-[6rem]' },
  { content: '거래종류', width: 'w-[4rem]' },
  { content: '주문금액', width: 'w-[10rem]' },
  { content: '주문수량', width: 'w-[10rem]' },
  { content: '미체결량', width: 'w-[10rem]' },
  { content: '주문취소', width: 'w-[6rem]' },
];

const MyOpenOrders = () => {
  return (
    <div className="pt-[1.5rem] text-text-light text-available-medium-14 border-border-default border-t-[1px]">
      <div className="text-available-medium-18 mb-[0.5rem]">미체결</div>
      <table className="w-full h-[18rem] mb-12 border-[1px] bg-surface-default border-border-default text-text-light">
        <TableRow height="h-[2rem]" styles="bg-surface-hover-light pr-[10px]">
          {columnData.map((c) => (
            <TableCell width={c.width}>{c.content}</TableCell>
          ))}
        </TableRow>
        <tbody className="block h-[16rem] overflow-y-auto">
          {openOrders.map((t) => (
            <TableRow key={t.time} height="h-[3rem]" styles="border-border-default border-b-[1px]">
              <TableCell width={columnData[0].width}>
                <span>{t.time.slice(0, 10).replace(/-/g, '.')}</span>
                <div className="mt-[-6px]">{t.time.slice(11, 19)}</div>
              </TableCell>
              <TableCell
                width={columnData[1].width}
                styles={t.orderType === 'BUY' ? 'text-positive' : 'text-negative'}
              >
                {t.orderType === 'BUY' ? '매수' : '매도'}
              </TableCell>
              <TableCell width={columnData[2].width}>{t.orderPrice.toLocaleString()}</TableCell>
              <TableCell width={columnData[3].width}>{t.orderAmount.toLocaleString()}</TableCell>
              <TableCell width={columnData[4].width}>{t.unfilledAmount.toLocaleString()}</TableCell>
              <TableCell width={columnData[5].width}>
                <button className={`w-[5rem] h-[2rem] rounded bg-surface-hover-light`}>
                  주문취소
                </button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOpenOrders;
