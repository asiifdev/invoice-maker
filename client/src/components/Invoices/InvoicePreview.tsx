import React, { useState, useEffect } from 'react';
import { X, Download, Palette, Eye } from 'lucide-react';
import { Invoice, Client, Company, InvoiceItem } from '../../types';
import { supabase } from '../../lib/supabase';
import { 
  ModernTemplate, 
  ClassicTemplate, 
  MinimalTemplate, 
  ProfessionalTemplate, 
  CreativeTemplate 
} from './InvoiceTemplates';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

const templates = [
  { id: 'modern', name: 'Modern', component: ModernTemplate },
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
  { id: 'creative', name: 'Creative', component: CreativeTemplate },
] as const;

export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(invoice.template || 'modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoice.id]);

  const fetchInvoiceDetails = async () => {
    try {
      const [clientResult, companyResult, itemsResult] = await Promise.all([
        supabase
          .from('clients')
          .select('*')
          .eq('id', invoice.client_id)
          .single(),
        supabase
          .from('companies')
          .select('*')
          .eq('id', invoice.company_id)
          .single(),
        supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id)
      ]);

      if (clientResult.data) setClient(clientResult.data);
      if (companyResult.data) setCompany(companyResult.data);
      if (itemsResult.data) setItems(itemsResult.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Update invoice template in database
    try {
      await supabase
        .from('invoices')
        .update({ template: templateId })
        .eq('id', invoice.id);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a new window with the invoice content
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const selectedTemplateComponent = templates.find(t => t.id === selectedTemplate);
      if (!selectedTemplateComponent) return;

      const TemplateComponent = selectedTemplateComponent.component;
      
      // Get the rendered template HTML
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      
      // Create a React root and render the template
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(tempDiv);
        root.render(
          React.createElement(TemplateComponent, {
            invoice,
            client,
            company,
            items,
            template: selectedTemplate as any
          })
        );

        // Wait for rendering to complete
        setTimeout(() => {
          const htmlContent = tempDiv.innerHTML;
          
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Invoice ${invoice.invoice_number}</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  @media print {
                    body { margin: 0; }
                    .no-print { display: none !important; }
                  }
                  body { font-family: system-ui, -apple-system, sans-serif; }
                </style>
              </head>
              <body>
                ${htmlContent}
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  };
                </script>
              </body>
            </html>
          `);
          
          printWindow.document.close();
          
          // Cleanup
          root.unmount();
          document.body.removeChild(tempDiv);
        }, 1000);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  const selectedTemplateComponent = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = selectedTemplateComponent?.component || ModernTemplate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Pratinjau Invoice</h2>
            <span className="text-sm text-gray-500">#{invoice.invoice_number}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Template Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Palette className="w-4 h-4 mr-2" />
                Template
              </button>
              
              {showTemplateSelector && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Pilih Template
                    </p>
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          handleTemplateChange(template.id);
                          setShowTemplateSelector(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                          selectedTemplate === template.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Download PDF */}
            <button 
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Unduh PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Template Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <TemplateComponent
              invoice={invoice}
              client={client}
              company={company}
              items={items}
              template={selectedTemplate as any}
            />
          </div>
        </div>

        {/* Template Info */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Template: <span className="font-medium">{selectedTemplateComponent?.name}</span>
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Klik "Template" untuk mengganti desain invoice
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close template selector */}
      {showTemplateSelector && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}