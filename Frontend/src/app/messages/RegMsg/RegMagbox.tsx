'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type PopupMessageProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
};

export default function PopupMessage({ message, type, onClose }: PopupMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500';

  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white flex items-center justify-between gap-4 w-[300px] ${bgColor}`}>
      <span>{message}</span>
      <button onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
