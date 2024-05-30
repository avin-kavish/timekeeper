import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toMinSecs(timeLeft: number) {
  const mins = Math.floor(timeLeft / 1000 / 60)
    .toFixed(0)
    .padStart(2, '0')
  const secs = Math.round((timeLeft / 1000) % 60)
    .toFixed(0)
    .padStart(2, '0')

  return `${mins}:${secs}`
}
