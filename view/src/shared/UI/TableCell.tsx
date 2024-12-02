import { ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  width: string;
  styles?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, width, styles = '' }) => {
  return <td className={`${width} text-center ${styles}`}>{children}</td>;
};

export default TableCell;
