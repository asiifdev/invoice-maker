import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Building,
  Settings,
  LogOut
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const navigationItems = [
  { id: 'dashboard' as const, label: 'Dasbor', icon: LayoutDashboard },
  { id: 'invoices' as const, label: 'Invoice', icon: FileText },
  { id: 'clients' as const, label: 'Klien', icon: Users },
  { id: 'products' as const, label: 'Produk', icon: Package },
  { id: 'company' as const, label: 'Perusahaan', icon: Building },
  { id: 'settings' as const, label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { signOut, user } = useAuth();

  const { data: company } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-lg">
      {/* Company Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className="w-10 h-10 object-contain rounded-lg"
              />
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
          </div>
          
          {/* Company Info */}
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-gray-900 truncate">
              {company?.name || 'Nama Perusahaan'}
            </h1>
            <p className="text-xs text-gray-600 truncate">
              {company?.email || user?.email || 'email@perusahaan.com'}
            </p>
            {company?.tax_id && (
              <p className="text-xs text-gray-500 truncate">
                NPWP: {company.tax_id}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">Keluar</span>
        </button>
      </div>
    </div>
  );
}