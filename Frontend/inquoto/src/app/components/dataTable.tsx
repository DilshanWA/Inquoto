import React, { useEffect, useState } from 'react';
import { useSearch } from "@/app/context/SearchContext";

type Document = {
  id?: string;
  documentId?: string;
  client?: string;
  customerName?: string;
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
  date?: string;
  userName?: string;
  creator?: string;
};

type DocumentTableProps = {
  type: 'quotation' | 'invoice';
};

const DocumentTable: React.FC<DocumentTableProps> = ({ type }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const shouldSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const url =
          type === 'quotation'
            ? 'http://localhost:5000/api/vi/getAll-quotations'
            : 'http://localhost:5000/api/vi/getAll-invoices';

        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch documents');

        const data = await response.json();
        setDocuments(type === 'quotation' ? data.quotations || [] : data.invoices || []);
      } catch (error: any) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [type]);

  const filteredDocs = documents.filter((doc) => {
  const query = searchQuery.toLowerCase();
  return (
    doc.documentId?.toLowerCase().startsWith(query) ||
    doc.customerName?.toLowerCase().startsWith(query) ||
    doc.userName?.toLowerCase().startsWith(query) ||
    doc.creator?.toLowerCase().startsWith(query)
  );
});


  const docsToRender = shouldSearch ? filteredDocs : documents;
  const paginatedDocs = docsToRender.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
  setCurrentPage(1);
}, [searchQuery]);


const highlightMatch = (text: string = '', query: string = '') => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200 font-semibold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};


  const GenPdf = async (document: Document) => {
  try {
    const url =
      type === 'quotation'
        ? 'http://localhost:5000/api/vi/quotations/pdf'
        : 'http://localhost:5000/api/vi/Create-invoice-pdf';

    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(document),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate PDF');
    }

    console.log('PDF generation response:', data);
  } catch (error: any) {
    console.error('Error generating PDF:', error.message);
    setError(error.message);
  }
};


  const handleStatusChange = async (document: Document, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const url = type === 'quotation'
        ? `http://localhost:5000/api/vi/update-quotation-status/${document.documentId}`
        : `http://localhost:5000/api/vi/update-invoice-status/${document.documentId}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          (doc.documentId === document.documentId || doc.id === document.id)
            ? { ...doc, status: newStatus }
            : doc
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDocs.map((doc) => (
                <tr key={doc.id || doc.documentId}>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.documentId || doc.id, searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.client || doc.customerName, searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.total || doc.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
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
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {highlightMatch(doc.userName || doc.creator, searchQuery)}
                  </td>
                  <td className='px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline'>View PDF</td>
                  <td
                    onClick={() => GenPdf(doc)}
                    className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    Download PDF
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {docsToRender.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage}</span>
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
