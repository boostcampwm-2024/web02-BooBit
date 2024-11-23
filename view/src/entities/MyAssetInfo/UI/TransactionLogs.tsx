import { useCallback, useRef } from 'react';
import { TransactionType } from '../model/TransactionType';
import TransactionLogItem from './TransactionLogItem';
import useGetTransactions from '../model/useGetTransactions';

const TransactionLogs: React.FC<{ currencyCode: string }> = ({ currencyCode }) => {
  const {
    data: logs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTransactions({
    currencyCode,
  });

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
    <ul className="w-[100%] h-[16.5rem] px-[3vw] overflow-y-auto">
      {logs && logs.pages[0].transactions.length !== 0 ? (
        logs.pages.map((page) =>
          page.transactions.map((h: TransactionType) => (
            <TransactionLogItem key={h.timestamp} log={h} currency_code={currencyCode} />
          ))
        )
      ) : (
        <div className="w-full h-[15.5rem] flex justify-center items-center text-text-dark">
          입출금 내역이 없습니다.
        </div>
      )}
      <div ref={bottomRef} className="h-2"></div>
    </ul>
  );
};

export default TransactionLogs;
