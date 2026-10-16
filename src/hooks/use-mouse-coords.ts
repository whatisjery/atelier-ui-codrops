import { useMotionValue } from 'motion/react'
import { useEffect } from 'react'

const format = (x: number, y: number) => `${x.toFixed(3)} ${y.toFixed(3)}`

export function useMouseCoords() {
    const coords = useMotionValue(format(0, 0))

    useEffect(() => {
        const onMove = (event: PointerEvent) => {
            coords.set(format(event.clientX / innerWidth, event.clientY / innerHeight))
        }

        window.addEventListener('pointermove', onMove)
        return () => {
            window.removeEventListener('pointermove', onMove)
        }
    }, [coords])

    return coords
}
