import React, { useState } from 'react';
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
import { Menu } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
              // TODO: Implement create invoice modal
              console.log('Buat invoice');
            }}
            onViewInvoice={setSelectedInvoice}
          />
        );
      case 'clients':
        return (
          <ClientList
            onCreateClient={() => {
              // TODO: Implement create client modal
              console.log('Buat klien');
            }}
          />
        );
      case 'products':
        return (
          <ProductList
            onCreateProduct={() => {
              // TODO: Implement create product modal
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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dasbor';
      case 'invoices': return 'Invoice';
      case 'clients': return 'Klien';
      case 'products': return 'Produk';
      case 'company': return 'Perusahaan';
      case 'settings': return 'Pengaturan';
      default: return 'Dasbor';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          isMobile={true}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
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
    </div>
  );
}

export default App;