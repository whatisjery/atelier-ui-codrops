import type { Metadata } from 'next'
import { Herr_Von_Muellerhoff, Instrument_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Preloader from '@/components/Preloader'
import { TransitionPage } from '@/components/page-transition/page-transition'
import { PixelTransition } from '@/components/pixel-transition/pixel-transition'
import { SmoothScroll } from '@/components/smooth-scroll/smooth-scroll'
import { WebglProvider } from '@/components/webgl-provider/webgl-provider'

const instrumentSans = Instrument_Sans({
    weight: '700',
    subsets: ['latin'],
    variable: '--font-instrument-sans',
})

const herrVonMuellerhoff = Herr_Von_Muellerhoff({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-script',
})

export const metadata: Metadata = {
    title: 'Codrops demo — Atelier UI',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang='en' className={`${instrumentSans.variable} ${herrVonMuellerhoff.variable} antialiased`}>
            <body className='font-sans font-bold text-sm uppercase leading-[1.1em] whitespace-nowrap'>
                <Preloader />
                <SmoothScroll>
                    <WebglProvider>
                        <PixelTransition>
                            <Nav />
                            <TransitionPage>{children}</TransitionPage>
                        </PixelTransition>
                    </WebglProvider>
                </SmoothScroll>
            </body>
        </html>
    )
}
