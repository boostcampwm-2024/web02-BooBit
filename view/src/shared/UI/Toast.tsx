import React from 'react';
import { useToast } from '../store/ToastContext';
import success from '../images/success.svg';
import error from '../images/error.svg';
import info from '../images/info.svg';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 left-6 space-y-2 z-99 bg-background-default">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-[24rem] h-[4rem] px-8 flex items-center gap-[1rem] rounded cursor-pointer text-available-medium-16 text-text-light
            ${
              toast.type === 'success'
                ? 'bg-positive'
                : toast.type === 'error'
                  ? 'bg-negative'
                  : toast.type === 'info'
                    ? 'bg-surface-alt'
                    : 'bg-primary'
            }`}
          onClick={() => removeToast(toast.id)}
        >
          <img
            src={toast.type === 'success' ? success : toast.type === 'error' ? error : info}
            alt="icon"
            width={30}
            height={30}
          />
          <div>{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
