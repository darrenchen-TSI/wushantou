import React from 'react';
import { ReservoirRtInfo } from '../types';
import { Droplet, Waves, CloudRain, Activity, Sun, Clock } from 'lucide-react';

interface ReservoirPanelProps {
  data: ReservoirRtInfo;
  evaporation?: number;
}

export const ReservoirPanel: React.FC<ReservoirPanelProps> = ({ data, evaporation }) => {
  // Ensure percentage is between 0 and 100
  const percentage = Math.min(Math.max(data.VolumeRate, 0), 100);
  
  // Calculate wave height (inverse logic: if full 100%, wave is at top 0%)
  const waveTop = 100 - percentage;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Waves className="w-6 h-6 text-blue-600" />
          {data.ReservoirName || "烏山頭水庫"}
        </h2>
        {data.DateTime && (
           <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
              <Clock className="w-3 h-3" />
              <span>{data.DateTime.replace('T', ' ')}</span>
           </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        {/* Animated Water Tank Card */}
        <div className="col-span-1 relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl overflow-hidden shadow-inner border border-blue-100 min-h-[280px] box group">
            {/* Water Background */}
            <div 
                className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000 ease-in-out"
                style={{ height: `${percentage}%` }}
            ></div>

            {/* Waves CSS Animation */}
            <div 
                className="absolute left-0 right-0 w-[200%] h-[200%] transition-all duration-1000 ease-in-out"
                style={{ top: `-${percentage + 5}%` }} 
            >
                <div className="wave -three"></div>
                <div className="wave -two"></div>
                <div className="wave"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50">
                         <p className="text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">目前水位</p>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-blue-700">{data.WaterLevel.toFixed(2)}</span>
                            <span className="text-sm font-medium text-blue-500">m</span>
                         </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white shadow-sm">
                        <Droplet className="w-6 h-6" />
                    </div>
                </div>

                <div className="text-center">
                    <div className="inline-block bg-white/95 backdrop-blur shadow-xl rounded-2xl px-8 py-4 border border-blue-100">
                        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">蓄水百分比</p>
                        <p className="text-5xl font-black text-blue-600 tracking-tight">
                            {percentage.toFixed(1)}<span className="text-2xl ml-1 text-blue-400">%</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side Stats Grid */}
        <div className="col-span-1 grid grid-cols-2 gap-4">
            {/* Effective Volume */}
            <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">有效蓄水量</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-800">
                    {data.Volume.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </p>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">萬 m³</span>
              </div>
            </div>

            {/* Rain Stats */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-cyan-50 rounded-md">
                    <CloudRain className="w-4 h-4 text-cyan-600" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold">日雨量</p>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {data.AverageDayRainQty.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400 ml-1">mm</span>
                </p>
            </div>

             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-50 rounded-md">
                    <CloudRain className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold">時雨量</p>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {data.AverageHourRainQty.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400 ml-1">mm</span>
                </p>
            </div>

            {/* Turbidity */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-50 rounded-md">
                    <Activity className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-slate-500 text-xs font-bold">濁度</p>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {data.Turbidity.toFixed(0)}
                <span className="text-xs font-normal text-slate-400 ml-1">NTU</span>
              </p>
            </div>

            {/* Evaporation */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-amber-50 rounded-md">
                    <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-slate-500 text-xs font-bold">蒸發量</p>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {evaporation !== undefined ? evaporation.toFixed(2) : '--'}
                <span className="text-xs font-normal text-slate-400 ml-1">mm</span>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};