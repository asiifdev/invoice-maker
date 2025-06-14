import React, { useState } from "react";
import { Sidebar } from "./components/Layout/Sidebar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { InvoiceList } from "./components/Invoices/InvoiceList";
import { InvoicePreview } from "./components/Invoices/InvoicePreview";
import { ClientList } from "./components/Clients/ClientList";
import { ProductList } from "./components/Products/ProductList";
import { CompanyProfile } from "./components/Company/CompanyProfile";
import { InvoiceSettings } from "./components/Settings/InvoiceSettings";
import { AuthForm } from "./components/Auth/AuthForm";
import { NavigationTab, Invoice } from "./types";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "invoices":
        return (
          <InvoiceList
            onCreateInvoice={() => {
              console.log("Buat invoice");
            }}
            onViewInvoice={setSelectedInvoice}
          />
        );
      case "clients":
        return (
          <ClientList
            onCreateClient={() => {
              console.log("Buat klien");
            }}
          />
        );
      case "products":
        return (
          <ProductList
            onCreateProduct={() => {
              console.log("Buat produk");
            }}
          />
        );
      case "company":
        return <CompanyProfile />;
      case "settings":
        return <InvoiceSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 lg:overflow-auto">
        {/* Mobile spacing for menu button */}
        <div className="lg:hidden h-16"></div>
        {renderContent()}
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
