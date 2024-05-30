'use client'
import { Button } from '@/components/ui/button'
import { NewInterval, useTimeStore } from '@/state/time'
import { useEffect, useRef, useState } from 'react'
import { toMinSecs } from '@/lib/utils'

const WORK_LENGTH = 25 * 60 * 1_000

const REST_LENGTH = 10 * 60 * 1_000

export default function Home() {
  const { currentInterval, startInterval, stopTiming } = useTimeStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const intervalRef = useRef(0)
  const track1 = useRef<HTMLAudioElement>()

  useEffect(() => {
    track1.current = new Audio()
    track1.current.autoplay = false
    track1.current.src = '/anthem-of-victory-111206.mp3'

    return () => {
      track1.current?.pause()
      track1.current = undefined
    }
  }, [])

  function switchInterval() {
    clearInterval(intervalRef.current)
    let newInterval = (
      currentInterval!.type === 'work'
        ? {
            type: 'rest',
            size: REST_LENGTH,
          }
        : { type: 'work', size: WORK_LENGTH }
    ) satisfies NewInterval
    startInterval(newInterval)
    setTimeLeft(newInterval.size)
  }

  useEffect(() => {
    console.log('called')
    if (currentInterval) {
      intervalRef.current = setInterval(() => {
        const tl = currentInterval
          ? currentInterval.start + currentInterval.size - Date.now()
          : 0
        if (tl < 0) {
          switchInterval()

          track1.current?.pause()
          track1.current!.currentTime = 0
          track1.current?.play()
        } else {
          setTimeLeft(tl)
        }
      }, 1_000) as unknown as number
    } else {
      clearInterval(intervalRef.current)
      setTimeLeft(0)
    }
  }, [currentInterval])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-10 md:p-24">
      <div className="z-10 w-full max-w-5xl font-mono">
        <div className="md:flex items-center gap-4 mb-4">
          <h2 className="text-4xl font-bold mb-4 lg:mb-0">Timekeeper</h2>
          <div className="flex-1"></div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => track1.current!.pause()}>
              Mute
            </Button>
            {currentInterval && (
              <Button variant="outline" onClick={switchInterval}>
                Switch
              </Button>
            )}
            <Button
              variant="default"
              onClick={() => {
                if (currentInterval) {
                  clearInterval(intervalRef.current)
                  stopTiming()
                } else {
                  startInterval({
                    type: 'work',
                    size: WORK_LENGTH,
                  })
                  setTimeLeft(WORK_LENGTH)
                }
              }}
            >
              {currentInterval ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
        <div className="mt-20 lg:flex flex-col items-center">
          <div>
            <div className="text-6xl font-semibold">
              {!currentInterval
                ? 'Work'
                : currentInterval.type === 'work'
                  ? 'Work'
                  : 'Rest'}
            </div>
            <div className="text-[8rem] lg:text-[12rem] font-bold">
              {toMinSecs(currentInterval ? timeLeft : WORK_LENGTH)}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
