import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar / Header */}
      <div className="flex h-16 items-center justify-between px-6 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-bold text-slate-800">SisMon</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex grow flex-col items-center justify-center p-6 md:p-12">
        <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Monitoring Kerja <br/> <span className="text-indigo-600">Lebih Efisien.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg">
            Sistem terintegrasi untuk memantau progres unit kerja teknis dan manajemen absensi teknisi secara real-time.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2"
            >
              <span>Mulai Sekarang</span> 
              <ArrowRightIcon className="w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 text-center text-slate-400 text-sm">
        &copy; 2026 Work Monitoring System
      </div>
    </main>
  );
}
