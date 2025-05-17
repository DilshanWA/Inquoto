'use client';

import { useState } from 'react';
import InvoiceForm from '@/app/components/InvoiceForm';
import DocumentTable from '@/app/components/dataTable';

export default function InvoicePage() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreateInvoiceClick = () => {
    setIsFormVisible(true); // Show the form when the button is clicked
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Hide the form when the close button is clicked
  };

  return (
  <div className="p-8">
    <h1 className="text-2xl mb-6 font-bold">Invoices</h1>

    {!isFormVisible && (
      <>
        <button
          onClick={handleCreateInvoiceClick}
          className="mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Invoice
        </button>

        <DocumentTable type="Invoice" />
      </>
    )}

    {/* Invoice form appears only when isFormVisible is true */}
    {isFormVisible && (
      <InvoiceForm type="invoice" handleCloseForm={handleCloseForm} />
    )}
  </div>
  );
}
