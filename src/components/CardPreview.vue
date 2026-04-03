<script setup lang="ts">
import { computed } from 'vue'
import type { TravelCard, TransportType } from '@/types'
import { TRANSPORT_CONFIGS, THEME_CONFIGS, formatDate } from '@/utils/constants'
import StepContent from '@/components/StepContent.vue'

const props = defineProps<{
  card: TravelCard
  previewMode?: boolean
  cardWidthPx?: number
}>()

const theme = computed(() => THEME_CONFIGS[props.card.theme || 'blue'])
const isMinimal = computed(() => !!theme.value.isMinimal)
const layout = computed(() => props.card.cardLayout || 'ticket')

function accentBg(_t: TransportType) {
  // 使用主题颜色，而非交通方式颜色 → 这样橙/绿/粉主题才能生效
  return theme.value.accent
}
function contentBg(t: TransportType) {
  if (isMinimal.value) return 'bg-white'
  return TRANSPORT_CONFIGS[t].bgColor
}
function stepBorder(t: TransportType) {
  if (isMinimal.value) return 'border-gray-400'
  return TRANSPORT_CONFIGS[t].borderColor
}
</script>

<template>
  <div
    id="travel-card"
    class="card-print bg-white overflow-hidden"
    :class="previewMode ? 'rounded-xl shadow text-xs' : 'rounded-2xl shadow-xl text-sm'"
    :style="previewMode ? {} : { width: (cardWidthPx ?? 920) + 'px' }"
    style="font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',Arial,sans-serif;"
  >
    <!-- 顶部：标题 + 目的地/日期 + 出发地/出行人 -->
    <div :class="previewMode ? 'px-3 pt-3 pb-2' : 'px-6 pt-5 pb-4'">
      <!-- 第一行：卡片标题 -->
      <div
        class="text-center font-black tracking-widest text-slate-800 border-b border-dashed border-slate-200"
        :class="previewMode ? 'text-sm pb-2 mb-2' : 'text-3xl pb-4 mb-3'"
      >{{ card.title || '出行卡片' }}</div>

      <!-- 第二行：目的地 + 出发日期 -->
      <div
        class="flex items-center justify-between gap-2"
        :class="previewMode ? 'text-xs mb-1' : 'text-base mb-2'"
      >
        <span class="text-slate-500">
          目的地：<span class="font-bold text-slate-800">{{ card.destination }}</span>
        </span>
        <span class="text-slate-500">出发日期：<span class="font-bold text-slate-800">{{ formatDate(card.date) }}</span></span>
        
      </div>

      <!-- 第三行：出发地 + 出行人 -->
      <div
        class="flex items-center justify-between gap-2"
        :class="previewMode ? 'text-xs' : 'text-base'"
      >
        <span class="text-slate-500">
          出发地：<span class="font-bold text-slate-800">{{ card.departure}}</span>
        </span>
        <span class="text-slate-500 flex-shrink-0">
          姓名：<span class="font-bold text-slate-800">{{ card.passengerName }}</span>
        </span>
      </div>
    </div>

    <!-- 行程步骤 -->
    <div :class="previewMode ? 'p-2.5' : 'p-4'">
      <div v-if="card.steps.length === 0" class="text-center text-slate-400 py-8">暂无行程步骤</div>

      <!-- ══ 布局 1：撕票线 (ticket) ══ -->
      <template v-if="layout === 'ticket'">
        <div :class="previewMode ? 'space-y-2' : 'space-y-3'">
          <div
            v-for="(step, idx) in card.steps"
            :key="step.id"
            class="flex border rounded-xl overflow-hidden"
            :class="stepBorder(step.transport)"
          >
            <div
              class="flex items-center justify-center text-white flex-shrink-0"
              :class="[accentBg(step.transport), previewMode ? 'px-2.5 py-2 min-w-[36px]' : 'px-4 py-4 min-w-[56px]']"
            >
              <span :class="previewMode ? 'text-base font-black' : 'text-2xl font-black'" class="tabular-nums leading-none">{{ idx + 1 }}</span>
            </div>
            <div
              class="w-px self-stretch border-l-2 border-dashed flex-shrink-0"
              :class="isMinimal ? 'border-gray-300' : 'border-white/0'"
            ></div>
            <div
              class="flex-1 min-w-0"
              :class="[contentBg(step.transport), previewMode ? 'px-3 py-2' : 'px-5 py-4']"
            >
              <StepContent :step="step" :is-minimal="isMinimal" :preview-mode="!!previewMode" :layout="layout" />
            </div>
          </div>
        </div>
      </template>

      <!-- ══ 布局 2：时间轴 (timeline) ══ -->
      <template v-else-if="layout === 'timeline'">
        <div>
          <div
            v-for="(step, idx) in card.steps"
            :key="step.id"
            class="flex"
            :class="previewMode ? 'gap-2' : 'gap-3'"
          >
            <div class="flex flex-col items-center flex-shrink-0">
              <div
                class="rounded-full text-white font-black flex items-center justify-center flex-shrink-0 z-10"
                :class="[accentBg(step.transport), previewMode ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-base']"
              >{{ idx + 1 }}</div>
              <div
                v-if="idx < card.steps.length - 1"
                class="w-0.5 flex-1 mt-1"
                :class="isMinimal ? 'bg-gray-200' : 'bg-slate-200'"
                style="min-height:12px"
              ></div>
            </div>
            <div
              class="flex-1 min-w-0 border rounded-xl bg-white"
              :class="[stepBorder(step.transport), previewMode ? 'px-3 py-2 mb-2' : 'px-5 py-4 mb-3']"
            >
              <StepContent :step="step" :is-minimal="isMinimal" :preview-mode="!!previewMode" :layout="layout" />
            </div>
          </div>
        </div>
      </template>

      <!-- ══ 布局 3：名片卡 (card) ══ -->
      <template v-else>
        <div :class="previewMode ? 'space-y-2' : 'space-y-3'">
          <div
            v-for="(step, idx) in card.steps"
            :key="step.id"
            class="rounded-xl overflow-hidden border"
            :class="stepBorder(step.transport)"
          >
            <div
              class="flex items-center gap-2 text-white"
              :class="[accentBg(step.transport), previewMode ? 'px-3 py-1.5' : 'px-5 py-2.5']"
            >
              <span class="font-black tabular-nums" :class="previewMode ? 'text-sm' : 'text-lg'">{{ idx + 1 }}</span>
              <span :class="previewMode ? 'text-sm' : 'text-xl'">{{ TRANSPORT_CONFIGS[step.transport].emoji }}</span>
              <span class="font-semibold opacity-90" :class="previewMode ? 'text-xs' : 'text-sm'">{{ TRANSPORT_CONFIGS[step.transport].label }}</span>
            </div>
            <div
              class="bg-white"
              :class="previewMode ? 'px-3 py-2' : 'px-5 py-4'"
            >
              <StepContent :step="step" :is-minimal="isMinimal" :preview-mode="!!previewMode" :layout="layout" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 紧急联系 + 重要提示 合并区 -->
    <div
      v-if="card.contacts.length > 0 || card.tips"
      class="mx-4 mb-3 rounded-xl overflow-hidden"
      :class="isMinimal ? 'border border-gray-800' : 'border border-red-200'"
    >
      <div
        v-if="card.contacts.length > 0"
        class="flex items-center flex-wrap gap-x-3 gap-y-1 px-4 py-2"
        :class="isMinimal ? 'bg-white' : 'bg-red-50'"
      >
        <span
          class="font-bold flex-shrink-0"
          :class="[isMinimal ? 'text-gray-900' : 'text-red-600', previewMode ? 'text-xs' : 'text-sm']"
        >📞 紧急联系：</span>
        <template v-for="(contact, i) in card.contacts" :key="contact.id">
          <span v-if="i > 0" class="text-gray-300 select-none">│</span>
          <span class="inline-flex items-center gap-1">
            <span class="font-semibold" :class="[previewMode ? 'text-xs' : 'text-sm', isMinimal ? 'text-gray-900' : 'text-slate-800']">{{ contact.name }}</span>
            <span class="font-bold" :class="[previewMode ? 'text-sm' : 'text-base', isMinimal ? 'text-gray-900' : 'text-red-600']">{{ contact.phone }}</span>
          </span>
        </template>
      </div>
      <div v-if="card.contacts.length > 0 && card.tips" class="border-t" :class="isMinimal ? 'border-gray-200' : 'border-red-100'"></div>
      <div v-if="card.tips" class="flex items-start gap-2 px-4 py-2" :class="isMinimal ? 'bg-white' : 'bg-rose-50'">
        <span class="flex-shrink-0 mt-0.5">❤️‍🩹</span>
        <div class="flex-1 min-w-0">
          <div class="font-bold" :class="[previewMode ? 'text-xs' : 'text-xs', isMinimal ? 'text-gray-500' : 'text-rose-500']">急救信息</div>
          <p class="leading-relaxed whitespace-pre-wrap" :class="[previewMode ? 'text-xs' : 'text-sm', isMinimal ? 'text-gray-800' : 'text-rose-900']">{{ card.tips }}</p>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div
      class="mx-4 mb-3 text-center py-2 border-t"
      :class="isMinimal ? 'border-gray-300 text-gray-400' : 'border-slate-100 text-slate-400'"
      style="font-size:11px;"
    >此卡片由「怎么走GetThere」平台生成</div>
  </div>
</template>
