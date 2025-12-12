'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

// Define type for a seism (earthquake) event
interface Seism {
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  mag: number;
  place: string;
  id: string;
  // Add more fields as needed from the CSV
}

export default function SeismsPage() {
  const [seisms, setSeisms] = useState<Seism[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetch(`http://localhost:8000/seisms?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setSeisms(data.data);
        setTotal(data.total);
      })
      .catch(err => console.error("Failed to fetch seisms:", err));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Séismes Récents (M ≥ 2.5)</h1>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 sticky top-0 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date & Heure</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3">Magnitude</th>
                <th className="px-4 py-3">Profondeur (km)</th>
                <th className="px-4 py-3">Latitude</th>
                <th className="px-4 py-3">Longitude</th>
                <th className="px-4 py-3">ID</th>
              </tr>
            </thead>
            <tbody>
              {seisms.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`hover:bg-gray-50 ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2">
                    {new Date(s.time).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-2">{s.place}</td>
                  <td className="px-4 py-2">
                    <span className="font-bold text-red-600">{s.mag}</span>
                  </td>
                  <td className="px-4 py-2">{s.depth}</td>
                  <td className="px-4 py-2">{s.latitude.toFixed(3)}</td>
                  <td className="px-4 py-2">{s.longitude.toFixed(3)}</td>
                  <td className="px-4 py-2 text-xs font-mono">{s.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (reuse your existing logic) */}
        <div className="flex justify-center items-center gap-1 mt-6 text-sm">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="w-8 h-8 border border-gray-300 rounded disabled:opacity-40"
          >
            «
          </button>

          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="w-8 h-8 border border-gray-300 rounded disabled:opacity-40"
          >
            ‹
          </button>

          {page > 2 && <span className="w-8 text-center">…</span>}

          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 border border-gray-300 rounded"
            >
              {page - 1}
            </button>
          )}

          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded border border-gray-300">
            {page}
          </span>

          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 border border-gray-300 rounded"
            >
              {page + 1}
            </button>
          )}

          {page < totalPages - 1 && <span className="w-8 text-center">…</span>}

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="w-8 h-8 border border-gray-300 rounded disabled:opacity-40"
          >
            ›
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="w-8 h-8 border border-gray-300 rounded disabled:opacity-40"
          >
            »
          </button>
        </div>
      </div>
    </Layout>
  );
}