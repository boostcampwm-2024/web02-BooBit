import TableCell from '../../shared/UI/TableCell.tsx';
import TableRow from '../../shared/UI/TableRow.tsx';
import { OrderType } from './model/OrderType.ts';
import useGetOrders from './model/useGetOrders.ts';
import { useCallback, useRef } from 'react';
import ORDER_STATUS from './const/status.ts';

const columnData = [
  { content: '주문상태', width: 'w-[4rem]' },
  { content: '코인', width: 'w-[3rem]' },
  { content: '종류', width: 'w-[3rem]' },
  { content: '거래수량', width: 'w-[10rem]' },
  { content: '거래단가', width: 'w-[10rem]' },
  { content: '거래금액', width: 'w-[10rem]' },
  { content: '주문시간', width: 'w-[6rem]' },
];

const MyOrderHistory = () => {
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetOrders();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  return (
    <div className="text-text-light text-available-medium-14">
      <div className="text-available-medium-18 mb-[0.5rem]">주문내역</div>
      <table className="w-full h-[22rem] mb-4 border-[1px] bg-surface-default border-border-default text-text-light">
        <thead>
          <TableRow height="h-[2rem]" styles="bg-surface-hover-light pr-[10px]">
            {columnData.map((c) => (
              <TableCell key={c.content} width={c.width}>
                {c.content}
              </TableCell>
            ))}
          </TableRow>
        </thead>

        <tbody className="block h-[20rem] overflow-y-auto">
          {history && history.pages[0].orders.length !== 0 ? (
            history.pages.map((page) =>
              page.orders.map((h: OrderType) => (
                <TableRow
                  key={h.timestamp}
                  height="h-[3rem]"
                  styles="border-border-default border-b-[1px]"
                >
                  <TableCell width={columnData[0].width}>{ORDER_STATUS[h.status]}</TableCell>
                  <TableCell width={columnData[1].width}>{h.coinCode}</TableCell>
                  <TableCell
                    width={columnData[2].width}
                    styles={h.orderType === 'BUY' ? 'text-positive' : 'text-negative'}
                  >
                    {h.orderType === 'BUY' ? '매수' : '매도'}
                  </TableCell>
                  <TableCell width={columnData[3].width}>{h.quantity.toLocaleString()}</TableCell>
                  <TableCell width={columnData[4].width}>{h.price.toLocaleString()}</TableCell>
                  <TableCell width={columnData[5].width}>
                    {(Number(h.quantity) * Number(h.price)).toLocaleString()}
                  </TableCell>
                  <TableCell width={columnData[6].width}>
                    <span>{h.timestamp.slice(0, 10).replace(/-/g, '.')}</span>
                    <div className="mt-[-6px]">{h.timestamp.slice(11, 19)}</div>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            <tr className="w-full h-[19rem] flex justify-center items-center text-text-dark">
              <td>주문 내역이 없습니다.</td>
            </tr>
          )}

          <tr ref={bottomRef} className="h-2"></tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyOrderHistory;
