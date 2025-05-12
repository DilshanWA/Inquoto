'use client';

import { useState } from 'react';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormProps {
  handleCloseForm: () => void;
  type: 'invoice' | 'quotation'; // <-- NEW PROP to differentiate
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
      : 'http://localhost:5000/api/quotation';

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
    } else {
      console.error(`Failed to submit ${type}`);
    }
  } catch (error) {
    console.error(`Error submitting ${type}:`, error);
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
            <h2 className="text-xl font-bold text-black capitalize">
              {type === 'invoice' ? 'Create Invoice' : 'Create Quotation'}
            </h2>

            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-medium">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Customer Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                  placeholder="Customer address"
                />
              </div>
              <div>
                <label className="block font-medium">Validity</label>
                <input
                  type="date"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
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
            {items.map((item, index) => (
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
                <div className="col-span-1 text-center text-black">Rs{item.total.toFixed(2)}</div>
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any special notes here..."
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block font-medium">Terms & Conditions</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3"
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Write your terms & conditions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 mt-10">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Generate {type === 'invoice' ? 'Invoice' : 'Quotation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
