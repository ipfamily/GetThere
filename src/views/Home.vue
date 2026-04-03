<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import { THEME_CONFIGS, TRANSPORT_CONFIGS, formatDate } from '@/utils/constants'
import type { TravelCard } from '@/types'

const store = useCardStore()

const features = [
  { icon: '👴', title: '老人友好', desc: '大字体、清晰步骤，让老人看得懂' },
  { icon: '🚄', title: '多种交通', desc: '高铁、地铁、公交、出租车等' },
  { icon: '📱', title: '保存图片', desc: '一键保存为图片，方便携带和打印' },
  { icon: '📄', title: '导出 PDF', desc: '生成精美 PDF，打印后随身携带' },
]

function deleteCard(id: string) {
  if (confirm('确定要删除这张卡片吗？')) {
    store.deleteCard(id)
  }
}

function getThemeIcon(card: TravelCard) {
  return THEME_CONFIGS[card.theme].icon
}

function getThemeHeader(card: TravelCard) {
  return THEME_CONFIGS[card.theme].headerBg
}

function getStepSummary(card: TravelCard) {
  return card.steps
    .slice(0, 3)
    .map(s => TRANSPORT_CONFIGS[s.transport].emoji)
    .join(' → ')
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-b from-blue-600 via-blue-500 to-transparent">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
      <div class="max-w-screen-xl mx-auto px-4 pt-16 pb-20 relative">
        <div class="text-center max-w-2xl mx-auto">
          <span class="text-5xl block mb-5 drop-shadow-lg">🗺️</span>
          <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
           GetThere
          </h1>
          <p class="text-blue-100 text-base md:text-lg leading-relaxed mb-8">
            为亲人生成专属行程问路卡片，让老幼出行不再迷茫
          </p>
          <RouterLink
            to="/create"
            class="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-7 py-3 rounded-full font-semibold text-base transition-all shadow-xl shadow-blue-700/20 hover:shadow-blue-700/30 hover:-translate-y-0.5"
          >
            <span class="text-lg">✨</span>
            创建问路卡片
          </RouterLink>
        </div>
      </div>
    </div>

    <main class="max-w-screen-xl mx-auto px-4 -mt-8 relative z-10 pb-12">
      <!-- 空状态 -->
      <div v-if="store.sortedCards.length === 0">
        <!-- 功能亮点 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div class="text-3xl mb-3">{{ feat.icon }}</div>
            <h3 class="font-semibold text-slate-700 text-sm mb-1">{{ feat.title }}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 卡片列表 -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-700">
            我的问路卡片
            <span class="ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
              {{ store.sortedCards.length }} 张
            </span>
          </h2>
          <RouterLink
            to="/create"
            class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full font-medium transition-colors shadow-sm"
          >
            <span>＋</span>
            新建
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="card in store.sortedCards"
            :key="card.id"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <!-- 卡片顶部色条 -->
            <div :class="`bg-gradient-to-r ${getThemeHeader(card)} p-4`">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-2xl">{{ getThemeIcon(card) }}</span>
                  <h3 class="text-white font-bold text-base mt-1 leading-tight">{{ card.title }}</h3>
                </div>
                <span class="text-white/90 text-sm bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {{ card.passengerName }}
                </span>
              </div>
            </div>

            <!-- 卡片信息 -->
            <div class="p-4">
              <div class="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <span>📍</span>
                <span class="font-medium">{{ card.departure }}</span>
                <span class="text-slate-300">→</span>
                <span class="font-medium">{{ card.destination }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span>📅</span>
                <span>{{ formatDate(card.date) }}</span>
              </div>
              <!-- 步骤概览 -->
              <div class="text-base mb-4 bg-slate-50 rounded-xl px-3 py-2 text-center tracking-wider">
                {{ getStepSummary(card) }}
                <span v-if="card.steps.length > 3" class="text-slate-400 text-xs ml-1">+{{ card.steps.length - 3 }}步</span>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2">
                <RouterLink
                  :to="`/preview/${card.id}`"
                  class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-xl font-medium transition-colors"
                >
                  查看 / 导出
                </RouterLink>
                <RouterLink
                  :to="`/edit/${card.id}`"
                  class="px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-sm transition-colors"
                  title="编辑"
                >
                  编辑
                </RouterLink>
                <button
                  @click="deleteCard(card.id)"
                  class="px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm transition-colors"
                  title="删除"
                >
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 新建卡片入口 -->
          <RouterLink
            to="/create"
            class="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center p-8 text-slate-400 hover:text-blue-500 min-h-[200px]"
          >
            <span class="text-4xl mb-3">＋</span>
            <span class="text-sm font-medium">新建行程卡</span>
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
