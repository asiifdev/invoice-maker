import React, { useState } from "react";
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
  X,
} from "lucide-react";
import { NavigationTab } from "../../types";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const navigationItems = [
  { id: "dashboard" as const, label: "Dasbor", icon: LayoutDashboard },
  { id: "invoices" as const, label: "Invoice", icon: FileText },
  { id: "clients" as const, label: "Klien", icon: Users },
  { id: "products" as const, label: "Produk", icon: Package },
  { id: "company" as const, label: "Perusahaan", icon: Building },
  { id: "settings" as const, label: "Pengaturan", icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleTabChange = (tab: NavigationTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 
        fixed lg:static 
        inset-y-0 left-0 
        w-64 bg-white border-r border-gray-200 
        flex flex-col 
        z-40 
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                InvoicePro
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Invoice Profesional
              </p>
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
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium truncate">{item.label}</span>
                    {/* Active indicator for mobile */}
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 lg:hidden"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="font-medium truncate">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}
