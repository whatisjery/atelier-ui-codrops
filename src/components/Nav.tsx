'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { PAGE_LINKS } from '@/constants'
import { useLocalTime } from '@/hooks/use-local-time'
import { toggleWebgl, useWebglEnabled } from '@/hooks/use-webgl-enabled'
import PlusIcon from './PlusIcon'
import { TransitionLink } from './page-transition/page-transition'

export default function Nav() {
    const [hovered, setHovered] = useState<string | null>(null)

    const pathname = usePathname().replace(/(.)\/+$/, '$1')
    const webglEnabled = useWebglEnabled()
    const time = useLocalTime()

    const current = hovered ?? pathname
    const isGallery = pathname === '/gallery'
    const webglOn = webglEnabled || isGallery

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-60 site-grid pt-2 ${isGallery ? 'bg-linear-to-b from-background to-transparent pb-15' : 'pb-2'}`}
        >
            <div className='flex gap-2 self-start'>
                <TransitionLink href='/' className='hover:bg-foreground hover:text-background'>
                    codrops demo
                </TransitionLink>

                <button
                    type='button'
                    onClick={toggleWebgl}
                    disabled={isGallery}
                    className={`hidden md:block cursor-pointer disabled:cursor-not-allowed uppercase ${webglOn ? 'text-foreground-light enabled:hover:text-foreground' : 'text-red-600'}`}
                >
                    webgl {webglOn ? 'on' : 'off'}
                </button>
            </div>

            <PlusIcon className='col-start-3' />

            <div className='col-start-4'>
                {PAGE_LINKS.map(({ href, label }) => (
                    <TransitionLink
                        key={href}
                        href={href}
                        className='relative block hover:bg-foreground hover:text-background'
                        onPointerEnter={() => setHovered(href)}
                        onPointerLeave={() => setHovered(null)}
                    >
                        {current === href && (
                            <span aria-hidden='true' className='absolute top-0 -left-5 rotate-90 text-foreground'>
                                &uarr;
                            </span>
                        )}
                        {label}
                    </TransitionLink>
                ))}
            </div>

            <PlusIcon className='col-start-6 md:col-start-5 justify-self-end' />

            <div className='hidden md:block col-start-6 text-right'>
                <p>atelier ui notice &copy;2026</p>
                <p>{time}</p>
            </div>
        </nav>
    )
}
