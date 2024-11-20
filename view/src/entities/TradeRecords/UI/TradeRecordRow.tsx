import { ReactNode } from 'react';

interface TradeRecordsRowProps {
  children: ReactNode;
  flex?: boolean;
  styles?: string;
}

const TradeRecordsRow: React.FC<TradeRecordsRowProps> = ({
  children,
  flex = false,
  styles = '',
}) => {
  const flexStyle = flex ? 'flex justify-between items-center px-[2rem]' : '';
  return <tr className={`w-full h-[2.5rem] text-center ${flexStyle} ${styles}`}>{children}</tr>;
};
export default TradeRecordsRow;
