// components/Message.tsx
import React from 'react';

type MessageProps = {
  type: 'success' | 'error';
  text: string;
  onClose: () => void;
};

const Message: React.FC<MessageProps> = ({ type, text, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{text}</span>
        <button onClick={onClose} className="ml-4 font-bold">×</button>
      </div>
    </div>
  );
};

export default Message;
