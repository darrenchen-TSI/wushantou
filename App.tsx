import React, { useEffect, useState } from 'react';
import { ReservoirRtInfo, AlarmStationInfo, EvapRainInfo } from './types';
import { fetchDashboardData } from './services/dataService';
import { ReservoirPanel } from './components/ReservoirPanel';
import { AlarmStationGrid } from './components/AlarmStationGrid';
import { RainfallChart } from './components/RainfallChart';
import { LayoutDashboard, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [reservoirData, setReservoirData] = useState<ReservoirRtInfo | null>(null);
  const [alarmData, setAlarmData] = useState<AlarmStationInfo[]>([]);
  const [rainData, setRainData] = useState<EvapRainInfo | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardData();
      setReservoirData(data.reservoir);
      setAlarmData(data.alarms);
      setRainData(data.rain);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-10">
      {/* Top Navigation / Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">烏山頭水庫智慧監控系統</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <span className="hidden sm:inline text-slate-400">
                Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
             </span>
             <button 
                onClick={loadData}
                disabled={loading}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                aria-label="Refresh Data"
             >
                <RefreshCcw className={`w-4 h-4 text-blue-300 ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">系統錯誤: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State Skeleton or Content */}
        {loading && !reservoirData ? (
           <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : (
          <>
            {/* Top Row: Reservoir Info & Rainfall Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                 {reservoirData && <ReservoirPanel data={reservoirData} evaporation={rainData?.Evaporation} />}
              </div>
              <div className="xl:col-span-1">
                 {rainData && <RainfallChart data={rainData} />}
              </div>
            </div>

            {/* Bottom Row: Alarms Grid */}
            <div>
              <AlarmStationGrid alarms={alarmData} />
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm pb-8">
         &copy; {new Date().getFullYear()} Wushantou Reservoir Management System.
      </footer>
    </div>
  );
};

export default App;