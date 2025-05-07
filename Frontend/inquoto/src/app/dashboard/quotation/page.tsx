'use client';

import { useState } from 'react';
import InvoiceForm from '@/app/components/InvoiceForm';
import DocumentTable from '@/app/components/dataTable';


export default function QuotationPage() {
   const [isFormVisible, setIsFormVisible] = useState(false);
   
     const handleCreateInvoiceClick = () => {
       setIsFormVisible(true); 
     };
   
     const handleCloseForm = () => {
       setIsFormVisible(false); 
     };
   
     return (
      <div className="p-6">
          <h1 className="text-2xl mb-6 font-bold">Quotation Page</h1>

        <DocumentTable type="quotation" />

         {!isFormVisible && (
           <button
             onClick={handleCreateInvoiceClick}
             className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           >
             Create Quotation
           </button>
         )}
         {isFormVisible && <InvoiceForm handleCloseForm={handleCloseForm} />}
       </div>   
     );
  }
  