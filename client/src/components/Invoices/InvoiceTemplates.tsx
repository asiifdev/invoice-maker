import React from 'react';
import { Invoice, Client, Company, InvoiceItem } from '../../types';

interface InvoiceTemplateProps {
  invoice: Invoice;
  client: Client | null;
  company: Company | null;
  items: InvoiceItem[];
  template: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
}

export function ModernTemplate({ invoice, client, company, items }: InvoiceTemplateProps) {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="border-l-4 border-blue-600 pl-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              {company?.logo_url && (
                <img 
                  src={company.logo_url} 
                  alt="Company Logo" 
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-blue-600">{company?.name || 'Nama Perusahaan'}</h1>
                <p className="text-gray-600">{company?.website}</p>
              </div>
            </div>
            <div className="text-gray-600 space-y-1">
              <p>{company?.address}</p>
              <p>{company?.city}, {company?.country}</p>
              <p>{company?.phone}</p>
              <p>{company?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-lg font-semibold text-gray-700">{invoice.invoice_number}</p>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Amount</p>
              <p className="text-xl font-bold text-blue-700">Rp {invoice.total.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b border-gray-200 pb-1">Tagihan Kepada:</h3>
            <div className="text-gray-900 space-y-1">
              <p className="font-semibold text-lg">{client?.name}</p>
              <p>{client?.address}</p>
              <p>{client?.city}, {client?.country}</p>
              <p>{client?.email}</p>
              <p>{client?.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Tanggal Terbit:</p>
                <p className="text-gray-900 font-medium">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Jatuh Tempo:</p>
                <p className="text-gray-900 font-medium">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Status:</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : invoice.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invoice.status === 'paid' ? 'Lunas' : 
                   invoice.status === 'pending' ? 'Tertunda' : 'Terlambat'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-200 bg-blue-50">
                <th className="text-left py-4 px-4 font-semibold text-blue-800">Deskripsi</th>
                <th className="text-center py-4 px-4 font-semibold text-blue-800">Qty</th>
                <th className="text-right py-4 px-4 font-semibold text-blue-800">Harga</th>
                <th className="text-right py-4 px-4 font-semibold text-blue-800">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-gray-900">{item.quantity}</td>
                  <td className="text-right py-4 px-4 text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">Rp {Number(item.total).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Pajak (11%):</span>
                <span className="font-semibold text-gray-900">Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 uppercase mb-2">Catatan:</h3>
            <p className="text-blue-700">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            Terima kasih atas kepercayaan Anda. Untuk pertanyaan, hubungi kami di {company?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClassicTemplate({ invoice, client, company, items }: InvoiceTemplateProps) {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto border-2 border-gray-800">
      <div className="border-b-4 border-gray-800 pb-6 mb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            {company?.logo_url && (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className="w-20 h-20 object-contain"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-wide">{company?.name || 'Nama Perusahaan'}</h1>
              <p className="text-gray-600 italic">{company?.website}</p>
            </div>
          </div>
          <div className="text-gray-700">
            <p>{company?.address} • {company?.city}, {company?.country}</p>
            <p>{company?.phone} • {company?.email}</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest">INVOICE</h2>
          <p className="text-xl font-semibold text-gray-600 mt-2">{invoice.invoice_number}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border border-gray-300 p-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 bg-gray-100 p-2 -m-4 mb-4">Tagihan Kepada:</h3>
          <div className="text-gray-900 space-y-1">
            <p className="font-bold text-lg">{client?.name}</p>
            <p>{client?.address}</p>
            <p>{client?.city}, {client?.country}</p>
            <p>{client?.email}</p>
            <p>{client?.phone}</p>
          </div>
        </div>
        <div className="border border-gray-300 p-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 bg-gray-100 p-2 -m-4 mb-4">Detail Invoice:</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-600">Tanggal Terbit:</p>
              <p className="text-gray-900 font-medium">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Jatuh Tempo:</p>
              <p className="text-gray-900 font-medium">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Amount:</p>
              <p className="text-2xl font-bold text-gray-800">Rp {Number(invoice.total).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-2 border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left py-3 px-4 font-bold uppercase">Deskripsi</th>
              <th className="text-center py-3 px-4 font-bold uppercase">Qty</th>
              <th className="text-right py-3 px-4 font-bold uppercase">Harga</th>
              <th className="text-right py-3 px-4 font-bold uppercase">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 italic">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-gray-900 font-medium">{item.quantity}</td>
                <td className="text-right py-3 px-4 text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                <td className="text-right py-3 px-4 font-bold text-gray-900">Rp {Number(item.total).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 border-2 border-gray-800">
          <div className="bg-gray-100 p-4 space-y-2">
            <div className="flex justify-between py-1">
              <span className="font-semibold text-gray-700">Subtotal:</span>
              <span className="font-bold text-gray-900">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-gray-700">Pajak (11%):</span>
              <span className="font-bold text-gray-900">Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t-2 border-gray-800 pt-2">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-gray-800 uppercase">Total:</span>
                <span className="text-xl font-bold text-gray-800">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 border border-gray-300 p-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 bg-gray-100 p-2 -m-4 mb-4">Catatan:</h3>
          <p className="text-gray-700 italic">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-800 pt-4 text-center">
        <p className="text-sm text-gray-600 font-medium">
          Terima kasih atas kepercayaan Anda • {company?.email} • {company?.phone}
        </p>
      </div>
    </div>
  );
}

export function MinimalTemplate({ invoice, client, company, items }: InvoiceTemplateProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center space-x-4">
          {company?.logo_url && (
            <img 
              src={company.logo_url} 
              alt="Company Logo" 
              className="w-12 h-12 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-light text-gray-900">{company?.name || 'Nama Perusahaan'}</h1>
            <p className="text-gray-500 text-sm">{company?.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-gray-900">Invoice</h2>
          <p className="text-gray-600 mt-1">{invoice.invoice_number}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Bill To</h3>
          <div className="text-gray-900 space-y-1">
            <p className="font-medium">{client?.name}</p>
            <p className="text-sm text-gray-600">{client?.address}</p>
            <p className="text-sm text-gray-600">{client?.city}, {client?.country}</p>
            <p className="text-sm text-gray-600">{client?.email}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue Date</p>
              <p className="text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</p>
              <p className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount Due</p>
              <p className="text-2xl font-light text-gray-900">Rp {Number(invoice.total).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-center py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Qty</th>
              <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Rate</th>
              <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4">
                  <div>
                    <p className="text-gray-900">{item.product_name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-4 text-gray-900">{item.quantity}</td>
                <td className="text-right py-4 text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                <td className="text-right py-4 text-gray-900">Rp {Number(item.total).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Tax (11%)</span>
            <span className="text-gray-900">Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-lg font-medium text-gray-900">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
          <p className="text-gray-700 text-sm">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        <p>{company?.address} • {company?.city}, {company?.country}</p>
        <p>{company?.phone} • {company?.email}</p>
      </div>
    </div>
  );
}

export function ProfessionalTemplate({ invoice, client, company, items }: InvoiceTemplateProps) {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 -m-8 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {company?.logo_url && (
              <div className="w-16 h-16 bg-white rounded-lg p-2">
                <img 
                  src={company.logo_url} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{company?.name || 'Nama Perusahaan'}</h1>
              <p className="text-gray-300">{company?.website}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold">INVOICE</h2>
            <p className="text-xl text-gray-300">{invoice.invoice_number}</p>
          </div>
        </div>
        <div className="mt-4 text-gray-300 text-sm">
          <p>{company?.address} • {company?.city}, {company?.country}</p>
          <p>{company?.phone} • {company?.email}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Tagihan Kepada:</h3>
            <div className="text-gray-900 space-y-1">
              <p className="font-semibold text-lg">{client?.name}</p>
              <p>{client?.address}</p>
              <p>{client?.city}, {client?.country}</p>
              <p>{client?.email}</p>
              <p>{client?.phone}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Detail Invoice:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Terbit:</span>
                <span className="font-medium">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jatuh Tempo:</span>
                <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-gray-800">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white p-3 rounded-t-lg">
          <div className="grid grid-cols-12 gap-4 font-semibold text-sm">
            <div className="col-span-6">DESKRIPSI</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">HARGA</div>
            <div className="col-span-2 text-right">JUMLAH</div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-b-lg">
          {items.map((item, index) => (
            <div key={index} className={`grid grid-cols-12 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${index === items.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-200'}`}>
              <div className="col-span-6">
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <div className="col-span-2 text-center text-gray-900">{item.quantity}</div>
              <div className="col-span-2 text-right text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</div>
              <div className="col-span-2 text-right font-semibold text-gray-900">Rp {Number(item.total).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pajak (11%):</span>
              <span className="font-semibold">Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-gray-800">TOTAL:</span>
                <span className="text-xl font-bold text-gray-800">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <h3 className="text-sm font-semibold text-blue-800 uppercase mb-2">Catatan:</h3>
          <p className="text-blue-700">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
        <p className="font-medium">Terima kasih atas kepercayaan Anda!</p>
        <p>Untuk pertanyaan, hubungi kami di {company?.email} atau {company?.phone}</p>
      </div>
    </div>
  );
}

export function CreativeTemplate({ invoice, client, company, items }: InvoiceTemplateProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full transform rotate-45"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {company?.logo_url && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-purple-200">
                <img 
                  src={company.logo_url} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {company?.name || 'Nama Perusahaan'}
              </h1>
              <p className="text-gray-600">{company?.website}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-purple-100">{invoice.invoice_number}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-gray-600 text-sm">
          <p>{company?.address} • {company?.city}, {company?.country}</p>
          <p>{company?.phone} • {company?.email}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-sm font-bold text-purple-800 uppercase mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Tagihan Kepada
          </h3>
          <div className="text-gray-900 space-y-1">
            <p className="font-bold text-lg text-purple-800">{client?.name}</p>
            <p>{client?.address}</p>
            <p>{client?.city}, {client?.country}</p>
            <p>{client?.email}</p>
            <p>{client?.phone}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">Tanggal Terbit</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">Jatuh Tempo</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg">
            <p className="text-xs font-semibold text-purple-100 uppercase">Total Amount</p>
            <p className="text-2xl font-bold">Rp {Number(invoice.total).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-xl">
          <div className="grid grid-cols-12 gap-4 font-bold text-sm">
            <div className="col-span-6">DESKRIPSI</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">HARGA</div>
            <div className="col-span-2 text-right">JUMLAH</div>
          </div>
        </div>
        <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
          {items.map((item, index) => (
            <div key={index} className={`grid grid-cols-12 gap-4 p-4 ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'} ${index !== items.length - 1 ? 'border-b border-purple-100' : ''}`}>
              <div className="col-span-6">
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <div className="col-span-2 text-center text-gray-900 font-medium">{item.quantity}</div>
              <div className="col-span-2 text-right text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</div>
              <div className="col-span-2 text-right font-bold text-purple-700">Rp {Number(item.total).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border border-purple-200">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (11%):</span>
                <span className="font-semibold text-gray-900">Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-purple-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-purple-800">TOTAL:</span>
                  <span className="text-xl font-bold text-purple-800">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-6 rounded-r-xl">
          <h3 className="text-sm font-bold text-purple-800 uppercase mb-2 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Catatan
          </h3>
          <p className="text-purple-700">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
          <p className="font-semibold">Terima kasih atas kepercayaan Anda!</p>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Untuk pertanyaan, hubungi kami di {company?.email}
        </p>
      </div>
    </div>
  );
}