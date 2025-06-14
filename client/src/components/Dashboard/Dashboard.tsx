import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { DollarSign, FileText, Users, AlertCircle, Calendar, Clock, Plus } from 'lucide-react';
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

  // Calculate growth percentages (mock data for demo)
  const revenueGrowth = "+12.5%";
  const clientGrowth = "+8.2%";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dasbor</h1>
          <p className="mt-1 text-sm lg:text-base text-gray-600">
            Selamat datang kembali! Berikut ringkasan bisnis Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <span className="sm:hidden">
            {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
          change={`${revenueGrowth} dari bulan lalu`}
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
          change={`${clientGrowth} klien baru bulan ini`}
          trend="up"
          icon={Users}
          color="orange"
        />
        <StatsCard
          title="Terlambat"
          value={overdue.toString()}
          change="Perlu perhatian segera"
          trend={overdue > 0 ? "down" : "neutral"}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Invoice Terbaru</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua
                </button>
              </div>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(invoice as any).clients?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Rp {invoice.total.toLocaleString('id-ID')}</div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="lg:hidden divide-y divide-gray-200">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
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
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{(invoice as any).clients?.name || 'N/A'}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Rp {invoice.total.toLocaleString('id-ID')}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recentInvoices.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Belum ada invoice. Buat invoice pertama Anda!</p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Invoice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Takes 1 column on large screens */}
        <div className="space-y-6">
          {/* Monthly Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Bulan Ini</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Invoice Dikirim</span>
                <span className="text-sm font-medium text-gray-900">{invoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Invoice Lunas</span>
                <span className="text-sm font-medium text-green-600">
                  {invoices.filter(i => i.status === 'paid').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rata-rata Nilai</span>
                <span className="text-sm font-medium text-gray-900">
                  Rp {invoices.length > 0 ? Math.round(invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length).toLocaleString('id-ID') : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Buat Invoice Baru
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Klien
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </button>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Performa Bisnis</h3>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-blue-100 text-sm mb-3">
              Bisnis Anda berkembang dengan baik bulan ini
            </p>
            <div className="text-2xl font-bold">
              {revenueGrowth}
            </div>
            <p className="text-blue-100 text-xs">
              Pertumbuhan pendapatan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}