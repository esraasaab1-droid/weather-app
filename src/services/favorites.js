const STORAGE_KEY = 'weather-favorites'

export function getFavorites() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function isFavorite(city) {
  return getFavorites().some(
    (c) => c.latitude === city.latitude && c.longitude === city.longitude
  )
}

export function addFavorite(city) {
  const favorites = getFavorites()
  if (isFavorite(city)) return favorites
  const updated = [...favorites, city]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function removeFavorite(city) {
  const updated = getFavorites().filter(
    (c) => !(c.latitude === city.latitude && c.longitude === city.longitude)
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}