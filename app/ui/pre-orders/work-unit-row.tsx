'use client';

import { assignTechnician } from '@/app/lib/actions';
import { useState } from 'react';

export default function WorkUnitRow({ 
  unit, 
  technicians, 
  preOrderId 
}: { 
  unit: any, 
  technicians: any[], 
  preOrderId: string 
}) {
  const [loading, setLoading] = useState(false);
  const activeAssignment = unit.assignments[0];

  const handleAssign = async (techId: string) => {
    if (!techId) return;
    setLoading(true);
    await assignTechnician(unit.id, techId, preOrderId);
    setLoading(false);
  };

  return (
    <tr className="border-b last:border-none">
      <td className="px-3 py-4 font-bold">{unit.type}</td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${unit.progress}%` }}
            ></div>
          </div>
          <span className="text-xs">{unit.progress}%</span>
        </div>
      </td>
      <td className="px-3 py-4">
        <span className={`text-xs px-2 py-1 rounded ${
          unit.status === 'DONE' ? 'bg-green-100 text-green-800' :
          unit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {unit.status}
        </span>
      </td>
      <td className="px-3 py-4">
        <select
          disabled={loading}
          className="text-sm border rounded p-1"
          value={activeAssignment?.technician_id || ''}
          onChange={(e) => handleAssign(e.target.value)}
        >
          <option value="">Unassigned</option>
          {technicians.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
