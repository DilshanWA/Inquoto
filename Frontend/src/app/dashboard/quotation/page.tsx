'use client';

import { useState } from 'react';
import InvoiceForm from '@/app/components/InvoiceForm';
import DocumentTable from '@/app/components/dataTable';

interface Document {
  id?: string;
  documentId?: string;
  customerName?: string;
  customerAddress?: string;
  address?: string;
  date?: string;
  validity?: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  note?: string;
  terms?: string;
}


export default function QuotationPage() {
   const [isFormVisible, setIsFormVisible] = useState(false);
   const [editingDoc, setEditingDoc] = useState<Document | null>(null);
   
     const handleCreateInvoiceClick = () => {
       setEditingDoc(null);
       setIsFormVisible(true); 
     };
   
     const handleCloseForm = () => {
       setIsFormVisible(false); 
       setEditingDoc(null);
     };

    const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setIsFormVisible(true);
     };
   
     return (
      <div className="p-6">
          <h1 className="text-2xl mb-6 font-bold">Quotations</h1>

        {!isFormVisible && (
          <>
          <button
             onClick={handleCreateInvoiceClick}
             className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           >
             Create New Quotation
           </button>
            <DocumentTable type="Quotation"  onEditDocument={handleEditDocument}/>
          </>
           
         )}
         
         {isFormVisible && 
            <InvoiceForm 
            type='quotation' 
            initialData={editingDoc ? mapDocToInitialData(editingDoc) : undefined}
            handleCloseForm={handleCloseForm} />}
       </div>   
     );
  }
  
  function mapDocToInitialData(doc: Document) {
  return {
    id: doc.id || doc.documentId || '',
    customerName: doc.customerName || '',
    customerAddress: doc.customerAddress || '', 
    date: doc.date || '',
    validity: doc.validity || '',
    items: doc.items || [{ description: '', quantity: 0, unitPrice: 0, total: 0 }],
    note: doc.note || '',
    terms: doc.terms || '',
  };
}