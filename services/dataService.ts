import { AlarmStationInfo, EvapRainInfo, ReservoirRtInfo } from "../types";

// Simulating the XML parsing result from the C# backend
export const fetchDashboardData = async (): Promise<{
  reservoir: ReservoirRtInfo;
  alarms: AlarmStationInfo[];
  rain: EvapRainInfo;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    reservoir: {
      WaterLevel: 56.45,
      Volume: 432.1, // Million cubic meters
      VolumeRate: 78.5, // Percentage
      Turbidity: 12, // NTU
      AverageDayRainQty: 4.2, // mm
    },
    alarms: [
      {
        StationID: "S001",
        StationName: "大壩控制站",
        RecDateTime: "2023-10-27 10:00:00",
        CmdName: "通訊正常",
        Powered: "正常",
        DC: "正常",
        Door: "關閉",
        Amp: "正常",
        Trumpet: "正常",
      },
      {
        StationID: "S002",
        StationName: "西口監測站",
        RecDateTime: "2023-10-27 10:05:00",
        CmdName: "通訊正常",
        Powered: "異常", // Should trigger Danger
        DC: "正常",
        Door: "開啟", // Should trigger Warning
        Amp: "正常",
        Trumpet: "正常",
      },
      {
        StationID: "S003",
        StationName: "東口監測站",
        RecDateTime: "2023-10-27 09:55:00",
        CmdName: "斷線", // Should trigger Danger
        Powered: "",
        DC: "",
        Door: "",
        Amp: "",
        Trumpet: "",
      },
      {
        StationID: "S004",
        StationName: "送水管理站",
        RecDateTime: "2023-10-27 10:01:00",
        CmdName: "通訊正常",
        Powered: "正常",
        DC: "電壓過低", // Should trigger Danger (fallback logic)
        Door: "關閉",
        Amp: "正常",
        Trumpet: "故障", // Should trigger Danger
      },
    ],
    rain: {
      Evaporation: 2.5,
      EastSideRainQty: 12.0,
      WestSideRainQty: 5.5,
      WeirBodyRainQty: 0.0,
      WaterSupplyRainQty: 1.2,
      OfficeRainQty: 0.0,
    },
  };
};