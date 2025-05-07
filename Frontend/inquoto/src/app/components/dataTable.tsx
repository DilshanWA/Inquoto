import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const url =
          type === 'quotation'
            ? 'http://localhost:5000/api/quotations'
            : 'http://localhost:5000/api/invoices';

        const response = await axios.get(url);
        setDocuments(response.data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, [type]);

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
          {documents.map((doc) => (
            <tr key={doc.id || doc.documentId}>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.id || doc.documentId}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.client || doc.clientName}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.total || doc.amount}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.status}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.createdDate || doc.date}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">{doc.createdBy || doc.creator}</td>
              <td className="px-6 py-4 text-sm text-blue-600 text-left cursor-pointer hover:underline">Download Pdf</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
