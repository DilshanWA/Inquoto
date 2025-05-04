'use client';

import { useState } from 'react';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormProps {
  handleCloseForm: () => void;
}

export default function InvoiceForm({ handleCloseForm }: InvoiceFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState('');
  const [validity, setValidity] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 0, unitPrice: 0 },
  ]);
  const [note, setNote] = useState('');
  const [terms, setTerms] = useState('');

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 0, unitPrice: 0 }]);
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
    setItems(updatedItems);
  };

  const getTotal = (item: LineItem) => item.quantity * item.unitPrice;

  return (
    <div className="w-full h-full flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white p-6 rounded shadow-md relative">
        {/* Close Button */}
        <button
          onClick={handleCloseForm}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          X
        </button>

        <form className="space-y-6 mt-4">
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-black font-medium">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Customer Address</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
                placeholder="Customer address"
              />
            </div>
            <div>
              <label className="block font-medium">Validity</label>
              <input
                type="date"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Table Header (Hidden on mobile) */}
          <div className="hidden sm:grid grid-cols-5 bg-gray-200 font-medium text-black px-2 py-1 rounded">
            <div>No</div>
            <div>Description</div>
            <div>Quantity</div>
            <div>Unit Price</div>
            <div>Total</div>
          </div>

          {/* Line Items */}
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 py-2 border-b border-gray-200 items-center">
              <div className="font-semibold">{index + 1}</div>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChangeItem(index, 'description', e.target.value)}
                className="border border-gray-300 text-gray-700 px-2 py-1 rounded"
                placeholder="Description"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleChangeItem(index, 'quantity', e.target.value)}
                className="border border-gray-300 text-gray-700 px-2 py-1 rounded"
                placeholder="Qty"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleChangeItem(index, 'unitPrice', e.target.value)}
                className="border border-gray-300 text-gray-700 px-2 py-1 rounded"
                placeholder="Unit Price"
              />
              <div className="text-black">{getTotal(item).toFixed(2)}</div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="bg-[#050A30] text-white px-4 py-2 rounded hover:opacity-90"
          >
            + Add New
          </button>

          {/* Notes and Terms */}
          <div>
            <label className="block font-medium">Note</label>
            <textarea
              className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any special notes here..."
            />
          </div>
          <div>
            <label className="block font-medium">Terms & Conditions</label>
            <textarea
              className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Write your terms & conditions..."
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
