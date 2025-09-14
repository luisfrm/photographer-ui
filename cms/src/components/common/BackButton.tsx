"use client"

import { MoveLeft } from "lucide-react"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className={cn("gap-2", className)}
    >
      <MoveLeft className="size-4" />
      Go back
    </Button>
  )
}


