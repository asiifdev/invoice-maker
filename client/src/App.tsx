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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </div>
      </main>

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