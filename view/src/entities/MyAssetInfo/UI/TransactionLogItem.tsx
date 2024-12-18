import formatDate from '../../../shared/model/formatDate';
import formatPrice from '../../../shared/model/formatPrice';
import { TransactionType } from '../model/TransactionType';

interface TransactionLogItemProps {
  log: TransactionType;
  currency_code: string;
}

const TransactionLogItem: React.FC<TransactionLogItemProps> = ({ log, currency_code }) => {
  return (
    <div
      key={log.timestamp}
      className="w-[100%] flex justify-between items-center py-[1rem] border-t-[1px] border-border-default"
    >
      <div>
        <div
          className={`${log.tx_type === 'withdrawal' ? 'text-negative' : 'text-positive'} text-available-medium-16`}
        >
          {log.tx_type === 'withdrawal' ? '출금' : '입금'} 완료
        </div>
        <div className="text-text-dark text-available-medium-14">{formatDate(log.timestamp)}</div>
      </div>
      <div className="text-text-light text-display-bold-16">
        {formatPrice(log.amount)} {currency_code}
      </div>
    </div>
  );
};

export default TransactionLogItem;
