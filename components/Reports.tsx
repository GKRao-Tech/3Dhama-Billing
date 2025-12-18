
import React, { useMemo } from 'react';
import { Bill } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  bills: Bill[];
}

const Reports: React.FC<ReportsProps> = ({ bills }) => {
  const chartData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const sortedBills = [...bills].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last30Days = sortedBills.slice(-30);

    last30Days.forEach(bill => {
      const dateStr = new Date(bill.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + bill.total;
    });

    return Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }));
  }, [bills]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = new Date().toISOString().slice(0, 7);
    
    const dailyRevenue = bills
      .filter(b => b.date.startsWith(todayStr))
      .reduce((acc, b) => acc + b.total, 0);

    const monthlyRevenue = bills
      .filter(b => b.date.startsWith(monthStr))
      .reduce((acc, b) => acc + b.total, 0);

    const totalRevenue = bills.reduce((acc, b) => acc + b.total, 0);

    return { dailyRevenue, monthlyRevenue, totalRevenue };
  }, [bills]);

  const downloadCSV = () => {
    if (bills.length === 0) return;
    
    const headers = ["Date", "Bill No", "Customer", "Subtotal", "GST", "Total"];
    const rows = bills.map(b => [
      new Date(b.date).toLocaleDateString(),
      b.billNumber,
      b.customerName,
      b.subtotal.toFixed(2),
      (b.cgst + b.sgst).toFixed(2),
      b.total.toFixed(2)
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `3Dhama_Sales_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Business Performance</h2>
        <button 
          onClick={downloadCSV}
          className="text-xs font-bold bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today</p>
          <p className="text-2xl font-black text-rose-500">₹{stats.dailyRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">This Month</p>
          <p className="text-2xl font-black text-yellow-600">₹{stats.monthlyRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lifetime</p>
          <p className="text-2xl font-black text-slate-800">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Sales Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="revenue" fill="#eab308" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
