import React, { useState } from 'react';
import { useNotification } from "@/app/context/NotificationContext";

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
  const token = localStorage.getItem('token');
  const { addNotification } = useNotification();

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 0, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve uid and name from localStorage
    const uid = localStorage.getItem('uid');
    const userName = localStorage.getItem('name');

    // Ensure uid and name are available, else show an error
    if (!uid || !userName) {
      console.error('User UID or name is missing in localStorage');
      return;
    }

    // Create formData including uid and name
    const formData = {
      type, // <-- include type (invoice or quotation)
      customerName,
      customerAddress,
      date,
      validity,
      items,
      note,
      terms,
      total: getTotalInvoice(),
      uid,  // Include uid
      userName, // Include name
    };

    // Define the endpoint based on type
    const endpoint =
      type === 'invoice'
        ? 'http://localhost:5000/api/vi/create-invoices'
        : 'http://localhost:5000/api/vi/create-quotations';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming token is already set
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${type} submitted:`, result);
        handleCloseForm();
        addNotification(`Successfully Create ${type}.`);
      } else {
        console.error(`Failed to submit ${type}`);
      }
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
    }
  };

  return (
      <>
      <div className="fixed inset-0 bg-black opacity-70 z-0 transition-opacity" />
      <div className="flex items-center justify-center item-center p-4 text-center mt-30">
        <div className="absolute w-full max-w-5xl transform overflow-hidden bg-white text-left shadow-xl transition-all rounded-lg">
          <button
            onClick={handleCloseForm}
            className="absolute 0 right-5 z-10 rounded-md bg-gray-100 p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable form container */}
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    placeholder="Customer address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Validity</label>
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
                  <div className="col-span-1 text-center text-gray-700">Rs{item.total.toFixed(2)}</div>
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
              <div className="flex justify-end font-semibold text-gray-700 mt-4 text-sm">
                <span>Total: Rs {getTotalInvoice().toFixed(2)}</span>
              </div>

              {/* Add New Item */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-[#050A30] text-white px-4 py-2 rounded-md hover:opacity-90 text-sm"
                >
                  + Add New Item
                </button>
              </div>

              {/* Note */}
              <div className="mt-4">
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Terms</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Enter terms"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-[#050A30] text-white px-6 py-3 rounded-md hover:opacity-90 text-sm"
                >
                  {type === 'invoice' ? 'Create Invoice' : 'Create Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
   </>

  );
}
