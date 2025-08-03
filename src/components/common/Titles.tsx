import { cn } from "@/lib/utils"

interface TitleProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: TitleProps) {
  return (
    <h1 className={cn("text-6xl font-bold text-foreground", className)}>
      {children}
    </h1>
  )
}

export function H2({ children, className }: TitleProps) {
  return (
    <h2 className={cn("text-6xl font-serif text-black mb-12", className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: TitleProps) {
  return (
    <h3 className={cn("text-5xl font-serif mb-6 text-black", className)}>
      {children}
    </h3>
  )
}

export function H4({ children, className }: TitleProps) {
  return (
    <h3 className={cn("text-2xl font-serif mb-6 text-black", className)}>
      {children}
    </h3>
  )
}
