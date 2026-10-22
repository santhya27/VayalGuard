import { useEffect, useMemo, useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  CloudRain,
  ClipboardCheck,
  Languages,
  MapPin,
  Search,
  RefreshCw,
  Sun,
  Cloud,
  CloudSun,
  Droplets,
  Thermometer,
  CalendarDays,
  ShieldAlert,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Leaf,
  Menu,
  X,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";

import {
  getVillageCoordinates,
  getWeather,
  getWeatherDescription,
} from "./services/weather";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const translations = {
  en: {
    dashboard: "Dashboard",
    forecast: "Weather forecast",
    actions: "Farm action plan",
    welcome: "Your farm, one step ahead.",
    subtitle: "Weather intelligence made practical for your fields.",
    location: "Farm location",
    crop: "Your crop",
    harvest: "Expected harvest date",
    search: "Check village",
    loading: "Checking weather...",
    refresh: "Refresh forecast",
    today: "Today's weather",
    rain: "Rain probability",
    temperature: "Temperature",
    risk: "Farm risk assessment",
    plan: "Your next steps",
    forecastTitle: "7-day forecast",
    checklist: "Preparation checklist",
    completed: "completed",
    high: "High attention",
    medium: "Moderate attention",
    low: "Lower attention",
    source: "Forecast source: Open-Meteo",
    disclaimer: "Forecasts are estimates, not guarantees.",
    villagePlaceholder: "Enter village or town",
    chooseCrop: "Choose crop",
    paddy: "Paddy / Rice",
    wheat: "Wheat",
    cotton: "Cotton",
    groundnut: "Groundnut",
    maize: "Maize",
    sugarcane: "Sugarcane",
    millet: "Millets",
    pulses: "Pulses",
    soybean: "Soybean",
    sesame: "Sesame",
    sunflower: "Sunflower",
    chilli: "Chilli",
    tomato: "Tomato",
    onion: "Onion",
    banana: "Banana",
    coconut: "Coconut",
    vegetables: "Other vegetables",
    otherCrop: "Other crop",
    otherCropPlaceholder: "Enter crop name",
    otherStatePlaceholder: "Enter state name",
    otherIrrigationPlaceholder: "Enter irrigation method",
    season: "Growing season",
    autoSeason: "Automatic (based on conditions)",
    summer: "Summer",
    winter: "Winter",
    harvestHint: "Select your expected harvest date",
    why: "Why this matters",
    action: "Recommended action",
    confidence: "Forecast context",
    lastUpdated: "Last fetched",
    empty: "Enter a village to check its weather forecast.",
    errorTitle: "Unable to load forecast",
    retry: "Try again",
    language: "தமிழ்",
    noRain: "No significant rain signal in this forecast.",
    noHarvest: "Harvest is not near based on the date you selected.",
    nearHarvest: "Your selected harvest date is approaching.",
    rainExpected: "Rain is indicated in the forecast period.",
    complete: "Mark as completed",
    undo: "Mark as pending",
    allDone: "Your current checklist is complete.",
    sourceNote: "Weather data is model-based and may change.",
    selectVillage: "Selected location",
    todayLabel: "Today",
    rainTotal: "Forecast rain total",
    day: "day",
    days: "days",
    status: "Farm status",
    selectLocation: "Search for your farm location to begin.",
    noForecast: "No weather data yet",
    overview: "Overview",
    riskHelp:
      "Risk level is a rule-based screening indicator, not a prediction of crop loss.",
    locationHelp:
      "Confirm the village shown below before relying on its forecast.",
    updated: "Forecast refreshed",
  },

  ta: {
    dashboard: "முகப்பு",
    forecast: "வானிலை முன்னறிவிப்பு",
    actions: "வயல் செயல் திட்டம்",
    welcome: "உங்கள் வயல், ஒரு படி முன்னே.",
    subtitle: "உங்கள் வயலுக்கான பயனுள்ள வானிலைத் தகவல்கள்.",
    location: "வயல் அமைவிடம்",
    crop: "பயிர்",
    harvest: "எதிர்பார்க்கப்படும் அறுவடை தேதி",
    search: "வானிலையைப் பார்க்க",
    loading: "வானிலை சரிபார்க்கப்படுகிறது...",
    refresh: "முன்னறிவிப்பைப் புதுப்பிக்க",
    today: "இன்றைய வானிலை",
    rain: "மழை வாய்ப்பு",
    temperature: "வெப்பநிலை",
    risk: "வயல் அபாய மதிப்பீடு",
    plan: "அடுத்த நடவடிக்கைகள்",
    forecastTitle: "7 நாள் முன்னறிவிப்பு",
    checklist: "தயாரிப்புப் பட்டியல்",
    completed: "முடிந்தது",
    high: "அதிக கவனம்",
    medium: "மிதமான கவனம்",
    low: "குறைந்த கவனம்",
    source: "முன்னறிவிப்பு மூலம்: Open-Meteo",
    disclaimer: "முன்னறிவிப்புகள் மதிப்பீடுகள் மட்டுமே.",
    villagePlaceholder: "கிராமம் அல்லது நகரம்",
    chooseCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    paddy: "நெல்",
    wheat: "கோதுமை",
    cotton: "பருத்தி",
    groundnut: "நிலக்கடலை",
    maize: "மக்காச்சோளம்",
    sugarcane: "கரும்பு",
    millet: "சிறுதானியங்கள்",
    pulses: "பருப்பு வகைகள்",
    soybean: "சோயாபீன்",
    sesame: "எள்",
    sunflower: "சூரியகாந்தி",
    chilli: "மிளகாய்",
    tomato: "தக்காளி",
    onion: "வெங்காயம்",
    banana: "வாழை",
    coconut: "தென்னை",
    vegetables: "மற்ற காய்கறிகள்",
    otherCrop: "மற்ற பயிர்",
    otherCropPlaceholder: "பயிரின் பெயரை உள்ளிடவும்",
    otherStatePlaceholder: "மாநிலத்தின் பெயரை உள்ளிடவும்",
    otherIrrigationPlaceholder: "பாசன முறையை உள்ளிடவும்",
    season: "பயிரிடும் பருவம்",
    autoSeason: "தானியங்கி (வானிலை அடிப்படையில்)",
    summer: "கோடைக்காலம்",
    winter: "குளிர்காலம்",
    harvestHint: "அறுவடை தேதியைத் தேர்ந்தெடுக்கவும்",
    why: "இது ஏன் முக்கியம்",
    action: "பரிந்துரைக்கப்படும் நடவடிக்கை",
    confidence: "முன்னறிவிப்பு விவரம்",
    lastUpdated: "கடைசியாகப் பெற்றது",
    empty: "வானிலையைப் பார்க்க கிராமத்தின் பெயரை உள்ளிடவும்.",
    errorTitle: "முன்னறிவிப்பைப் பெற முடியவில்லை",
    retry: "மீண்டும் முயற்சிக்கவும்",
    language: "English",
    noRain: "இந்த முன்னறிவிப்பில் குறிப்பிடத்தக்க மழை அறிகுறி இல்லை.",
    noHarvest: "தேர்ந்தெடுத்த தேதியின்படி அறுவடை அருகில் இல்லை.",
    nearHarvest: "நீங்கள் தேர்ந்தெடுத்த அறுவடை தேதி நெருங்குகிறது.",
    rainExpected: "முன்னறிவிப்புக் காலத்தில் மழை சுட்டிக்காட்டப்படுகிறது.",
    complete: "முடிந்ததாகக் குறிக்கவும்",
    undo: "நிலுவையில் எனக் குறிக்கவும்",
    allDone: "உங்கள் தற்போதைய பட்டியல் முடிந்தது.",
    sourceNote: "வானிலைத் தரவு மாறக்கூடும்.",
    selectVillage: "தேர்ந்தெடுத்த இடம்",
    todayLabel: "இன்று",
    rainTotal: "மொத்த முன்னறிவிப்பு மழை",
    day: "நாள்",
    days: "நாட்கள்",
    status: "வயல் நிலை",
    selectLocation: "தொடங்க உங்கள் வயல் அமைவிடத்தைத் தேடுங்கள்.",
    noForecast: "இன்னும் வானிலைத் தரவு இல்லை",
    overview: "கண்ணோட்டம்",
    riskHelp:
      "இது விதிமுறை அடிப்படையிலான எச்சரிக்கை; பயிர் இழப்புக்கான கணிப்பு அல்ல.",
    locationHelp:
      "முன்னறிவிப்பைப் பயன்படுத்துவதற்கு முன் கிராமத்தை உறுதிப்படுத்தவும்.",
    updated: "முன்னறிவிப்பு புதுப்பிக்கப்பட்டது",
  },
};

const cropLabels = {
  paddy: { en: "Paddy / Rice", ta: "நெல்" },
  wheat: { en: "Wheat", ta: "கோதுமை" },
  cotton: { en: "Cotton", ta: "பருத்தி" },
  groundnut: { en: "Groundnut", ta: "நிலக்கடலை" },
  maize: { en: "Maize", ta: "மக்காச்சோளம்" },
  sugarcane: { en: "Sugarcane", ta: "கரும்பு" },
  millet: { en: "Millets", ta: "சிறுதானியங்கள்" },
  pulses: { en: "Pulses", ta: "பருப்பு வகைகள்" },
  soybean: { en: "Soybean", ta: "சோயாபீன்" },
  sesame: { en: "Sesame", ta: "எள்" },
  sunflower: { en: "Sunflower", ta: "சூரியகாந்தி" },
  chilli: { en: "Chilli", ta: "மிளகாய்" },
  tomato: { en: "Tomato", ta: "தக்காளி" },
  onion: { en: "Onion", ta: "வெங்காயம்" },
  banana: { en: "Banana", ta: "வாழை" },
  coconut: { en: "Coconut", ta: "தென்னை" },
  vegetables: { en: "Other vegetables", ta: "மற்ற காய்கறிகள்" },
  other: { en: "Other crop", ta: "மற்ற பயிர்" },
};

const KNOWN_STATES = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
const KNOWN_IRRIGATION = ["", "Rain-fed", "Canal", "Borewell", "Drip", "Sprinkler", "Other"];

// Reads the saved profile once, when the component first mounts.
// Village and location are deliberately NOT restored: the farmer must
// type and confirm the location for the current forecast.
function readSavedProfile() {
  let s = {};
  try {
    s = JSON.parse(localStorage.getItem("vayalguard-profile") || "{}");
  } catch {
    // Ignore corrupt browser storage.
  }
  const cropKnown = Boolean(s.crop && cropLabels[s.crop]);
  const stateKnown = !s.stateName || s.stateName === "Other" || KNOWN_STATES.includes(s.stateName);
  const irrKnown = !s.irrigation || KNOWN_IRRIGATION.includes(s.irrigation);

  return {
    language: s.language === "ta" ? "ta" : "en",
    crop: !s.crop ? "paddy" : cropKnown ? s.crop : "other",
    customCrop: !s.crop || cropKnown ? s.customCrop ?? "" : s.crop,
    stateName: !s.stateName ? "Tamil Nadu" : stateKnown ? s.stateName : "Other",
    customState: stateKnown ? s.customState ?? "" : s.stateName,
    irrigation: !s.irrigation ? "" : irrKnown ? s.irrigation : "Other",
    customIrrigation: irrKnown ? s.customIrrigation ?? "" : s.irrigation,
    district: s.district ?? "",
    sowingDate: s.sowingDate ?? "",
    harvestDate: s.harvestDate ?? "",
    growthStage: s.growthStage ?? "",
    tasksDone: s.tasksDone ?? {},
  };
}

function readDismissedAlerts() {
  try {
    return JSON.parse(localStorage.getItem("vayalguard-dismissed-alerts") || "[]");
  } catch {
    return [];
  }
}

function getForecastSeason(weather) {
  const daily = weather?.daily;
  if (!daily?.time?.length) return "unknown";

  const maxTemps = (daily.temperature_2m_max ?? []).map(Number).filter(Number.isFinite);
  const minTemps = (daily.temperature_2m_min ?? []).map(Number).filter(Number.isFinite);
  const rainfall = (daily.precipitation_sum ?? []).map(Number).filter(Number.isFinite);
  if (!maxTemps.length) return "unknown";

  const avgMax = maxTemps.reduce((sum, value) => sum + value, 0) / maxTemps.length;
  const avgMin = minTemps.length
    ? minTemps.reduce((sum, value) => sum + value, 0) / minTemps.length
    : avgMax;
  const totalRain = rainfall.reduce((sum, value) => sum + value, 0);

  // Forecast-driven estimate, not a formal meteorological or crop-season declaration.
  if (avgMax >= 32 && (totalRain < 25 || avgMin >= 23)) return "summer";
  if (avgMax <= 29 || avgMin <= 18) return "winter";
  return totalRain >= 25 ? "winter" : "summer";
}

function getRisk(weather, harvestDate, crop, growthStage, irrigation, language, customCropName = "", customIrrigation = "") {
  if (!weather?.daily?.time?.length) {
    return { level: "unknown", score: null, reasons: [], actions: [], summary: "No forecast available yet." };
  }

  const daily = weather.daily;
  const probabilities = daily.precipitation_probability_max ?? [];
  const rainfall = daily.precipitation_sum ?? [];
  const temperatures = daily.temperature_2m_max ?? [];
  const wind = daily.wind_speed_10m_max ?? [];
  const evapotranspiration = daily.et0_fao_evapotranspiration ?? [];

  const maxProbability = Math.max(0, ...probabilities.map((n) => Number(n) || 0));
  const maxRain = Math.max(0, ...rainfall.map((n) => Number(n) || 0));
  const totalRain = rainfall.reduce((sum, n) => sum + (Number(n) || 0), 0);
  const maxTemperature = Math.max(0, ...temperatures.map((n) => Number(n) || 0));
  const maxWind = Math.max(0, ...wind.map((n) => Number(n) || 0));
  const minTemperature = Math.min(...(daily.temperature_2m_min ?? [99]).map((n) => Number(n) || 0));
  const effectiveSeason = getForecastSeason(weather);
  const totalEt0 = evapotranspiration.reduce((sum, n) => sum + (Number(n) || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const harvest = harvestDate ? new Date(`${harvestDate}T00:00:00`) : null;
  const daysUntilHarvest = harvest && !Number.isNaN(harvest.getTime())
    ? Math.ceil((harvest - today) / 86400000)
    : null;
  const nearHarvest = daysUntilHarvest !== null && daysUntilHarvest >= 0 && daysUntilHarvest <= 7;

  // Transparent forecast screening only; these are operational thresholds,
  // not a validated crop-loss model or an official agricultural warning.
  // Keep correlated signals from being counted repeatedly. Rain probability
  // and rain amount share one rain component; heat, dryness, and wind each
  // have their own component. Farm-specific modifiers are capped at 2 points.
  const riskPoints = { rain: 0, heat: 0, dry: 0, wind: 0, context: 0 };
  const addRiskPoints = (component, points) => {
    riskPoints[component] = Math.max(riskPoints[component], points);
  };
  const reasons = [];
  const actions = [];
  const isTamil = language === "ta";
  const cropName = crop === "other" && customCropName.trim()
    ? customCropName.trim()
    : (cropLabels[crop]?.[language] ?? crop ?? (isTamil ? "பயிர்" : "crop"));
  const irrigationName = irrigation === "Other" && customIrrigation.trim()
    ? customIrrigation.trim()
    : irrigation;

  if (maxProbability >= 80) {
    addRiskPoints("rain", 2);
    reasons.push(isTamil
      ? `முன்னறிவிப்பில் மழை வாய்ப்பு ${Math.round(maxProbability)}% வரை உள்ளது.`
      : `Rain probability reaches ${Math.round(maxProbability)}% during the forecast.`);
  } else if (maxProbability >= 50) {
    addRiskPoints("rain", 1);
    reasons.push(isTamil
      ? `மழை வாய்ப்பு ${Math.round(maxProbability)}% வரை உள்ளது.`
      : `Rain probability reaches ${Math.round(maxProbability)}% during the forecast.`);
  }

  if (maxRain >= 25) {
    addRiskPoints("rain", 2);
    reasons.push(isTamil
      ? `ஒரு நாளில் ${maxRain.toFixed(1)} மி.மீ. வரை மழை கணிக்கப்பட்டுள்ளது; நீர் தேங்கும் இடங்களை கவனிக்கவும்.`
      : `Forecast rainfall reaches ${maxRain.toFixed(1)} mm on at least one day; waterlogging may be a concern in poorly drained fields.`);
  } else if (maxRain >= 10) {
    addRiskPoints("rain", 1);
    reasons.push(isTamil
      ? `ஒரு நாளில் ${maxRain.toFixed(1)} மி.மீ. வரை மழை கணிக்கப்பட்டுள்ளது.`
      : `Forecast rainfall reaches ${maxRain.toFixed(1)} mm on at least one day.`);
  }

  if (maxTemperature >= 38) {
    addRiskPoints("heat", 2);
    reasons.push(isTamil
      ? `அதிகபட்ச வெப்பநிலை ${maxTemperature.toFixed(1)}°C வரை இருக்கலாம்.`
      : `High temperature is forecast, reaching ${maxTemperature.toFixed(1)}°C.`);
  } else if (maxTemperature >= 35) {
    addRiskPoints("heat", 1);
    reasons.push(isTamil
      ? `அதிகபட்ச வெப்பநிலை ${maxTemperature.toFixed(1)}°C வரை இருக்கலாம்.`
      : `Warm conditions are forecast, with a high of ${maxTemperature.toFixed(1)}°C.`);
  }

  if (totalRain < 5 && maxTemperature >= 34 && totalEt0 >= 25) {
    addRiskPoints("dry", 1);
    reasons.push(isTamil
      ? "குறைந்த மழை மற்றும் அதிக ஆவியாதல் தேவை காரணமாக மண் ஈரப்பதத்தை கண்காணிக்கவும்."
      : "Low forecast rainfall combined with elevated atmospheric water demand may increase moisture stress; check actual soil moisture.");
  }

  if (effectiveSeason === "summer" && totalRain < 5 && maxTemperature >= 35) {
    addRiskPoints("dry", 1);
    reasons.push(isTamil
      ? "கோடைக்காலம்: மழை குறைவாகவும் வெப்பம் அதிகமாகவும் இருப்பதால் மண் ஈரப்பதத்தைக் கண்காணிக்கவும்."
      : "Summer conditions: low forecast rain and high heat make soil-moisture checks important.");
  }
  if (effectiveSeason === "winter" && minTemperature <= 15) {
    reasons.push(isTamil
      ? "குளிர்காலம்: குறைந்த இரவு/காலை வெப்பநிலையை கவனித்து, உள்ளூர் பயிர் ஆலோசனையைப் பின்பற்றவும்."
      : "Winter conditions: monitor cool nights and mornings and follow local crop-stage guidance.");
  }

  if (maxWind >= 40) {
    addRiskPoints("wind", 1);
    reasons.push(isTamil
      ? `காற்றின் வேகம் ${Math.round(maxWind)} கி.மீ./மணி வரை இருக்கலாம்.`
      : `Strong winds may occur, with forecast maximum wind speed around ${Math.round(maxWind)} km/h.`);
  }

  if (nearHarvest && (maxProbability >= 40 || maxRain >= 5)) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "அறுவடை தேதி அடுத்த 7 நாட்களுக்குள் உள்ளது; மழை முன்னறிவிப்பையும் கருத்தில் கொள்ளவும்."
      : "Your selected harvest date is within seven days and rain is forecast; review harvest and drying arrangements.");
  }

  // Crop and stage modifiers are practical screening heuristics, not
  // validated crop-loss predictions. They make the selected profile matter.
  if (growthStage === "Flowering" && maxTemperature >= 35) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "பயிர் பூக்கும் நிலையில் இருப்பதால், வெப்பநிலை மாற்றங்களைக் கவனித்து உள்ளூர் பயிர் ஆலோசனையைப் பின்பற்றவும்."
      : "The crop is at flowering stage; forecast heat adds an extra monitoring concern.");
  }

  if (growthStage === "Grain or fruit development" && maxTemperature >= 35) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "தானியம் அல்லது பழம் உருவாகும் நிலையில் அதிக வெப்பம் முன்னறிவிக்கப்பட்டுள்ளது; பயிர் மற்றும் மண் ஈரப்பதத்தைச் சரிபார்க்கவும்."
      : "Heat is forecast during grain or fruit development; check crop and soil conditions and consult local crop-stage guidance.");
  }

  if ((growthStage === "Maturity" || growthStage === "Harvest") && (maxRain >= 10 || maxProbability >= 70) && !nearHarvest) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "முதிர்ச்சி அல்லது அறுவடை நிலையில் மழை முன்னறிவிக்கப்பட்டுள்ளது; உலர்த்தல் மற்றும் பாதுகாப்பான சேமிப்பைத் திட்டமிடவும்."
      : "Rain is forecast while the crop is at maturity or harvest stage; review harvest timing and dry-storage arrangements.");
  }

  if ((growthStage === "Sowing" || growthStage === "Land preparation") && (maxRain >= 10 || maxProbability >= 70)) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "விதைப்பு அல்லது நிலத் தயாரிப்பு நிலை என்பதால், மழை முன்னறிவிப்பை வைத்து வயல் நிலையைச் சரிபார்க்கவும்."
      : "Because the field is at sowing or land-preparation stage, forecast rain makes field readiness worth checking.");
  }

  if (crop === "groundnut" && maxRain >= 10 && maxRain < 25) {
    reasons.push(isTamil
      ? "நிலக்கடலைத் தேர்ந்தெடுக்கப்பட்டுள்ளது: அதிக மழைக்குப் பிறகு வயலில் நீர் தேங்குகிறதா எனச் சரிபார்க்கவும்."
      : "Groundnut selected: after substantial rain, check for standing water and ensure safe drainage.");
  } else if (crop === "cotton" && maxTemperature >= 35 && totalRain >= 10) {
    reasons.push(isTamil
      ? "பருத்தி தேர்ந்தெடுக்கப்பட்டுள்ளது: வெப்பமான காலத்தில் மண் ஈரப்பதம் மற்றும் பயிர் அழுத்த அறிகுறிகளை கண்காணிக்கவும்."
      : "Cotton selected: during hot weather, monitor soil moisture and visible crop stress.");
  } else if (crop === "wheat" && maxTemperature >= 30 && !(maxTemperature >= 32 && (growthStage === "Flowering" || growthStage === "Grain or fruit development"))) {
    reasons.push(isTamil
      ? "கோதுமை தேர்ந்தெடுக்கப்பட்டுள்ளது: வளர்ச்சி நிலைக்கு ஏற்ப வெப்பநிலை குறித்து உள்ளூர் ஆலோசனையைப் பார்க்கவும்."
      : "Wheat selected: check stage-specific local guidance when warm conditions are forecast.");
  } else if (crop === "paddy" && maxRain >= 10) {
    reasons.push(isTamil
      ? "நெல் தேர்ந்தெடுக்கப்பட்டுள்ளது: வயலில் நீர் நிலை மற்றும் வெளியேற்ற வசதியைப் பயிர் நிலைக்கு ஏற்ப கண்காணிக்கவும்."
      : "Paddy selected: monitor field water levels and drainage according to the crop stage.");
  }

  // Crop-specific modifiers are intentionally small and transparent. They
  // represent screening prompts, not validated crop-loss probabilities.
  const hotAndDry = maxTemperature >= 35 && totalRain < 10;
  const veryWet = maxRain >= 25;
  if (crop === "groundnut" && veryWet) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "நிலக்கடலைக்கு அதிக மழை நிலையில் வடிகால் கவனம் தேவைப்படலாம்; நீர் தேங்கும் இடங்களைச் சரிபார்க்கவும்."
      : "Groundnut with substantial forecast rain: add a drainage check, especially in low-lying areas.");
  } else if (crop === "cotton" && hotAndDry) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "பருத்தி பயிருக்கு வெப்பமும் குறைந்த மழையும் உள்ளதால் மண் ஈரப்பதம் மற்றும் பயிர் அழுத்தத்தைச் சரிபார்க்கவும்."
      : "Cotton with hot, dry forecast conditions: check soil moisture and visible crop stress.");
  } else if (crop === "wheat" && maxTemperature >= 32 && (growthStage === "Flowering" || growthStage === "Grain or fruit development")) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "கோதுமையின் இனப்பெருக்க வளர்ச்சி நிலையில் வெப்பம் முன்னறிவிக்கப்பட்டுள்ளது; உள்ளூர் பயிர் ஆலோசனையைச் சரிபார்க்கவும்."
      : "Warm conditions during the selected wheat reproductive stage warrant checking local stage-specific guidance.");
  } else if (["maize", "millet", "pulses", "soybean", "sesame", "sunflower"].includes(crop) && hotAndDry) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? `${cropName}: வெப்பமும் குறைந்த மழையும் உள்ளதால் மண் ஈரப்பதம் மற்றும் பயிர் நிலையைச் சரிபார்க்கவும்.`
      : `${cropName}: hot, dry forecast conditions make soil-moisture and crop-condition checks important.`);
  } else if (["chilli", "tomato", "onion", "vegetables"].includes(crop) && (veryWet || maxTemperature >= 38)) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? `${cropName}: அதிக மழை அல்லது கடும் வெப்பம் முன்னறிவிக்கப்பட்டுள்ளது; வயல் வடிகால் மற்றும் பயிர் நிலையைச் சரிபார்க்கவும்.`
      : `${cropName}: heavy rain or very high heat is forecast; check drainage and crop condition and follow local crop guidance.`);
  } else if (["sugarcane", "banana", "coconut"].includes(crop) && hotAndDry) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? `${cropName}: வெப்பமும் குறைந்த மழையும் உள்ளதால் மண் ஈரப்பதம் மற்றும் நீர் கிடைப்பதைச் சரிபார்க்கவும்.`
      : `${cropName}: hot, dry conditions warrant checking soil moisture and available water before field decisions.`);
  }

  if (irrigation === "Rain-fed" && totalRain < 5 && maxTemperature >= 34) {
    addRiskPoints("context", 1);
    reasons.push(isTamil
      ? "மழை சார்ந்த பாசனம் மற்றும் குறைந்த முன்னறிவிப்பு மழை காரணமாக மண் ஈரப்பதத்தைச் சரிபார்க்கவும்."
      : "Rain-fed irrigation and low forecast rainfall make soil-moisture checks especially important.");
  }

  const score = riskPoints.rain + riskPoints.heat + riskPoints.dry + riskPoints.wind + Math.min(2, riskPoints.context);
  const level = score >= 5 ? "high" : score >= 2 ? "medium" : "low";
  const summary = isTamil
    ? (level === "high" ? "முன்னறிவிப்பில் பல வானிலை காரணிகள் கவனம் தேவைப்படுகின்றன." : level === "medium" ? "முன்னறிவிப்பைக் கவனித்து வயல் நிலையைச் சரிபார்க்கவும்." : "தற்போதைய முன்னறிவிப்பில் குறைவான எச்சரிக்கை அறிகுறிகள் உள்ளன; வழக்கமான கண்காணிப்பைத் தொடரவும்.")
    : (level === "high" ? "Several forecast conditions need attention. Check field conditions and local advisories before time-sensitive work." : level === "medium" ? "Some forecast conditions deserve attention. Monitor the field and recheck the forecast." : "Fewer weather risk signals were detected in this forecast. Continue routine field monitoring.");

  const addAction = (id, titleEn, detailEn, titleTa, detailTa) => {
    actions.push({ id, title: isTamil ? titleTa : titleEn, detail: isTamil ? detailTa : detailEn });
  };

  // Keep weather checks separate from drainage advice. Drainage is only
  // recommended when the forecast suggests a meaningful heavy-rain concern.
  if (maxProbability >= 50 || maxRain >= 10) {
    addAction("check-weather", "Recheck the local forecast", "Review the forecast and official district weather advisory before weather-sensitive field work.", "உள்ளூர் முன்னறிவிப்பை மீண்டும் சரிபார்க்கவும்", "வானிலை சார்ந்த வயல் பணிகளுக்கு முன் முன்னறிவிப்பு மற்றும் மாவட்ட அதிகாரப்பூர்வ ஆலோசனையைப் பார்க்கவும்.");
  }

  const heavyRainConcern = maxRain >= 20 || maxProbability >= 80;
  if (heavyRainConcern && ["paddy", "groundnut", "cotton", "chilli", "tomato", "onion", "vegetables"].includes(crop)) {
    addAction("inspect-drainage", "Check drainage and standing water", "Heavy rain is forecast. Where relevant to your crop and field, check water outlets and low-lying spots after rain; do not enter flooded or unsafe fields.", "வடிகால் மற்றும் தேங்கிய நீரைச் சரிபார்க்கவும்", "அதிக மழை முன்னறிவிக்கப்பட்டுள்ளது. பயிர் மற்றும் வயல் நிலைக்கு ஏற்ப மழைக்குப் பிறகு நீர் வெளியேறும் பாதைகள் மற்றும் தாழ்வான இடங்களைச் சரிபார்க்கவும்; வெள்ளம் அல்லது பாதுகாப்பற்ற வயலுக்குள் செல்ல வேண்டாம்.");
  }

  if (maxTemperature >= 35 || (totalRain < 5 && totalEt0 >= 25)) {
    const irrigationDetailEn = irrigation === "Rain-fed"
      ? "Check soil moisture and local advisories; rain-fed fields may have limited water options. Do not assume irrigation is available."
      : `For ${cropName}${irrigationName ? ` using ${irrigationName}` : ""}, check soil moisture and whether water is actually available before irrigation; follow crop-stage and local recommendations, and do not irrigate from temperature alone.`;
    const irrigationDetailTa = irrigation === "Rain-fed"
      ? "மண் ஈரப்பதம் மற்றும் உள்ளூர் ஆலோசனையைச் சரிபார்க்கவும்; மழை சார்ந்த வயல்களில் நீர் வசதி குறைவாக இருக்கலாம்."
      : "பாசனத்திற்கு முன் மண் ஈரப்பதத்தைச் சரிபார்த்து, பயிர் நிலை மற்றும் உள்ளூர் ஆலோசனையைப் பின்பற்றவும்.";
    addAction("check-moisture", "Check soil moisture", irrigationDetailEn, "மண் ஈரப்பதத்தைச் சரிபார்க்கவும்", irrigationDetailTa);
  }

  if (nearHarvest && (maxProbability >= 40 || maxRain >= 5)) {
    addAction("harvest-plan", "Review harvest and drying arrangements", "If crop maturity and field conditions allow, discuss timing and dry storage arrangements with a local agricultural adviser.", "அறுவடை மற்றும் உலர்த்தும் ஏற்பாடுகளைச் சரிபார்க்கவும்", "பயிர் முதிர்ச்சி மற்றும் வயல் நிலை அனுமதித்தால், அறுவடை நேரம் மற்றும் உலர்ந்த சேமிப்பு ஏற்பாடுகளை உள்ளூர் வேளாண் ஆலோசகருடன் சரிபார்க்கவும்.");
  }

  if (maxWind >= 40) {
    addAction("wind-safety", "Postpone exposed work if conditions are unsafe", "Secure loose materials and follow local safety advice during strong winds or storms.", "பலத்த காற்றில் பாதுகாப்பை முன்னிலைப்படுத்தவும்", "பலத்த காற்று அல்லது புயல் நேரத்தில் தளர்வான பொருட்களைப் பாதுகாத்து, உள்ளூர் பாதுகாப்பு அறிவுறுத்தல்களைப் பின்பற்றவும்.");
  }

  if (growthStage === "Sowing" || growthStage === "Land preparation") {
    addAction("sowing-check", "Check field readiness before sowing", "Assess field moisture and near-term rain; confirm sowing timing with crop-specific local guidance.", "விதைப்பதற்கு முன் வயலைச் சரிபார்க்கவும்", "வயல் ஈரப்பதம் மற்றும் வரவிருக்கும் மழையை மதிப்பிட்டு, பயிர் சார்ந்த உள்ளூர் ஆலோசனையுடன் விதைப்பு நேரத்தை உறுதிப்படுத்தவும்.");
  }

  if (crop === "paddy") {
    addAction("crop-paddy-water", "Monitor paddy field water level", "Check that water depth and outlets suit the current rice growth stage; avoid assuming that more water is always better.", "நெல் வயல் நீர்மட்டத்தைக் கண்காணிக்கவும்", "நெல் வளர்ச்சி நிலைக்கு ஏற்ப நீர்மட்டம் மற்றும் நீர் வெளியேற்றத்தைச் சரிபார்க்கவும்; அதிக நீர் எப்போதும் நல்லது எனக் கருத வேண்டாம்.");
  } else if (crop === "groundnut" && (maxRain >= 10 || maxProbability >= 70)) {
    addAction("crop-groundnut-drainage", "Check groundnut field drainage", "Rain is forecast. After rain, inspect low spots for standing water and follow local groundnut guidance before changing field operations.", "நிலக்கடலை வயல் வடிகாலைச் சரிபார்க்கவும்", "மழை முன்னறிவிக்கப்பட்டுள்ளது. மழைக்குப் பிறகு தாழ்வான இடங்களில் நீர் தேங்குகிறதா எனப் பார்த்து உள்ளூர் ஆலோசனையைப் பின்பற்றவும்.");
  } else if (crop === "groundnut") {
    addAction("crop-groundnut-monitor", "Monitor groundnut and soil moisture", "Check plant condition and soil moisture. Base irrigation or field work on actual conditions and local groundnut guidance.", "நிலக்கடலை மற்றும் மண் ஈரப்பதத்தைக் கண்காணிக்கவும்", "நிலக்கடலை பயிரின் நிலை மற்றும் மண் ஈரப்பதத்தைச் சரிபார்த்து, வயல் பணிகளை உண்மையான நிலை மற்றும் உள்ளூர் ஆலோசனைக்கு ஏற்ப திட்டமிடவும்.");
  } else if (crop === "cotton") {
    addAction("crop-cotton-monitor", "Inspect cotton for weather stress", "Check soil moisture and look for visible wilting or storm damage; base irrigation and other actions on field conditions.", "பருத்தி பயிரின் வானிலை அழுத்தத்தைப் பாருங்கள்", "மண் ஈரப்பதம், வாடுதல் அல்லது புயல் சேத அறிகுறிகளைப் பார்த்து வயல் நிலைக்கு ஏற்ப நடவடிக்கை எடுக்கவும்.");
  } else if (crop === "wheat") {
    addAction("crop-wheat-monitor", "Review wheat stage and weather", "Check the crop stage against local agricultural advice, especially when warm or wet conditions are forecast.", "கோதுமை வளர்ச்சி நிலை மற்றும் வானிலையைச் சரிபார்க்கவும்", "வெப்பம் அல்லது மழை முன்னறிவிப்பின் போது பயிர் நிலையை உள்ளூர் வேளாண் ஆலோசனையுடன் ஒப்பிடவும்.");
  }

  if (!["paddy", "groundnut", "cotton", "wheat"].includes(crop)) {
    addAction(
      `crop-monitor-${crop}-${customCropName.trim().toLowerCase().replace(/\s+/g, "-")}`,
      isTamil ? `${cropName} பயிரைக் கண்காணிக்கவும்` : `Monitor ${cropName}`,
      isTamil
        ? `${cropName} பயிரின் வளர்ச்சி நிலை, மண் ஈரப்பதம் மற்றும் வானிலை பாதிப்புகளைச் சரிபார்க்கவும். பாசனம் அல்லது வயல் பணிகளை மாற்றுவதற்கு முன் உள்ளூர் வேளாண்துறை ஆலோசனையைப் பின்பற்றவும்.`
        : `Check the growth stage, soil moisture, and weather effects on ${cropName}. Follow local agriculture-department guidance before changing irrigation or field operations.`,
      `${cropName} பயிரைக் கண்காணிக்கவும்`,
      `${cropName} பயிரின் வளர்ச்சி நிலை, மண் ஈரப்பதம் மற்றும் வானிலை பாதிப்புகளைச் சரிபார்த்து உள்ளூர் வேளாண் ஆலோசனையைப் பின்பற்றவும்.`
    );
  }

  if (!actions.length) {
    addAction("routine-check", "Continue routine field monitoring", "Observe crop and soil conditions and check the forecast again when planning field operations.", "வழக்கமான வயல் கண்காணிப்பைத் தொடரவும்", "பயிர் மற்றும் மண் நிலையை கவனித்து, வயல் பணிகளைத் திட்டமிடும்போது முன்னறிவிப்பை மீண்டும் பார்க்கவும்.");
  }

  return { level, score, reasons: reasons.length ? reasons : [isTamil ? "இந்த முன்னறிவிப்பில் தேர்ந்தெடுக்கப்பட்ட எச்சரிக்கை அளவுகள் எதுவும் எட்டப்படவில்லை." : "The forecast did not cross the screening thresholds used by this app."], actions, maxProbability, maxRain, totalRain, maxTemperature, maxWind, minTemperature, effectiveSeason, daysUntilHarvest, summary };
}

function weatherIcon(code, size = 24) {
  if ([0, 1].includes(code)) return <Sun size={size} />;

  if ([2, 3, 45, 48].includes(code)) {
    return <Cloud size={size} />;
  }

  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
      95, 96, 99,
    ].includes(code)
  ) {
    return <CloudRain size={size} />;
  }

  return <CloudSun size={size} />;
}

function localizedWeatherDescription(code, language) {
  if (language !== "ta") return getWeatherDescription(code);
  const tamil = {
    0: "தெளிவான வானம்", 1: "பெரும்பாலும் தெளிவு", 2: "ஓரளவு மேகமூட்டம்", 3: "மேகமூட்டம்",
    45: "மூடுபனி", 48: "உறைபனி மூடுபனி", 51: "லேசான தூறல்", 53: "தூறல்", 55: "அடர்ந்த தூறல்",
    56: "உறையும் லேசான தூறல்", 57: "உறையும் தூறல்", 61: "லேசான மழை", 63: "மிதமான மழை", 65: "கனமழை",
    66: "உறையும் லேசான மழை", 67: "உறையும் கனமழை", 71: "லேசான பனிப்பொழிவு", 73: "மிதமான பனிப்பொழிவு",
    75: "கனமான பனிப்பொழிவு", 77: "பனித்துகள்கள்", 80: "லேசான மழைத் தூறல்", 81: "மிதமான மழைத் தூறல்",
    82: "கனமான மழைத் தூறல்", 85: "லேசான பனிப்பொழிவு", 86: "கனமான பனிப்பொழிவு",
    95: "இடியுடன் கூடிய மழை", 96: "ஆலங்கட்டி மழையுடன் இடி", 99: "கனமான ஆலங்கட்டி மழையுடன் இடி"
  };
  return tamil[code] || "வானிலை விவரம்";
}

function formatDate(date, language = "en") {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    language === "ta" ? "ta-IN" : "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
}

export default function App() {
  // Saved profile is read once, on first render (no setState-in-effect needed).
  const [saved] = useState(readSavedProfile);

  const [language, setLanguage] = useState(saved.language);
  const [page, setPage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [village, setVillage] = useState("");
  const [location, setLocation] = useState(null);
  const [crop, setCrop] = useState(saved.crop);
  const [harvestDate, setHarvestDate] = useState(saved.harvestDate);

  // Extended farmer profile
  const [stateName, setStateName] = useState(saved.stateName);
  const [customState, setCustomState] = useState(saved.customState);
  const [customCrop, setCustomCrop] = useState(saved.customCrop);
  const [customIrrigation, setCustomIrrigation] = useState(saved.customIrrigation);
  const [district, setDistrict] = useState(saved.district);
  const [sowingDate, setSowingDate] = useState(saved.sowingDate);
  const [growthStage, setGrowthStage] = useState(saved.growthStage);
  const [irrigation, setIrrigation] = useState(saved.irrigation);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");

  const [weather, setWeather] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tasksDone, setTasksDone] = useState(saved.tasksDone);
  const [dismissedAlertKeys, setDismissedAlertKeys] = useState(readDismissedAlerts);

  const t = translations[language];
  const effectiveState = stateName === "Other" ? customState.trim() : stateName;
  const effectiveCropName = crop === "other" ? customCrop.trim() : (cropLabels[crop]?.en || crop);
  const effectiveIrrigation = irrigation === "Other" ? customIrrigation.trim() : irrigation;
  const todayInputValue = new Date().toLocaleDateString("en-CA");
  const growthStageLabel = growthStage
    ? ({
        "Land preparation": { en: "Land preparation", ta: "நிலத் தயாரிப்பு" },
        Sowing: { en: "Sowing", ta: "விதைப்பு" },
        "Vegetative growth": { en: "Vegetative growth", ta: "வளர்ச்சி நிலை" },
        Flowering: { en: "Flowering", ta: "பூக்கும் நிலை" },
        "Grain or fruit development": { en: "Grain or fruit development", ta: "தானியம் அல்லது பழம் உருவாகும் நிலை" },
        Maturity: { en: "Maturity", ta: "முதிர்ச்சி" },
        Harvest: { en: "Harvest", ta: "அறுவடை" },
      }[growthStage]?.[language] ?? growthStage)
    : "";

  // Index of "today" in the forecast, in the forecast location's timezone.
  const safeTodayIndex = useMemo(() => {
    const times = weather?.daily?.time;
    if (!times?.length) return 0;
    const todayText = new Intl.DateTimeFormat("en-CA", {
      timeZone: weather.timezone || "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    return Math.max(0, times.indexOf(todayText));
  }, [weather]);

  // Keep the page language correct for screen readers and Tamil fonts.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Save farmer profile fields in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(
        "vayalguard-profile",
        JSON.stringify({
          village,
          crop,
          harvestDate,
          language,
          location,
          tasksDone,
          stateName,
          customState,
          customCrop,
          customIrrigation,
          district,
          sowingDate,
          growthStage,
          irrigation,
        })
      );
    } catch {
      // The app can still work if browser storage is unavailable.
    }
  }, [
    village,
    crop,
    harvestDate,
    language,
    location,
    tasksDone,
    stateName,
    customState,
    customCrop,
    customIrrigation,
    district,
    sowingDate,
    growthStage,
    irrigation,
  ]);

  async function saveFarmerProfile() {
    if (!village.trim() || !effectiveState || !crop || (crop === "other" && !customCrop.trim()) || (irrigation === "Other" && !customIrrigation.trim())) {
      setProfileSaveMessage(
        language === "ta"
          ? "சேமிப்பதற்கு முன் கிராமம், மாநிலம் மற்றும் பயிரை உள்ளிடவும்."
          : "Please enter your village, select a state, and choose a crop before saving."
      );
      return;
    }

    setProfileSaving(true);
    setProfileSaveMessage("");

    try {
      const response = await fetch(`${API_URL}/api/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          village: village.trim(),
          state: effectiveState,
          district: district.trim(),
          crop: effectiveCropName,
          sowingDate: sowingDate || null,
          growthStage,
          irrigation: effectiveIrrigation,
          harvestDate: harvestDate || null,
          language,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || (language === "ta" ? "விவசாயி விவரங்களைச் சேமிக்க முடியவில்லை." : "Could not save farmer profile."));
      }

      setProfileSaveMessage(language === "ta" ? "விவசாயி விவரங்கள் தரவுத்தளத்தில் சேமிக்கப்பட்டன." : "Farmer profile saved successfully to MongoDB.");
    } catch (err) {
      setProfileSaveMessage(
        err.message === "Failed to fetch"
          ? (language === "ta" ? `சேவையகத்தை அணுக முடியவில்லை. ${API_URL} இயங்குகிறதா எனச் சரிபார்க்கவும்.` : `Could not reach the backend. Make sure it is running on ${API_URL}.`)
          : err.message || (language === "ta" ? "விவசாயி விவரங்களைச் சேமிக்க முடியவில்லை." : "Could not save farmer profile.")
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function loadForecast(place = village) {
    const searchTerm = String(place ?? "").trim();

    if (!searchTerm) {
      setError(language === "ta" ? "முதலில் இந்தியாவில் உள்ள கிராமம் அல்லது நகரத்தின் பெயரை உள்ளிடவும்." : "Enter a village or town in India first.");
      setNotice("");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    // Keep the current forecast only when refreshing the same
    // previously confirmed Indian location.
    const currentLocationIsIndian =
      location?.countryCode === "IN" ||
      location?.country === "India";

    const sameConfirmedLocation =
      currentLocationIsIndian &&
      searchTerm.toLowerCase() === location?.name?.toLowerCase();

    // Clear old weather when a different location is searched.
    if (!sameConfirmedLocation) {
      setWeather(null);
      setLocation(null);
      setUpdatedAt(null);
    }

    try {
      const coordinates = await getVillageCoordinates(searchTerm);

      // Defensively reject any result not confirmed as being in India.
      if (
        coordinates.countryCode !== "IN" ||
        coordinates.country !== "India"
      ) {
        throw new Error(
          (language === "ta" ? "இந்தியாவில் உள்ள சரியான கிராமம் அல்லது நகரத்தைத் தேர்ந்தெடுக்கவும்." : "Please select a valid village or town within India.")
        );
      }

      const result = await getWeather(
        coordinates.latitude,
        coordinates.longitude
      );

      // Update the dashboard only after the forecast request succeeds.
      setLocation(coordinates);
      setVillage(coordinates.name);
      setWeather(result);
      setUpdatedAt(new Date());
      setNotice(t.updated);
    } catch (err) {
      setError(
        err.message || (language === "ta" ? "வானிலை முன்னறிவிப்பைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்." : "Unable to load the forecast. Please try again.")
      );

      // Do not keep an old location visible after a failed search.
      if (!sameConfirmedLocation) {
        setWeather(null);
        setLocation(null);
        setUpdatedAt(null);
      }
    } finally {
      setLoading(false);
    }
  }

  const risk = useMemo(
    () => getRisk(weather, harvestDate, crop, growthStage, irrigation, language, customCrop, customIrrigation),
    [weather, harvestDate, crop, growthStage, irrigation, language, customCrop, customIrrigation]
  );

  // Crop-aware guidance is intentionally framed as practical prompts,
  // not as official or crop-loss predictions.
  const cropAdvice = useMemo(() => {
    if (!weather?.daily?.time?.length) return [];

    const dailyData = weather.daily;
    const probabilities = dailyData.precipitation_probability_max ?? [];
    const rainAmounts = dailyData.precipitation_sum ?? [];
    const temperatures = dailyData.temperature_2m_max ?? [];
    const maxRainProbability = Math.max(0, ...probabilities.map((v) => v ?? 0));
    const maxRainAmount = Math.max(0, ...rainAmounts.map((v) => v ?? 0));
    const maxTemperature = Math.max(0, ...temperatures.map((v) => v ?? 0));
    const todayForHarvest = new Date();
    todayForHarvest.setHours(0, 0, 0, 0);
    const harvestForAdvice = harvestDate ? new Date(`${harvestDate}T00:00:00`) : null;
    const nearHarvest = Boolean(harvestForAdvice && !Number.isNaN(harvestForAdvice.getTime()) && (harvestForAdvice - todayForHarvest) >= 0 && (harvestForAdvice - todayForHarvest) <= 7 * 86400000);
    const advice = [];

    if (maxRainProbability >= 50 || maxRainAmount >= 5) {
      const heavyRainExpected = maxRainProbability >= 80 || maxRainAmount >= 20;
      advice.push({
        title: language === "ta" ? "மழை முன்னறிவிப்பு" : "Rain in the forecast",
        detail: language === "ta"
          ? (heavyRainExpected
              ? "அதிக மழை வாய்ப்பு இருப்பதால், உங்கள் பயிருக்கும் வயலுக்கும் பொருத்தமான இடங்களில் மட்டும் நீர் வெளியேறும் பாதைகளைச் சரிபார்க்கவும். வயல் நிலையைப் பார்த்தே பணிகளைத் திட்டமிடவும்."
              : "மழை முன்னறிவிப்பைப் பார்த்து வயல் பணிகளைத் திட்டமிடவும். மழை வாய்ப்பு இருப்பதற்காக மட்டும் பாசனத்தை மாற்ற வேண்டாம்; மண் ஈரப்பதம் மற்றும் வயல் நிலையைச் சரிபார்க்கவும்.")
          : (heavyRainExpected
              ? "Heavy rain is possible. Check water outlets only where relevant to your crop and field, and avoid entering flooded or unsafe areas."
              : "Use the rain forecast when planning field work. Do not change irrigation just because rain is possible; check actual soil moisture and field conditions first."),
      });
    }

    if (nearHarvest || growthStage === "Maturity" || growthStage === "Harvest") {
      advice.push({
        title: language === "ta" ? "அறுவடைத் திட்டம்" : "Harvest-stage planning",
        detail:
          language === "ta"
            ? "மழை வாய்ப்பு இருந்தால், அறுவடை நேரம் மற்றும் அறுவடை செய்த தானியத்தை உலர்ந்த இடத்தில் பாதுகாப்பது குறித்து உள்ளூர் வேளாண் ஆலோசனையைச் சரிபார்க்கவும்."
            : "If rain is forecast, review harvest timing and how harvested grain can be kept dry. Confirm timing decisions with local agricultural guidance.",
      });
    } else if (growthStage === "Sowing" || growthStage === "Land preparation") {
      advice.push({
        title: language === "ta" ? "விதைப்பு / நிலத் தயாரிப்பு" : "Sowing and land preparation",
        detail:
          language === "ta"
            ? "விதைப்பதற்கு முன் வயல் ஈரப்பதம் மற்றும் கனமழை வாய்ப்பைச் சரிபார்க்கவும். சரியான நேரம் பயிர் மற்றும் உள்ளூர் நிலைமைகளைப் பொறுத்தது."
            : "Before sowing, check field moisture and the chance of heavy rain. Suitable timing depends on the crop and local field conditions.",
      });
    } else if (growthStage === "Flowering") {
      advice.push({
        title: language === "ta" ? "பூக்கும் நிலை" : "Flowering stage",
        detail:
          language === "ta"
            ? "வானிலை மாற்றங்களை கவனிக்கவும்; நீர்ப்பாசனம் அல்லது வயல் பணிகளை மாற்றுவதற்கு முன் உள்ளூர் பயிர் ஆலோசனையைப் பார்க்கவும்."
            : "Watch for weather changes and check local crop guidance before changing irrigation or field operations.",
      });
    }

    if (maxTemperature >= 35) {
      advice.push({
        title: language === "ta" ? "அதிக வெப்பநிலை" : "High temperature",
        detail:
          language === "ta"
            ? "வயல் மற்றும் மண் ஈரப்பதத்தை கண்காணிக்கவும். பாசன முடிவுகளை பயிர் நிலை, மண் மற்றும் உள்ளூர் ஆலோசனை அடிப்படையில் எடுக்கவும்."
            : "Monitor crop and soil moisture. Base irrigation decisions on crop stage, soil conditions, and local advice rather than temperature alone.",
      });
    }

    if (!advice.length) {
      advice.push({
        title: language === "ta" ? "வழக்கமான கண்காணிப்பு" : "Routine crop monitoring",
        detail:
          language === "ta"
            ? "முன்னறிவிப்பை தொடர்ந்து கவனித்து, வயல் நிலையைப் பார்த்து நடவடிக்கை எடுக்கவும். குறிப்பிட்ட பரிந்துரைகளுக்கு மாவட்ட வேளாண் ஆலோசனையைப் பார்க்கவும்."
            : "Keep checking the forecast and observe field conditions. Consult district agricultural advisories for crop-specific recommendations.",
      });
    }

    return advice;
  }, [weather, growthStage, language, harvestDate]);

  const alertSignature = useMemo(() => {
    if (!weather?.daily?.time?.length) return "";
    const d = weather.daily;
    return [
      location?.name || village,
      crop,
      growthStage,
      d.time[0],
      d.precipitation_probability_max?.[0] ?? "na",
      d.precipitation_sum?.[0] ?? "na",
      d.temperature_2m_max?.[0] ?? "na",
      harvestDate,
    ].join("|");
  }, [weather, location, village, crop, growthStage, harvestDate]);

  // Alerts are derived data, so they are computed with useMemo
  // instead of effect + state.
  const smartAlerts = useMemo(() => {
    const d = weather?.daily;
    if (!d?.time?.length || !alertSignature) return [];

    const todayRain = d.precipitation_probability_max?.[safeTodayIndex] ?? 0;
    const todayAmount = d.precipitation_sum?.[safeTodayIndex] ?? 0;
    const todayTemp = d.temperature_2m_max?.[safeTodayIndex] ?? 0;
    const harvestNear = Boolean(harvestDate) && (() => {
      const days = Math.ceil((new Date(`${harvestDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000);
      return days >= 0 && days <= 7;
    })();

    const generated = [];
    if (todayRain >= 60 || todayAmount >= 10) {
      generated.push({
        key: `${alertSignature}|rain`,
        title: language === "ta" ? "மழை குறித்து கவனம்" : "Rain may affect field work",
        reason: language === "ta"
          ? `இன்றைய முன்னறிவிப்பில் மழை வாய்ப்பு ${Math.round(todayRain)}%${todayAmount ? `; மழை அளவு ${todayAmount} மி.மீ.` : ""}.`
          : `Today's forecast shows a ${Math.round(todayRain)}% rain chance${todayAmount ? ` and ${todayAmount} mm of rain` : ""}.`,
        nextStep: language === "ta"
          ? (todayRain >= 80 || todayAmount >= 20
              ? "அதிக மழை வாய்ப்பு இருப்பதால், தேவையான இடங்களில் நீர் வெளியேறும் பாதைகளைச் சரிபார்த்து பாதுகாப்பாகப் பணிகளைத் திட்டமிடவும்."
              : "மழை முன்னறிவிப்பைப் பார்த்து வயல் பணிகளைத் திட்டமிடவும்; வயல் நிலை மற்றும் பாதுகாப்பைச் சரிபார்க்கவும்.")
          : (todayRain >= 80 || todayAmount >= 20
              ? "Heavy rain is possible. Check water outlets where relevant and plan field work safely."
              : "Use the rain forecast to plan field work and check field conditions and safety."),
      });
    }
    if (harvestNear && (todayRain >= 40 || todayAmount >= 5)) {
      generated.push({
        key: `${alertSignature}|harvest`,
        title: language === "ta" ? "அறுவடை தேதி நெருங்குகிறது" : "Rain may affect planned harvest",
        reason: language === "ta"
          ? "தேர்ந்தெடுத்த அறுவடை தேதி அடுத்த 7 நாட்களுக்குள் உள்ளது; மழையும் முன்னறிவிக்கப்பட்டுள்ளது."
          : "Your selected harvest date is within 7 days and rain is forecast.",
        nextStep: language === "ta"
          ? "அறுவடை மற்றும் தானிய உலர்த்தும் திட்டத்தை உள்ளூர் வேளாண் ஆலோசனையுடன் சரிபார்க்கவும்."
          : "Review harvest and grain-drying plans with local agricultural guidance.",
      });
    }
    if (todayTemp >= 35) {
      generated.push({
        key: `${alertSignature}|heat`,
        title: language === "ta" ? "அதிக வெப்பநிலை" : "High temperature expected",
        reason: language === "ta"
          ? `இன்றைய அதிகபட்ச வெப்பநிலை ${todayTemp}°C என முன்னறிவிக்கப்பட்டுள்ளது.`
          : `Today's forecast high is ${todayTemp}°C.`,
        nextStep: language === "ta"
          ? "மண் ஈரப்பதத்தை கண்காணித்து, உள்ளூர் வழிகாட்டுதலின்படி பாசனத்தைத் திட்டமிடவும்."
          : "Monitor soil moisture and plan irrigation using local guidance.",
      });
    }

    return generated.filter((alert) => !dismissedAlertKeys.includes(alert.key));
  }, [weather, alertSignature, harvestDate, language, dismissedAlertKeys, safeTodayIndex]);

  function dismissSmartAlert(key) {
    setDismissedAlertKeys((current) => {
      const next = [...new Set([...current, key])].slice(-100);
      try {
        localStorage.setItem("vayalguard-dismissed-alerts", JSON.stringify(next));
      } catch {
        // Alerts still work for the current session if storage is unavailable.
      }
      return next;
    });
  }

  const tasks = risk.actions;

  const completedCount = tasks.filter(
    (task) => tasksDone[task.id]
  ).length;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const daily = weather?.daily;

  const rainProbability =
    daily?.precipitation_probability_max?.[safeTodayIndex];

  const maxTemp = daily?.temperature_2m_max?.[safeTodayIndex];
  const minTemp = daily?.temperature_2m_min?.[safeTodayIndex];
  const rainTotal = daily?.precipitation_sum?.[safeTodayIndex];
  const weatherCode = daily?.weather_code?.[safeTodayIndex] ?? 2;

  const riskTitle =
    risk.level === "high"
      ? t.high
      : risk.level === "medium"
        ? t.medium
        : risk.level === "low"
          ? t.low
          : t.noForecast;

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenu(false);
    if (nextPage === "forecast" || nextPage === "actions") {
      window.setTimeout(() => {
        const targetId = nextPage === "forecast" ? "weather-forecast" : "farm-action-plan";
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sprout size={27} />
          </div>

          <div>
            <h1>VayalGuard</h1>
            <span>{language === "ta" ? "காலநிலைக்கு ஏற்ற வேளாண்மை" : "Climate-smart farming"}</span>
          </div>

          <button
            className="icon-button mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">{language === "ta" ? "பணிகள்" : "WORKSPACE"}</div>

        <nav className="navigation">
          <button
            className={
              page === "dashboard" ? "nav-item active" : "nav-item"
            }
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard size={19} />
            {t.dashboard}
          </button>

          <button
            className={
              page === "forecast" ? "nav-item active" : "nav-item"
            }
            onClick={() => navigate("forecast")}
          >
            <CloudRain size={19} />
            {t.forecast}
          </button>

          <button
            className={
              page === "actions" ? "nav-item active" : "nav-item"
            }
            onClick={() => navigate("actions")}
          >
            <ClipboardCheck size={19} />
            {t.actions}
          </button>
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-tip">
          <div className="tip-icon">
            <Leaf size={20} />
          </div>
          <h3>{language === "ta" ? "சிறிய நடவடிக்கைகள்; வலுவான வயல்கள்" : "Small steps. Stronger farms."}</h3>
          <p>{language === "ta" ? "உள்ளூர் வானிலைத் தகவல்களைப் பயன்படுத்தி அடுத்த நடவடிக்கையைத் திட்டமிடுங்கள்." : "Use local weather information to plan your next move."}</p>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          {language === "ta" ? "வானிலை அடிப்படையிலான வயல் உதவி" : "Weather-powered farm support"}
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              VayalGuard <span>/</span> {t[page]}
            </div>
          </div>

          <div className="topbar-actions">
            <span className="live-label">
              <span className="status-dot" />
              {language === "ta" ? "வானிலை இணைப்பு" : "Weather connection"}
            </span>

            <button
              className="language-button"
              onClick={() =>
                setLanguage(language === "en" ? "ta" : "en")
              }
            >
              <Languages size={17} />
              {t.language}
            </button>
          </div>
        </header>

        <div className="page-container">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <Sprout size={15} />
                {language === "ta" ? "உங்கள் வயல் துணை" : "YOUR FARM COMPANION"}
              </div>

              <h2>
                {page === "dashboard"
                  ? t.welcome
                  : page === "forecast"
                    ? t.forecastTitle
                    : t.actions}
              </h2>

              <p>{t.subtitle}</p>
            </div>

            <button
              className="button button-secondary"
              onClick={() => loadForecast()}
              disabled={loading || !village.trim()}
            >
              {loading ? (
                <LoaderCircle size={17} className="spin" />
              ) : (
                <RefreshCw size={17} />
              )}
              {t.refresh}
            </button>
          </section>

          <section className="farm-profile card">
            <div className="section-title">
              <div className="section-icon">
                <Sprout size={19} />
              </div>

              <div>
                <h3>{language === "ta" ? "வயல் விவரங்கள்" : "Farm profile"}</h3>
                <p>{language === "ta" ? "உங்கள் வயலுக்கேற்ற வானிலை வழிகாட்டலைப் பெற விவரங்களை நிரப்பவும்." : "Personalize your weather-based guidance"}</p>
              </div>
            </div>

            <div className="profile-fields">
              <label className="field">
                <span>
                  <MapPin size={15} />
                  {t.location}
                </span>

                <div className="input-with-button">
                  <input
                    value={village}
                    onChange={(event) => setVillage(event.target.value)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && loadForecast()
                    }
                    placeholder={t.villagePlaceholder}
                    aria-label={t.location}
                  />

                  <button
                    className="button button-primary search-button"
                    onClick={() => loadForecast()}
                    disabled={loading}
                  >
                    {loading ? (
                      <LoaderCircle size={16} className="spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    <span>{t.search}</span>
                  </button>
                </div>
              </label>

              <label className="field">
                <span>
                  <Sprout size={15} />
                  {t.crop}
                </span>
                <select
                  value={crop}
                  onChange={(event) => {
                    setCrop(event.target.value);
                    if (event.target.value === "other") setCustomCrop("");
                  }}
                >
                  {Object.entries(cropLabels).filter(([value]) => value !== "other").map(([value, labels]) => (
                    <option value={value} key={value}>{labels[language]}</option>
                  ))}
                  <option value="other">{t.otherCrop}</option>
                </select>
                {crop === "other" && (
                  <input
                    value={customCrop}
                    onChange={(event) => setCustomCrop(event.target.value)}
                    placeholder={t.otherCropPlaceholder}
                    aria-label={t.otherCropPlaceholder}
                  />
                )}
              </label>

              <div className="field">
                <span><Sun size={15} /> {t.season}</span>
                <div className="field-value" aria-live="polite">
                  {getForecastSeason(weather) === "unknown"
                    ? (language === "ta" ? "முன்னறிவிப்பு கிடைத்ததும் தானாகத் தீர்மானிக்கப்படும்" : "Detected automatically from the forecast")
                    : `${language === "ta" ? "முன்னறிவிப்பின் அடிப்படையில்: " : "Based on forecast: "}${getForecastSeason(weather) === "summer" ? t.summer : t.winter}`}
                </div>
              </div>

              <label className="field">
                <span>
                  <CalendarDays size={15} />
                  {t.harvest}
                </span>

                <input
                  type="date"
                  value={harvestDate}
                  min={todayInputValue}
                  onChange={(event) =>
                    setHarvestDate(event.target.value)
                  }
                />
              </label>
            </div>

            {/* Additional farmer profile fields */}
            <div className="profile-fields">
              <label className="field">
                <span>{language === "ta" ? "மாநிலம்" : "State"}</span>
                <select
                  value={stateName === "Other" || !KNOWN_STATES.includes(stateName) ? "Other" : stateName}
                  onChange={(event) => {
                    setStateName(event.target.value);
                    if (event.target.value === "Other") setCustomState("");
                  }}
                >
                  <option value="Tamil Nadu">{language === "ta" ? "தமிழ்நாடு" : "Tamil Nadu"}</option>
                  <option value="Kerala">{language === "ta" ? "கேரளம்" : "Kerala"}</option>
                  <option value="Karnataka">{language === "ta" ? "கர்நாடகம்" : "Karnataka"}</option>
                  <option value="Andhra Pradesh">{language === "ta" ? "ஆந்திரப் பிரதேசம்" : "Andhra Pradesh"}</option>
                  <option value="Telangana">{language === "ta" ? "தெலங்கானா" : "Telangana"}</option>
                  <option value="Other">{language === "ta" ? "மற்றவை" : "Other"}</option>
                </select>
                {stateName === "Other" && (
                  <input
                    value={customState}
                    onChange={(event) => setCustomState(event.target.value)}
                    placeholder={t.otherStatePlaceholder}
                    aria-label={t.otherStatePlaceholder}
                  />
                )}
              </label>

              <label className="field">
                <span>{language === "ta" ? "மாவட்டம்" : "District"}</span>
                <input
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  placeholder={language === "ta" ? "மாவட்டத்தின் பெயரை உள்ளிடவும்" : "Enter your district"}
                />
              </label>

              <label className="field">
                <span>{language === "ta" ? "விதைத்த தேதி" : "Sowing date"}</span>
                <input
                  type="date"
                  value={sowingDate}
                  max={todayInputValue}
                  onChange={(event) => setSowingDate(event.target.value)}
                />
              </label>

              <label className="field">
                <span>{language === "ta" ? "பயிர் வளர்ச்சி நிலை" : "Crop growth stage"}</span>
                <select
                  value={growthStage}
                  onChange={(event) => setGrowthStage(event.target.value)}
                >
                  <option value="">{language === "ta" ? "வளர்ச்சி நிலையைத் தேர்ந்தெடுக்கவும்" : "Select stage"}</option>
                  <option value="Land preparation">{language === "ta" ? "நிலத் தயாரிப்பு" : "Land preparation"}</option>
                  <option value="Sowing">{language === "ta" ? "விதைப்பு" : "Sowing"}</option>
                  <option value="Vegetative growth">{language === "ta" ? "வளர்ச்சி நிலை" : "Vegetative growth"}</option>
                  <option value="Flowering">{language === "ta" ? "பூக்கும் நிலை" : "Flowering"}</option>
                  <option value="Grain or fruit development">
                    {language === "ta" ? "தானியம் அல்லது பழம் உருவாகும் நிலை" : "Grain or fruit development"}
                  </option>
                  <option value="Maturity">{language === "ta" ? "முதிர்ச்சி" : "Maturity"}</option>
                  <option value="Harvest">{language === "ta" ? "அறுவடை" : "Harvest"}</option>
                </select>
              </label>

              <label className="field">
                <span>{language === "ta" ? "பாசன முறை" : "Irrigation method"}</span>
                <select
                  value={irrigation}
                  onChange={(event) => {
                    setIrrigation(event.target.value);
                    if (event.target.value === "Other") setCustomIrrigation("");
                  }}
                >
                  <option value="">{language === "ta" ? "பாசன முறையைத் தேர்ந்தெடுக்கவும்" : "Select method"}</option>
                  <option value="Rain-fed">{language === "ta" ? "மழை சார்ந்தது" : "Rain-fed"}</option>
                  <option value="Canal">{language === "ta" ? "கால்வாய் பாசனம்" : "Canal irrigation"}</option>
                  <option value="Borewell">{language === "ta" ? "ஆழ்துளைக் கிணறு" : "Borewell"}</option>
                  <option value="Drip">{language === "ta" ? "சொட்டுநீர் பாசனம்" : "Drip irrigation"}</option>
                  <option value="Sprinkler">{language === "ta" ? "தெளிப்பு பாசனம்" : "Sprinkler"}</option>
                  <option value="Other">{language === "ta" ? "மற்றவை" : "Other"}</option>
                </select>
                {irrigation === "Other" && (
                  <input
                    value={customIrrigation}
                    onChange={(event) => setCustomIrrigation(event.target.value)}
                    placeholder={t.otherIrrigationPlaceholder}
                    aria-label={t.otherIrrigationPlaceholder}
                  />
                )}
              </label>
            </div>

            {location && (
              <div className="location-confirmation">
                <MapPin size={15} />
                <span>
                  <strong>{t.selectVillage}:</strong>{" "}
                  {location.name}
                  {location.admin2 ? `, ${location.admin2}` : ""}
                  {location.admin1 ? `, ${location.admin1}` : ""}
                  {location.country ? `, ${location.country}` : ""}
                </span>
              </div>
            )}

            <p className="field-hint">{t.locationHelp}</p>

            <div className="profile-save-row">
              <button
                type="button"
                className="button button-primary"
                onClick={saveFarmerProfile}
                disabled={profileSaving || !village.trim()}
              >
                {profileSaving ? (language === "ta" ? "சுயவிவரம் சேமிக்கப்படுகிறது..." : "Saving profile...") : (language === "ta" ? "விவசாயி சுயவிவரத்தைச் சேமிக்கவும்" : "Save farmer profile")}
              </button>

              {profileSaveMessage && (
                <p className="field-hint" role="status" aria-live="polite">
                  {profileSaveMessage}
                </p>
              )}
            </div>
          </section>

          {/* Official agricultural advisories */}
          <section className="card forecast-card">
            <div className="card-heading">
              <div>
                <span className="muted-label">
                  {language === "ta" ? "அதிகாரப்பூர்வ வேளாண் வழிகாட்டல்" : "OFFICIAL FARMING GUIDANCE"}
                </span>
                <h3>{language === "ta" ? "அரசு வேளாண் ஆலோசனைகள்" : "Government Agricultural Advisories"}</h3>
                <p className="card-subtitle">
                  {language === "ta" ? "உங்கள் மாநிலம் மற்றும் மாவட்டத்திற்கான வானிலை சார்ந்த வேளாண் ஆலோசனைகளைப் பெறுங்கள்." : "Find weather-based farming advice for your state and district."}
                </p>
              </div>

              <div className="round-icon">
                <ClipboardCheck size={19} />
              </div>
            </div>

            <p className="field-hint">
              {language === "ta" ? "ஆலோசனைக்கான இடம்: " : "Advisories for: "}
              <strong>{[district.trim(), effectiveState].filter(Boolean).join(", ") || "—"}</strong>
              {" — "}
              {language === "ta" ? "அறிவிப்பு உங்கள் மாவட்டத்திற்கானதா என்பதை உறுதிப்படுத்தி, பரிந்துரையைப் பின்பற்றுவதற்கு முன் வெளியிடப்பட்ட தேதியைச் சரிபார்க்கவும்." : "confirm that the bulletin matches your district and check its issue date before following any recommendation."}
            </p>

            <div className="advisory-links">
              <a
                className="button button-primary"
                href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_district_current_en.php"
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === "ta" ? "அதிகாரப்பூர்வ வேளாண் ஆலோசனைகளைப் பார்க்கவும்" : "View official English advisories"} <ArrowUpRight size={16} />
              </a>

              <a
                className="button button-secondary"
                href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_district_current_lo.php"
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === "ta" ? "தமிழ் உள்ளிட்ட உள்ளூர் மொழி ஆலோசனைகளைப் பார்க்கவும்" : "View local-language advisories"} <ArrowUpRight size={16} />
              </a>
            </div>

            <p className="small-disclaimer">
              {language === "ta" ? "மூலம்: இந்திய வானிலை ஆய்வு மையம் (IMD). VayalGuard அதிகாரப்பூர்வ ஆலோசனை இணையதளத்தைத் திறக்கும்; அறிவிப்புகளின் உள்ளடக்கத்தைத் தனியாகப் பெறவோ சரிபார்க்கவோ செய்யாது." : "Source: India Meteorological Department (IMD). VayalGuard opens the official advisory website; it does not independently retrieve or verify bulletin contents."}
            </p>
          </section>

          {error && (
            <div className="error-banner" role="alert">
              <AlertTriangle size={19} />

              <div>
                <strong>{t.errorTitle}</strong>
                <p>{error}</p>
              </div>

              <button
                className="button button-secondary"
                onClick={() => loadForecast()}
              >
                {t.retry}
              </button>
            </div>
          )}

          {notice && !error && (
            <div className="success-message">
              <CheckCircle2 size={16} />
              {notice}
            </div>
          )}

          {!weather && !loading && (
            <div className="empty-state card">
              <div className="empty-illustration">
                <CloudSun size={45} />
              </div>

              <h3>{t.selectLocation}</h3>
              <p>{t.empty}</p>

              <button
                className="button button-primary"
                onClick={() => loadForecast()}
                disabled={!village.trim()}
              >
                <Search size={17} />
                {t.search}
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-panel card">
              <LoaderCircle className="spin" size={30} />
              <p>{t.loading}</p>
            </div>
          )}

          {weather && !loading && (
            <>
              {(page === "dashboard" || page === "forecast") && (
                <section className="card smart-alerts-card" aria-live="polite">
                  <div className="card-heading">
                    <div>
                      <span className="muted-label">
                        {language === "ta" ? "முக்கிய வானிலை எச்சரிக்கைகள்" : "MEANINGFUL WEATHER ALERTS"}
                      </span>
                      <h3>{language === "ta" ? "உங்கள் வயலுக்கான முக்கிய எச்சரிக்கைகள்" : "Alerts that matter to your farm"}</h3>
                      <p className="card-subtitle">
                        {language === "ta" ? "முக்கியமான மாற்றங்கள் மட்டும்; மீண்டும் மீண்டும் வரும் எச்சரிக்கைகளை மறைக்கலாம்." : "Only weather conditions that may affect your crop or planned activity. Dismiss an alert to avoid seeing it again for this forecast."}
                      </p>
                    </div>
                    <div className="round-icon"><ShieldAlert size={19} /></div>
                  </div>

                  {smartAlerts.length ? (
                    <div className="smart-alert-list">
                      {smartAlerts.map((alert) => (
                        <article className="smart-alert" key={alert.key}>
                          <div className="smart-alert-symbol"><AlertTriangle size={19} /></div>
                          <div className="smart-alert-content">
                            <strong>{alert.title}</strong>
                            <p>{alert.reason}</p>
                            <small><b>{language === "ta" ? "அடுத்த படி:" : "Suggested next step:"}</b> {alert.nextStep}</small>
                          </div>
                          <button className="button button-secondary smart-alert-dismiss" onClick={() => dismissSmartAlert(alert.key)}>
                            {language === "ta" ? "மறை" : "Dismiss"}
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="smart-alert-empty">
                      <CheckCircle2 size={18} />
                      {language === "ta" ? "தற்போது முக்கிய எச்சரிக்கை இல்லை. முன்னறிவிப்பைத் தொடர்ந்து கவனிக்கவும்." : "No high-priority alert for the current forecast. Keep monitoring local conditions."}
                    </div>
                  )}
                  <p className="small-disclaimer">
                    {language === "ta" ? "முன்னறிவிப்பு:" : "Forecast updated:"} {updatedAt ? updatedAt.toLocaleString(language === "ta" ? "ta-IN" : "en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}. {language === "ta" ? "இவை பயன்பாட்டு எச்சரிக்கைகள்; அதிகாரப்பூர்வ வேளாண் ஆலோசனை அல்ல." : "These are app-generated prompts, not official agricultural advisories."}
                  </p>
                </section>
              )}

              {(page === "dashboard" || page === "forecast") && (
                <section className="card crop-advice-card">
                  <div className="card-heading">
                    <div>
                      <span className="muted-label">{language === "ta" ? "பயிருக்கு ஏற்ற வானிலை வழிகாட்டல்" : "CROP-AWARE WEATHER ADVICE"}</span>
                      <h3>{language === "ta" ? `${(crop === "other" && customCrop.trim()) ? customCrop.trim() : (cropLabels[crop]?.ta || crop)} — வானிலை என்ன சொல்கிறது?` : `${(crop === "other" && customCrop.trim()) ? customCrop.trim() : (cropLabels[crop]?.en || crop)} — what the forecast means`}</h3>
                      <p className="card-subtitle">
                        {language === "ta" ? "உங்கள் பயிர் மற்றும் வளர்ச்சி நிலையைப் பயன்படுத்திய நடைமுறை நினைவூட்டல்கள்." : `Guidance tailored to your selected crop${growthStageLabel ? ` and ${growthStageLabel.toLowerCase()} stage` : ""}.`}
                      </p>
                    </div>
                    <div className="round-icon"><Sprout size={19} /></div>
                  </div>
                  <div className="crop-advice-list">
                    {cropAdvice.map((item, index) => (
                      <article className="crop-advice-item" key={`${item.title}-${index}`}>
                        <span className="crop-advice-number">{String(index + 1).padStart(2, "0")}</span>
                        <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                      </article>
                    ))}
                  </div>
                  <p className="small-disclaimer">
                    {language === "ta" ? "முக்கியம்: இவை முன்னறிவிப்பு அடிப்படையிலான பொதுவான வழிகாட்டல்கள். குறிப்பிட்ட முடிவுகளுக்கு மாவட்ட வேளாண் ஆலோசனை மற்றும் IMD அறிவிப்புகளைச் சரிபார்க்கவும்." : "Important: These are general prompts based on forecast data, not verified crop-specific prescriptions. Confirm decisions with district agricultural advisories and IMD bulletins."}
                  </p>
                </section>
              )}

              {(page === "dashboard" || page === "forecast") && (
                <>
                  <section className="stats-grid">
                    <article className="weather-hero card">
                      <div className="weather-hero-top">
                        <div>
                          <span className="muted-label">{t.today}</span>
                          <h3>{location?.name}</h3>
                          <p>
                            {formatDate(
                              daily.time[safeTodayIndex],
                              language
                            )}
                          </p>
                        </div>

                        <div className="hero-weather-icon">
                          {weatherIcon(weatherCode, 42)}
                        </div>
                      </div>

                      <div className="temperature">
                        {maxTemp ?? "—"}
                        <span>°C</span>
                      </div>

                      <div className="weather-description">
                        {localizedWeatherDescription(weatherCode, language)}
                      </div>

                      <div className="temperature-range">
                        <Thermometer size={16} />
                        {minTemp ?? "—"}°C – {maxTemp ?? "—"}°C
                      </div>

                      <div className="hero-bottom">
                        <span>
                          <MapPin size={14} />
                          {location?.admin1 || location?.country}
                        </span>

                        <span>
                          <CloudRain size={14} />
                          {rainProbability ?? "—"}% {language === "ta" ? "மழை" : "rain"}
                        </span>
                      </div>
                    </article>

                    <article className="stat-card card">
                      <div className="stat-top">
                        <span>{t.rain}</span>
                        <div className="stat-icon blue">
                          <Droplets size={20} />
                        </div>
                      </div>

                      <div className="stat-value">
                        {rainProbability ?? "—"}
                        <small>%</small>
                      </div>

                      <p>{language === "ta" ? "இன்றைய மழை வாய்ப்பு" : "Today's forecast probability"}</p>

                      <div className="stat-progress">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, rainProbability ?? 0)
                            )}%`,
                          }}
                        />
                      </div>
                    </article>

                    <article className="stat-card card">
                      <div className="stat-top">
                        <span>{t.temperature}</span>
                        <div className="stat-icon orange">
                          <Thermometer size={20} />
                        </div>
                      </div>

                      <div className="stat-value">
                        {maxTemp ?? "—"}
                        <small>°C</small>
                      </div>

                      <p>{language === "ta" ? "எதிர்பார்க்கப்படும் பகல் நேர அதிகபட்சம்" : "Expected daytime maximum"}</p>

                      <div className="min-max">
                        {language === "ta" ? "குறைந்தபட்சம்" : "Minimum"} <strong>{minTemp ?? "—"}°C</strong>
                      </div>
                    </article>
                  </section>

                  <section className="content-grid">
                    <article className="card risk-card">
                      <div className="card-heading">
                        <div>
                          <span className="muted-label">
                            {language === "ta" ? "வயல்கார்டு வானிலை மதிப்பீடு" : "VAYALGUARD INTELLIGENCE"}
                          </span>
                          <h3>{t.risk}</h3>
                        </div>

                        <div className={`risk-badge ${risk.level}`}>
                          <ShieldAlert size={15} />
                          {riskTitle}
                        </div>
                      </div>

                      <div className={`risk-summary ${risk.level}`}>
                        <div className="risk-summary-icon">
                          {risk.level === "high" ? (
                            <AlertTriangle size={23} />
                          ) : risk.level === "low" ? (
                            <CheckCircle2 size={23} />
                          ) : (
                            <ShieldAlert size={23} />
                          )}
                        </div>

                        <div>
                          <strong>
                            {risk.summary}
                          </strong>
                          <p>{risk.reasons[0] || t.noRain}</p>
                        </div>
                      </div>

                      <div className="risk-details">
                        <h4>{t.why}</h4>
                        <ul>
                          {risk.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>

                        <h4>{t.action}</h4>
                        <ul>
                          {risk.actions.slice(0, 2).map((action) => (
                            <li key={action.id}>{action.title}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="small-disclaimer">{t.riskHelp}</p>
                    </article>

                    <article className="card checklist-card">
                      <div className="card-heading">
                        <div>
                          <span className="muted-label">
                            {language === "ta" ? "உங்கள் வயல் திட்டம்" : "YOUR FIELD PLAN"}
                          </span>
                          <h3>{t.plan}</h3>
                        </div>

                        <div className="round-icon">
                          <ClipboardCheck size={19} />
                        </div>
                      </div>

                      <div className="checklist-progress-label">
                        <span>
                          {completedCount} / {tasks.length} {t.completed}
                        </span>
                        <strong>{progress}%</strong>
                      </div>

                      <div className="checklist-progress">
                        <span style={{ width: `${progress}%` }} />
                      </div>

                      <div className="task-list">
                        {tasks.slice(0, 3).map((task) => (
                          <button
                            className={`task-row ${
                              tasksDone[task.id] ? "task-done" : ""
                            }`}
                            key={task.id}
                            onClick={() =>
                              setTasksDone((old) => ({
                                ...old,
                                [task.id]: !old[task.id],
                              }))
                            }
                          >
                            {tasksDone[task.id] ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <Circle size={20} />
                            )}

                            <span>
                              <strong>{task.title}</strong>
                              <small>{task.detail}</small>
                            </span>
                          </button>
                        ))}
                      </div>

                      <button
                        className="text-button"
                        onClick={() => navigate("actions")}
                      >
                        {language === "ta" ? "முழு வயல் செயல் திட்டத்தைப் பார்க்கவும்" : "View full action plan"} <ArrowUpRight size={16} />
                      </button>
                    </article>
                  </section>
                </>
              )}

              {(page === "dashboard" || page === "forecast") && (
                <section id="weather-forecast" className="card forecast-card">
                  <div className="card-heading">
                    <div>
                      <span className="muted-label">{language === "ta" ? "முன்கூட்டித் திட்டமிடுங்கள்" : "PLAN AHEAD"}</span>
                      <h3>{t.forecastTitle}</h3>
                      <p className="card-subtitle">
                        {language === "ta" ? "தினசரி வெப்பநிலை மற்றும் மழை முன்னறிவிப்பு" : "Daily temperature and precipitation outlook"}
                      </p>
                    </div>

                    <div className="forecast-location">
                      <MapPin size={15} />
                      {location?.name}
                    </div>
                  </div>

                  <div className="forecast-grid">
                    {daily.time.map((date, index) => (
                      <article
                        className={`forecast-day ${
                          index === safeTodayIndex ? "forecast-today" : ""
                        }`}
                        key={date}
                      >
                        <span className="forecast-date">
                          {index === safeTodayIndex
                            ? t.todayLabel
                            : formatDate(date, language)}
                        </span>

                        <div className="forecast-icon">
                          {weatherIcon(daily.weather_code[index], 27)}
                        </div>

                        <span className="forecast-condition">
                          {localizedWeatherDescription(daily.weather_code[index], language)}
                        </span>

                        <strong className="forecast-temp">
                          {daily.temperature_2m_max[index]}°
                        </strong>

                        <span className="forecast-min">
                          {daily.temperature_2m_min[index]}°
                        </span>

                        <div className="forecast-rain">
                          <Droplets size={14} />
                          {daily.precipitation_probability_max?.[index] ?? "—"}%
                        </div>

                        <span className="forecast-mm">
                          {daily.precipitation_sum?.[index] ?? "—"} mm
                        </span>
                      </article>
                    ))}
                  </div>

                  <div className="forecast-legend">
                    <span>
                      <Droplets size={14} />
                      {language === "ta" ? "மழை வாய்ப்பு" : "Rain probability"}
                    </span>
                    <span>{language === "ta" ? "தினசரி மழையளவு (மி.மீ.)" : "Daily precipitation in mm"}</span>
                  </div>
                </section>
              )}

              {(page === "dashboard" || page === "actions") && (
                <section id="farm-action-plan" className="card full-actions-card" style={{ scrollMarginTop: "24px" }}>
                  <div className="card-heading">
                    <div>
                      <span className="muted-label">{language === "ta" ? "அடுத்த நடவடிக்கை" : "YOUR NEXT MOVE"}</span>
                      <h3>{t.checklist}</h3>
                      <p className="card-subtitle">
                        {language === "ta" ? "தற்போதைய முன்னறிவிப்பின் அடிப்படையிலான எளிய நடவடிக்கைகள்" : "Small, practical steps based on your current forecast"}
                      </p>
                    </div>

                    <div className="action-count">
                      {completedCount}/{tasks.length}
                    </div>
                  </div>

                  <div className="full-task-list">
                    {tasks.map((task, index) => (
                      <div
                        className={`full-task ${
                          tasksDone[task.id] ? "task-done" : ""
                        }`}
                        key={task.id}
                      >
                        <button
                          className="task-check"
                          aria-label={
                            tasksDone[task.id] ? t.undo : t.complete
                          }
                          onClick={() =>
                            setTasksDone((old) => ({
                              ...old,
                              [task.id]: !old[task.id],
                            }))
                          }
                        >
                          {tasksDone[task.id] ? (
                            <CheckCircle2 size={22} />
                          ) : (
                            <Circle size={22} />
                          )}
                        </button>

                        <div className="task-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="full-task-content">
                          <h4>{task.title}</h4>
                          <p>{task.detail}</p>
                        </div>

                        <span
                          className={`task-status ${
                            tasksDone[task.id] ? "done" : ""
                          }`}
                        >
                          {tasksDone[task.id] ? t.completed : (language === "ta" ? "செய்ய வேண்டியது" : "To do")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {completedCount === tasks.length && (
                    <div className="all-done-message">
                      <CheckCircle2 size={18} />
                      {t.allDone}
                    </div>
                  )}
                </section>
              )}

              <footer className="data-footer">
                <div className="source-label">
                  <span className="status-dot" />
                  {t.source}
                </div>

                <p>
                  {t.disclaimer} {t.sourceNote}
                </p>

                {updatedAt && (
                  <span>
                    {t.lastUpdated}:{" "}
                    {updatedAt.toLocaleTimeString(
                      language === "ta" ? "ta-IN" : "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                )}

                {daily && (
                  <span>
                    {t.rainTotal}: {rainTotal ?? "—"} mm
                  </span>
                )}
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}