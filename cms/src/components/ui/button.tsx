import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer w-full md:w-auto hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&[data-loading=true]]:before:content-[''] [&[data-loading=true]]:before:inline-block [&[data-loading=true]]:before:h-4 [&[data-loading=true]]:before:w-4 [&[data-loading=true]]:before:animate-spin [&[data-loading=true]]:before:rounded-full [&[data-loading=true]]:before:border-2 [&[data-loading=true]]:before:border-current [&[data-loading=true]]:before:border-t-transparent [&[data-loading=true]]:before:mr-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-accent bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-primary dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-10 rounded-md px-6 has-[>svg]:px-4",
        lg: "h-12 rounded-md px-8 has-[>svg]:px-4 text-md font-semibold",
        xl: "h-14 rounded-md px-10 has-[>svg]:px-4 text-xl",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  status,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    status?: 'idle' | 'loading' | 'success' | 'error'
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-loading={status === "loading"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }


