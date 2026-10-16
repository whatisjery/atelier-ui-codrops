'use client'

import { useProgress } from '@react-three/drei'
import { useState } from 'react'

export default function Preloader() {
    const { active, progress, total } = useProgress()
    const [loaded, setLoaded] = useState(false)

    if (total > 0 && !active && !loaded) setLoaded(true)

    return (
        <div
            className={`fixed inset-0 z-80 flex items-center justify-center bg-background transition-opacity delay-700 duration-700 ${loaded ? 'pointer-events-none opacity-0' : ''}`}
        >
            {Math.round(progress)}%
        </div>
    )
}
