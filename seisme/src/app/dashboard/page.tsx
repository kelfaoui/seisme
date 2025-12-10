// app/page.tsx or pages/index.tsx (Next.js)
'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [stlData, setStlData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [rfmData, setRfmData] = useState([]);
  const [numbers, setNumbers] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const stlRes = await fetch('http://localhost:8000/stl');
      const forecastRes = await fetch('http://localhost:8000/predict');
      const rfmRes = await fetch('http://localhost:8000/rfm');
      const numberRes = await fetch('http://localhost:8000/numbers');

      const stl = await stlRes.json();
      const forecast = await forecastRes.json();
      const rfm = await rfmRes.json();
      const nums = await numberRes.json();

      setNumbers(nums);

      setStlData(stl.dates.map((date: string, i: number) => ({
        date,
        observed: stl.observed[i],
        trend: stl.trend[i],
        seasonal: stl.seasonal[i],
        resid: stl.resid[i],
      })));

      setForecastData(forecast.history_dates.map((date: string, i: number) => ({
        date,
        value: forecast.history[i],
        type: 'historique',
      })).concat(
        forecast.forecast_dates.map((date: string, i: number) => ({
          date,
          value: forecast.forecast[i],
          type: 'prévision',
        }))
      ));

      setRfmData(rfm.map((row: any) => ({
        client_id: row.client_id,
        recence: row.recence,
        frequence: row.frequence,
        montant: row.montant,
        cluster: row.cluster,
      })));
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-12">
      <div className=" mb-3">
          <h1 className="text-xl font-bold mb-3">Tableau de bord</h1>
          {numbers && (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    {Object.entries(numbers).map(([key, value]) => (
      <div
        key={key}
        className="bg-blue-100 text-blue-500 rounded-lg shadow p-4 flex flex-col items-center justify-center"
      >
        <span className="text-3xl font-bold">{value}</span>
        <span className="capitalize mt-2">{key}</span>
      </div>
    ))}
  </div>
)}
        {/* Décomposition STL */}
        <div className="bg-white rounded-lg shadow p-6 space-y-8">
          <h2 className="text-xl font-semibold mb-4">STL Décomposition</h2>

         
          <div>
            <h3 className="text-md font-medium mb-2">Observé</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stlData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="observed" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tendances */}
          <div>
            <h3 className="text-md font-medium mb-2">Tendance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stlData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trend" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonnalité */}
          <div>
            <h3 className="text-md font-medium mb-2">Saisonnalité</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stlData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="seasonal" stroke="#ffc658" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Residelle */}
          <div>
            <h3 className="text-md font-medium mb-2">Résiduelle</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stlData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="resid" stroke="#ff7300" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
