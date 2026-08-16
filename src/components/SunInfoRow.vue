<script setup>
import { formatTime } from '../services/weatherApi'

defineProps({
  daily: Object,
  current: Object
})
</script>

<template>
  <div class="sun-row" v-if="daily">
    <div class="info-card purple">
      <span class="icon">🌅</span>
      <div>
        <div class="value">{{ formatTime(daily.sunrise[0]) }}</div>
        <div class="title">شروق الشمس</div>
      </div>
    </div>
    <div class="info-card orange">
      <span class="icon">🌇</span>
      <div>
        <div class="value">{{ formatTime(daily.sunset[0]) }}</div>
        <div class="title">غروب الشمس</div>
      </div>
    </div>
    <div class="info-card teal">
      <span class="icon">📊</span>
      <div>
        <div class="value">{{ Math.round(current.pressure_msl) }}</div>
        <div class="title">hPa الضغط الجوي</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sun-row {
  display: flex;
  gap: 8px;
  max-width: 480px;
  margin: 12px auto 0;
}
.info-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  padding: 12px;
}
.info-card.purple { background: #F3E8FF; }
.info-card.orange { background: #FFEDD5; }
.info-card.teal { background: #CCFBF1; }
.icon { font-size: 20px; }
.value { font-size: 13px; font-weight: 700; color: #0F172A; }
.title { font-size: 10px; color: #64748B; }
</style>