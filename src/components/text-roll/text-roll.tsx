"use client"

import { animate, type Easing } from "motion"

const EASE: Easing = [0.84, 0, 0.22, 1]

import { type ComponentRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import { type RenderProp, useRender } from "../../hooks/use-render"
import { TextSplit } from "../text-split/text-split"

type AnimationProps = {
    axis: "x" | "y"
    direction: "forward" | "backward" | "random"
    stagger: number
    duration: number
    cycles: number
}

export type TextRollProps = {
    children: string
    mode?: "letters" | "group"
    playOnScroll?: boolean
    playOnMount?: boolean
    playOnHover?: boolean
    render?: RenderProp
} & Partial<AnimationProps>

type DisplaceLetterProps = {
    ref: React.Ref<DisplaceLetterHandle>
    char: string
    enableHover: boolean
    onComplete?: () => void
} & Omit<AnimationProps, "stagger">

export type DisplaceLetterHandle = {
    play: (delay?: number) => void
}

function getDir(dir: TextRollProps["direction"]): 1 | -1 {
    if (dir === "random") return Math.random() > 0.5 ? 1 : -1
    if (dir === "forward") return 1
    return -1
}

function DisplaceLetter({
    ref,
    char,
    enableHover,
    axis,
    direction,
    duration,
    cycles,
    onComplete,
}: DisplaceLetterProps) {
    const isPlayingRef = useRef(false)
    const clonedCharsRef = useRef<(ComponentRef<"span"> | null)[]>([])
    const currentCharRef = useRef<ComponentRef<"span"> | null>(null)

    const startPlay = useCallback(
        async (delay = 0) => {
            if (isPlayingRef.current) return
            isPlayingRef.current = true

            const dir = getDir(direction)

            clonedCharsRef.current.forEach((clone, i) => {
                if (!clone) return
                if (axis === "y") {
                    clone.style.top = `${(i + 1) * dir * -100}%`
                    clone.style.left = "0"
                } else {
                    clone.style.left = `${(i + 1) * dir * -100}%`
                    clone.style.top = "0"
                }
            })

            await animate(
                [currentCharRef.current, ...clonedCharsRef.current.filter((span) => span !== null)],
                axis === "y"
                    ? { y: [`${dir * cycles * 100}%`, "0%"] }
                    : { x: [`${dir * cycles * 100}%`, "0%"] },
                {
                    duration,
                    delay,
                    ease: EASE,
                },
            )
            isPlayingRef.current = false
            onComplete?.()
        },
        [axis, direction, duration, cycles, onComplete],
    )

    useImperativeHandle(ref, () => ({ play: startPlay }), [startPlay])

    const handleHover = useCallback(() => {
        startPlay()
    }, [startPlay])

    return (
        <span
            suppressHydrationWarning
            onMouseEnter={enableHover ? handleHover : undefined}
            className={`${axis === "y" ? "overflow-y-clip" : "overflow-x-clip"} inline-block relative whitespace-pre`}
        >
            {Array.from({ length: cycles }, (_, i) => (
                <span
                    key={i}
                    ref={(clone) => {
                        clonedCharsRef.current[i] = clone
                    }}
                    aria-hidden={true}
                    className="absolute"
                    style={
                        axis === "y"
                            ? { top: `${(i + 1) * -100}%`, left: 0 }
                            : { left: `${(i + 1) * -100}%`, top: 0 }
                    }
                >
                    {char}
                </span>
            ))}

            <span ref={currentCharRef} className="block">
                {char}
            </span>
        </span>
    )
}

export function TextRoll({
    children,
    axis = "y",
    mode = "letters",
    direction = "random",
    playOnScroll = true,
    playOnMount = true,
    playOnHover = true,
    stagger = 0,
    duration = 0.8,
    cycles = 2,
    render,
}: TextRollProps) {
    const containerRef = useRef<ComponentRef<"span">>(null)
    const letterRefs = useRef<(DisplaceLetterHandle | null)[]>([])
    const isPlayingRef = useRef(false)
    const completedRef = useRef(0)

    const staggerRef = useRef(stagger)
    useEffect(() => {
        staggerRef.current = stagger
    }, [stagger])

    const handleLetterComplete = useCallback(() => {
        if (!isPlayingRef.current) return
        completedRef.current++
        if (completedRef.current >= letterRefs.current.length) {
            isPlayingRef.current = false
            completedRef.current = 0
        }
    }, [])

    const triggerPlay = useCallback(() => {
        if (isPlayingRef.current) return
        isPlayingRef.current = true
        completedRef.current = 0

        letterRefs.current.forEach((letter, index) => {
            letter?.play(staggerRef.current * index)
        })
    }, [])

    useEffect(() => {
        if (playOnMount) triggerPlay()
    }, [playOnMount, triggerPlay])

    useEffect(() => {
        if (!playOnScroll) return
        const container = containerRef.current
        if (!container) return
        let isFirstRender = true
        const obs = new IntersectionObserver(([entry]) => {
            if (isFirstRender) {
                isFirstRender = false
                return
            }
            if (entry.isIntersecting) triggerPlay()
        })
        obs.observe(container)
        return () => obs.disconnect()
    }, [playOnScroll, triggerPlay])

    return useRender({
        render,
        defaultElement: <span />,
        props: {
            ref: containerRef,
            onMouseEnter: playOnHover && mode === "group" ? triggerPlay : undefined,
            children: (
                <TextSplit
                    showMask={false}
                    splitBy="letters"
                    renderItems={(char, index) => (
                        <DisplaceLetter
                            ref={(letter) => {
                                letterRefs.current[index] = letter
                            }}
                            char={char}
                            enableHover={playOnHover && mode === "letters"}
                            direction={direction}
                            axis={axis}
                            duration={duration}
                            cycles={cycles}
                            onComplete={handleLetterComplete}
                        />
                    )}
                >
                    {children}
                </TextSplit>
            ),
        },
    })
}
