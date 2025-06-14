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
  collapsed?: boolean;
}

const navigationItems = [
  { id: 'dashboard' as const, label: 'Dasbor', icon: LayoutDashboard },
  { id: 'invoices' as const, label: 'Invoice', icon: FileText },
  { id: 'clients' as const, label: 'Klien', icon: Users },
  { id: 'products' as const, label: 'Produk', icon: Package },
  { id: 'company' as const, label: 'Perusahaan', icon: Building },
  { id: 'settings' as const, label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, collapsed = false }: SidebarProps) {
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
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col shadow-lg transition-all duration-300 fixed lg:sticky top-0`}>
      {/* Company Header */}
      <div className={`${collapsed ? 'p-2' : 'p-4 sm:p-6'} border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-300`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          {/* Company Logo */}
          <div className={`${collapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300`}>
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt="Company Logo" 
                className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} object-contain rounded-lg transition-all duration-300`}
              />
            ) : (
              <Building className={`${collapsed ? 'w-5 h-5' : 'w-6 h-6'} text-white transition-all duration-300`} />
            )}
          </div>
          
          {/* Company Info */}
          {!collapsed && (
            <div className="min-w-0 flex-1 transition-opacity duration-300">
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
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-3 sm:p-4'} overflow-y-auto transition-all duration-300`}>
        <ul className={`space-y-1 ${collapsed ? '' : 'sm:space-y-2'}`}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'} rounded-lg text-left transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0 transition-all duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {!collapsed && (
                    <span className="font-medium truncate transition-opacity duration-300">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`${collapsed ? 'p-2' : 'p-3 sm:p-4'} border-t border-gray-200 bg-gray-50 transition-all duration-300`}>
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center ${collapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'} rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-700 group relative`}
          title={collapsed ? 'Keluar' : undefined}
        >
          <LogOut className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} text-gray-500 flex-shrink-0 transition-all duration-200`} />
          {!collapsed && (
            <span className="font-medium truncate transition-opacity duration-300">Keluar</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Keluar
            </div>
          )}
        </button>
      </div>
    </div>
  );
}