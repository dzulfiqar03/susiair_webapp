export interface Point { date: string; hours: number; rollingSum: number; isFuture: boolean; isToday: boolean }
export interface LimitCardData { key: string; label: string; windowDays: number; limit: number; hours: number; percent: number; exceeded: boolean }
export interface Summary { range: string; windowDays: number; limit: number; yMax: number; today: string; points: Point[]; cards: LimitCardData[] }
export interface Pilot { name: string; totalFlightHours: number; avatarUrl: string }
export interface Doc { id: string; label: string; expiryDate: string; daysRemaining: number; status: 'safe' | 'soon' | 'expired' }
export interface LegendItem { code: string; label: string; color: string }
export interface ScheduleItem { id: string; duty_date: string; base_name: string; base_color: string; duty_type: string; count_schedules: number; count_logbooks: number; remaining: number; completed: boolean }
export type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y'
