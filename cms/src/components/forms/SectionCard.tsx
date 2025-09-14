import { cn } from "@/lib/utils"

export function SectionCard({
  title,
  description,
  icon: Icon,
  className,
  children,
}: {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 shadow-xs",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        {Icon ? (
          <div className="grid place-items-center size-8 rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
        ) : null}
        <div>
          <h2 className="text-lg font-semibold leading-none">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}


