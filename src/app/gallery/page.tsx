import { SphereGallery } from '@/components/sphere-gallery/sphere-gallery'
import { BASE_PATH } from '@/constants'

const items = [
    { src: `${BASE_PATH}/img-1.webp`, alt: 'image with natural colors.' },
    { src: `${BASE_PATH}/img-2.webp`, alt: 'image with inverted colors.' },
    { src: `${BASE_PATH}/img-3.webp`, alt: 'image in black and white.' },
]

const GLOBE_LINE_START = 'M24 23C36.15 23 46 18.08 46 12C46 5.92 36.15 1 24 1'
const GLOBE_LINE_END = 'M24 23C11.85 23 2 18.08 2 12C2 5.92 11.85 1 24 1'

export default function Gallery() {
    return (
        <>
            <SphereGallery lensBlur={0.9} items={items} className='fixed inset-0' />

            <h1 className='fixed inset-0 z-10 flex items-center justify-center pointer-events-none text-2xl leading-none tracking-tighter'>
                <svg
                    width={48}
                    height={24}
                    viewBox='0 0 48 24'
                    fill='none'
                    stroke='currentColor'
                    aria-hidden='true'
                    className='mr-px'
                >
                    <ellipse cx='24' cy='12' rx='22' ry='11' vectorEffect='non-scaling-stroke' />

                    <path d='M2 12h44' vectorEffect='non-scaling-stroke' />
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <path key={i} d={GLOBE_LINE_START} vectorEffect='non-scaling-stroke'>
                            <animate
                                attributeName='d'
                                values={`${GLOBE_LINE_START};${GLOBE_LINE_END}`}
                                dur='2.6s'
                                begin={`${(-i * 2.6) / 6}s`}
                                repeatCount='indefinite'
                                calcMode='spline'
                                keyTimes='0;1'
                                keySplines='0.42 0 0.58 1'
                            />
                        </path>
                    ))}
                </svg>
                Codrops.
            </h1>

            <footer className='pointer-events-none fixed inset-x-0 bottom-0 z-10 pt-20 pb-5 bg-linear-to-t from-background to-transparent text-xs'>
                <p className='mx-auto w-180 text-center whitespace-normal'>
                    Process is more important than outcome. When the outcome drives the process we
                    will only ever go to where we've already been. If process drives outcome we may
                    not know where we're going, but we will know we want to be there. &mdash; Bruce
                    Mau
                </p>
            </footer>
        </>
    )
}
