'use client';

import { submitAttendance } from '@/app/lib/actions';
import { useState } from 'react';

export default function AttendanceCard({ attendance }: { attendance: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTap = async () => {
    setLoading(true);
    const res = await submitAttendance();
    setMessage(res.message);
    setLoading(false);
  };

  const isTappedIn = !!attendance;
  const isTappedOut = !!attendance?.tap_out;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900">Today's Attendance</h3>
      <div className="mt-4">
        {isTappedOut ? (
           <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
              You have finished work for today.
              <p className="text-xs mt-1">Duration: {attendance.work_duration_minutes} mins</p>
           </div>
        ) : (
          <button
            onClick={handleTap}
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-bold text-xl transition-all ${
               isTappedIn 
               ? 'bg-orange-500 hover:bg-orange-600' 
               : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : isTappedIn ? 'TAP OUT' : 'TAP IN'}
          </button>
        )}
        {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}
        
        {isTappedIn && !isTappedOut && (
            <p className="mt-2 text-center text-xs text-gray-500">
                Tapped in at: {new Date(attendance.tap_in).toLocaleTimeString()}
            </p>
        )}
      </div>
    </div>
  );
}
