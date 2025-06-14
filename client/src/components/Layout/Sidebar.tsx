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
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 h-full flex flex-col shadow-2xl transition-all duration-300 fixed lg:sticky top-0 z-50`}>
      {/* Company Header */}
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 transition-all duration-300`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-4'}`}>
          {/* Company Logo */}
          <div className={`${collapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ring-2 ring-blue-500/20`}>
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
          
          {/* Company Info - Hidden when collapsed */}
          <div className={`min-w-0 flex-1 transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <h1 className="text-sm font-bold text-white truncate">
              {company?.name || 'Nama Perusahaan'}
            </h1>
            <p className="text-xs text-gray-300 truncate">
              {company?.email || user?.email || 'email@perusahaan.com'}
            </p>
            {company?.tax_id && (
              <p className="text-xs text-gray-400 truncate">
                NPWP: {company.tax_id}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} overflow-y-auto transition-all duration-300`}>
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl text-left transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  
                  {/* Menu Text - Hidden when collapsed */}
                  <span className={`font-medium truncate transition-all duration-300 menu-text ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-gray-700 bg-gray-900 transition-all duration-300`}>
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center ${collapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'} rounded-xl text-left transition-all duration-300 text-gray-300 hover:bg-red-600 hover:text-white hover:scale-105 group relative`}
          title={collapsed ? 'Keluar' : undefined}
        >
          <LogOut className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400 group-hover:text-white flex-shrink-0 transition-all duration-300`} />
          
          {/* Logout Text - Hidden when collapsed */}
          <span className={`font-medium truncate transition-all duration-300 menu-text ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Keluar
          </span>
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Keluar
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}