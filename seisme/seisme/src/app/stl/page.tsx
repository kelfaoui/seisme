// app/page.tsx or pages/index.tsx (Next.js)
'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import Layout from '../components/Layout';

interface StlDataPoint {
  date: string;
  observed: number;
  trend: number;
  seasonal: number;
  resid: number;
}

interface ForecastDataPoint {
  date: string;
  value: number;
  type: string;
}

interface RfmDataPoint {
  client_id: any;
  recence: any;
  frequence: any;
  montant: any;
  cluster: any;
}

export default function Home() {
  const [stlData, setStlData] = useState<StlDataPoint[]>([]);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [rfmData, setRfmData] = useState<RfmDataPoint[]>([]);
  const [numbers, setNumbers] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stlRes = await fetch('http://localhost:8000/stl');
        const forecastRes = await fetch('http://localhost:8000/predict');
        const rfmRes = await fetch('http://localhost:8000/rfm');
        const numberRes = await fetch('http://localhost:8000/numbers');

        const stl = await stlRes.json();
        const forecast = await forecastRes.json();
        const rfm = await rfmRes.json();
        const nums = await numberRes.json();

        setNumbers(nums || {});

        if (stl?.dates && Array.isArray(stl.dates)) {
          setStlData(stl.dates.map((date: string, i: number) => ({
            date,
            observed: stl.observed?.[i] || 0,
            trend: stl.trend?.[i] || 0,
            seasonal: stl.seasonal?.[i] || 0,
            resid: stl.resid?.[i] || 0,
          })));
        }

        if (forecast?.history_dates && Array.isArray(forecast.history_dates)) {
          const historyData = forecast.history_dates.map((date: string, i: number) => ({
            date,
            value: forecast.history?.[i] || 0,
            type: 'historique',
          }));
          
          const forecastData = (forecast.forecast_dates && Array.isArray(forecast.forecast_dates))
            ? forecast.forecast_dates.map((date: string, i: number) => ({
                date,
                value: forecast.forecast?.[i] || 0,
                type: 'prévision',
              }))
            : [];
          
          setForecastData([...historyData, ...forecastData]);
        }

        if (rfm && Array.isArray(rfm)) {
          setRfmData(rfm.map((row: any) => ({
            client_id: row.client_id,
            recence: row.recence,
            frequence: row.frequence,
            montant: row.montant,
            cluster: row.cluster,
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-12">
      <div className=" mb-3">
          <h1 className="text-xl font-bold mb-3">Series temporelles (STL)</h1>
          
        {/* STL Decomposition */}
        <div className="bg-white rounded-lg shadow p-6 space-y-8">
          <h2 className="text-xl font-semibold mb-4">STL Décomposition</h2>

          {/* Observed */}
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

          {/* Trend */}
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

          {/* Seasonal */}
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

          {/* Residual */}
          <div>
            <h3 className="text-md font-medium mb-2">Résidu</h3>
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
