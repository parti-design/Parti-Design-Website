/**
 * RichText stub — this component previously rendered Payload/Lexical rich text JSON.
 *
 * With the Keystatic migration, rich text is rendered via <KeystaticContent /> instead.
 * This stub exists to avoid breaking any remaining references during the transition.
 *
 * TODO: Remove this file once all consumers have been updated to use KeystaticContent.
 */
import { cn } from '@/utilities/ui'
import React from 'react'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props

  // If there's no data, render nothing
  if (!data) return null

  return (
    <div
      className={cn(
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    >
      {/* RichText is a stub — content from Keystatic is rendered by KeystaticContent instead */}
      <p className="text-muted-foreground text-sm italic">[Rich text content]</p>
    </div>
  )
}
