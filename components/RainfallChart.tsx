import React from 'react';
import { EvapRainInfo } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CloudDrizzle } from 'lucide-react';

interface RainfallChartProps {
  data: EvapRainInfo;
}

export const RainfallChart: React.FC<RainfallChartProps> = ({ data }) => {
  const chartData = [
    { name: '東口', value: data.EastSideRainQty },
    { name: '西口', value: data.WestSideRainQty },
    { name: '堰堤', value: data.WeirBodyRainQty },
    { name: '送水', value: data.WaterSupplyRainQty },
    { name: '分處', value: data.OfficeRainQty },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CloudDrizzle className="w-5 h-5 text-cyan-600" />
          即時雨量監測 (mm)
        </h2>
      </div>
      
      <div className="p-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill="#0ea5e9" 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};