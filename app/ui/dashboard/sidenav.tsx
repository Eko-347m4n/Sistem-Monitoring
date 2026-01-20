import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { logOut } from '@/app/lib/actions';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white border-r border-slate-200">
      <Link
        className="mb-6 flex h-16 items-center justify-start rounded-xl bg-indigo-600 p-4"
        href="/"
      >
        <div className="w-32 text-white md:w-40 flex items-center gap-2">
           <div className="h-6 w-6 bg-white/20 rounded flex items-center justify-center font-bold text-xs">M</div>
           <span className="text-lg font-bold">SisMon</span>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1">
        <NavLinks />
        <div className="hidden h-auto w-full grow md:block"></div>
        <form
          action={async () => {
            'use server';
            await logOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors">
            <PowerIcon className="w-5" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}