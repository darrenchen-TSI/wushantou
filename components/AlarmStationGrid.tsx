import React from 'react';
import { AlarmStationInfo } from '../types';
import { getStatusColor } from '../utils';
import { StatusBadge } from './StatusBadge';
import { AlertTriangle, Wifi, Battery, Radio, Mic2, DoorOpen } from 'lucide-react';

interface AlarmStationGridProps {
  alarms: AlarmStationInfo[];
}

export const AlarmStationGrid: React.FC<AlarmStationGridProps> = ({ alarms }) => {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-rose-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">警報站監測 (Alarm Stations)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {alarms.map((station) => {
          // Check if any status is critical to highlight the card header
          const statuses = [
            getStatusColor(station.CmdName, 'Normal'),
            getStatusColor(station.Powered, 'Normal'),
            getStatusColor(station.DC, 'Normal'),
            getStatusColor(station.Door, 'Door'),
            getStatusColor(station.Amp, 'Normal'),
            getStatusColor(station.Trumpet, 'Normal'),
          ];
          
          const hasDanger = statuses.includes('danger');
          const hasWarning = statuses.includes('warning');
          
          const headerClass = hasDanger 
            ? 'bg-rose-50 border-rose-100 text-rose-800' 
            : hasWarning 
              ? 'bg-amber-50 border-amber-100 text-amber-800'
              : 'bg-white border-slate-100 text-slate-800';

          return (
            <div key={station.StationID} className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md ${hasDanger ? 'ring-2 ring-rose-500/20' : ''}`}>
              
              <div className={`px-5 py-4 border-b flex justify-between items-center ${headerClass}`}>
                <div>
                  <h3 className="font-bold text-lg">{station.StationName}</h3>
                  <p className="text-xs opacity-70 mt-0.5 font-mono">{station.StationID}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] opacity-60 uppercase tracking-wider font-semibold">Updated</p>
                   <p className="text-xs font-mono">{station.RecDateTime?.split(' ')[1] || '--:--'}</p>
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <Wifi className="w-3 h-3" /> Communication
                   </div>
                   <StatusBadge 
                      label="連線狀態" 
                      value={station.CmdName} 
                      status={getStatusColor(station.CmdName, 'Normal')} 
                    />
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <Battery className="w-3 h-3" /> Power
                   </div>
                   <StatusBadge 
                      label="市電 (AC)" 
                      value={station.Powered} 
                      status={getStatusColor(station.Powered, 'Normal')} 
                    />
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <Battery className="w-3 h-3" /> Backup
                   </div>
                   <StatusBadge 
                      label="電池 (DC)" 
                      value={station.DC} 
                      status={getStatusColor(station.DC, 'Normal')} 
                    />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <Radio className="w-3 h-3" /> Audio
                   </div>
                   <StatusBadge 
                      label="擴大機" 
                      value={station.Amp} 
                      status={getStatusColor(station.Amp, 'Normal')} 
                    />
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <Mic2 className="w-3 h-3" /> Audio
                   </div>
                   <StatusBadge 
                      label="喇叭" 
                      value={station.Trumpet} 
                      status={getStatusColor(station.Trumpet, 'Normal')} 
                    />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-slate-500">
                        <DoorOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">門禁監控</span>
                     </div>
                     <div className="w-32">
                        <StatusBadge 
                          label="" 
                          value={station.Door} 
                          status={getStatusColor(station.Door, 'Door')} 
                        />
                     </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};