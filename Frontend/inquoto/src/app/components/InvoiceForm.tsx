'use client';

import { useState, useCallback } from 'react';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormProps {
  handleCloseForm: () => void;
}

export default function InvoiceForm({ handleCloseForm }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    date: '',
    validity: '',
    items: [{ description: '', quantity: 0, unitPrice: 0, total: 0 }],
    note: '',
    terms: '',
  });

  // Handle change for general form fields
  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle change for individual line item fields
  const handleChangeItem = useCallback(
    (index: number, field: keyof LineItem, value: string) => {
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        if (field === 'description') updatedItems[index].description = value;
        else if (field === 'quantity') updatedItems[index].quantity = Number(value);
        else if (field === 'unitPrice') updatedItems[index].unitPrice = Number(value);
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
        return { ...prev, items: updatedItems };
      });
    },
    []
  );

  // Add a new item row
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 0, unitPrice: 0, total: 0 }],
    }));
  };

  // Remove a specific item row
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Get total invoice amount
  const getTotalInvoice = () => formData.items.reduce((total, item) => total + item.total, 0);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      ...formData,
      total: getTotalInvoice(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invoice/Create-invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Invoice submitted:', result);
        handleCloseForm();
      } else {
        console.error('Failed to submit invoice');
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  return (
    <>
      <div className="fixed h-screen inset-0 bg-black opacity-70 transition-opacity" />
      <div className="flex items-center justify-center p-4 text-center -mt-30">
        <div className="relative w-full max-w-7xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          <button
            onClick={handleCloseForm}
            className="absolute top-4 right-4 z-10 rounded-md bg-gray-100 p-1 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <form className="space-y-6 p-6" onSubmit={handleSubmit}>
            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-medium">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Customer Address</label>
                <input
                  type="text"
                  value={formData.customerAddress}
                  onChange={(e) => handleChange('customerAddress', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                  placeholder="Customer address"
                />
              </div>
              <div>
                <label className="block font-medium">Validity</label>
                <input
                  type="date"
                  value={formData.validity}
                  onChange={(e) => handleChange('validity', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                />
              </div>
            </div>

            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 bg-gray-200 font-medium text-black px-2 py-1 rounded text-sm">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-1 text-center">Total</div>
              <div className="col-span-1 text-center">Del</div>
            </div>

            {/* Line Items */}
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 py-1 px-2 items-center text-sm">
                <div className="col-span-1 text-center">{index + 1}</div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChangeItem(index, 'description', e.target.value)}
                  className="col-span-5 border border-gray-300 rounded-md py-3 px-2"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChangeItem(index, 'quantity', e.target.value)}
                  className="col-span-2 border border-gray-300 rounded-md py-3 px-2 text-center"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleChangeItem(index, 'unitPrice', e.target.value)}
                  className="col-span-2 border border-gray-300 rounded-md py-3 px-2 text-center"
                  placeholder="Price"
                />
                <div className="col-span-1 text-center text-black">
                  Rs{item.total.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete row"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-end font-semibold text-black mt-4 text-lg">
              <span>Total: Rs {getTotalInvoice().toFixed(2)}</span>
            </div>

            {/* Add New Item */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 bg-[#050A30] text-white px-4 py-2 rounded-md hover:opacity-90"
              >
                + Add New
              </button>
            </div>

            {/* Note */}
            <div>
              <label className="block font-medium">Note</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                rows={3}
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Add any special notes here..."
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block font-medium">Terms & Conditions</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                rows={3}
                value={formData.terms}
                onChange={(e) => handleChange('terms', e.target.value)}
                placeholder="Write your terms & conditions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 mt-10">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
