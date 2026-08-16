<script setup>
import { ref, computed } from 'vue'
import { weatherCodeToInfo, formatFullDate } from '../services/weatherApi'

const props = defineProps({
  cityName: String,
  weather: Object
})

const isFavorite = ref(false)
const info = computed(() => weatherCodeToInfo(props.weather?.current?.weather_code))
</script>

<template>
  <div class="weather-card" v-if="weather">
    <button class="fav-btn" @click="isFavorite = !isFavorite">
      {{ isFavorite ? '❤️' : '🤍' }}
    </button>

    <h2>{{ cityName }}</h2>
    <p class="date">{{ formatFullDate(weather.current.time) }}</p>

    <div class="main-row">
      <div class="temp-block">
        <div class="temp">{{ Math.round(weather.current.temperature_2m) }}°</div>
        <p class="label">{{ info.label }}</p>
        <span class="badge">✅ حالة الطقس جيدة</span>
      </div>
      <div class="icon">{{ info.icon }}</div>
    </div>

    <div class="stats-bar">
      <div class="stat">
        <span class="stat-icon">🌡️</span>
        <span class="stat-value">{{ Math.round(weather.current.apparent_temperature) }}°</span>
        <span class="stat-title">المحسوسة</span>
      </div>
      <div class="stat">
        <span class="stat-icon">💧</span>
        <span class="stat-value">{{ weather.current.relative_humidity_2m }}%</span>
        <span class="stat-title">الرطوبة</span>
      </div>
      <div class="stat">
        <span class="stat-icon">💨</span>
        <span class="stat-value">{{ Math.round(weather.current.wind_speed_10m) }}</span>
        <span class="stat-title">كم/س رياح</span>
      </div>
      <div class="stat">
        <span class="stat-icon">👁️</span>
        <span class="stat-value">
          {{ weather.currentVisibility ? Math.round(weather.currentVisibility / 1000) : '-' }}
        </span>
        <span class="stat-title">الرؤية</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  text-align: center;
  background: linear-gradient(160deg, #3B82F6 0%, #2563EB 60%, #1D4ED8 100%);
  color: white;
  border-radius: 22px;
  padding: 24px 20px 0;
  max-width: 480px;
  margin: 24px auto 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
}
.fav-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 15px;
}
h2 { margin: 0; font-size: 22px; }
.date { margin: 4px 0 12px; font-size: 13px; opacity: 0.85; }

.main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
.temp-block { text-align: right; }
.temp { font-size: 52px; font-weight: bold; line-height: 1; }
.label { margin: 4px 0 10px; font-size: 15px; opacity: 0.9; }
.badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
}
.icon { font-size: 90px; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15)); }

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: rgba(255,255,255,0.12);
  margin-top: 24px;
  padding: 14px 8px;
  border-radius: 16px 16px 0 0;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-icon { font-size: 16px; }
.stat-value { font-size: 15px; font-weight: 700; }
.stat-title { font-size: 10px; opacity: 0.85; }
</style>