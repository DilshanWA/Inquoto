'use client';

import React, { useState, useEffect } from 'react';
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
  initialData?: {
    id: string;
    customerName: string;
    customerAddress: string;
    date: string;
    validity: string;
    items: LineItem[];
    note: string;
    terms: string;
  };
}

export default function InvoiceForm({ handleCloseForm, type, initialData }: InvoiceFormProps) {
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

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setCustomerAddress(initialData.customerAddress);
      setDate(initialData.date);
      setValidity(initialData.validity);
      setItems(initialData.items.length > 0 ? initialData.items : [{ description: '', quantity: 0, unitPrice: 0, total: 0 }]);
      setNote(initialData.note);
      setTerms(initialData.terms);
    }
  }, [initialData]);

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
    const userEmail = localStorage.getItem('email');

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
      userEmail
    };

    let endpoint = '';
    let method = 'POST';

    if (isEditMode && initialData?.id) {
      endpoint =
        type === 'invoice'
          ? `http://localhost:5000/api/vi/update-invoice/${initialData.id}`
          : `http://localhost:5000/api/vi/update-quotation/${initialData.id}`;
      method = 'PUT';
    } else {
      endpoint =
        type === 'invoice'
          ? 'http://localhost:5000/api/vi/create-invoices'
          : 'http://localhost:5000/api/vi/create-quotations';
      method = 'POST';
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${type} ${isEditMode ? 'updated' : 'created'} successfully.` });
        addNotification(`Successfully ${isEditMode ? 'updated' : 'created'} ${type}.`);
        setTimeout(() => {
          handleCloseForm();
        }, 900);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || `Failed to ${isEditMode ? 'update' : 'create'} ${type}.` });
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
        <div className="relative w-full max-w-5xl transform overflow-hidden bg-white p-6 rounded-lg shadow-xl">
          <button
            onClick={handleCloseForm}
            className="absolute top-4 right-4 z-10 rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-800"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-h-[70vh] overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name*</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    placeholder="Customer name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date*</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Validity*</label>
                  <input
                    type="date"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-12 bg-gray-200 font-medium text-gray-700 px-3 py-2 rounded text-xs">
                <div className="col-span-1 text-center">No</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

                        {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center gap-2 border-b border-gray-200 py-2 text-sm"
            >
              <div className="col-span-1 text-center">{index + 1}</div>
              <div className="col-span-5">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChangeItem(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleChangeItem(index, 'quantity', e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-center"
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleChangeItem(index, 'unitPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right"
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-span-2 text-right font-semibold">
                {item.total.toFixed(2)}
              </div>
              <div className="col-span-12 text-right mt-1">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            disabled={isSubmitting}
            className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Add Item
          </button>

          <div className="text-right mt-4 font-bold text-lg">
            Total: {getTotalInvoice().toFixed(2)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Terms</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : isEditMode ? 'Update' : `Create ${type} `}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>
  )
}
