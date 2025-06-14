import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Building,
  Settings,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const navigationItems = [
  { id: 'dashboard' as const, label: 'Dasbor', icon: LayoutDashboard },
  { id: 'invoices' as const, label: 'Invoice', icon: FileText },
  { id: 'clients' as const, label: 'Klien', icon: Users },
  { id: 'products' as const, label: 'Produk', icon: Package },
  { id: 'company' as const, label: 'Perusahaan', icon: Building },
  { id: 'settings' as const, label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, isMobileOpen = false, onMobileToggle }: SidebarProps) {
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

  const handleTabChange = (tab: NavigationTab) => {
    onTabChange(tab);
    if (onMobileToggle) {
      onMobileToggle(); // Close mobile menu after selection
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 h-full flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">InvoicePro</h1>
              <p className="text-xs lg:text-sm text-gray-500 truncate">Invoice Profesional</p>
            </div>
          </div>
          
          {/* Company Info */}
          {company && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt="Company Logo" 
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <Building className="w-6 h-6 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{company.name}</p>
                  <p className="text-xs text-gray-500 truncate">{company.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="font-medium truncate">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto flex-shrink-0"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-700 group"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
            <span className="font-medium">Keluar</span>
          </button>
          
          {/* User Info */}
          {user && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}