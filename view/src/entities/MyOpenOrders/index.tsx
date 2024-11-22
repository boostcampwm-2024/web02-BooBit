import TableCell from '../../shared/UI/TableCell.tsx';
import TableRow from '../../shared/UI/TableRow.tsx';
import { useToast } from '../../shared/store/ToastContext.tsx';
import { OrderType } from './model/OrderType.ts';
import useGetPending from './model/useGetPending.ts';

const columnData = [
  { content: '시간', width: 'w-[6rem]' },
  { content: '거래종류', width: 'w-[4rem]' },
  { content: '주문금액', width: 'w-[10rem]' },
  { content: '주문수량', width: 'w-[10rem]' },
  { content: '미체결량', width: 'w-[10rem]' },
  { content: '주문취소', width: 'w-[6rem]' },
];

const MyOpenOrders = () => {
  const { addToast } = useToast();
  const { data: openOrders } = useGetPending();

  const handleRemoveOrder = (e: React.MouseEvent<HTMLElement, MouseEvent>, historyId: number) => {
    e.preventDefault();

    addToast(historyId + ' 삭제', 'info');
  };

  return (
    <div className="pt-[1.5rem] text-text-light text-available-medium-14 border-border-default border-t-[1px]">
      <div className="text-available-medium-18 mb-[0.5rem]">미체결</div>
      <table className="w-full h-[18rem] mb-12 border-[1px] bg-surface-default border-border-default text-text-light">
        <thead>
          <TableRow height="h-[2rem]" styles="bg-surface-hover-light pr-[10px]">
            {columnData.map((c) => (
              <TableCell key={c.content} width={c.width}>
                {c.content}
              </TableCell>
            ))}
          </TableRow>
        </thead>

        <tbody className="block h-[16rem] overflow-y-auto">
          {openOrders ? (
            openOrders.map((t: OrderType) => (
              <TableRow
                key={t.createdAt}
                height="h-[3rem]"
                styles="border-border-default border-b-[1px]"
              >
                <TableCell width={columnData[0].width}>
                  <span>{t.createdAt.slice(0, 10).replace(/-/g, '.')}</span>
                  <div className="mt-[-6px]">{t.createdAt.slice(11, 19)}</div>
                </TableCell>
                <TableCell
                  width={columnData[1].width}
                  styles={t.orderType === 'BUY' ? 'text-positive' : 'text-negative'}
                >
                  {t.orderType === 'BUY' ? '매수' : '매도'}
                </TableCell>
                <TableCell width={columnData[2].width}>{t.price}</TableCell>
                <TableCell width={columnData[3].width}>{t.quantity}</TableCell>
                <TableCell width={columnData[4].width}>{t.unfilledAmount}</TableCell>
                <TableCell width={columnData[5].width}>
                  <button
                    className={`w-[5rem] h-[2rem] rounded bg-surface-hover-light`}
                    onClick={(e) => handleRemoveOrder(e, t.historyId)}
                  >
                    주문취소
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr className="w-full h-full flex justify-center items-center text-text-dark">
              <td>미체결 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOpenOrders;
