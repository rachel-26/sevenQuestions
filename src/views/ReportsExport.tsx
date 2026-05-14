import React from 'react';

export const ReportsExport: React.FC = () => {
  return (
    <div className="p-stack-md max-w-container-max mx-auto">
      <div className="mb-stack-md">
        <p className="text-slate-500 font-body-sm mb-1">Generate and manage comprehensive literary datasets</p>
        <h3 className="font-display-lg text-display-lg text-slate-900">Project DNA Exports</h3>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-stack-md">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-border-subtle shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-headline-md text-slate-900">Format Selection</h4>
              <p className="text-slate-500 font-body-sm">Choose the output structure for your current analysis batch</p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-label-caps font-label-caps">ACTIVE SESSION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-border-subtle rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <span className="font-label-bold block mb-1">Markdown</span>
              <span className="font-micro-detail text-slate-500">Perfect for technical documentation and Git storage.</span>
            </div>
            <div className="border border-border-subtle rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <span className="font-label-bold block mb-1">CSV</span>
              <span className="font-micro-detail text-slate-500">Spreadsheet ideal for data visualization.</span>
            </div>
            <div className="border border-border-subtle rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <span className="font-label-bold block mb-1">JSON Schema</span>
              <span className="font-micro-detail text-slate-500">Machine-readable format for API integrations.</span>
            </div>
            <div className="border border-border-subtle rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <span className="font-label-bold block mb-1">Formal PDF</span>
              <span className="font-micro-detail text-slate-500">Beautifully typeset reports for stakeholders.</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between">
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-label-bold hover:bg-black transition-all shadow-md">
              Generate Full Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
