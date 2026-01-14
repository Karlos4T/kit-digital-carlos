import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      aria-label="AARONN"
      className={clsx(
        'font-display text-xl font-semibold tracking-[0.3em] text-white',
        className,
      )}
    >
      AARONN
    </span>
  )
}
