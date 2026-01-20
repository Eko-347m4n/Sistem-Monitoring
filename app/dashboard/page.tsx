import { auth } from '@/auth';
import { fetchTechnicianTasks, fetchTodayAttendance } from '@/app/lib/data';
import AttendanceCard from '@/app/ui/dashboard/attendance-card';
import TaskCard from '@/app/ui/dashboard/task-card';

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role;

  if (role === 'TECHNICIAN') {
    const [tasks, attendance] = await Promise.all([
      fetchTechnicianTasks(session?.user?.id!),
      fetchTodayAttendance(session?.user?.id!)
    ]);

    return (
      <main className="max-w-xl mx-auto space-y-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Workspace</h1>
           <p className="text-slate-500">Welcome back, {session?.user?.name}</p>
        </div>
        
        <section>
           <AttendanceCard attendance={attendance} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-800 flex items-center gap-2">
            Active Tasks
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
          </h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 italic">No active tasks assigned.</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <TaskCard key={task.id} assignment={task} />
                ))
            )}
          </div>
        </section>
      </main>
    );
  }

  // ADMIN VIEW
  return (
    <main>
      <h1 className="mb-8 text-2xl font-bold text-slate-800">
        Dashboard Overview
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">System Status</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Online</p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
               <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
        </div>
      </div>
    </main>
  );
}