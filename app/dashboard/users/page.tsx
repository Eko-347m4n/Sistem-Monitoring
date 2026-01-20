import { fetchUsers } from '@/app/lib/data';

export default async function Page() {
  const users = await fetchUsers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
      </div>
      
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <table className="min-w-full text-slate-900">
              <thead className="text-left text-sm font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
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
