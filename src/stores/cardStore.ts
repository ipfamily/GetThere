import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TravelCard } from '@/types'

const STORAGE_KEY = 'wenluka_cards'

export const useCardStore = defineStore('card', () => {
  const cards = ref<TravelCard[]>(loadFromStorage())

  function loadFromStorage(): TravelCard[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value))
  }

  function addCard(card: TravelCard) {
    cards.value.unshift(card)
    saveToStorage()
  }

  function updateCard(card: TravelCard) {
    const idx = cards.value.findIndex(c => c.id === card.id)
    if (idx >= 0) {
      cards.value[idx] = card
      saveToStorage()
    }
  }

  function deleteCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
    saveToStorage()
  }

  function getCardById(id: string): TravelCard | undefined {
    return cards.value.find(c => c.id === id)
  }

  const sortedCards = computed(() =>
    [...cards.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  return { cards, sortedCards, addCard, updateCard, deleteCard, getCardById }
})
