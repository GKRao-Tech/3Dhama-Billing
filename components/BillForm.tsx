
import React, { useState, useMemo, useEffect } from 'react';
import { Bill, BillItem, Product } from '../types';
import { INITIAL_PRODUCTS, GST_RATE } from '../constants';
import { saveBill } from '../services/storage';

interface BillFormProps {
  onBillSaved: () => void;
}

const BillForm: React.FC<BillFormProps> = ({ onBillSaved }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>("0.5");
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = useMemo(() => 
    INITIAL_PRODUCTS.find(p => p.id === selectedProductId), 
    [selectedProductId]
  );

  const currentPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    if (selectedProduct.category === 'Cakes' && selectedProduct.weightPrices) {
      return selectedProduct.weightPrices[selectedWeight] || selectedProduct.basePrice;
    }
    return selectedProduct.basePrice;
  }, [selectedProduct, selectedWeight]);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity), 0), [items]);
  const cgst = subtotal * GST_RATE;
  const sgst = subtotal * GST_RATE;
  const total = subtotal + cgst + sgst;

  const addItem = () => {
    if (!selectedProduct) return;

    const weightLabel = selectedProduct.category === 'Cakes' ? `${selectedWeight} kg` : '';
    const uniqueId = `${selectedProduct.id}-${weightLabel}`;

    const existingIndex = items.findIndex(i => i.id === uniqueId);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      setItems([...items, { 
        id: uniqueId, 
        name: selectedProduct.name, 
        price: currentPrice, 
        quantity,
        weightLabel
      }]);
    }
    
    setQuantity(1);
    setSelectedWeight("0.5");
    setSelectedProductId('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (items.length === 0 || !customerName) {
      alert('Please enter customer name and at least one item.');
      return;
    }

    const newBill: Bill = {
      id: crypto.randomUUID(),
      billNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerName,
      date: new Date().toISOString(),
      items,
      subtotal,
      cgst,
      sgst,
      total
    };

    saveBill(newBill);
    setItems([]);
    setCustomerName('');
    onBillSaved();
    alert('Bill saved successfully!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Create New Bill</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none bg-white"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select Item</option>
              {INITIAL_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProduct?.category === 'Cakes' ? (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none bg-white"
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
              >
                <option value="0.5">0.5 kg</option>
                <option value="1.0">1.0 kg</option>
                <option value="1.5">1.5 kg</option>
                <option value="2.0">2.0 kg</option>
              </select>
            </div>
          ) : (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          )}

          <div className="md:col-span-4">
            <button
              onClick={addItem}
              disabled={!selectedProductId}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
            >
              Add (₹{currentPrice})
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden border border-slate-100 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Item</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-600">Price</th>
                <th className="text-center py-2 px-3 font-semibold text-slate-600">Weight/Qty</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-600">Amount</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-2 px-3 text-slate-700">{item.name}</td>
                  <td className="text-right py-2 px-3 text-slate-500">₹{item.price.toFixed(2)}</td>
                  <td className="text-center py-2 px-3 text-slate-700 font-medium">
                    {item.weightLabel || item.quantity}
                  </td>
                  <td className="text-right py-2 px-3 font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td className="text-right py-2 px-1">
                    <button onClick={() => removeItem(item.id)} className="text-rose-300 hover:text-rose-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-center text-slate-400 py-6 italic bg-slate-50/30">No items added to the bill</p>}
        </div>

        <div className="bg-slate-50/50 p-4 rounded-xl space-y-2 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">CGST (9%)</span>
            <span className="font-medium">₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">SGST (9%)</span>
            <span className="font-medium">₹{sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-slate-200 mt-2">
            <span>Total Amount</span>
            <span className="text-rose-600">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default BillForm;
