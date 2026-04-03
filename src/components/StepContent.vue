<script setup lang="ts">
import type { JourneyStep, TransportType } from '@/types'
import { TRANSPORT_CONFIGS } from '@/utils/constants'

const props = defineProps<{
  step: JourneyStep
  isMinimal: boolean
  previewMode: boolean
  layout?: string   // 'ticket' | 'timeline' | 'card'
}>()

function isTicketStep(step: JourneyStep) {
  const ticketTypes: TransportType[] = ['train', 'plane', 'ferry']
  return ticketTypes.includes(step.transport) && (step.fromStation || step.toStation)
}

function badgeClass(t: TransportType) {
  if (props.isMinimal) return 'bg-gray-100 text-gray-800 border-gray-300'
  return `bg-white ${TRANSPORT_CONFIGS[t].textColor} border ${TRANSPORT_CONFIGS[t].borderColor}`
}

function titleColor(t: TransportType) {
  if (props.isMinimal) return 'text-gray-900'
  return TRANSPORT_CONFIGS[t].textColor
}
</script>

<template>
  <!-- ====== 车票详情布局（高铁/飞机/轮船且填写了站点） ====== -->
  <template v-if="isTicketStep(step)">

    <!-- 「撕票线」布局：大字时间全尺寸展示 -->
    <template v-if="!layout || layout === 'ticket'">
      <div class="flex justify-center mb-3">
        <span
          class="px-4 py-1 rounded-full font-bold border"
          :class="[previewMode ? 'text-xs' : 'text-base', badgeClass(step.transport)]"
        >{{ step.title || TRANSPORT_CONFIGS[step.transport].label }}</span>
      </div>
      <div class="grid grid-cols-[1fr_auto_1fr] items-center" :class="previewMode ? 'gap-2' : 'gap-3'">
        <div class="text-center min-w-0">
          <div class="font-black tabular-nums leading-none" :class="[previewMode ? 'text-2xl' : 'text-5xl', isMinimal ? 'text-gray-900' : 'text-slate-900']">{{ step.departTime || '--' }}</div>
          <div class="font-black truncate mt-1" :class="[previewMode ? 'text-sm' : 'text-xl', isMinimal ? 'text-gray-800' : 'text-slate-800']">{{ step.fromStation }}</div>
          <div class="mt-0.5" :class="[previewMode ? 'text-xs' : 'text-sm', isMinimal ? 'text-gray-400' : 'text-slate-400']">出发</div>
        </div>
        <div class="flex items-center flex-shrink-0">
          <div :class="previewMode ? 'w-4 h-px bg-slate-300' : 'w-8 h-0.5 bg-slate-300'"></div>
          <span class="mx-1" :class="[previewMode ? 'text-base' : 'text-2xl', isMinimal ? 'text-gray-500' : 'text-slate-400']">→</span>
          <div :class="previewMode ? 'w-4 h-px bg-slate-300' : 'w-8 h-0.5 bg-slate-300'"></div>
        </div>
        <div class="text-center min-w-0">
          <div class="font-black tabular-nums leading-none" :class="[previewMode ? 'text-2xl' : 'text-5xl', isMinimal ? 'text-gray-900' : 'text-slate-900']">{{ step.arriveTime || '--' }}</div>
          <div class="font-black truncate mt-1" :class="[previewMode ? 'text-sm' : 'text-xl', isMinimal ? 'text-gray-800' : 'text-slate-800']">{{ step.toStation }}</div>
          <div class="mt-0.5" :class="[previewMode ? 'text-xs' : 'text-sm', isMinimal ? 'text-gray-400' : 'text-slate-400']">到达</div>
        </div>
      </div>
      <div v-if="step.gate || step.seatInfo" class="flex flex-wrap gap-2 mt-3 justify-center">
        <span v-if="step.gate" class="inline-flex items-center rounded-xl border-2 font-black" :class="[previewMode ? 'px-3 py-1 text-sm' : 'px-5 py-2 text-xl', badgeClass(step.transport)]">{{ step.transport === 'plane' ? '登机口' : '检票口' }}：{{ step.gate }}</span>
        <span v-if="step.seatInfo" class="inline-flex items-center rounded-xl border-2 font-black" :class="[previewMode ? 'px-3 py-1 text-sm' : 'px-5 py-2 text-xl', badgeClass(step.transport)]">座位：{{ step.seatInfo }}</span>
      </div>
      <p v-if="step.description" class="text-slate-500 leading-snug mt-2 text-center" :class="previewMode ? 'text-xs' : 'text-sm'">{{ step.description }}</p>
    </template>

    <!-- 「时间轴」/「名片卡」布局：紧凑横向展示 -->
    <template v-else>
      <div class="font-bold leading-snug" :class="[previewMode ? 'text-sm' : 'text-xl', isMinimal ? 'text-gray-900' : 'text-slate-800']">{{ step.title || TRANSPORT_CONFIGS[step.transport].label }}</div>
      <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
        <span class="font-black tabular-nums" :class="[previewMode ? 'text-lg' : 'text-3xl', isMinimal ? 'text-gray-900' : 'text-slate-900']">{{ step.departTime || '--' }}</span>
        <span class="font-semibold" :class="[previewMode ? 'text-xs' : 'text-base', isMinimal ? 'text-gray-600' : 'text-slate-600']">{{ step.fromStation }}</span>
        <span :class="isMinimal ? 'text-gray-400' : 'text-slate-300'">→</span>
        <span class="font-black tabular-nums" :class="[previewMode ? 'text-lg' : 'text-3xl', isMinimal ? 'text-gray-900' : 'text-slate-900']">{{ step.arriveTime || '--' }}</span>
        <span class="font-semibold" :class="[previewMode ? 'text-xs' : 'text-base', isMinimal ? 'text-gray-600' : 'text-slate-600']">{{ step.toStation }}</span>
      </div>
      <div v-if="step.gate || step.seatInfo" class="flex flex-wrap gap-2 mt-2">
        <span v-if="step.gate" class="inline-flex items-center rounded-lg border font-semibold" :class="[previewMode ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm', badgeClass(step.transport)]">{{ step.transport === 'plane' ? '登机口' : '检票口' }}：{{ step.gate }}</span>
        <span v-if="step.seatInfo" class="inline-flex items-center rounded-lg border font-semibold" :class="[previewMode ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm', badgeClass(step.transport)]">座位：{{ step.seatInfo }}</span>
      </div>
      <p v-if="step.description" class="text-slate-500 leading-snug mt-1" :class="previewMode ? 'text-xs' : 'text-sm'">{{ step.description }}</p>
    </template>

  </template>

  <!-- ====== 通用布局（其他交通方式或未填站点） ====== -->
  <template v-else>
    <div
      class="font-bold leading-snug"
      :class="[previewMode ? 'text-sm' : 'text-xl', titleColor(step.transport)]"
    >{{ step.title || TRANSPORT_CONFIGS[step.transport].label }}</div>

    <p
      v-if="step.description"
      class="text-slate-700 leading-snug mt-1"
      :class="previewMode ? 'text-xs' : 'text-base'"
    >{{ step.description }}</p>

    <div v-if="step.detail1 || step.detail2" class="flex flex-wrap gap-2 mt-2">
      <span
        v-if="step.detail1"
        class="inline-flex items-center rounded-lg border font-semibold"
        :class="[previewMode ? 'px-2 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm', badgeClass(step.transport)]"
      >📌 {{ step.detail1 }}</span>
      <span
        v-if="step.detail2"
        class="inline-flex items-center rounded-lg border font-semibold"
        :class="[previewMode ? 'px-2 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm', badgeClass(step.transport)]"
      >📌 {{ step.detail2 }}</span>
    </div>
  </template>

  <!-- 特别提示 -->
  <div
    v-if="step.tipText"
    class="flex items-center gap-1.5 rounded-lg mt-2"
    :class="[
      isMinimal ? 'bg-gray-100 border border-gray-300' : 'bg-amber-50 border border-amber-200',
      previewMode ? 'px-2 py-1' : 'px-3 py-2'
    ]"
  >
    <span class="flex-shrink-0">⚠️</span>
    <span :class="[previewMode ? 'text-xs' : 'text-sm', isMinimal ? 'text-gray-700' : 'text-amber-700']"
    >{{ step.tipText }}</span>
  </div>
</template>
