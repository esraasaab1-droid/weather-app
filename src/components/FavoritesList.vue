<script setup>
defineProps({
  favorites: Array
})
const emit = defineEmits(['select-favorite'])
</script>

<template>
  <div class="favorites" v-if="favorites.length">
    <span class="title">⭐ المدن المفضلة</span>
    <div class="chips">
      <button
        v-for="city in favorites"
        :key="city.id"
        class="chip"
        @click="emit('select-favorite', city)"
      >
        {{ city.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.favorites {
  max-width: 480px;
  margin: 16px auto 0;
}
.title {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.chip {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #2563EB;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
}
.chip:hover {
  background: #DBEAFE;
}
</style>