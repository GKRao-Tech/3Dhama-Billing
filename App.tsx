
import React, { useState, useEffect } from 'react';
import { Bill } from './types';
import { getBills, deleteBill } from './services/storage';
import BillForm from './components/BillForm';
import BillView from './components/BillView';
import Reports from './components/Reports';
import AISuggestions from './components/AISuggestions';

const App: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [view, setView] = useState<'billing' | 'reports'>('billing');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setBills(getBills());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBills = bills.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.billNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-tr from-yellow-500 to-yellow-200 rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-sm transition-transform group-hover:scale-110">
                 <span className="font-brand font-bold text-slate-800 text-lg">3D</span>
              </div>
              <div className="absolute -inset-0.5 bg-yellow-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-2xl font-brand font-bold text-slate-800 leading-none">3DHAMA</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Cakes & Creations</p>
            </div>
          </div>
          
          <nav className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setView('billing')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'billing' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              New Bill
            </button>
            <button
              onClick={() => setView('reports')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'reports' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Reports
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form or Reports */}
          <div className="lg:col-span-7 space-y-6">
            {view === 'billing' ? (
              <BillForm onBillSaved={loadData} />
            ) : (
              <Reports bills={bills} />
            )}
            
            <AISuggestions bills={bills} />
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
              <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Billing History
                </h2>
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 w-32 md:w-48 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-auto divide-y divide-slate-100">
                {filteredBills.length > 0 ? (
                  filteredBills.map(bill => (
                    <div 
                      key={bill.id} 
                      className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex justify-between items-center"
                      onClick={() => setSelectedBill(bill)}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-slate-800 text-lg">{bill.customerName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono font-bold">{bill.billNumber}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{new Date(bill.date).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-lg mb-1">₹{bill.total.toFixed(2)}</div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(bill.id);
                          }}
                          className="text-xs font-bold text-rose-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 px-2 py-1 rounded"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 opacity-60">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No sales recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bill Detailed View Modal */}
      {selectedBill && (
        <BillView bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}
    </div>
  );
};

export default App;
