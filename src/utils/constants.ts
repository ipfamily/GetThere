import type { TransportType, TransportConfig, CardTheme, CardLayout } from '@/types'

export const TRANSPORT_CONFIGS: Record<TransportType, TransportConfig> = {
  train: {
    label: '高铁 / 火车',
    emoji: '🚄',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    accentBg: 'bg-blue-600',
  },
  subway: {
    label: '地铁',
    emoji: '🚇',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    accentBg: 'bg-purple-600',
  },
  bus: {
    label: '公交车',
    emoji: '🚌',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    accentBg: 'bg-green-600',
  },
  taxi: {
    label: '出租车 / 网约车',
    emoji: '🚕',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    accentBg: 'bg-yellow-500',
  },
  walk: {
    label: '步行',
    emoji: '🚶',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    accentBg: 'bg-orange-500',
  },
  plane: {
    label: '飞机',
    emoji: '✈️',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-300',
    accentBg: 'bg-sky-600',
  },
  ferry: {
    label: '轮船 / 渡轮',
    emoji: '🚢',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-300',
    accentBg: 'bg-teal-600',
  },
  transfer: {
    label: '换乘 / 提示',
    emoji: '🔄',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    accentBg: 'bg-gray-500',
  },
}

export const THEME_CONFIGS: Record<CardTheme, {
  label: string
  headerBg: string
  headerText: string
  accent: string
  accentText: string
  badge: string
  icon: string
  isMinimal?: boolean
}> = {
  blue: {
    label: '科技蓝',
    headerBg: 'from-blue-600 to-blue-800',
    headerText: 'text-white',
    accent: 'bg-blue-600',
    accentText: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '',
  },
  orange: {
    label: '温暖橙',
    headerBg: 'from-orange-500 to-amber-600',
    headerText: 'text-white',
    accent: 'bg-orange-500',
    accentText: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '',
  },
  green: {
    label: '清新绿',
    headerBg: 'from-emerald-500 to-teal-600',
    headerText: 'text-white',
    accent: 'bg-emerald-500',
    accentText: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '',
  },
  pink: {
    label: '童趣粉',
    headerBg: 'from-pink-400 to-rose-500',
    headerText: 'text-white',
    accent: 'bg-pink-500',
    accentText: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '',
  },
  minimal: {
    label: '经典黑',
    headerBg: 'from-gray-100 to-gray-200',
    headerText: 'text-gray-900',
    accent: 'bg-gray-900',
    accentText: 'text-gray-900',
    badge: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '',
    isMinimal: true,
  },
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export const LAYOUT_CONFIGS: Record<CardLayout, { label: string; icon: string; desc: string }> = {
  ticket: { label: '撕票线', icon: '🎟️', desc: '彩色侧边 撕票纹理' },
  timeline: { label: '时间轴', icon: '🕐', desc: '圆点连线 序号清晰' },
  card: { label: '名片卡', icon: '🃏', desc: '彩色页头 独立卡片' },
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}
