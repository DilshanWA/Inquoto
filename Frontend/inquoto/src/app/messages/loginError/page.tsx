// components/ErrorPopup.tsx
import React from 'react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="absolute  top-10 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-white border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-red-600">Login Error</h3>
          <button
            className="text-red-500 hover:text-red-700 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
