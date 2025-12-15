import { StatusType, StatusColor } from './types';

/**
 * Ported logic from C# GetStatusClass method.
 * Determines the visual state based on the value string and the type of sensor.
 */
export const getStatusColor = (val: string | null | undefined, type: StatusType): StatusColor => {
  const cleanVal = val?.trim() || "";

  // 1. Highest Priority: Danger (Faults, Errors, Disconnects)
  // C#: if (val.Contains("故障") || val.Contains("異常") || val.Contains("斷線"))
  if (cleanVal.includes("故障") || cleanVal.includes("異常") || cleanVal.includes("斷線")) {
    return "danger";
  }

  // 2. Door Logic
  // C#: if (type == "Door") return val == "開啟" ? "status-warning" : (val == "關閉" ? "status-success" : "status-secondary");
  if (type === 'Door') {
    if (cleanVal === "開啟") return "warning";
    if (cleanVal === "關閉") return "success";
    return "secondary";
  }

  // 3. Normal State
  // C#: if (val == "正常" || val == "通訊正常" || val == "關閉")
  if (cleanVal === "正常" || cleanVal === "通訊正常" || cleanVal === "關閉") {
    return "success";
  }

  // 4. Unknown non-empty values -> Danger
  // C#: if (!string.IsNullOrEmpty(val))
  if (cleanVal !== "") {
    return "danger";
  }

  // 5. Empty/Null -> Secondary (Gray)
  return "secondary";
};

export const getStatusTextClass = (color: StatusColor): string => {
  switch (color) {
    case 'success': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    case 'warning': return 'text-amber-700 bg-amber-100 border-amber-200';
    case 'danger': return 'text-rose-700 bg-rose-100 border-rose-200';
    case 'secondary': return 'text-slate-500 bg-slate-100 border-slate-200';
    default: return 'text-slate-500 bg-slate-100 border-slate-200';
  }
};

export const getStatusDotClass = (color: StatusColor): string => {
    switch (color) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-rose-500';
      case 'secondary': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };