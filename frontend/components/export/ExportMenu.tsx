'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Printer, Mail, X } from 'lucide-react';

interface ExportMenuProps {
  data?: unknown[];
  filename?: string;
  onExport?: (format: 'excel' | 'pdf' | 'csv') => void;
}

export default function ExportMenu({ data, filename = 'export', onExport }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export logic
      console.log(`Exporting ${filename} as ${format}`);
      // Here you would implement actual export logic
    }
    setIsOpen(false);
  };

  const exportOptions = [
    {
      format: 'excel' as const,
      icon: FileSpreadsheet,
      title: 'Export to Excel',
      description: 'Download as .xlsx file',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      format: 'pdf' as const,
      icon: FileText,
      title: 'Export to PDF',
      description: 'Download as PDF document',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      format: 'csv' as const,
      icon: FileText,
      title: 'Export to CSV',
      description: 'Download as comma-separated values',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    }
  ];

  return (
    <div className="relative">
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded-lg font-medium transition-colors shadow-md"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-portal-teal-600 to-portal-teal-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Export Data</h3>
                  <p className="text-xs text-teal-100 mt-1">Choose your preferred format</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Export Options */}
            <div className="p-3 space-y-2">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg ${option.bgColor} ${option.hoverColor} transition-colors group`}
                >
                  <div className={`${option.color} mt-1`}>
                    <option.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-gray-800">
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Additional Options */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200">
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>
            </div>

            {/* Info Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Ready to export {data?.length || 0} records</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
