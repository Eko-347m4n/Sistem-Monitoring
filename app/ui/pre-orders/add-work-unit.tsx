'use client';

import { createWorkUnit } from '@/app/lib/actions';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AddWorkUnitButton({ preOrderId }: { preOrderId: string }) {
  const types = ['AIR', 'ELECTRICAL', 'PHYSICAL'];

  const handleAdd = async (type: string) => {
    if (confirm(`Add ${type} work unit?`)) {
      await createWorkUnit(preOrderId, type);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      {types.map(type => (
        <button
          key={type}
          onClick={() => handleAdd(type)}
          className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
        >
          <PlusIcon className="w-3" /> Add {type}
        </button>
      ))}
    </div>
  );
}
