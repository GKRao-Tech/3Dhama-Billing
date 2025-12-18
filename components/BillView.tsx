
import React from 'react';
import { Bill } from '../types';
import { SHOP_DETAILS } from '../constants';

interface BillViewProps {
  bill: Bill;
  onClose: () => void;
}

const BillView: React.FC<BillViewProps> = ({ bill, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-brand font-bold text-xs border border-yellow-600">3D</div>
             <h3 className="font-bold text-slate-800 text-sm">Invoice {bill.billNumber}</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="bg-white text-slate-400 hover:text-slate-600 border border-slate-200 px-3 rounded-xl transition-all"
            >
              &times;
            </button>
          </div>
        </div>

        <div id="printable-bill" className="p-12 overflow-auto bg-white flex-1">
          {/* LOGO AREA */}
          <div className="flex flex-col items-center mb-12 text-center">
             <div className="mb-4 relative">
                {/* Visual representation of the logo */}
                <div className="w-32 h-32 rounded-full bg-[#FDF5E6] border-[6px] border-[#D4AF37] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                   <div className="absolute top-2 w-full h-full flex items-center justify-center opacity-10">
                      <svg className="w-20 h-20 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                   </div>
                   <div className="z-10 text-[24px] font-brand font-bold text-[#2F4F4F]">3 DHAMA</div>
                   <div className="w-12 h-0.5 bg-[#D4AF37] mt-1 opacity-50"></div>
                </div>
                {/* Sparkle effects using CSS */}
                <div className="absolute top-0 right-0 text-yellow-500 animate-pulse text-xl">✦</div>
                <div className="absolute bottom-4 left-0 text-yellow-300 animate-pulse text-sm">✦</div>
             </div>
            <h1 className="text-3xl font-brand font-bold text-slate-800 tracking-[0.2em] mb-1">3DHAMA</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{SHOP_DETAILS.address}</p>
            <p className="text-slate-400 text-[10px] font-bold tracking-tighter mt-1">GSTIN: {SHOP_DETAILS.gstin} | PH: {SHOP_DETAILS.phone}</p>
          </div>

          <div className="flex justify-between mb-12 pb-6 border-b border-slate-100">
            <div className="text-sm">
              <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold mb-2">Customer Details</p>
              <p className="font-bold text-xl text-slate-800">{bill.customerName}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold mb-2">Billing Reference</p>
              <p className="text-slate-900 font-bold"># {bill.billNumber}</p>
              <p className="text-slate-500 text-[11px] font-medium">{new Date(bill.date).toLocaleString()}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-12">
            <thead>
              <tr className="border-b border-slate-900/10 bg-slate-50/50">
                <th className="text-left py-4 px-2 font-bold text-slate-800 uppercase text-[9px] tracking-widest">Product / Item</th>
                <th className="text-right py-4 px-2 font-bold text-slate-800 uppercase text-[9px] tracking-widest">Rate</th>
                <th className="text-center py-4 px-2 font-bold text-slate-800 uppercase text-[9px] tracking-widest">Wgt / Qty</th>
                <th className="text-right py-4 px-2 font-bold text-slate-800 uppercase text-[9px] tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="py-5 px-2 text-slate-800 font-semibold">{item.name}</td>
                  <td className="text-right py-5 px-2 text-slate-500">₹{item.price.toFixed(2)}</td>
                  <td className="text-center py-5 px-2 text-slate-900 font-bold">
                    {item.weightLabel || item.quantity}
                  </td>
                  <td className="text-right py-5 px-2 text-slate-900 font-black">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto w-72 space-y-4 pt-4 border-t-4 border-slate-900">
            <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <span>Taxable Value</span>
              <span className="text-slate-700">₹{bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <span>CGST (9%)</span>
              <span className="text-slate-700">₹{bill.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <span>SGST (9%)</span>
              <span className="text-slate-700">₹{bill.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl font-brand font-bold text-slate-900 border-t border-slate-100 pt-6 mt-4">
              <span className="text-lg uppercase tracking-tighter">Total</span>
              <span className="text-yellow-600">₹{bill.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-20 text-center text-xs text-slate-400 border-t border-slate-50 pt-10">
            <p className="font-brand font-bold text-slate-600 mb-2 tracking-widest">3DHAMA CREATIONS</p>
            <p className="italic">Crafted with Love, Baked with Passion.</p>
            <p className="mt-8 opacity-40 text-[9px] font-mono">DIGITAL SIGNATURE SECURED INVOICE SYSTEM</p>
          </div>
        </div>
      </div>
      
      {/* Hidden print-only view */}
      <div className="hidden print-only fixed inset-0 bg-white p-12 z-[100] text-slate-900">
        <div className="text-center mb-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500 mb-4 flex items-center justify-center font-brand font-bold text-xl">3D</div>
            <h1 className="text-4xl font-brand font-bold text-slate-900 mb-2">3DHAMA</h1>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">{SHOP_DETAILS.address}</p>
            <p className="text-slate-500 text-xs">PH: {SHOP_DETAILS.phone} | GSTIN: {SHOP_DETAILS.gstin}</p>
        </div>

        <div className="flex justify-between mb-10 pb-4 border-b-2 border-slate-900">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Billed To</p>
            <p className="text-2xl font-bold">{bill.customerName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
            <p className="text-xl font-bold font-mono">{bill.billNumber}</p>
            <p className="text-xs text-slate-500">{new Date(bill.date).toLocaleString()}</p>
          </div>
        </div>

        <table className="w-full text-sm mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-100">
              <th className="text-left py-3 px-2 font-bold uppercase text-[10px]">Description</th>
              <th className="text-right py-3 px-2 font-bold uppercase text-[10px]">Rate</th>
              <th className="text-center py-3 px-2 font-bold uppercase text-[10px]">Wgt/Qty</th>
              <th className="text-right py-3 px-2 font-bold uppercase text-[10px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="py-4 font-bold text-lg">{item.name}</td>
                <td className="text-right py-4">₹{item.price.toFixed(2)}</td>
                <td className="text-center py-4 font-bold">{item.weightLabel || item.quantity}</td>
                <td className="text-right py-4 font-black">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto w-80 space-y-3 pt-6 border-t-4 border-slate-900">
          <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
            <span>Subtotal</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
            <span>CGST (9%)</span>
            <span>₹{bill.cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
            <span>SGST (9%)</span>
            <span>₹{bill.sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-3xl font-brand font-bold border-t-2 border-slate-200 pt-4 mt-4">
            <span className="text-lg">GRAND TOTAL</span>
            <span>₹{bill.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-20 text-center border-t border-slate-200 pt-10">
          <p className="font-brand font-bold text-xl mb-2">3DHAMA</p>
          <p>Thank you for your order!</p>
        </div>
      </div>
    </div>
  );
};

export default BillView;
