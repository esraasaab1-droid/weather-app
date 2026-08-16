<script setup>
import { ref } from 'vue'
import { searchCity } from '../services/weatherApi'

const emit = defineEmits(['select-city'])
const query = ref('')
const results = ref([])
const loading = ref(false)

async function onSearch() {
  if (query.value.trim().length < 2) {
    results.value = []
    return
  }
  loading.value = true
  try {
    results.value = await searchCity(query.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function pick(city) {
  emit('select-city', city)
  results.value = []
  query.value = city.name
}
</script>

<template>
  <div class="search-bar">
    <div class="input-wrap">
      <span class="pin"></span>
      <input
        v-model="query"
        @input="onSearch"
        type="text"
        placeholder="ابحث عن مدينة..."
      />
      <button class="search-btn" type="button">🔍</button>
    </div>
    <ul v-if="results.length" class="results">
      <li v-for="city in results" :key="city.id" @click="pick(city)">
        {{ city.name }} <span v-if="city.country">- {{ city.country }}</span>
      </li>
    </ul>
    <p v-if="loading" class="loading">جاري البحث...</p>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
}
.input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 6px 6px 6px 16px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
}
.pin {
  font-size: 16px;
  padding: 0 8px;
}
input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 4px;
  font-size: 15px;
  background: transparent;
  color: #0F172A;
}
.search-btn {
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}
.search-btn:hover { background: #1D4ED8; }
.results {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  list-style: none;
  margin-top: 4px;
  overflow: hidden;
  z-index: 10;
}
.results li {
  padding: 10px 16px;
  cursor: pointer;
}
.results li:hover {
  background: #f0f0f0;
}
.loading {
  text-align: center;
  color: #888;
  margin-top: 8px;
}
</style>