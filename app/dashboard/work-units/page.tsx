import { fetchWorkUnits } from '@/app/lib/data';
import Link from 'next/link';

export default async function Page() {
  const workUnits = await fetchWorkUnits();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">All Work Units</h1>
      </div>
      
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <table className="min-w-full text-slate-900">
              <thead className="text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:pl-6">
                    Pre-Order
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Progress
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Technician
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workUnits.map((unit) => {
                  const technicianName = unit.assignments[0]?.technician?.name || 'Unassigned';
                  return (
                    <tr
                      key={unit.id}
                      className="group transition-colors hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                        <div className="flex flex-col">
                            <Link 
                                href={`/dashboard/pre-orders/${unit.pre_order_id}`}
                                className="font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                {unit.pre_order.order_code}
                            </Link>
                            <span className="text-xs text-slate-500">{unit.pre_order.customer_name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-slate-700">
                        {unit.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                <div 
                                className="bg-indigo-600 h-1.5 rounded-full" 
                                style={{ width: `${unit.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-slate-500">{unit.progress}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          unit.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          unit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        {technicianName}
                      </td>
                    </tr>
                  );
                })}
                {workUnits.length === 0 && (
                    <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400">
                            No work units found.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
