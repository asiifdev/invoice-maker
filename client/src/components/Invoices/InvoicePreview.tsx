import React, { useState, useEffect } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Invoice, Client, Company } from '../../types';
import { supabase } from '../../lib/supabase';
import { ModernTemplate, ClassicTemplate, MinimalTemplate, ProfessionalTemplate, CreativeTemplate } from './InvoiceTemplates';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal' | 'professional' | 'creative'>(invoice.template as any || 'modern');

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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const templates = [
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
    { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
    { id: 'creative', name: 'Creative', component: CreativeTemplate },
  ] as const;

  const currentTemplateIndex = templates.findIndex(t => t.id === selectedTemplate);
  const SelectedTemplateComponent = templates[currentTemplateIndex].component;

  const nextTemplate = () => {
    const nextIndex = (currentTemplateIndex + 1) % templates.length;
    setSelectedTemplate(templates[nextIndex].id);
  };

  const prevTemplate = () => {
    const prevIndex = currentTemplateIndex === 0 ? templates.length - 1 : currentTemplateIndex - 1;
    setSelectedTemplate(templates[prevIndex].id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pratinjau Invoice</h2>
            
            {/* Template Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={prevTemplate}
                className="p-1 hover:bg-gray-100 rounded"
                title="Template Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={nextTemplate}
                className="p-1 hover:bg-gray-100 rounded"
                title="Template Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mobile template selector */}
            <div className="sm:hidden">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Unduh PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-2 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <SelectedTemplateComponent
              invoice={invoice}
              client={client}
              company={company}
              items={items}
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}