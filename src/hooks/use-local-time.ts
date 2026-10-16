import { useSyncExternalStore } from 'react'

const subscribe = (listener: () => void) => {
    const id = setInterval(listener, 1000)
    return () => {
        clearInterval(id)
    }
}

const getTime = () => {
    const date = new Date()
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}${date.getHours() < 12 ? 'am' : 'pm'}`
}

export function useLocalTime() {
    return useSyncExternalStore(subscribe, getTime, () => '')
}
