import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Interval {
  start: number
  end: number | null
  type: 'work' | 'rest'
  size: number
}

export type NewInterval = Pick<Interval, 'size' | 'type'>

export interface TimeState {
  currentInterval: Interval | null
  startInterval: (interval: NewInterval) => void
  stopTiming: () => void
}

export const useTimeStore = create<TimeState>()(
  persist(
    immer((set, get) => ({
      currentInterval: null,
      startInterval(values) {
        set((s) => {
          if (s.currentInterval) s.currentInterval.end = Date.now()
          s.currentInterval = { ...values, start: Date.now(), end: null }
        })
      },
      stopTiming() {
        set((s) => {
          if (s.currentInterval) s.currentInterval.end = Date.now()
          s.currentInterval = null
        })
      },
    })),
    {
      name: 'time-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
