<script setup>
import { ref } from 'vue'
import { weatherCodeToInfo, dayShortName } from '../services/weatherApi'

defineProps({
  daily: Object
})

const cardsRef = ref(null)
const selectedDay = ref(0)
const showSuggestion = ref(false)

function scrollCards(amount) {
  if (cardsRef.value) {
    cardsRef.value.scrollBy({ left: amount, behavior: 'smooth' })
  }
}

function scrollNext() {
  scrollCards(150)
}

function scrollPrev() {
  scrollCards(-150)
}

function selectDay(i) {
  selectedDay.value = i
  showSuggestion.value = true
}

function toggleSuggestion() {
  showSuggestion.value = !showSuggestion.value
}

function getClothingSuggestion(tempMax, weatherCode) {
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode)

  if (isSnowy) return { icon: '🧥', text: 'معطف ثقيل، قفازات، وشاح — الجو ثلجي' }
  if (isRainy) return { icon: '🌂', text: 'خذي مظلة ومعطف خفيف مقاوم للمطر' }
  if (tempMax >= 32) return { icon: '👕', text: 'لبس خفيف وقطني، ونظارة شمس' }
  if (tempMax >= 24) return { icon: '👚', text: 'لبس صيفي خفيف مريح' }
  if (tempMax >= 15) return { icon: '🧥', text: 'جاكيت خفيف يكفي' }
  if (tempMax >= 5) return { icon: '🧣', text: 'كنزة صوف وجاكيت سميك' }
  return { icon: '🥶', text: 'معطف ثقيل جدًا، الجو قارس البرودة' }
}
</script>

<template>
  <div class="forecast-section" v-if="daily">
    <div class="forecast-header">
      <span class="title">توقعات {{ daily.time.length }} أيام القادمة</span>
      <span class="more" @click="toggleSuggestion"> الملابس المقترحة ‹</span>
    </div>

    <div class="forecast-row">
      <button class="nav-btn" @click="scrollNext">›</button>
      <div class="cards" ref="cardsRef">
        <div
          v-for="(date, i) in daily.time"
          :key="date"
          class="day-card"
          :class="{ today: i === 0, selected: i === selectedDay && showSuggestion }"
          @click="selectDay(i)"
        >
          <span class="day-name">{{ i === 0 ? 'اليوم' : dayShortName(date) }}</span>
          <span class="icon">{{ weatherCodeToInfo(daily.weather_code[i]).icon }}</span>
          <span class="temps">
            {{ Math.round(daily.temperature_2m_max[i]) }}° / {{ Math.round(daily.temperature_2m_min[i]) }}°
          </span>
          <span class="cond">{{ weatherCodeToInfo(daily.weather_code[i]).label }}</span>
        </div>
      </div>
      <button class="nav-btn" @click="scrollPrev">‹</button>
    </div>

    <div v-if="showSuggestion" class="suggestion-box">
      <span class="suggestion-icon">
        {{ getClothingSuggestion(daily.temperature_2m_max[selectedDay], daily.weather_code[selectedDay]).icon }}
      </span>
      <div class="suggestion-text">
        <span class="suggestion-title">
          اقتراح اللبس - {{ selectedDay === 0 ? 'اليوم' : dayShortName(daily.time[selectedDay]) }}
        </span>
        <span class="suggestion-desc">
          {{ getClothingSuggestion(daily.temperature_2m_max[selectedDay], daily.weather_code[selectedDay]).text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forecast-section {
  max-width: 480px;
  margin: 20px auto 0;
  background: #fff;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.06);
}
.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title { font-size: 14px; font-weight: 700; color: #0F172A; }
.more { font-size: 12px; color: #2563EB; cursor: pointer; }

.forecast-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-btn {
  background: #EFF6FF;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: #2563EB;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}
.cards {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  scroll-behavior: smooth;
}
.day-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 8px;
  min-width: 78px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
}
.day-card.today {
  background: #EFF6FF;
  border-color: #2563EB;
}
.day-card.selected {
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}
.day-name { font-size: 12px; color: #64748B; font-weight: 600; }
.icon { font-size: 24px; }
.temps { font-size: 12px; font-weight: 700; color: #0F172A; }
.cond { font-size: 10px; color: #94A3B8; }

.suggestion-box {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F0F9FF;
  border: 1px solid #BAE6FD;
  border-radius: 14px;
  padding: 12px 14px;
}
.suggestion-icon { font-size: 28px; }
.suggestion-text { display: flex; flex-direction: column; gap: 2px; }
.suggestion-title { font-size: 12px; font-weight: 700; color: #0F172A; }
.suggestion-desc { font-size: 12px; color: #475569; }
</style>
