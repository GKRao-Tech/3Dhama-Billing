
import React, { useState, useEffect } from 'react';
import { Bill } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface AISuggestionsProps {
  bills: Bill[];
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ bills }) => {
  const [insight, setInsight] = useState<string>('Analyzing your sales data...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      if (bills.length === 0) return;
      setLoading(true);
      const text = await getBusinessInsights(bills);
      setInsight(text);
      setLoading(false);
    };

    fetchInsight();
  }, [bills.length]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-rose-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3 shadow-sm">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">AI Business Insights</h4>
        <p className={`text-sm text-slate-700 font-medium italic ${loading ? 'animate-pulse' : ''}`}>
          "{insight}"
        </p>
      </div>
    </div>
  );
};

export default AISuggestions;
