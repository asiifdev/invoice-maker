import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Settings, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface InvoiceSettings {
  id?: string;
  invoice_pattern: string;
  next_number: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export function InvoiceSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pattern, setPattern] = useState('INV{DD}{MM}{YY}{###}');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['invoice-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('invoice_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as InvoiceSettings | null;
    },
    enabled: !!user?.id,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<InvoiceSettings>) => {
      if (settings?.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('invoice_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .eq('user_id', user?.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('invoice_settings')
          .insert([{ ...settingsData, user_id: user?.id }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-settings', user?.id] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const settingsData: Partial<InvoiceSettings> = {
      invoice_pattern: formData.get('pattern') as string,
      next_number: parseInt(formData.get('next_number') as string) || 1,
    };
    
    saveSettingsMutation.mutate(settingsData);
  };

  const generatePreview = (patternInput: string) => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const nextNumber = (settings?.next_number || 1).toString().padStart(3, '0');

    return patternInput
      .replace('{DD}', day)
      .replace('{MM}', month)
      .replace('{YY}', year)
      .replace('{YYYY}', now.getFullYear().toString())
      .replace('{###}', nextNumber)
      .replace('{##}', nextNumber.slice(-2))
      .replace('{#}', (settings?.next_number || 1).toString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Invoice</h1>
          </div>
          <p className="mt-1 text-gray-600">Atur format nomor invoice dan pengaturan lainnya</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pola Nomor Invoice
                  </label>
                  <input
                    type="text"
                    name="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    defaultValue={settings?.invoice_pattern || 'INV{DD}{MM}{YY}{###}'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="INV{DD}{MM}{YY}{###}"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Gunakan placeholder: {'{DD}'} = Tanggal, {'{MM}'} = Bulan, {'{YY}'} = Tahun 2 digit, {'{YYYY}'} = Tahun 4 digit, {'{###}'} = Nomor urut 3 digit
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Invoice Berikutnya
                  </label>
                  <input
                    type="number"
                    name="next_number"
                    min="1"
                    defaultValue={settings?.next_number || 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nomor ini akan digunakan untuk invoice berikutnya
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Preview</h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded px-3 py-2">
                    <span className="font-mono text-lg text-blue-600">
                      {generatePreview(pattern)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Contoh nomor invoice yang akan dihasilkan hari ini
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Placeholder yang Tersedia:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div><code>{'{DD}'}</code> - Tanggal (01-31)</div>
                    <div><code>{'{MM}'}</code> - Bulan (01-12)</div>
                    <div><code>{'{YY}'}</code> - Tahun 2 digit (25)</div>
                    <div><code>{'{YYYY}'}</code> - Tahun 4 digit (2025)</div>
                    <div><code>{'{###}'}</code> - Nomor urut 3 digit (001)</div>
                    <div><code>{'{##}'}</code> - Nomor urut 2 digit (01)</div>
                    <div><code>{'{#}'}</code> - Nomor urut tanpa padding (1)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saveSettingsMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saveSettingsMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}