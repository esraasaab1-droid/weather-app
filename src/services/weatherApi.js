const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCity(name) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(name)}&count=5&language=ar`)
  const data = await res.json()
  return data.results || []
}

export async function getWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,pressure_msl',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
    hourly: 'visibility',
    timezone: 'auto'
  })
  const res = await fetch(`${WEATHER_URL}?${params}`)
  const data = await res.json()

  if (data.hourly?.time && data.current?.time) {
    const idx = data.hourly.time.indexOf(data.current.time.slice(0, 13) + ':00')
    data.currentVisibility = idx !== -1 ? data.hourly.visibility[idx] : null
  }

  return data
}

export function weatherCodeToInfo(code) {
  const map = {
    0: { label: 'صافي', icon: '☀️' },
    1: { label: 'صافي غالبًا', icon: '🌤️' },
    2: { label: 'غائم جزئيًا', icon: '⛅' },
    3: { label: 'غائم', icon: '☁️' },
    45: { label: 'ضباب', icon: '🌫️' },
    48: { label: 'ضباب متجمد', icon: '🌫️' },
    51: { label: 'رذاذ خفيف', icon: '🌦️' },
    53: { label: 'رذاذ', icon: '🌦️' },
    55: { label: 'رذاذ كثيف', icon: '🌧️' },
    61: { label: 'مطر خفيف', icon: '🌧️' },
    63: { label: 'مطر', icon: '🌧️' },
    65: { label: 'مطر غزير', icon: '⛈️' },
    71: { label: 'ثلج خفيف', icon: '🌨️' },
    73: { label: 'ثلج', icon: '❄️' },
    75: { label: 'ثلج كثيف', icon: '❄️' },
    80: { label: 'زخات مطر', icon: '🌦️' },
    95: { label: 'عاصفة رعدية', icon: '⛈️' }
  }
  return map[code] || { label: 'غير معروف', icon: '❓' }
}

export function formatFullDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date()
  return new Intl.DateTimeFormat('ar', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}

export function formatTime(dateStr) {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('ar', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d)
}

export function dayShortName(dateStr) {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  return days[new Date(dateStr).getDay()]
}