import React from 'react';
import { useToast } from '../store/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 left-6 space-y-2 z-99 bg-background-default">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-[20rem] h-[4rem] px-6 flex items-center rounded cursor-pointer text-available-medium-16 text-text-light
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
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
