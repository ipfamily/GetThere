// 交通方式类型
export type TransportType =
  | 'train'      // 高铁/普通火车
  | 'subway'     // 地铁
  | 'bus'        // 公交车
  | 'taxi'       // 出租车/网约车
  | 'walk'       // 步行
  | 'plane'      // 飞机
  | 'ferry'      // 轮船/渡轮
  | 'transfer'   // 换乘提示

// 问路卡主题
export type CardTheme = 'blue' | 'orange' | 'green' | 'pink' | 'minimal'

// 步骤布局风格
export type CardLayout = 'ticket' | 'timeline' | 'card'

// 行程步骤
export interface JourneyStep {
  id: string
  transport: TransportType
  title: string        // 车次/航班号/线路 如「G1234」
  description: string  // 补充说明
  // 通用字段
  detail1?: string     // 关键信息1
  detail2?: string     // 关键信息2
  tipText?: string     // 特别提示
  // 车票详细信息（高铁/火车/飞机等）
  fromStation?: string   // 出发站
  toStation?: string     // 到达站
  departTime?: string    // 出发时间
  arriveTime?: string    // 到达时间
  gate?: string          // 检票口/登机口
  seatInfo?: string      // 座位信息 如「5车12C」
}

// 联系人
export interface ContactPerson {
  id: string
  name: string
  relation: string  // 称呼/关系，如「女儿」「儿子」
  phone: string
}

// 问路卡
export interface TravelCard {
  id: string
  title: string            // 卡片标题，如「爷爷去天津的出行指南」
  passengerName: string    // 出行人姓名
  date: string             // 出行日期
  departure: string        // 出发地
  destination: string      // 目的地
  steps: JourneyStep[]
  contacts: ContactPerson[]
  tips: string             // 自定义重要提示
  theme: CardTheme
  cardLayout?: CardLayout  // 步骤布局风格，默认 'ticket'
  cardWidthPx?: number     // 卡片宽度（像素），默认 760
  createdAt: number
}

// 交通方式配置
export interface TransportConfig {
  label: string
  emoji: string
  bgColor: string
  textColor: string
  borderColor: string
  accentBg: string
}
