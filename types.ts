export interface ReservoirRtInfo {
  WaterLevel: number;
  Volume: number;
  VolumeRate: number; // In percentage (0-100)
  Turbidity: number;
  AverageDayRainQty: number;
}

export interface AlarmStationInfo {
  RecDateTime: string;
  StationID: string;
  StationName: string;
  CmdName: string; // Command/Communication status
  Powered: string; // Power status
  DC: string;      // Battery/DC status
  Door: string;    // Door status
  Amp: string;     // Amplifier status
  Trumpet: string; // Speaker/Trumpet status
}

export interface EvapRainInfo {
  Evaporation: number;
  EastSideRainQty: number;
  WestSideRainQty: number;
  WeirBodyRainQty: number;
  WaterSupplyRainQty: number;
  OfficeRainQty: number;
}

export type StatusType = 'Normal' | 'Door';

export type StatusColor = 'success' | 'warning' | 'danger' | 'secondary';