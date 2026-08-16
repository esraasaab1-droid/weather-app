<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import ForecastList from './components/ForecastList.vue'
import SunInfoRow from './components/SunInfoRow.vue'
import FavoritesList from './components/FavoritesList.vue'
import { getWeather } from './services/weatherApi'
import { getFavorites, addFavorite, removeFavorite, isFavorite } from './services/favorites'

const cityName = ref('')
const currentCity = ref(null)
const weather = ref(null)
const error = ref('')
const favorites = ref([])

onMounted(() => {
  favorites.value = getFavorites()
})

async function loadCity(city) {
  error.value = ''
  cityName.value = city.name
  currentCity.value = city
  try {
    weather.value = await getWeather(city.latitude, city.longitude)
  } catch (e) {
    error.value = 'صار خطأ بجلب بيانات الطقس'
  }
}

function handleSelectCity(city) {
  loadCity(city)
}

function handleToggleFavorite(city) {
  if (!city) return
  if (isFavorite(city)) {
    favorites.value = removeFavorite(city)
  } else {
    favorites.value = addFavorite(city)
  }
}

async function getCityNameFromCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`
    )
    const data = await response.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state ||
      'موقعي الحالي'
    )
  } catch (e) {
    return 'موقعي الحالي'
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    error.value = 'المتصفح ما بيدعم تحديد الموقع'
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const name = await getCityNameFromCoords(lat, lon)

      const city = {
        id: 'current-location',
        name,
        latitude: lat,
        longitude: lon
      }
      await loadCity(city)
    },
    () => { error.value = 'ما قدرنا نحدد موقعك' }
  )
}
</script>

<template>
  <div class="app">
    <div class="hero">
      <h1>🌤️ تطبيق الطقس</h1>
      <p class="subtitle">اعرف حالة الطقس في أي مدينة حول العالم</p>

      <SearchBar @select-city="handleSelectCity" />
      <p class="location-link" @click="useCurrentLocation">📍 موقعي الحالي</p>
      <p class="hint">📍 مثال: دمشق، الرياض، القاهرة، إسطنبول...</p>
    </div>

    <FavoritesList :favorites="favorites" @select-favorite="loadCity" />

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!weather" class="welcome-card">
      <div class="welcome-icon">⛅</div>
      <h2>مرحبًا بك في تطبيق الطقس</h2>
      <p class="welcome-text">ابحث عن أي مدينة لمعرفة حالة الطقس الحالية والتوقعات لعدة أيام قادمة</p>

      <div class="features">
        <div class="feature">
          <span class="feature-icon">🌡️</span>
          <span class="feature-title">درجة الحرارة</span>
          <span class="feature-desc">حالية ودقيقة</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💧</span>
          <span class="feature-title">الرطوبة</span>
          <span class="feature-desc">نسبة الرطوبة</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💨</span>
          <span class="feature-title">سرعة الرياح</span>
          <span class="feature-desc">اتجاه وسرعة الرياح</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📅</span>
          <span class="feature-title">توقعات 5 أيام</span>
          <span class="feature-desc">تحديث مستمر</span>
        </div>
      </div>
    </div>

    <template v-else>
      <WeatherCard
        :city-name="cityName"
        :weather="weather"
        :city="currentCity"
        @toggle-favorite="handleToggleFavorite"
      />
      <ForecastList :daily="weather?.daily" />
      <SunInfoRow :daily="weather?.daily" :current="weather?.current" />
      <p class="footer-note">🔄 تحديث البيانات كل 10 دقائق</p>
    </template>
  </div>
</template>

<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%);
  direction: rtl;
  color: #0F172A;
}
.app {
  padding: 48px 16px;
  min-height: 100vh;
  max-width: 600px;
  margin: 0 auto;
}
.hero { text-align: center; margin-bottom: 8px; }
.hero h1 { font-size: 32px; margin: 0 0 8px; }
.subtitle { color: #64748B; margin: 0 0 24px; }
.location-link {
  color: #2563EB;
  font-size: 13px;
  cursor: pointer;
  margin: 10px 0 0;
}
.hint { color: #94A3B8; font-size: 13px; margin-top: 6px; }
.error { text-align: center; color: #DC2626; }

.welcome-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.06);
  margin-top: 16px;
}
.welcome-icon { font-size: 48px; margin-bottom: 12px; }
.welcome-card h2 { margin: 0 0 8px; font-size: 20px; }
.welcome-text {
  color: #64748B;
  font-size: 14px;
  max-width: 380px;
  margin: 0 auto 28px;
  line-height: 1.6;
}
.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.feature { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.feature-icon { font-size: 22px; }
.feature-title { font-size: 13px; font-weight: 600; color: #0F172A; }
.feature-desc { font-size: 11px; color: #94A3B8; }
.footer-note {
  text-align: center;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .features { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}
</style>
