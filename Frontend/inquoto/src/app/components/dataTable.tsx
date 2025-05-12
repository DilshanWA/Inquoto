import React, { useEffect, useState } from 'react';

type Document = {
  id?: string;
  documentId?: string;
  client?: string;
  clientName?: string;
  total?: number;
  amount?: number;
  status?: string;
  createdDate?: string;
  date?: string;
  createdBy?: string;
  creator?: string;
};

type DocumentTableProps = {
  type: 'quotation' | 'invoice';
};

const DocumentTable: React.FC<DocumentTableProps> = ({ type }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchDocuments = async () => {
      setLoading(true);  // Start loading
      try {
        const url =
          type === 'quotation'
            ? 'http://localhost:5000/api/quotations'
            : 'http://localhost:5000/api/invoice/getAll-invoices';

        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await response.json();
        setDocuments(data.invoices);
      } catch (error: any) {
        setError('Failed to fetch documents');
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchDocuments();
  }, [type]);









  const GenPdf = async (document: Document) => {
    try {
      const url =
        type === 'quotation'
          ? 'http://localhost:5000/api/quotations/pdf'
          : 'http://localhost:5000/api/invoice/Create-invoice-pdf';
  
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invoice/Create-invoice-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(document),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
  
      // const blob = await response.blob();
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = `${document.documentId || document.id}.pdf`;
      // link.click();
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };
  




  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(documents) && documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id || doc.documentId}>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.id || doc.documentId}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.client || doc.clientName}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.total || doc.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.status}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.createdDate || doc.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.createdBy || doc.creator}</td>
                <td onClick={() => GenPdf(doc)} className="px-6 py-4 text-sm text-blue-600 text-left cursor-pointer hover:underline">
                  Download Pdf
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center px-6 py-4 text-sm text-gray-500">
                No documents available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
