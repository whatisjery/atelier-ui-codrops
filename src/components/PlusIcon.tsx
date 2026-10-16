type PlusIconProps = {
    className?: string
}

export default function PlusIcon({ className }: PlusIconProps) {
    return (
        <svg
            width={14}
            height={14}
            viewBox='0 0 48 48'
            stroke='currentColor'
            strokeWidth='5'
            aria-hidden='true'
            className={className}
        >
            <path d='M0 23.793H47.5898' />
            <path d='M23.8008 0L23.8008 47.5898' />
        </svg>
    )
}
