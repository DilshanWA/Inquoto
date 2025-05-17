'use client';

import React, { useState } from 'react';
import { useNotification } from '@/app/context/NotificationContext';
import MessageBox from '@/app/messages/InvQuoMsg/SuccessPopup';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormProps {
  handleCloseForm: () => void;
  type: 'invoice' | 'quotation';
}

export default function InvoiceForm({ handleCloseForm, type }: InvoiceFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState('');
  const [validity, setValidity] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 0, unitPrice: 0, total: 0 },
  ]);
  const [note, setNote] = useState('');
  const [terms, setTerms] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const { addNotification } = useNotification();

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 0, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChangeItem = (index: number, field: keyof LineItem, value: string) => {
    const updatedItems = [...items];
    if (field === 'description') {
      updatedItems[index].description = value;
    } else if (field === 'quantity') {
      updatedItems[index].quantity = Number(value);
    } else if (field === 'unitPrice') {
      updatedItems[index].unitPrice = Number(value);
    }
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setItems(updatedItems);
  };

  const getTotalInvoice = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const validateForm = () => {
    if (!customerName || !customerAddress || !date || !validity) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return false;
    }

    const hasValidItems = items.some(item => item.description && item.quantity > 0 && item.unitPrice > 0);
    if (!hasValidItems) {
      setMessage({ type: 'error', text: 'Please add at least one valid item.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const uid = localStorage.getItem('uid');
    const userName = localStorage.getItem('name');

    if (!uid || !userName) {
      setMessage({ type: 'error', text: 'User information missing. Please login again.' });
      return;
    }

    const formData = {
      type,
      customerName,
      customerAddress,
      date,
      validity,
      items,
      note,
      terms,
      total: getTotalInvoice(),
      uid,
      userName,
    };

    const endpoint =
      type === 'invoice'
        ? 'http://localhost:5000/api/vi/create-invoices'
        : 'http://localhost:5000/api/vi/create-quotations';

    try {
      setIsSubmitting(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${type} created successfully.` });
        addNotification(`Successfully created ${type}.`);
        setTimeout(() => {
          handleCloseForm();
        }, 900);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || `Failed to create ${type}.` });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: `An error occurred. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {message && (
        <MessageBox
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <div className="fixed">
        <div className="relative w-full max-w-10xl transform overflow-hidden bg-white p-6 rounded-lg shadow-xl">
          {/* Close Button */}
          <button
            onClick={handleCloseForm}
            className="absolute top-4 right-4 z-10 rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-800"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Form */}
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name*</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date*</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Address*</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Validity*</label>
                  <input
                    type="date"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  />
                </div>
              </div>

              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 bg-gray-200 font-medium text-gray-700 px-3 py-2 rounded text-xs">
                <div className="col-span-1 text-center">No</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1 text-center">Del</div>
              </div>

              {/* Line Items */}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 py-2 px-3 items-center text-xs">
                  <div className="col-span-1 text-center">{index + 1}</div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleChangeItem(index, 'description', e.target.value)}
                    className="col-span-5 border border-gray-300 rounded-md py-2 px-2 text-sm"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChangeItem(index, 'quantity', e.target.value)}
                    className="col-span-2 border border-gray-300 rounded-md py-2 px-2 text-center text-sm"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleChangeItem(index, 'unitPrice', e.target.value)}
                    className="col-span-2 border border-gray-300 rounded-md py-2 px-2 text-center text-sm"
                    placeholder="Price"
                  />
                  <div className="col-span-1 text-center text-gray-700">Rs {item.total.toFixed(2)}</div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Line Item */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 text-sm"
                >
                  + Add New Item
                </button>
              </div>

              {/* Total */}
              <div className="flex justify-end font-semibold text-gray-700 text-sm mt-2">
                <span>Total: Rs {getTotalInvoice().toFixed(2)}</span>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter additional note"
                />
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Terms</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Enter terms"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-white rounded-md text-sm ${
                    isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : `Create ${type}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
