import { ReactNode } from 'react';

const TradeRecordsCell: React.FC<{
  children: ReactNode;
  start?: boolean;
  end?: boolean;
  styles?: string;
}> = ({ children, start = false, end = false, styles = '' }) => {
  const startStyle = start ? 'text-start ' : '';
  const endStyle = end ? 'text-end ' : '';
  return <td className={`w-[15rem] ${startStyle} ${endStyle} ${styles}`}>{children}</td>;
};
export default TradeRecordsCell;
