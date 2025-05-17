'use client';
import React, { useEffect, useState } from 'react';
import { useSearch } from '@/app/context/SearchContext';
import PopupMessage from '../messages/InvQuoMsg/SuccessPopup';
import Message from './../messages/InvQuoMsg/SuccessPopup';

type Document = {
  id?: string;
  documentId?: string;
  client?: string;
  customerName?: string;
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
  userName?: string;
  creator?: string;
  [key: string]: any;
};

type DocumentTableProps = {
  type: 'Quotation' | 'Invoice';
  onEditDocument?: (doc: Document) => void;
  
};

const DocumentTable: React.FC<DocumentTableProps> = ({ type, onEditDocument }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const userRole = localStorage.getItem('role')

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const shouldSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const url =
          type === 'Quotation'
            ? 'http://localhost:5000/api/vi/getAll-quotations'
            : 'http://localhost:5000/api/vi/getAll-invoices';

        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch documents');

        const data = await response.json();
        setDocuments(type === 'Quotation' ? data.quotations || [] : data.invoices || []);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [type]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.documentId?.toLowerCase().startsWith(query) ||
      doc.customerName?.toLowerCase().startsWith(query) ||
      doc.client?.toLowerCase().startsWith(query) ||
      doc.userName?.toLowerCase().startsWith(query) ||
      doc.creator?.toLowerCase().startsWith(query)
    );
  });

  const docsToRender = shouldSearch ? filteredDocs : documents;
  const paginatedDocs = docsToRender.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const highlightMatch = (text: string = '', query: string = '') => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

const handleStatusChange = async (document: Document, newStatus: string) => {
  try {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    const documentId = document.documentId || document.id;

    console.log(newStatus);
    console.log(documentId);

    const url =
      type === 'Quotation'
        ? `http://localhost:5000/api/vi/quotations-state/${documentId}`
        : `http://localhost:5000/api/vi/invoices-state/${documentId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
        'user-email': userEmail || '',
      },
      body: JSON.stringify({ state: newStatus }), // match your backend expectation
    });

    if (!response.ok) throw new Error('Failed to update status');

      setDocuments((prev) =>
        prev.map((docItem) =>
          (docItem.documentId && docItem.documentId === document.documentId) ||
          (docItem.id && docItem.id === document.id)
            ? { ...docItem, status: newStatus }
            : docItem
        )
      );

  } catch (err) {
    console.error(err);
    setError('Failed to update status');
  }
};
 
const GenPdf = async (doc: Document) => {
    try {
      const url =
        type === 'Quotation'
          ? 'http://localhost:5000/api/vi/create-pdf'
          : 'http://localhost:5000/api/vi/create-pdf';

      const token = localStorage.getItem('token');

      const payload = {
        ...doc,
        docType: type,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const pdfURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = pdfURL;
      link.download = `${doc.id || 'document'}.pdf`;
      link.click();

      return pdfURL;

    } catch (error) {
      console.error(error);
      setError('Failed to generate PDF');
    }
  };

  const handleViewPdf = async (doc: Document) => {
         try {
      const url =
        type === 'Quotation'
          ? 'http://localhost:5000/api/vi/create-pdf'
          : 'http://localhost:5000/api/vi/create-pdf';

      const token = localStorage.getItem('token');

      const payload = {
        ...doc,
        docType: type,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const pdfURL = window.URL.createObjectURL(blob);

      window.open(pdfURL, '_blank')

    } catch (error) {
      console.error(error);
      setError('Failed to generate PDF');
    }
  };

  // New: Handle Edit
  const handleEdit = (doc: Document) => {
    if (!window.confirm(`Are you sure you want to edit document "${doc.documentId || doc.id}"?`)) return;
    const currentUser = localStorage.getItem('uid');
    const role = localStorage.getItem('role');
    if (doc.userID !== currentUser && role !== 'super_admin') {
      alert('You cannot edit a document that you did not create.');
      return;
    }

    if (onEditDocument) {
      onEditDocument(doc);   // Pass doc to parent to open form
    }
  };

  // New: Handle Delete
const handleDelete = async (doc: Document) => {
  if (!window.confirm(`Are you sure you want to delete document "${doc.documentId || doc.id}"?`)) return;

  try {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    const url = type === 'Quotation'
      ? `http://localhost:5000/api/vi/delete-quotations/${doc.quotationId}`
      : `http://localhost:5000/api/vi/delete-invoices/${doc.invoiceId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-email': userEmail || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete document');
    }

    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  } catch (err) {
    console.error(err);
    setError('Failed to delete document');
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-4">
      <div className="overflow-x-auto max-h-[1000px] overflow-y-auto border border-gray-200 rounded-lg">
        {shouldSearch && docsToRender.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No matching documents found.</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-300 sticky top-0 z-0">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Document ID</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Client</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Total</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Status</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Created Date</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Created By</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Preview</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Download</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Edit</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-black uppercase">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDocs.map((doc) => (
                <tr key={doc.id || doc.documentId}>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.documentId || doc.id || '', searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.client || doc.customerName || '', searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.total ?? doc.amount ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {userRole === 'super_admin' ? (
                      <select
                        value={doc.status || 'Pending'}
                        onChange={(e) => handleStatusChange(doc, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          doc.status === 'Completed' ? 'bg-blue-100 text-blue-800' : ''}
                      `}
                    >
                      {doc.status}
                    </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.userName || doc.creator || '', searchQuery)}
                  </td>
                  <td
                    onClick={() => handleViewPdf(doc)}
                    className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    View PDF
                  </td>
                  <td
                    onClick={() => GenPdf(doc)}
                    className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    Download PDF
                  </td>
               
                  <td
                      onClick={() => handleEdit(doc)}
                      className="px-6 py-4 text-sm text-green-600 cursor-pointer hover:underline"
                      title="Edit document"
                    >
                      ✏️
                  </td>
                  <td
                    onClick={() => handleDelete(doc)}
                    className="px-6 py-4 text-sm text-red-600 cursor-pointer hover:underline"
                    title="Delete document"
                  >
                    🗑️
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
      </div>

      {docsToRender.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {Math.ceil(docsToRender.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * itemsPerPage < docsToRender.length ? prev + 1 : prev
              )
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage * itemsPerPage >= docsToRender.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
