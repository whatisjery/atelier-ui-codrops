"use client"

import { useProgress, useTexture } from "@react-three/drei"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    type ComponentProps,
    type ComponentType,
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react"

export type CoverAnimation = (reduced: boolean) => Promise<void>
type PageComponent = ComponentType<{ children: ReactNode }>
type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
    href: string
    preload?: string[]
}

const trimSlash = (path: string) => path.replace(/(.)\/+$/, "$1")

const NavigateContext = createContext<((href: string) => void) | null>(null)
const PageContext = createContext<PageComponent | null>(null)

type TransitionProviderProps = {
    children: ReactNode
    coverIn: CoverAnimation
    coverOut: CoverAnimation
    page?: PageComponent
}

export function TransitionProvider({ children, coverIn, coverOut, page }: TransitionProviderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const busy = useRef(false)
    const reduced = useRef(false)
    const animations = useRef({ coverIn, coverOut })
    animations.current = { coverIn, coverOut }
    const [covered, setCovered] = useState(false)
    const [isPending, startTransition] = useTransition()
    const loaderActive = useProgress((state) => state.active)

    const locationPath = useRef("")
    useEffect(() => {
        locationPath.current = window.location.pathname
    }, [pathname])

    const navigate = useCallback(
        async (href: string) => {
            if (busy.current) return
            const target = new URL(href, `http://n${pathname}`).pathname
            if (trimSlash(target) === trimSlash(pathname)) return

            busy.current = true
            router.prefetch(href)
            document.documentElement.setAttribute("data-atelier-transitioning", "")
            reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            await animations.current.coverIn(reduced.current)
            startTransition(() => router.push(href))
            setCovered(true)
        },
        [router, pathname],
    )

    useEffect(() => {
        const onPopState = (event: PopStateEvent) => {
            if (busy.current) return
            if (window.location.pathname === locationPath.current) return

            event.stopImmediatePropagation()
            busy.current = true
            document.documentElement.setAttribute("data-atelier-transitioning", "")
            const href = window.location.href
            reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            animations.current.coverIn(reduced.current).then(() => {
                startTransition(() => router.replace(href, { scroll: false }))
                setCovered(true)
            })
        }

        window.addEventListener("popstate", onPopState, { capture: true })
        return () => {
            window.removeEventListener("popstate", onPopState, { capture: true })
            document.documentElement.removeAttribute("data-atelier-transitioning")
        }
    }, [router])

    /*
     * After the route commits, WebGL planes mount into the canvas a frame
     * later, so asset loading has not started yet when this effect first
     * runs. The reveal waits two frames and re-checks the live store: if
     * loading began, the effect re-runs when it ends.
     */
    useEffect(() => {
        if (!covered || isPending || loaderActive) return

        let cancelled = false
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (cancelled || useProgress.getState().active) return
                setCovered(false)
                animations.current.coverOut(reduced.current).then(() => {
                    document.documentElement.removeAttribute("data-atelier-transitioning")
                    busy.current = false
                })
            })
        })

        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
        }
    }, [covered, isPending, loaderActive])

    return (
        <NavigateContext.Provider value={navigate}>
            <PageContext.Provider value={page ?? null}>{children}</PageContext.Provider>
        </NavigateContext.Provider>
    )
}

export function TransitionPage({ children }: { children: ReactNode }) {
    const Page = useContext(PageContext)
    return Page ? <Page>{children}</Page> : children
}

export function TransitionLink({ href, preload, ...rest }: TransitionLinkProps) {
    const navigate = useContext(NavigateContext)

    const preloadAssets = () => {
        for (const url of preload ?? []) useTexture.preload(url)
    }

    return (
        <Link
            {...rest}
            href={href}
            onPointerEnter={(event) => {
                rest.onPointerEnter?.(event)
                preloadAssets()
            }}
            onNavigate={(event) => {
                if (!navigate) return
                event.preventDefault()
                preloadAssets()
                navigate(href)
            }}
        />
    )
}
