import { fetchPreOrderById, fetchTechnicians } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/pre-orders/breadcrumbs';
import { notFound } from 'next/navigation';
import WorkUnitRow from '@/app/ui/pre-orders/work-unit-row';
import AddWorkUnitButton from '@/app/ui/pre-orders/add-work-unit';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [preOrder, technicians] = await Promise.all([
    fetchPreOrderById(id),
    fetchTechnicians(),
  ]);

  if (!preOrder) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pre-Orders', href: '/dashboard/pre-orders' },
          {
            label: `Detail: ${preOrder.order_code}`,
            href: `/dashboard/pre-orders/${id}`,
            active: true,
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* PO Info Card */}
        <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Order Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium">{preOrder.customer_name}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Status</span>
              <span className="font-medium">{preOrder.status}</span>
            </div>
            <div className="flex flex-col pt-2">
              <span className="text-slate-500">Description</span>
              <p className="mt-1 italic">{preOrder.description || '-'}</p>
            </div>
          </div>
        </div>

        {/* Work Units Section */}
        <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Work Units</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Progress</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Technician</th>
                </tr>
              </thead>
              <tbody>
                {preOrder.work_units.map((unit) => (
                  <WorkUnitRow 
                    key={unit.id} 
                    unit={unit} 
                    technicians={technicians} 
                    preOrderId={id} 
                  />
                ))}
                {preOrder.work_units.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-slate-400">
                      No work units added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AddWorkUnitButton preOrderId={id} />
        </div>
      </div>
    </main>
  );
}
