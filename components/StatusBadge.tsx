import React from 'react';
import { StatusColor } from '../types';
import { getStatusTextClass, getStatusDotClass } from '../utils';

interface StatusBadgeProps {
  label: string;
  value: string;
  status: StatusColor;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, value, status }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getStatusTextClass(status)} transition-colors duration-300`}>
        <span className={`w-2 h-2 rounded-full ${getStatusDotClass(status)} animate-pulse`} />
        <span className="text-sm font-bold truncate">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );
};