<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import CardPreview from '@/components/CardPreview.vue'
import type { TravelCard } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useCardStore()

const card = ref<TravelCard | null>(null)
const exporting = ref<'image' | 'pdf' | null>(null)

onMounted(() => {
  const found = store.getCardById(route.params.id as string)
  if (!found) { router.replace('/'); return }
  card.value = found
})

async function handleExportImage() {
  if (!card.value) return
  exporting.value = 'image'
  try {
    const { exportAsImage } = await import('@/utils/export')
    await exportAsImage('travel-card', card.value.title || 'GetThere')
  } catch (e) {
    console.error('导出图片失败:', e)
    alert('导出图片失败: ' + (e instanceof Error ? e.message : '未知错误'))
  } finally {
    exporting.value = null
  }
}

async function handleExportPDF() {
  if (!card.value) return
  exporting.value = 'pdf'
  try {
    const { exportAsPDF } = await import('@/utils/export')
    await exportAsPDF('travel-card', card.value.title || 'GetThere')
  } catch (e) {
    console.error('导出PDF失败:', e)
    alert('导出PDF失败: ' + (e instanceof Error ? e.message : '未知错误'))
  } finally {
    exporting.value = null
  }
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="min-h-screen" v-if="card">
    <!-- 顶部导航 - 不打印 -->
    <header class="bg-white shadow-sm sticky top-0 z-10 no-print">
      <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="text-slate-500 hover:text-slate-700 transition-colors text-sm">
          返回首页
        </RouterLink>
        <span class="text-slate-300">|</span>
        <h1 class="font-bold text-slate-800 flex-1 truncate">{{ card.title }}</h1>
        <div class="flex gap-2 ml-auto">
          <RouterLink
            :to="`/edit/${card.id}`"
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ✏️ 编辑
          </RouterLink>
          <button
            @click="handlePrint"
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            🖨️ 打印
          </button>
          <button
            @click="handleExportImage"
            :disabled="!!exporting"
            class="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            <span v-if="exporting === 'image'" class="animate-spin">⏳</span>
            <span v-else>🖼️</span>
            下载图片
          </button>
          <button
            @click="handleExportPDF"
            :disabled="!!exporting"
            class="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            <span v-if="exporting === 'pdf'" class="animate-spin">⏳</span>
            <span v-else>📄</span>
            下载PDF
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-screen-xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">

        <!-- 卡片预览区 -->
        <div class="flex-1">
          <!-- 实际卡片 -->
          <div class="flex justify-center">
            <CardPreview :card="card" :preview-mode="false" :card-width-px="card.cardWidthPx ?? 920" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载中 -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-slate-400 text-center">
      <div class="text-4xl mb-3 animate-spin">⏳</div>
      <p>加载中...</p>
    </div>
  </div>
</template>
