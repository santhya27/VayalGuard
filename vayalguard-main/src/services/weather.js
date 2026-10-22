const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url, fallbackMessage, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(fallbackMessage);
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("The request took too long. Check your connection and try again.");
    }
    if (err instanceof TypeError) {
      throw new Error("No internet connection or the weather service is unreachable.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Returns up to 10 Indian matches. "Ambattur, Chennai" also works:
// the part after the comma is used to rank results by district/state.
export async function searchVillages(input) {
  const [namePart, ...hintParts] = String(input ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!namePart) {
    throw new Error("Please enter an Indian village or town name.");
  }

  const params = new URLSearchParams({
    name: namePart,
    count: "10",
    language: "en",
    format: "json",
    countryCode: "IN",
  });

  const data = await fetchJson(
    `${GEOCODING_URL}?${params}`,
    "Unable to search locations right now. Please try again."
  );

  const hint = hintParts.join(" ").toLowerCase();

  const places = (data.results ?? [])
    .filter((p) => p.country_code?.toUpperCase() === "IN")
    .map((p) => ({
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      admin1: p.admin1 ?? "", // state
      admin2: p.admin2 ?? "", // district
      country: p.country ?? "India",
      countryCode: p.country_code ?? "IN",
    }));

  if (!places.length) {
    throw new Error(
      "No matching location was found in India. Check the spelling or try a nearby town."
    );
  }

  const score = (p) => {
    let s = 0;
    if (p.name.toLowerCase() === namePart.toLowerCase()) s += 2;
    if (hint && `${p.admin2} ${p.admin1}`.toLowerCase().includes(hint)) s += 3;
    return s;
  };

  return [...places].sort((a, b) => score(b) - score(a));
}

// Backward compatible: returns the best single match.
export async function getVillageCoordinates(village) {
  const places = await searchVillages(village);
  return places[0];
}

export async function getWeather(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Invalid location coordinates. Search again.");
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max", // used by the wind risk rule
      "wind_gusts_10m_max",
      "et0_fao_evapotranspiration", // used by the dry-stress rule
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  const data = await fetchJson(
    `${FORECAST_URL}?${params}`,
    "Weather data is temporarily unavailable. Please try again."
  );

  if (!Array.isArray(data?.daily?.time) || data.daily.time.length === 0) {
    throw new Error("No forecast data was returned for this location.");
  }

  return data;
}

export function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather conditions vary";
}

