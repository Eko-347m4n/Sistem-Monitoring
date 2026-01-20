import { fetchPreOrders } from '@/app/lib/data';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  const preOrders = await fetchPreOrders();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Pre-Orders</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Link
          href="/dashboard/pre-orders/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-sm"
        >
          <span className="hidden md:block">Create Pre-Order</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <table className="min-w-full text-slate-900">
              <thead className="text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:pl-6">
                    Order Code
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Description
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preOrders.map((po) => (
                  <tr
                    key={po.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                      <Link 
                        href={`/dashboard/pre-orders/${po.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {po.order_code}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {po.customer_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        po.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        po.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {po.description}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-right text-sm font-medium">
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}