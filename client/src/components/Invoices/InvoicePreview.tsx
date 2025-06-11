import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Invoice, Client, Company } from '../../types';
import { supabase } from '../../lib/supabase';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoice.id]);

  const fetchInvoiceDetails = async () => {
    try {
      const [clientResult, companyResult, itemsResult] = await Promise.all([
        supabase
          .from('clients')
          .select('*')
          .eq('id', invoice.client_id)
          .single(),
        supabase
          .from('companies')
          .select('*')
          .eq('id', invoice.company_id)
          .single(),
        supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id)
      ]);

      if (clientResult.data) setClient(clientResult.data);
      if (companyResult.data) setCompany(companyResult.data);
      if (itemsResult.data) setItems(itemsResult.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    const commonContent = (
      <>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{company?.name || 'Nama Perusahaan'}</h1>
            <div className="mt-2 text-gray-600">
              <p>{company?.address}</p>
              <p>{company?.city}, {company?.country}</p>
              <p>{company?.phone}</p>
              <p>{company?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-lg font-semibold text-gray-700">{invoice.invoice_number}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Tagihan Kepada:</h3>
            <div className="text-gray-900">
              <p className="font-semibold">{client?.name}</p>
              <p>{client?.address}</p>
              <p>{client?.city}, {client?.country}</p>
              <p>{client?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Tanggal Terbit:</p>
                <p className="text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Jatuh Tempo:</p>
                <p className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-600">Deskripsi</th>
                <th className="text-right py-3 font-semibold text-gray-600">Qty</th>
                <th className="text-right py-3 font-semibold text-gray-600">Harga</th>
                <th className="text-right py-3 font-semibold text-gray-600">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </td>
                  <td className="text-right py-3 text-gray-900">{item.quantity}</td>
                  <td className="text-right py-3 text-gray-900">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="text-right py-3 font-semibold text-gray-900">Rp {item.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">Rp {invoice.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Pajak (11%):</span>
              <span className="font-semibold text-gray-900">Rp {invoice.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-blue-600">Rp {invoice.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Catatan:</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </>
    );

    switch (invoice.template) {
      case 'modern':
        return (
          <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
            <div className="border-l-4 border-blue-600 pl-6">
              {commonContent}
            </div>
          </div>
        );
      
      case 'classic':
        return (
          <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto border-2 border-gray-300">
            <div className="border-b-4 border-gray-800 pb-6 mb-6">
              {commonContent}
            </div>
          </div>
        );
      
      case 'minimal':
        return (
          <div className="bg-white p-8 max-w-4xl mx-auto">
            {commonContent}
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
            {commonContent}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pratinjau Invoice</h2>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2" />
              Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 bg-gray-50">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}