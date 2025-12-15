import React from 'react';
import { ReservoirRtInfo } from '../types';
import { Droplet, Waves, CloudRain, Activity, Sun, Clock } from 'lucide-react';

interface ReservoirPanelProps {
  data: ReservoirRtInfo;
  evaporation?: number;
}

export const ReservoirPanel: React.FC<ReservoirPanelProps> = ({ data, evaporation }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Waves className="w-6 h-6 text-blue-600" />
          {data.ReservoirName || "烏山頭水庫"}即時水情
        </h2>
        {data.DateTime && (
           <div className="flex items-center gap-1 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              <Clock className="w-3 h-3" />
              <span>資料時間: {data.DateTime.replace('T', ' ')}</span>
           </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Main Water Level Card */}
        <div className="col-span-1 md:col-span-2 bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">目前水位 (Water Level)</p>
                <div className="text-5xl font-bold tracking-tight">
                  {data.WaterLevel.toFixed(2)}
                  <span className="text-2xl font-normal text-blue-200 ml-2">m</span>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Droplet className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2 text-blue-100">
                <span>蓄水百分比</span>
                <span className="font-bold">{data.VolumeRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-3 backdrop-blur-sm">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${Math.min(data.VolumeRate, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            {/* Effective Volume */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-500 text-sm font-medium mb-1">有效蓄水量</p>
              <p className="text-2xl font-bold text-slate-800">
                {data.Volume.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                <span className="text-sm font-normal text-slate-500 ml-1">萬立方公尺</span>
              </p>
            </div>

            {/* Turbidity */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-orange-500" />
                <p className="text-slate-500 text-sm font-medium">濁度 (Turbidity)</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {data.Turbidity.toFixed(0)}
                <span className="text-sm font-normal text-slate-500 ml-1">NTU</span>
              </p>
            </div>

             {/* Rain Stats Container */}
             <div className="col-span-2 grid grid-cols-2 gap-4">
               {/* Avg Day Rain */}
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <CloudRain className="w-4 h-4 text-cyan-500" />
                  <p className="text-slate-500 text-sm font-medium">日雨量</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {data.AverageDayRainQty.toFixed(1)}
                  <span className="text-sm font-normal text-slate-500 ml-1">mm</span>
                </p>
              </div>

               {/* Avg Hour Rain */}
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <p className="text-slate-500 text-sm font-medium">時雨量</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {data.AverageHourRainQty.toFixed(1)}
                  <span className="text-sm font-normal text-slate-500 ml-1">mm</span>
                </p>
              </div>
             </div>

            {/* Evaporation */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <p className="text-slate-500 text-sm font-medium">蒸發量 (Evaporation)</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {evaporation !== undefined ? evaporation.toFixed(2) : '--'}
                <span className="text-sm font-normal text-slate-500 ml-1">mm</span>
              </p>
            </div>
        </div>

      </div>
    </div>
  );
};