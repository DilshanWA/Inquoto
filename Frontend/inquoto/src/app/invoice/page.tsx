'use client';

import { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm'; // Assuming the form is in the same directory

export default function InvoicePage() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreateInvoiceClick = () => {
    setIsFormVisible(true); // Show the form when the button is clicked
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Hide the form when the close button is clicked
  };

  return (
    <div className="p-6">
      {/* Button to create invoice */}
      {!isFormVisible && (
        <button
          onClick={handleCreateInvoiceClick}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Invoice
        </button>
      )}

      {/* Invoice form appears only when isFormVisible is true */}
      {isFormVisible && <InvoiceForm handleCloseForm={handleCloseForm} />}
    </div>
  );
}
