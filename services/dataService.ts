import { AlarmStationInfo, EvapRainInfo, ReservoirRtInfo } from "../types";

const RESERVOIR_API = "http://220.130.231.7/wushantouwebservice/Reservoir.asmx/GetRealTimeInfo";
const ALARM_API = "http://220.130.231.7/wushantouwebservice/AlarmStationService.asmx/GetAllAlarmStationInfos";
const RAIN_API = "http://220.130.231.7/wushantouwebservice/OutsiderService.asmx/GetEvapRainRealtimeHourInfo";

// Helper to parse XML string into DOM
const parseXml = (xmlStr: string) => {
  try {
    return new DOMParser().parseFromString(xmlStr, "text/xml");
  } catch (e) {
    console.error("XML Parse Error", e);
    return null;
  }
};

// Helper to get text content safely
const getText = (parent: Document | Element | null, tag: string): string => {
  if (!parent) return "";
  const el = parent.getElementsByTagName(tag)[0];
  return el?.textContent || "";
};

// Helper to get number content safely
const getNumber = (parent: Document | Element | null, tag: string): number => {
  const val = getText(parent, tag);
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// --- MOCK DATA FOR FALLBACK ---
const MOCK_RESERVOIR: ReservoirRtInfo = {
  ReservoirName: "烏山頭水庫 (模擬)",
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
  // Prevent Mixed Content errors (HTTPS page requesting HTTP API)
  // This is common in hosted environments (Vercel/GitHub Pages) or even local localhost sometimes.
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isApiHttp = RESERVOIR_API.startsWith('http:');
  
  if (isHttps && isApiHttp) {
    console.warn("Mixed Content Restriction: Skipping live fetch from HTTPS to HTTP. Using Mock Data.");
    return { reservoir: MOCK_RESERVOIR, alarms: MOCK_ALARMS, rain: MOCK_RAIN };
  }

  try {
    // Attempt to fetch live data
    // Use signal/timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const fetchOptions = { 
      method: 'GET', 
      mode: 'cors' as RequestMode,
      signal: controller.signal
    };

    const resPromise = fetch(RESERVOIR_API, fetchOptions).then(r => {
      if (!r.ok) throw new Error(`Reservoir API error: ${r.status}`);
      return r.text();
    });
    const alarmPromise = fetch(ALARM_API, fetchOptions).then(r => {
      if (!r.ok) throw new Error(`Alarm API error: ${r.status}`);
      return r.text();
    });
    const rainPromise = fetch(RAIN_API, fetchOptions).then(r => {
      if (!r.ok) throw new Error(`Rain API error: ${r.status}`);
      return r.text();
    });

    const [resText, alarmText, rainText] = await Promise.all([resPromise, alarmPromise, rainPromise]);
    clearTimeout(timeoutId);

    // 1. Parse Reservoir
    const resXml = parseXml(resText);
    if (!resXml) throw new Error("Failed to parse Reservoir XML");

    const rawRate = getNumber(resXml, "VolumeRate");
    const reservoir: ReservoirRtInfo = {
      ReservoirName: getText(resXml, "ReservoirName"),
      DateTime: getText(resXml, "DateTime"),
      WaterLevel: getNumber(resXml, "WaterLevel"),
      Volume: getNumber(resXml, "Volume"),
      VolumeRate: rawRate > 1 ? rawRate : rawRate * 100, // Handle cases where API might return % or decimal
      Turbidity: getNumber(resXml, "Turbidity"),
      AverageHourRainQty: getNumber(resXml, "AverageHourRainQty"),
      AverageDayRainQty: getNumber(resXml, "AverageDayRainQty"),
    };

    // 2. Parse Alarms
    const alarmXml = parseXml(alarmText);
    if (!alarmXml) throw new Error("Failed to parse Alarm XML");

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
    if (!rainXml) throw new Error("Failed to parse Rain XML");

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
    console.warn("Live data fetch failed (CORS, Network, or Parse Error). Using Mock Data for visualization.", error);
    
    // Simulate network delay for realism if it failed immediately
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      reservoir: MOCK_RESERVOIR,
      alarms: MOCK_ALARMS,
      rain: MOCK_RAIN
    };
  }
};