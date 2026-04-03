<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import { TRANSPORT_CONFIGS, THEME_CONFIGS, LAYOUT_CONFIGS, generateId } from '@/utils/constants'
import type { TravelCard, CardTheme, CardLayout, TransportType } from '@/types'
import CardPreview from '@/components/CardPreview.vue'

const router = useRouter()
const route = useRoute()
const store = useCardStore()

const isEdit = computed(() => !!route.params.id)

function makeDefaultCard(): TravelCard {
  return {
    id: generateId(),
    title: '',
    passengerName: '',
    date: new Date().toISOString().slice(0, 10),
    departure: '',
    destination: '',
    steps: [],
    contacts: [],
    tips: '',
    theme: 'blue',
    cardLayout: 'ticket',
    cardWidthPx: 920,
    createdAt: Date.now(),
  }
}

const card = ref<TravelCard>(makeDefaultCard())

// 右侧预览容器 + ResizeObserver 计算缩放比
const previewContainerRef = ref<HTMLElement | null>(null)
const previewContainerWidth = ref(600)
let ro: ResizeObserver | null = null

const previewZoom = computed(() => {
  return Math.min(1, previewContainerWidth.value / (card.value.cardWidthPx ?? 920))
})

onMounted(async () => {
  if (isEdit.value) {
    const existing = store.getCardById(route.params.id as string)
    if (existing) {
      card.value = JSON.parse(JSON.stringify(existing))
    }
  }
  // 等 DOM 渲染后再绑定 ResizeObserver
  await nextTick()
  if (previewContainerRef.value) {
    ro = new ResizeObserver(entries => {
      previewContainerWidth.value = entries[0].contentRect.width
    })
    ro.observe(previewContainerRef.value)
    previewContainerWidth.value = previewContainerRef.value.offsetWidth
  }
})

onUnmounted(() => {
  ro?.disconnect()
})

// 步骤管理
function addStep() {
  card.value.steps.push({
    id: generateId(),
    transport: 'train',
    title: '',
    description: '',
    detail1: '',
    detail2: '',
    tipText: '',
    fromStation: '',
    toStation: '',
    departTime: '',
    arriveTime: '',
    gate: '',
    seatInfo: '',
  })
}

function removeStep(index: number) {
  card.value.steps.splice(index, 1)
}

function moveStep(index: number, dir: -1 | 1) {
  const target = index + dir
  if (target < 0 || target >= card.value.steps.length) return
  const tmp = card.value.steps[index]
  card.value.steps[index] = card.value.steps[target]
  card.value.steps[target] = tmp
}

// 联系人管理
function addContact() {
  card.value.contacts.push({
    id: generateId(),
    name: '',
    relation: '',
    phone: '',
  })
}

function removeContact(index: number) {
  card.value.contacts.splice(index, 1)
}

// 保存
function saveCard() {
  if (card.value.steps.length === 0) {
    alert('请至少添加一个行程步骤')
    return
  }

  // 标题允许留空，保存时自动回填默认标题，避免列表和预览出现空白。
  if (!card.value.title.trim()) {
    card.value.title = '出行卡片'
  }

  if (isEdit.value) {
    store.updateCard(card.value)
  } else {
    store.addCard(card.value)
  }
  router.push(`/preview/${card.value.id}`)
}

const transportTypes = Object.entries(TRANSPORT_CONFIGS) as [TransportType, typeof TRANSPORT_CONFIGS[TransportType]][]
const themes = Object.entries(THEME_CONFIGS) as [CardTheme, typeof THEME_CONFIGS[CardTheme]][]
const layouts = Object.entries(LAYOUT_CONFIGS) as [CardLayout, typeof LAYOUT_CONFIGS[CardLayout]][]

// 是否为需要显示详细票务信息的交通方式
function hasTicketDetail(t: TransportType): boolean {
  return ['train', 'plane', 'ferry'].includes(t)
}

function getStepPlaceholder(transport: TransportType): { title: string; desc: string; d1: string; d2: string } {
  const map: Record<TransportType, { title: string; desc: string; d1: string; d2: string }> = {
    train: { title: '车次号，如 G1234', desc: '如：北京西 → 天津南', d1: '', d2: '' },
    subway: { title: '如：乘坐1号线地铁', desc: '如：在西单站上车，在国贸站下车', d1: '方向：四惠方向', d2: '乘坐 5 站到达' },
    bus: { title: '如：乘坐 659 路公交', desc: '如：在火车站上车，在XX站下车', d1: '方向：终点站方向', d2: '乘坐约 4 站，约 20 分钟' },
    taxi: { title: '如：乘坐出租车/滴滴', desc: '如：在酒店门口打车，告司机目的地', d1: '目的地：XX 医院', d2: '预计费用约 30 元' },
    walk: { title: '如：步行前往', desc: '如：出站后直走200米，看到红色门面右转', d1: '距离约 300 米', d2: '约步行 5 分钟' },
    plane: { title: '航班号，如 MU5678', desc: '如：首都机场 T3 航站楼出发', d1: '', d2: '' },
    ferry: { title: '船次/轮船号', desc: '如：在XX码头乘坐，在YY码头下船', d1: '', d2: '' },
    transfer: { title: '如：换乘提示', desc: '如：出地铁后走到3号出口，换乘公交', d1: '', d2: '' },
  }
  return map[transport]
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="text-slate-500 hover:text-slate-700 transition-colors">
          返回首页
        </RouterLink>
        <span class="text-slate-300">|</span>
        <h1 class="font-bold text-slate-800">{{ isEdit ? '编辑卡片' : '新建卡片' }}</h1>
        <div class="ml-auto flex gap-2">
          <button
            @click="saveCard"
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            保存去下载
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-screen-xl mx-auto px-4 py-6">
      <div class="flex flex-col xl:flex-row gap-6 items-start">

        <!-- 左侧：编辑表单（固定宽度） -->
        <div class="xl:w-[460px] flex-shrink-0 space-y-5 w-full">

          <!-- 基本信息 -->
          <section class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 class="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span class="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              基本信息
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-600 mb-1">卡片标题（可选）</label>
                <input
                  v-model="card.title"
                  type="text"
                  placeholder="请帮帮我，谢谢"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">出行人姓名（可选）</label>
                <input
                  v-model="card.passengerName"
                  type="text"
                  placeholder="如：李爷爷 / 小明"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">出行日期</label>
                <input
                  v-model="card.date"
                  type="date"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">出发地</label>
                <input
                  v-model="card.departure"
                  type="text"
                  placeholder="如：北京西站"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">目的地</label>
                <input
                  v-model="card.destination"
                  type="text"
                  placeholder="如：天津南站"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
          </section>

          <!-- 卡片主题 -->
          <section class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 class="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span class="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              卡片风格
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                v-for="([key, cfg]) in themes"
                :key="key"
                @click="card.theme = key"
                :class="[
                  'rounded-xl p-3 border-2 transition-all text-center',
                  card.theme === key ? 'border-blue-500 shadow-md scale-105' : 'border-slate-200 hover:border-blue-300'
                ]"
              >
                <div
                  :class="[
                    'rounded-lg h-8 mb-2 flex items-center justify-center',
                    cfg.isMinimal
                      ? 'bg-white border-2 border-gray-800'
                      : `bg-gradient-to-r ${cfg.headerBg}`
                  ]"
                >
                  <span class="text-lg">{{ cfg.icon }}</span>
                </div>
                <span class="text-xs font-medium text-slate-700">{{ cfg.label }}</span>
              </button>
            </div>

            <!-- 布局样式 -->
            <div class="mt-4 pt-4 border-t border-slate-100">
              <p class="text-xs font-medium text-slate-500 mb-2">步骤布局</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="([key, cfg]) in layouts"
                  :key="key"
                  @click="card.cardLayout = key"
                  :class="[
                    'rounded-xl p-3 border-2 transition-all text-center',
                    card.cardLayout === key ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'
                  ]"
                >
                  <div class="text-xl mb-1">{{ cfg.icon }}</div>
                  <div class="text-xs font-semibold text-slate-700">{{ cfg.label }}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">{{ cfg.desc }}</div>
                </button>
              </div>
            </div>
          </section>

          <!-- 行程步骤 -->
          <section class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-bold text-slate-700 flex items-center gap-2">
                <span class="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                行程步骤
              </h2>
              <button
                @click="addStep"
                class="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                + 添加步骤
              </button>
            </div>

            <div v-if="card.steps.length === 0" class="text-center py-8 text-slate-400 text-sm">
              <div class="text-4xl mb-2">🚶</div>
              点击「添加步骤」开始规划行程
            </div>

            <div class="space-y-4">
              <div
                v-for="(step, idx) in card.steps"
                :key="step.id"
                class="border border-slate-200 rounded-xl p-4 relative"
                :class="TRANSPORT_CONFIGS[step.transport].bgColor"
              >
                <!-- 步骤头部 -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm border border-slate-200">
                    {{ idx + 1 }}
                  </span>
                  <select
                    v-model="step.transport"
                    class="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  >
                    <option v-for="([type, cfg]) in transportTypes" :key="type" :value="type">
                      {{ cfg.emoji }} {{ cfg.label }}
                    </option>
                  </select>
                  <div class="ml-auto flex gap-1">
                    <button @click="moveStep(idx, -1)" :disabled="idx === 0" class="w-7 h-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors text-xs border border-slate-200 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center">↑</button>
                    <button @click="moveStep(idx, 1)" :disabled="idx === card.steps.length - 1" class="w-7 h-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors text-xs border border-slate-200 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center">↓</button>
                    <button @click="removeStep(idx)" class="w-7 h-7 text-slate-400 hover:text-red-500 transition-colors text-sm border border-slate-200 rounded-lg bg-white hover:bg-red-50 flex items-center justify-center">×</button>
                  </div>
                </div>

                <!-- 步骤内容 -->
                <div class="space-y-2">
                  <input
                    v-model="step.title"
                    type="text"
                    :placeholder="getStepPlaceholder(step.transport).title"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all font-semibold"
                  />

                  <!-- 车票详细信息（高铁/飞机/轮船） -->
                  <div v-if="hasTicketDetail(step.transport)" class="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                    <div class="text-xs text-slate-500 font-medium mb-1">🎫 票务信息</div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-xs text-slate-400">出发站</label>
                        <input v-model="step.fromStation" type="text" placeholder="如：北京西" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                      <div>
                        <label class="text-xs text-slate-400">到达站</label>
                        <input v-model="step.toStation" type="text" placeholder="如：天津南" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-xs text-slate-400">出发时间</label>
                        <input v-model="step.departTime" type="text" placeholder="如：09:30" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                      <div>
                        <label class="text-xs text-slate-400">到达时间</label>
                        <input v-model="step.arriveTime" type="text" placeholder="如：10:30" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-xs text-slate-400">{{ step.transport === 'plane' ? '登机口' : '检票口' }}</label>
                        <input v-model="step.gate" type="text" :placeholder="step.transport === 'plane' ? '如：B312' : '如：A12'" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                      <div>
                        <label class="text-xs text-slate-400">座位信息</label>
                        <input v-model="step.seatInfo" type="text" placeholder="如：5车厢 12C 座" class="w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                      </div>
                    </div>
                  </div>

                  <!-- 非车票类型：通用字段 -->
                  <template v-if="!hasTicketDetail(step.transport)">
                    <textarea
                      v-model="step.description"
                      :placeholder="getStepPlaceholder(step.transport).desc"
                      rows="2"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
                    />
                    <div class="grid grid-cols-2 gap-2">
                      <input
                        v-model="step.detail1"
                        type="text"
                        :placeholder="getStepPlaceholder(step.transport).d1 || '关键信息1（可选）'"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                      <input
                        v-model="step.detail2"
                        type="text"
                        :placeholder="getStepPlaceholder(step.transport).d2 || '关键信息2（可选）'"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </template>

                  <!-- 描述（车票类型也可填写补充说明） -->
                  <textarea
                    v-if="hasTicketDetail(step.transport)"
                    v-model="step.description"
                    placeholder="补充说明（可选），如：到了出站口后有人接"
                    rows="1"
                    class="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
                  />

                  <input
                    v-model="step.tipText"
                    type="text"
                    placeholder="⚠️ 特别提示（可选）"
                    class="w-full border border-amber-200 rounded-lg px-3 py-1.5 text-xs bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all placeholder-amber-400"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- 紧急联系人 -->
          <section class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-bold text-slate-700 flex items-center gap-2">
                <span class="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                紧急联系人
              </h2>
              <button
                @click="addContact"
                class="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                + 添加联系人
              </button>
            </div>

            <div v-if="card.contacts.length === 0" class="text-center py-6 text-slate-400 text-sm">
              <div class="text-3xl mb-1">📞</div>
              添加联系人，迷路时可寻求帮助
            </div>

            <div class="space-y-3">
              <div
                v-for="(contact, idx) in card.contacts"
                :key="contact.id"
                class="flex gap-2 items-center"
              >
                <input v-model="contact.name" type="text" placeholder="称呼" class="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                <input v-model="contact.phone" type="tel" placeholder="电话号码" class="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
                <button @click="removeContact(idx)" class="text-slate-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 border border-slate-200 text-sm">×</button>
              </div>
            </div>
          </section>

          <!-- 急救信息 -->
          <section class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 class="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span class="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">5</span>
              急救信息（可选）
            </h2>
            <p class="text-xs text-slate-400 mb-2">若出行人有特殊病史、过敏或用药，路人和急救人员可以即时获取关键信息。</p>
            <textarea
              v-model="card.tips"
              rows="3"
              placeholder="如：血型A型 · 高血压（服用氨氯地平）· 青霉素过敏 · 骨质疏松，摔倒请勿搬动"
              class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all resize-none"
            />
          </section>

          <!-- 保存按钮 -->
          <button
            @click="saveCard"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-base transition-colors shadow-lg"
          >
            保存卡片
          </button>
        </div>

        <!-- 右侧：实时预览（所见即所得，缩放至容器宽度） -->
        <div class="flex-1 min-w-0 sticky top-20 self-start">
          <div class="bg-slate-100 rounded-2xl p-4">

            <!-- 工具栏：宽度调节 -->
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs text-slate-500 whitespace-nowrap font-medium">卡片宽度</span>
              <input
                type="range"
                v-model.number="card.cardWidthPx"
                min="500"
                max="840"
                step="20"
                class="flex-1 accent-blue-600 cursor-pointer"
              />
              <span class="text-xs font-mono text-slate-600 w-16 text-right flex-shrink-0">{{ card.cardWidthPx ?? 760 }} px</span>
            </div>

            <!-- 预览区：用 zoom 等比缩放，所见即所得 -->
            <div ref="previewContainerRef" class="w-full overflow-hidden rounded-xl">
              <div :style="{ zoom: previewZoom, display: 'block' }">
                <CardPreview :card="card" :card-width-px="card.cardWidthPx ?? 920" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
