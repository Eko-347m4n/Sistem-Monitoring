'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { createPreOrder } from '@/app/lib/actions';

export default function Form() {
  const initialState = { message: '', errors: {} };
  // @ts-ignore
  const [state, dispatch] = useFormState(createPreOrder, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-slate-50 p-4 md:p-6">
        
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer_name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative">
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              placeholder="Enter customer name"
              className="peer block w-full rounded-md border border-slate-200 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500"
              aria-describedby="customer-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customer_name &&
              state.errors.customer_name.map((error: string) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description / Notes
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              placeholder="Enter order description"
              className="peer block w-full rounded-md border border-slate-200 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500"
              aria-describedby="description-error"
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-slate-500" />
          </div>
        </div>

        {/* Work Units Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Initial Work Units
          </label>
          <div className="flex gap-4">
            {['AIR', 'ELECTRICAL', 'PHYSICAL'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="work_types"
                  value={type}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-slate-700 capitalize">{type.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
            {state.message && (
                <p className="mt-2 text-sm text-red-500">
                    {state.message}
                </p>
            )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pre-orders"
          className="flex h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          Cancel
        </Link>
        <button type="submit" className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Create Pre-Order
        </button>
      </div>
    </form>
  );
}
