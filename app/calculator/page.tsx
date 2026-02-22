'use client';

import { useState } from 'react';

export default function CalculatorPage() {
  const [kilometers, setKilometers] = useState<number | string>('');
  const [result, setResult] = useState<number | null>(null);

  const handleKilometersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setKilometers('');
      setResult(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setKilometers(numValue);
        setResult((numValue / 40) * 10000);
      } else {
        setKilometers(value); // Keep invalid string in input
        setResult(null);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Kalkulator Perjalanan</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="kilometers" className="block text-gray-700 text-sm font-bold mb-2">
            Jarak (km):
          </label>
          <input
            type="number"
            id="kilometers"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan jarak dalam kilometer"
            value={kilometers}
            onChange={handleKilometersChange}
            min="0"
            step="0.1"
          />
        </div>
        {result !== null && (
          <div className="mt-6 p-4 bg-blue-100 rounded-md">
            <p className="text-lg font-semibold text-blue-800">
              Perkiraan Pendapatan: Rp {result.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
