<script setup>
import { ref } from 'vue'
import { weatherCodeToInfo, dayShortName } from '../services/weatherApi'

defineProps({
  daily: Object
})

const cardsRef = ref(null)

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

function showMore() {
  if (cardsRef.value) {
    cardsRef.value.scrollTo({ left: cardsRef.value.scrollWidth, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="forecast-section" v-if="daily">
    <div class="forecast-header">
      <span class="title">توقعات {{ daily.time.length }} أيام القادمة</span>
      <span class="more" @click="showMore">عرض المزيد ‹</span>
    </div>

    <div class="forecast-row">
      <button class="nav-btn" @click="scrollNext">›</button>
      <div class="cards" ref="cardsRef">
        <div
          v-for="(date, i) in daily.time"
          :key="date"
          class="day-card"
          :class="{ today: i === 0 }"
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
}
.day-card.today {
  background: #EFF6FF;
  border-color: #2563EB;
}
.day-name { font-size: 12px; color: #64748B; font-weight: 600; }
.icon { font-size: 24px; }
.temps { font-size: 12px; font-weight: 700; color: #0F172A; }
.cond { font-size: 10px; color: #94A3B8; }
</style>
