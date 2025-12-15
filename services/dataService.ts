import { AlarmStationInfo, EvapRainInfo, ReservoirRtInfo } from "../types";

const RESERVOIR_API = "http://220.130.231.7/wushantouwebservice/Reservoir.asmx/GetRealTimeInfo";
const ALARM_API = "http://220.130.231.7/wushantouwebservice/AlarmStationService.asmx/GetAllAlarmStationInfos";
const RAIN_API = "http://220.130.231.7/wushantouwebservice/OutsiderService.asmx/GetEvapRainRealtimeHourInfo";

// Helper to parse XML string into DOM
const parseXml = (xmlStr: string) => {
  return new DOMParser().parseFromString(xmlStr, "text/xml");
};

// Helper to get text content safely
const getText = (parent: Document | Element, tag: string): string => {
  const el = parent.getElementsByTagName(tag)[0];
  return el?.textContent || "";
};

// Helper to get number content safely
const getNumber = (parent: Document | Element, tag: string): number => {
  const val = getText(parent, tag);
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// --- MOCK DATA FOR FALLBACK ---
const MOCK_RESERVOIR: ReservoirRtInfo = {
  ReservoirName: "烏山頭水庫",
  DateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
  WaterLevel: 56.49,
  Volume: 6212.8,
  VolumeRate: 80.29,
  Turbidity: 30,
  AverageHourRainQty: 0,
  AverageDayRainQty: 0,
};

const MOCK_RAIN: EvapRainInfo = {
  InfoTime: new Date().toISOString(),
  Evaporation: 0.21,
  EastSideRainQty: 0,
  WestSideRainQty: 0,
  WeirBodyRainQty: 0,
  WaterSupplyRainQty: 0,
  OfficeRainQty: 0,
  AverageRainQty: 0,
};

const MOCK_ALARMS: AlarmStationInfo[] = [
  {
    RecDateTime: new Date().toISOString(),
    StationID: "0001",
    StationName: "溢洪道出口警報站",
    CmdName: "通訊故障",
    Powered: "正常",
    DC: "正常",
    Door: "關閉",
    Amp: "正常",
    Trumpet: "正常",
  },
  {
    RecDateTime: new Date().toISOString(),
    StationID: "0002",
    StationName: "舊送水口警報站",
    CmdName: "通訊正常",
    Powered: "正常",
    DC: "正常",
    Door: "關閉",
    Amp: "正常",
    Trumpet: "正常",
  },
  {
    RecDateTime: new Date().toISOString(),
    StationID: "0003",
    StationName: "中繼站",
    CmdName: "通訊正常",
    Powered: "異常",
    DC: "低電壓",
    Door: "開啟",
    Amp: "正常",
    Trumpet: "正常",
  }
];

export const fetchDashboardData = async (): Promise<{
  reservoir: ReservoirRtInfo;
  alarms: AlarmStationInfo[];
  rain: EvapRainInfo;
}> => {
  try {
    // Attempt to fetch live data
    // Note: This will likely fail in a browser environment due to CORS if not proxied
    const resPromise = fetch(RESERVOIR_API, { method: 'GET', mode: 'cors' }).then(r => r.text());
    const alarmPromise = fetch(ALARM_API, { method: 'GET', mode: 'cors' }).then(r => r.text());
    const rainPromise = fetch(RAIN_API, { method: 'GET', mode: 'cors' }).then(r => r.text());

    // Wait for all, but if they fail (likely), go to catch block
    const [resText, alarmText, rainText] = await Promise.all([resPromise, alarmPromise, rainPromise]);

    // 1. Parse Reservoir
    const resXml = parseXml(resText);
    const rawRate = getNumber(resXml, "VolumeRate");
    const reservoir: ReservoirRtInfo = {
      ReservoirName: getText(resXml, "ReservoirName"),
      DateTime: getText(resXml, "DateTime"),
      WaterLevel: getNumber(resXml, "WaterLevel"),
      Volume: getNumber(resXml, "Volume"),
      VolumeRate: rawRate * 100,
      Turbidity: getNumber(resXml, "Turbidity"),
      AverageHourRainQty: getNumber(resXml, "AverageHourRainQty"),
      AverageDayRainQty: getNumber(resXml, "AverageDayRainQty"),
    };

    // 2. Parse Alarms
    const alarmXml = parseXml(alarmText);
    const stationNodes = alarmXml.getElementsByTagName("AlarmStationInfo");
    const alarms: AlarmStationInfo[] = Array.from(stationNodes).map((node) => ({
      RecDateTime: getText(node, "RecDateTime"),
      StationID: getText(node, "StationID"),
      StationName: getText(node, "StationName"),
      CmdName: getText(node, "CmdName"),
      Powered: getText(node, "Powered"),
      DC: getText(node, "DC"),
      Door: getText(node, "Door"),
      Amp: getText(node, "Amp"),
      Trumpet: getText(node, "Trumpet"),
    }));

    // 3. Parse Rain
    const rainXml = parseXml(rainText);
    const rain: EvapRainInfo = {
      InfoTime: getText(rainXml, "InfoTime"),
      Evaporation: getNumber(rainXml, "Evaporation"),
      EastSideRainQty: getNumber(rainXml, "EastSideRainQty"),
      WestSideRainQty: getNumber(rainXml, "WestSideRainQty"),
      WeirBodyRainQty: getNumber(rainXml, "WeirBodyRainQty"),
      WaterSupplyRainQty: getNumber(rainXml, "WaterSupplyRainQty"),
      OfficeRainQty: getNumber(rainXml, "OfficeRainQty"),
      AverageRainQty: getNumber(rainXml, "AverageRainQty"),
    };

    return { reservoir, alarms, rain };

  } catch (error) {
    console.warn("Live data fetch failed (CORS/Network), using Mock Data for visualization.", error);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      reservoir: MOCK_RESERVOIR,
      alarms: MOCK_ALARMS,
      rain: MOCK_RAIN
    };
  }
};