import * as React from "react"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}) {
  return (
    <div
      data-slot="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      role={!decorative ? "separator" : undefined}
      aria-orientation={orientation}
      {...props}
    />
  )
}

export { Separator }
