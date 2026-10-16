import { useSyncExternalStore } from 'react'

let enabled = true
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

export function toggleWebgl() {
    enabled = !enabled
    for (const listener of listeners) {
        listener()
    }
}

export function useWebglEnabled() {
    return useSyncExternalStore(subscribe, () => enabled, () => true)
}
