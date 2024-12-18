import { useCallback, useRef } from 'react';
import TableRow from '../../shared/UI/TableRow';
import TableCell from '../../shared/UI/TableCell';
import useGetTrades from './model/useGetTrades';
import { TradeType } from './model/TradeType';
import formatPrice from '../../shared/model/formatPrice';
import formatDate from '../../shared/model/formatDate';
const columnData = [
  { content: '코인', width: 'w-[3rem]' },
  { content: '종류', width: 'w-[3rem]' },
  { content: '거래수량', width: 'w-[10rem]' },
  { content: '거래단가', width: 'w-[10rem]' },
  { content: '거래금액', width: 'w-[10rem]' },
  { content: '체결시간', width: 'w-[6rem]' },
];

const MyTradeHistory = () => {
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetTrades();

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
      <div className="text-available-medium-18 mb-[0.5rem]">체결내역</div>
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
              page.orders.map((h: TradeType) => (
                <TableRow
                  key={h.tradeId}
                  height="h-[3rem]"
                  styles="border-border-default border-b-[1px]"
                >
                  <TableCell width={columnData[0].width}>{h.coinCode}</TableCell>
                  <TableCell
                    width={columnData[1].width}
                    styles={h.orderType === 'BUY' ? 'text-positive' : 'text-negative'}
                  >
                    {h.orderType === 'BUY' ? '매수' : '매도'}
                  </TableCell>
                  <TableCell width={columnData[2].width}>{formatPrice(h.quantity)}</TableCell>
                  <TableCell width={columnData[3].width}>{formatPrice(h.price)}</TableCell>
                  <TableCell width={columnData[4].width}>{formatPrice(h.totalAmount)}</TableCell>
                  <TableCell width={columnData[5].width}>
                    <span>{formatDate(h.tradedAt).slice(0, 10)}</span>
                    <div className="mt-[-6px]">{formatDate(h.tradedAt).slice(11)}</div>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            <tr className="w-full h-[19rem] flex justify-center items-center text-text-dark">
              <td>체결 내역이 없습니다.</td>
            </tr>
          )}

          <tr ref={bottomRef} className="h-2"></tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyTradeHistory;
