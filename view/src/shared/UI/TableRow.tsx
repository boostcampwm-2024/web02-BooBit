import { ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  height: string;
  styles?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, height, styles = '' }) => {
  return (
    <tr className={`w-full ${height} pl-[1rem] flex items-center justify-between ${styles}`}>
      {children}
    </tr>
  );
};

export default TableRow;
