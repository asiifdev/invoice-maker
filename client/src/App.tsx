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
import { Menu, X } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }} 
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">InvoicePro</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
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