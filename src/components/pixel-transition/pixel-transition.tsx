'use client'

import { motion } from 'motion/react'
import { type ReactNode, useRef, useState } from 'react'
import { type CoverAnimation, TransitionProvider } from '../page-transition/page-transition'

const ROWS_RATIO = 0.6
const HINT_EVERY = 5
const FLASH = 0.2
const REDUCED_DURATION = 0.15

type Phase = 'idle' | 'in' | 'out' | 'reduced-in' | 'reduced-out'

type PixelTransitionProps = {
    children: ReactNode
    color?: string
    hint?: string
    pixels?: number
    duration?: number
}

const sequence = (cells: number) => Array.from({ length: cells }, (_, index) => index)

const shuffle = (cells: number) => {
    const order = sequence(cells)
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
    }
    return order
}

export function PixelTransition({
    children,
    color = 'black',
    hint = '#818181',
    pixels = 10,
    duration = 0.2,
}: PixelTransitionProps) {
    const [phase, setPhase] = useState<Phase>('idle')
    const pending = useRef(0)
    const resolveRef = useRef<(() => void) | null>(null)

    const columns = Math.round(pixels)
    const rows = Math.max(1, Math.round(pixels * ROWS_RATIO))
    const cells = columns * rows

    const [order, setOrder] = useState(() => sequence(cells))
    if (order.length !== cells) setOrder(sequence(cells))

    const settle = (next?: Phase) => () => {
        pending.current -= 1
        if (pending.current !== 0) return
        resolveRef.current?.()
        if (next) setPhase(next)
    }

    const coverIn: CoverAnimation = (reduced) =>
        new Promise((resolve) => {
            resolveRef.current = resolve
            pending.current = cells
            setOrder(shuffle(cells))
            setPhase(reduced ? 'reduced-in' : 'in')
        })

    const coverOut: CoverAnimation = (reduced) =>
        new Promise((resolve) => {
            resolveRef.current = resolve
            pending.current = cells
            setPhase(reduced ? 'reduced-out' : 'out')
        })

    const covering = phase === 'in' || phase === 'reduced-in'
    const reduced = phase === 'reduced-in' || phase === 'reduced-out'

    const cellAnimation = (slot: number) => {
        const delay = (slot / cells) * duration
        const flash = slot % HINT_EVERY === 0 && (phase === 'in' || phase === 'out')

        if (reduced) {
            return {
                animate: { opacity: covering ? 1 : 0, backgroundColor: color },
                transition: { duration: REDUCED_DURATION },
            }
        }

        if (covering && flash) {
            return {
                animate: { opacity: 1, backgroundColor: [hint, hint, color] },
                transition: {
                    opacity: { duration: 0, delay },
                    backgroundColor: { duration: FLASH, delay, times: [0, 0.995, 1] },
                },
            }
        }

        if (covering) {
            return {
                animate: { opacity: 1, backgroundColor: color },
                transition: {
                    opacity: { duration: 0, delay },
                    backgroundColor: { duration: 0 },
                },
            }
        }

        if (flash) {
            return {
                animate: { opacity: 0, backgroundColor: hint },
                transition: {
                    opacity: { duration: 0, delay: delay + FLASH },
                    backgroundColor: { duration: 0, delay },
                },
            }
        }

        return {
            animate: { opacity: 0, backgroundColor: color },
            transition: {
                opacity: { duration: 0, delay },
                backgroundColor: { duration: 0 },
            },
        }
    }

    return (
        <TransitionProvider coverIn={coverIn} coverOut={coverOut}>
            {children}

            <div
                aria-hidden
                className={`pointer-events-none fixed inset-0 z-70 grid ${phase === 'idle' ? 'invisible' : ''}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
            >
                {order.map((slot, index) => {
                    const { animate, transition } = cellAnimation(slot)

                    return (
                        <motion.div
                            key={index}
                            className='-m-px'
                            style={{ backgroundColor: color }}
                            animate={animate}
                            transition={transition}
                            onAnimationComplete={settle(
                                phase === 'out' || phase === 'reduced-out' ? 'idle' : undefined,
                            )}
                        />
                    )
                })}
            </div>
        </TransitionProvider>
    )
}
