import { fetchAttendances } from '@/app/lib/data';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    notFound();
  }

  const attendances = await fetchAttendances();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Attendance Log</h1>
      </div>
      
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <table className="min-w-full text-slate-900">
              <thead className="text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:pl-6">
                    Technician
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Tap In
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Tap Out
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Duration
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((record) => (
                  <tr
                    key={record.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                        <div className="font-medium text-slate-900">{record.technician.name}</div>
                        <div className="text-xs text-slate-500">{record.technician.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {new Date(record.tap_in).toLocaleTimeString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {record.tap_out ? new Date(record.tap_out).toLocaleTimeString() : '-'}
                    </td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {record.work_duration_minutes ? `${record.work_duration_minutes} mins` : '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        record.status === 'ON_TIME' ? 'bg-green-100 text-green-800' :
                        record.status === 'LATE' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendances.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                            No attendance records found.
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
