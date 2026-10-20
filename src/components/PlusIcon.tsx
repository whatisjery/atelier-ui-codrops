type PlusIconProps = {
    className?: string
}

export default function PlusIcon({ className }: PlusIconProps) {
    return (
        <svg
            width={12.5}
            height={12.5}
            viewBox='0 0 48 48'
            stroke='currentColor'
            strokeWidth='4'
            aria-hidden='true'
            className={`max-sm:opacity-0 ${className ?? ''}`}
        >
            <path d='M0 23.793H47.5898' />
            <path d='M23.8008 0L23.8008 47.5898' />
        </svg>
    )
}
