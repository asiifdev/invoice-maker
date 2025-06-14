// client/src/components/Invoices/InvoiceList.tsx - Enhanced Mobile-First Invoice List
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  SortAsc,
  MoreVertical,
  FileText,
} from "lucide-react";
import { Invoice } from "../../types";
import { InvoiceForm } from "./InvoiceForm";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { useResponsive } from "../../hooks/useResponsive";
import { ResponsiveContainer } from "../Common/ResponsiveContainer";
import { MobileSheet } from "../Common/MobileSheet";
import { AdaptiveModal } from "../Common/AdaptiveModal";

interface InvoiceListProps {
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function InvoiceList({
  onCreateInvoice,
  onViewInvoice,
}: InvoiceListProps) {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Queries and mutations
  const { data: invoices = [], isLoading: loading } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          clients (name)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user?.id,
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceId)
        .eq("user_id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setShowActionSheet(false);
      setSelectedInvoice(null);
    },
  });

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.invoice_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ((invoice as any).clients?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "amount":
          aValue = a.total;
          bValue = b.total;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Event handlers
  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
    setShowActionSheet(false);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (confirm(`Yakin ingin menghapus invoice ${invoice.invoice_number}?`)) {
      deleteInvoiceMutation.mutate(invoice.id);
    }
  };

  const handleInvoiceAction = (
    invoice: Invoice,
    action: "view" | "edit" | "delete"
  ) => {
    setSelectedInvoice(invoice);
    setShowActionSheet(false);

    switch (action) {
      case "view":
        onViewInvoice(invoice);
        break;
      case "edit":
        handleEditInvoice(invoice);
        break;
      case "delete":
        handleDeleteInvoice(invoice);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Lunas";
      case "pending":
        return "Tertunda";
      case "overdue":
        return "Terlambat";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveContainer maxWidth="full">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Invoice
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                Buat, kelola, dan lacak invoice Anda
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {isMobile && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="btn-secondary-mobile"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter & Urutkan
                </button>
              )}
              <button
                onClick={handleCreateInvoice}
                className="btn-primary-mobile"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Desktop Filters */}
          {!isMobile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari invoice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-mobile pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-mobile"
                >
                  <option value="all">Semua Status</option>
                  <option value="paid">Lunas</option>
                  <option value="pending">Tertunda</option>
                  <option value="overdue">Terlambat</option>
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field as any);
                    setSortOrder(order as any);
                  }}
                  className="input-mobile"
                >
                  <option value="date-desc">Terbaru</option>
                  <option value="date-asc">Terlama</option>
                  <option value="amount-desc">Jumlah Tertinggi</option>
                  <option value="amount-asc">Jumlah Terendah</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </div>
            </div>
          )}

          {/* Mobile Search */}
          {isMobile && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-mobile pl-10"
                />
              </div>
            </div>
          )}

          {/* Invoice List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Mobile Invoice Cards */}
            {isMobile ? (
              <div className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {invoice.invoice_number}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {(invoice as any).clients?.name || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={`badge-mobile ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusText(invoice.status)}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowActionSheet(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Rp {invoice.total.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Jatuh tempo:{" "}
                          {new Date(invoice.due_date).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Klien
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {invoice.invoice_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {(invoice as any).clients?.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            Rp {invoice.total.toLocaleString("id-ID")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`badge-mobile ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(invoice.due_date).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onViewInvoice(invoice)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="p-1 text-yellow-600 hover:text-yellow-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredInvoices.length === 0 && (
              <div className="empty-state-mobile">
                <div className="empty-state-icon">
                  <FileText className="w-full h-full" />
                </div>
                <h3 className="empty-state-title">
                  {searchTerm || statusFilter !== "all"
                    ? "Tidak ada invoice yang sesuai"
                    : "Belum ada invoice"}
                </h3>
                <p className="empty-state-description">
                  {searchTerm || statusFilter !== "all"
                    ? "Coba ubah filter pencarian Anda"
                    : "Buat invoice pertama Anda untuk mulai mengelola bisnis"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button
                    onClick={handleCreateInvoice}
                    className="btn-primary-mobile"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Invoice
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </ResponsiveContainer>

      {/* Mobile Filter Sheet */}
      <MobileSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter & Urutkan"
      >
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-mobile"
            >
              <option value="all">Semua Status</option>
              <option value="paid">Lunas</option>
              <option value="pending">Tertunda</option>
              <option value="overdue">Terlambat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan berdasarkan
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="input-mobile"
            >
              <option value="date-desc">Terbaru</option>
              <option value="date-asc">Terlama</option>
              <option value="amount-desc">Jumlah Tertinggi</option>
              <option value="amount-asc">Jumlah Terendah</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(false)}
            className="btn-primary-mobile w-full"
          >
            Terapkan Filter
          </button>
        </div>
      </MobileSheet>

      {/* Mobile Action Sheet */}
      <MobileSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title={selectedInvoice?.invoice_number}
      >
        <div className="p-4 space-y-2">
          <button
            onClick={() => handleInvoiceAction(selectedInvoice!, "view")}
            className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg"
          >
            <Eye className="w-5 h-5 text-blue-600 mr-3" />
            <span>Lihat Invoice</span>
          </button>
          <button
            onClick={() => handleInvoiceAction(selectedInvoice!, "edit")}
            className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg"
          >
            <Edit className="w-5 h-5 text-yellow-600 mr-3" />
            <span>Edit Invoice</span>
          </button>
          <button
            onClick={() => handleInvoiceAction(selectedInvoice!, "delete")}
            className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg text-red-600"
          >
            <Trash2 className="w-5 h-5 mr-3" />
            <span>Hapus Invoice</span>
          </button>
          <div className="border-t border-gray-200 my-2"></div>
          <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg">
            <Download className="w-5 h-5 text-green-600 mr-3" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </MobileSheet>

      {/* Invoice Form Modal */}
      <AdaptiveModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? "Edit Invoice" : "Buat Invoice Baru"}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onClose={() => {
            setShowForm(false);
            setEditingInvoice(null);
          }}
        />
      </AdaptiveModal>
    </div>
  );
}
