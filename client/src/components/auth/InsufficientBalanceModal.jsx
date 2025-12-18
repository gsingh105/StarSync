import React from 'react';
import { X, AlertCircle, Wallet, Plus } from 'lucide-react';

const InsufficientBalanceModal = ({ isOpen, onClose, required, current, onRecharge }) => {
  if (!isOpen) return null;

  const deficit = required - current;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-red-100 dark:border-red-900/30 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100 dark:border-red-800">
            <AlertCircle className="text-red-500" size={40} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Insufficient Funds</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            You need <span className="font-bold text-red-500">₹{deficit}</span> more to start this {Math.floor(required/deficit)} min consultation.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">In Wallet</p>
              <p className="text-lg font-bold">₹{current}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
              <p className="text-[10px] font-black uppercase text-red-400 mb-1">Required</p>
              <p className="text-lg font-bold text-red-600">₹{required}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onRecharge}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-slate-900/20"
            >
              <Plus size={20} /> Add ₹{Math.max(deficit, 100)} to Wallet
            </button>
            <button 
              onClick={onClose}
              className="py-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;