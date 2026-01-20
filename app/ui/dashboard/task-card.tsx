'use client';

import { updateWorkProgress } from '@/app/lib/actions';
import { useState } from 'react';

export default function TaskCard({ assignment }: { assignment: any }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(assignment.work_unit.progress);
  const [note, setNote] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateWorkProgress(assignment.work_unit.id, Number(progress), note);
    setLoading(false);
    setNote(''); // Clear note after submit
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-start mb-2">
         <div>
            <h4 className="font-bold text-slate-800">{assignment.work_unit.pre_order.order_code}</h4>
            <p className="text-sm text-slate-500">{assignment.work_unit.pre_order.customer_name}</p>
         </div>
         <span className="px-2 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded">
            {assignment.work_unit.type}
         </span>
      </div>

      <form onSubmit={handleUpdate} className="mt-4 space-y-3">
        <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Progress (%)</label>
            <input 
               type="range" 
               min="0" 
               max="100" 
               value={progress} 
               onChange={(e) => setProgress(e.target.value)}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Current: {assignment.work_unit.progress}%</span>
                <span className="font-bold text-indigo-600">New: {progress}%</span>
            </div>
        </div>

        <div>
             <input
                type="text"
                placeholder="Add note (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-sm border-slate-200 rounded-md"
             />
        </div>

        <button 
           type="submit"
           disabled={loading || Number(progress) < assignment.work_unit.progress}
           className="w-full bg-slate-900 text-white text-sm py-2 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {loading ? 'Updating...' : 'Update Progress'}
        </button>
      </form>
    </div>
  );
}
