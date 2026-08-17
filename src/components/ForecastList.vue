<script setup>
import { ref, computed } from 'vue'
import { weatherCodeToInfo, dayShortName } from '../services/weatherApi'

const props = defineProps({
  daily: Object
})

const showOutfit = ref(false)
const cardsRef = ref(null)

function toggleOutfit() {
  showOutfit.value = !showOutfit.value
}

function scrollCards(direction) {
  if (!cardsRef.value) return

  cardsRef.value.scrollBy({
    left: direction * 200,
    behavior: 'smooth'
  })
}

const outfitSuggestion = computed(() => {
  if (!props.daily) return null

  const maxTemp = props.daily.temperature_2m_max[0]
  const code = props.daily.weather_code[0]
  const info = weatherCodeToInfo(code)

  let clothes = []
  let icon = '👕'

  if (maxTemp >= 30) {
    clothes = [
      'قميص خفيف قصير الكم',
      'شورت أو بنطلون خفيف',
      'نظارة شمس وقبعة'
    ]
    icon = '🩳'
  } else if (maxTemp >= 22) {
    clothes = [
      'قميص أو تيشيرت',
      'بنطلون خفيف',
      'حذاء مريح'
    ]
    icon = '👕'
  } else if (maxTemp >= 15) {
    clothes = [
      'كنزة خفيفة أو جاكيت رقيق',
      'بنطلون طويل',
      'حذاء مغلق'
    ]
    icon = '🧥'
  } else {
    clothes = [
      'معطف ثقيل',
      'كنزة صوف',
      'قفازات ووشاح'
    ]
    icon = '🧣'
  }

  if (info.label && info.label.includes('مطر')) {
    clothes.push('مظلة أو معطف واقي من المطر')
  }

  return {
    icon,
    clothes,
    temp: Math.round(maxTemp),
    label: info.label
  }
})
</script>

<template>
  <div class="forecast-section" v-if="daily">

    <!-- Header -->
    <div class="forecast-header">
      <span class="title">
        توقعات {{ daily.time.length }} أيام القادمة
      </span>

      <button class="more" @click="toggleOutfit">
        الملابس المقترحة ‹
      </button>
    </div>

    <!-- Outfit -->
    <div
      class="outfit-panel"
      v-if="showOutfit && outfitSuggestion"
    >
      <div class="outfit-icon">
        {{ outfitSuggestion.icon }}
      </div>

      <div class="outfit-info">
        <span class="outfit-temp">
          اليوم {{ outfitSuggestion.temp }}° -
          {{ outfitSuggestion.label }}
        </span>

        <ul class="outfit-list">
          <li
            v-for="(item, idx) in outfitSuggestion.clothes"
            :key="idx"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Forecast -->
    <div class="forecast-row">

      <!-- Previous -->
      <button
        class="nav-btn"
        @click="scrollCards(-1)"
      >
        ›
      </button>

      <!-- Cards -->
      <div
        class="cards"
        ref="cardsRef"
      >
        <div
          v-for="(date, i) in daily.time"
          :key="date"
          class="day-card"
          :class="{ today: i === 0 }"
        >
          <span class="day-name">
            {{ i === 0 ? 'اليوم' : dayShortName(date) }}
          </span>

          <span class="icon">
            {{ weatherCodeToInfo(daily.weather_code[i]).icon }}
          </span>

          <span class="temps">
            {{ Math.round(daily.temperature_2m_max[i]) }}°
            /
            {{ Math.round(daily.temperature_2m_min[i]) }}°
          </span>

          <span class="cond">
            {{ weatherCodeToInfo(daily.weather_code[i]).label }}
          </span>
        </div>
      </div>

      <!-- Next -->
      <button
        class="nav-btn"
        @click="scrollCards(1)"
      >
        ‹
      </button>

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

.title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
}

.more {
  font-size: 12px;
  color: #2563EB;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}

.outfit-panel {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.outfit-icon {
  font-size: 28px;
}

.outfit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.outfit-temp {
  font-size: 12px;
  font-weight: 700;
  color: #0F172A;
}

.outfit-list {
  margin: 0;
  padding-inline-start: 16px;
  font-size: 12px;
  color: #334155;
}

.outfit-list li {
  margin-top: 2px;
}

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

.nav-btn:hover {
  background: #DBEAFE;
}

.cards {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.cards::-webkit-scrollbar {
  display: none;
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
  flex-shrink: 0;
}

.day-card.today {
  background: #EFF6FF;
  border-color: #2563EB;
}

.day-name {
  font-size: 12px;
  color: #64748B;
  font-weight: 600;
}

.icon {
  font-size: 24px;
}

.temps {
  font-size: 12px;
  font-weight: 700;
  color: #0F172A;
}

.cond {
  font-size: 10px;
  color: #94A3B8;
}
</style>
