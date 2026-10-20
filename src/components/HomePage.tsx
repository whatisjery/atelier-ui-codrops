'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { BASE_PATH, EXTERNAL_LINKS } from '@/constants'
import { useMouseCoords } from '@/hooks/use-mouse-coords'
import { useWebglEnabled } from '@/hooks/use-webgl-enabled'
import { FluidDistortion } from './fluid-distortion/fluid-distortion'
import { LensMedia } from './lens-media/lens-media'
import { LiquidMedia } from './liquid-media/liquid-media'
import PlusIcon from './PlusIcon'
import { PixelMedia } from './pixel-media/pixel-media'
import { TextRoll } from './text-roll/text-roll'
import { WebglImage } from './webgl-image/webgl-image'
import { WebglText } from './webgl-text/webgl-text'

const images = [
    {
        src: `${BASE_PATH}/img-1.webp`,
        Media: LiquidMedia,
        title: 'liquid media',
        slug: 'liquid-media',
    },
    {
        src: `${BASE_PATH}/img-2.webp`,
        Media: PixelMedia,
        title: 'pixel media',
        slug: 'pixel-media',
    },
    { src: `${BASE_PATH}/img-3.webp`, Media: LensMedia, title: 'lens media', slug: 'lens-media' },
]

export default function HomePage() {
    const footerRef = useRef<HTMLElement>(null)
    const webglEnabled = useWebglEnabled()
    const mouseCoords = useMouseCoords()
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)

    const currentLink = hoveredLink ?? EXTERNAL_LINKS[0].href

    const { scrollYProgress } = useScroll({
        target: footerRef,
        offset: ['start end', 'end end'],
    })

    const y = useTransform(scrollYProgress, [0, 1], ['-50%', '0%'])

    return (
        <>
            <div className='fixed inset-x-0 bottom-0 z-60 site-grid py-2 bg-background'>
                <PlusIcon className='col-start-3 self-end' />

                <div className='col-start-4'>
                    {EXTERNAL_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            target='_blank'
                            rel='noreferrer'
                            className='relative block w-fit md:w-auto hover:bg-foreground hover:text-background'
                            onPointerEnter={() => setHoveredLink(href)}
                            onPointerLeave={() => setHoveredLink(null)}
                        >
                            {currentLink === href && (
                                <span
                                    aria-hidden='true'
                                    className='absolute top-0 -left-5 rotate-90 text-foreground'
                                >
                                    &uarr;
                                </span>
                            )}
                            {label}
                        </a>
                    ))}
                </div>

                <PlusIcon className='col-start-6 md:col-start-5 justify-self-end self-end' />
            </div>

            {webglEnabled && (
                <FluidDistortion
                    blend={0}
                    intensity={0}
                    distortion={0.9}
                    force={1.7}
                    radius={0.3}
                    curl={5}
                    swirl={3}
                    densityDissipation={0.91}
                />
            )}

            <header className='lg:mt-[16vw] mt-[30vw]'>
                <div className='flex justify-end leading-none relative right-[5.5vw]'>
                    <WebglText
                        webglEnabled={webglEnabled}
                        zIndex={1}
                        render={
                            <span className='font-script absolute left-[8vw] z-1 text-[47vw] top-[-9vw]' />
                        }
                    >
                        C
                    </WebglText>
                    <WebglText
                        webglEnabled={webglEnabled}
                        render={<span className='tracking-[-0.08em] text-[18vw] relative' />}
                    >
                        ODROPS
                    </WebglText>
                </div>

                <div className='relative flex flex-col justify-between py-5 h-[60vw] text-background'>
                    <WebglImage
                        webglEnabled={webglEnabled}
                        src={`${BASE_PATH}/img-cover.webp`}
                        alt=''
                        className='absolute inset-0 size-full object-cover'
                    />

                    <div className='relative z-2 site-grid'>
                        <motion.p className='hidden md:block col-start-3 tabular-nums'>
                            {mouseCoords}
                        </motion.p>

                        <p className='hidden md:block col-start-4 col-span-3'>
                            scroll down( &nbsp;and&nbsp; )move your mouse.
                        </p>
                    </div>

                    <div className='relative z-2 site-grid items-end'>
                        <p>codrops demo</p>

                        <div className='hidden md:block col-start-4'>
                            <p>atelier ui (v1)</p>
                            <p>move your mouse around</p>
                        </div>

                        <p className='col-start-6 text-right'>&copy;2026</p>
                    </div>
                </div>

                <div className='site-grid mt-10 mb-40 md:mt-20 md:mb-80'>
                    <PlusIcon className='col-start-3' />
                    <PlusIcon className='col-start-6 md:col-start-5 justify-self-end' />
                </div>
            </header>

            <section className='site-grid'>
                <p>
                    example( &nbsp;<span className='text-foreground-light'>three perspectives</span>
                    &nbsp; )
                </p>

                <p className='col-span-6 sm:col-start-4 sm:col-span-3 indent-30 leading-[1em] whitespace-normal'>
                    Process is more important than outcome. When the outcome drives the process we
                    will only ever go to where we've already been. If process drives outcome we may
                    not know where we're going, but we will know we want to be there. &mdash; Bruce
                    Mau
                </p>

                {images.map(({ src, Media, title, slug }, i) => (
                    <a
                        key={src}
                        href={`https://www.atelier-ui.com/en/docs/components/cursor/${slug}`}
                        target='_blank'
                        rel='noreferrer'
                        className='group block col-span-6 md:col-span-2'
                    >
                        <Media
                            webglEnabled={webglEnabled}
                            src={src}
                            alt=''
                            postProcessing={false}
                            className='w-full'
                        />
                        <p className='group-hover:bg-foreground group-hover:text-background'>
                            <span className='text-foreground-light group-hover:text-background'>
                                image {i + 1}
                            </span>
                            &nbsp; {title}
                        </p>
                    </a>
                ))}
            </section>

            <section className='relative z-1 pt-10 h-90 md:pt-20 md:h-180 flex flex-col justify-between bg-background'>
                <div className='site-grid'>
                    <PlusIcon className='col-start-3' />
                    <PlusIcon className='col-start-6 md:col-start-5 justify-self-end' />
                </div>

                <div className='flex justify-between tracking-[-0.08em] leading-none text-[18vw]'>
                    <TextRoll stagger={0.05}>CODR</TextRoll>
                    <TextRoll stagger={0.05} render={<span className='relative -left-5' />}>
                        OPS
                    </TextRoll>
                </div>
            </section>

            <footer ref={footerRef} className='overflow-hidden'>
                <motion.div style={{ y }} className='relative py-5 min-h-[65vh] text-background'>
                    <LensMedia
                        size={0}
                        softness={1.3}
                        aberration={0.35}
                        dispersion={6}
                        refraction={0.38}
                        smoothing={9.3}
                        webglEnabled={webglEnabled}
                        postProcessing={false}
                        autoReflow
                        type='video'
                        src={`${BASE_PATH}/video-footer.mp4`}
                        className='absolute inset-0 size-full object-cover'
                    />

                    <div className='pointer-events-none relative site-grid'>
                        <p className='col-start-1 sm:col-start-4'>
                            code &amp; design by{' '}
                            <a
                                href='https://github.com/whatisjery'
                                target='_blank'
                                rel='noreferrer'
                                className='pointer-events-auto hover:bg-foreground hover:text-background'
                            >
                                jérémie nallet
                            </a>
                        </p>
                    </div>
                </motion.div>
            </footer>
        </>
    )
}
