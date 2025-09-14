import { cn } from "@/lib/utils"

export function PlaceholderBlock({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-md border bg-muted/10 p-3 text-sm text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}


