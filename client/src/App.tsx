import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { InvoiceList } from './components/Invoices/InvoiceList';
import { InvoicePreview } from './components/Invoices/InvoicePreview';
import { ClientList } from './components/Clients/ClientList';
import { ProductList } from './components/Products/ProductList';
import { CompanyProfile } from './components/Company/CompanyProfile';
import { InvoiceSettings } from './components/Settings/InvoiceSettings';
import { AuthForm } from './components/Auth/AuthForm';
import { NavigationTab, Invoice } from './types';
import { useAuth } from './hooks/useAuth';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on mobile and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Mobile: Always close sidebar
      if (width < 768) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      }
      // Tablet: Keep current state but ensure proper behavior
      else if (width < 1024) {
        // Don't auto-change state, let user control
      }
      // Desktop: Ensure sidebar is visible
      else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle swipe gestures for mobile
  useEffect(() => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = currentX - startX;
      
      // Swipe right to open sidebar (from left edge)
      if (deltaX > 50 && startX < 50 && window.innerWidth < 768) {
        setSidebarOpen(true);
      }
      
      // Swipe left to close sidebar
      if (deltaX < -50 && sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return (
          <InvoiceList
            onCreateInvoice={() => {
              console.log('Buat invoice');
            }}
            onViewInvoice={setSelectedInvoice}
          />
        );
      case 'clients':
        return (
          <ClientList
            onCreateClient={() => {
              console.log('Buat klien');
            }}
          />
        );
      case 'products':
        return (
          <ProductList
            onCreateProduct={() => {
              console.log('Buat produk');
            }}
          />
        );
      case 'company':
        return <CompanyProfile />;
      case 'settings':
        return <InvoiceSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* CSS Grid Layout */}
      <div 
        className="grid h-full transition-all duration-300 ease-in-out"
        style={{
          gridTemplateColumns: window.innerWidth >= 1024 
            ? (sidebarCollapsed ? '4rem 1fr' : '16rem 1fr')
            : '1fr',
          gridTemplateRows: '3.75rem 1fr',
          gridTemplateAreas: window.innerWidth >= 1024 
            ? '"sidebar header" "sidebar main"'
            : '"header" "main"'
        }}
      >
        {/* Mobile sidebar backdrop overlay */}
        {sidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Header */}
        <header 
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-30"
          style={{ gridArea: 'header' }}
        >
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 lg:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            
            {/* Page Title */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-lg font-semibold text-gray-900">
                {activeTab === 'dashboard' && 'Dasbor'}
                {activeTab === 'invoices' && 'Invoice'}
                {activeTab === 'clients' && 'Klien'}
                {activeTab === 'products' && 'Produk'}
                {activeTab === 'company' && 'Perusahaan'}
                {activeTab === 'settings' && 'Pengaturan'}
              </h1>
            </div>
          </div>
          
          {/* Right side spacer for mobile */}
          <div className="w-10 lg:hidden" />
        </header>

        {/* Sidebar */}
        <aside 
          className={`
            transition-all duration-300 ease-in-out z-50
            ${window.innerWidth >= 1024 
              ? 'relative' 
              : `fixed inset-y-0 left-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            }
          `}
          style={{ 
            gridArea: window.innerWidth >= 1024 ? 'sidebar' : 'unset',
            width: window.innerWidth >= 1024 
              ? (sidebarCollapsed ? '4rem' : '16rem')
              : '16rem'
          }}
        >
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              // Auto-close sidebar on mobile after selection
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            collapsed={sidebarCollapsed}
          />
        </aside>

        {/* Main content */}
        <main 
          className="overflow-auto bg-gray-50"
          style={{ gridArea: 'main' }}
        >
          <div className="p-4 sm:p-6 lg:p-8 h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Swipe indicator for mobile */}
      {!sidebarOpen && window.innerWidth < 768 && (
        <div className="swipe-indicator" />
      )}
    </div>
  );
}

export default App;