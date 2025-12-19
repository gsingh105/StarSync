import React, { useState } from 'react';
import AddAstrologerForm from '../../components/admin/AddAstrologerForm';
import AstrologerList from '../../components/admin/AstrologerList';
import { Plus, Users, Shield, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; // Import toast

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('list');

  // Callback for when an astrologer is successfully added
  const handleAddSuccess = () => {
    setActiveTab('list');
    toast.success('Star Guide added to the universe successfully!', {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 font-sans relative overflow-hidden transition-colors duration-500">
      {/* Toast Pop-up Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Cosmic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                   <Shield size={24} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
             </div>
             <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm">
               Manage your star guides, oversee platform settings, and monitor celestial activities.
             </p>
           </div>
           
           <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex">
             <button
               onClick={() => setActiveTab('list')}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all
                 ${activeTab === 'list' 
                   ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-amber-200 dark:ring-amber-800' 
                   : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
               <Users size={18} />
               Directory
             </button>
             <button
               onClick={() => setActiveTab('add')}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all
                 ${activeTab === 'add' 
                   ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-amber-200 dark:ring-amber-800' 
                   : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
               <Plus size={18} />
               Add New
             </button>
           </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'list' ? (
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[500px]">
               <AstrologerList />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
               <button 
                 onClick={() => setActiveTab('list')}
                 className="mb-6 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors"
               >
                 <ArrowLeft size={16} />
                 Back to Directory
               </button>
               
               <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-1">
                 {/* Pass the success handler to the form */}
                 <AddAstrologerForm onCreated={handleAddSuccess} />
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;