import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { DollarSign, FileText, Users, AlertCircle, Eye, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Invoice, Client } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user?.id,
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user?.id,
  });

  const loading = invoicesLoading || clientsLoading;

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const overdue = invoices.filter(inv => inv.status === 'overdue').length;
  const totalClients = clients.length;

  const recentInvoices = invoices.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dasbor</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                Selamat datang kembali! Berikut ringkasan bisnis Anda.
              </p>
            </div>
            {/* Quick Actions Mobile */}
            <div className="flex flex-wrap gap-2 sm:hidden">
              <button className="flex-1 min-w-0 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                Buat Invoice
              </button>
              <button className="flex-1 min-w-0 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
                Tambah Klien
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Total Pendapatan"
            value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
            change="+12.5% dari bulan lalu"
            trend="up"
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Invoice Tertunda"
            value={`Rp ${pendingAmount.toLocaleString('id-ID')}`}
            change={`${invoices.filter(i => i.status === 'pending').length} invoice tertunda`}
            trend="neutral"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Total Klien"
            value={totalClients.toString()}
            change="+2 klien baru bulan ini"
            trend="up"
            icon={Users}
            color="orange"
          />
          <StatsCard
            title="Terlambat"
            value={overdue.toString()}
            change="Perlu perhatian"
            trend="down"
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Recent Invoices - Mobile Optimized */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Terbaru</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {/* Mobile Invoice Cards */}
          <div className="block sm:hidden">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {invoice.invoice_number}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {(invoice as any).clients?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
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
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Rp {invoice.total.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Jatuh tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(invoice as any).clients?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rp {invoice.total.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Lunas' : 
                         invoice.status === 'pending' ? 'Tertunda' : 'Terlambat'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-700 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentInvoices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada invoice</h3>
              <p className="text-gray-500 mb-4">Buat invoice pertama Anda untuk mulai mengelola bisnis</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Buat Invoice
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Invoice Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Klien Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Invoice</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {invoices.length > 0 ? Math.round(totalRevenue / invoices.length).toLocaleString('id-ID') : '0'}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {recentInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada invoice. Buat invoice pertama Anda!</p>
          </div>
        )}
      </div>
    </div>
  );
}