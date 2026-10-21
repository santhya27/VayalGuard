
const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

export async function getVillageCoordinates(village) {
  const query = village.trim();

  if (!query) {
    throw new Error("Please enter an Indian village or town name.");
  }

  const params = new URLSearchParams({
    name: query,
    count: "10",
    language: "en",
    format: "json",
    countryCode: "IN",
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error(
      "Unable to search locations right now. Please try again."
    );
  }

  const data = await response.json();

  // Validate the country even if the API returns unexpected results.
  const indianResults = (data.results ?? []).filter(
    (place) => place.country_code?.toUpperCase() === "IN"
  );

  if (indianResults.length === 0) {
    throw new Error(
      "No matching location was found in India. Check the spelling or try a nearby town."
    );
  }

  // Prefer an exact name match; otherwise use the first Indian match.
  const exactMatch = indianResults.find(
    (place) => place.name.toLowerCase() === query.toLowerCase()
  );

  const result = exactMatch ?? indianResults[0];

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    admin1: result.admin1 ?? "",
    country: result.country ?? "",
    countryCode: result.country_code ?? "IN",
  };
}

export async function getWeather(latitude, longitude) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
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
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error(
      "Weather data is temporarily unavailable. Please try again."
    );
  }

  const data = await response.json();

  if (
    !data.daily ||
    !Array.isArray(data.daily.time) ||
    data.daily.time.length === 0
  ) {
    throw new Error("No forecast data was returned for this location.");
  }

  return data;
}

export function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Mostly clear";
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

